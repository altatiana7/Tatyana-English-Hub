-- ============================================================================
-- Tatyana English Hub · схема базы
-- Применять целиком в Supabase → SQL Editor (или `supabase db push`).
-- Скрипт идемпотентный: повторный запуск не ломает существующие данные.
--
-- Принципы:
--   * данные учителя (расписание, темы, оплаты) — только за авторизацией;
--   * сайты учеников остаются на GitHub Pages, адреса уроков не меняются:
--     в homework_assignments есть колонка page_url с существующей ссылкой;
--   * ни одна таблица не открыта анонимному пользователю (см. policies.sql).
-- ============================================================================

-- Расширения не обязательны: используется только gen_random_uuid()
-- (встроена в PostgreSQL 13+, в Supabase включена по умолчанию).
-- Никаких citext/pgcrypto — схема ставится на чистый Postgres.

-- ---------------------------------------------------------------------------
-- 1. Профили: связка auth.users ↔ роль
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'student' check (role in ('teacher', 'student')),
  full_name   text,
  email       text,
  created_at  timestamptz not null default now()
);

create unique index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

comment on table public.profiles is
  'Роль пользователя. teacher — полный доступ, student — только свои строки.';

-- ---------------------------------------------------------------------------
-- 2. Ученики
-- ---------------------------------------------------------------------------
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid unique references public.profiles(id) on delete set null,
  name        text not null,
  level       text,                                  -- A2, B1, ...
  textbook    text,                                  -- Outcomes Pre-Int, Gateway B1, ...
  rate        numeric(10, 2),                        -- ставка за занятие
  weekday     smallint check (weekday between 1 and 7),  -- 1 = понедельник
  lesson_time time,                                  -- 18:00
  color       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists students_name_idx on public.students (lower(name));

-- ---------------------------------------------------------------------------
-- 3. Занятия
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  lesson_date date not null,
  topic       text,                                  -- что прошли
  homework    text,                                  -- что задано
  result      text,                                  -- как справился
  status      text not null default 'planned'
              check (status in ('planned', 'done', 'missed', 'moved')),
  page_url    text,                                  -- существующий адрес урока на GitHub Pages
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists lessons_student_date_idx
  on public.lessons (student_id, lesson_date desc);

-- ---------------------------------------------------------------------------
-- 4. Оплаты: план по месяцам и фактические платежи
--    Раньше жили в localStorage ключами вида "2026-10|3".
-- ---------------------------------------------------------------------------
create table if not exists public.payment_plans (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  period      date not null,                         -- первое число месяца
  planned     numeric(10, 2) not null default 0,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint payment_plans_period_is_month check (extract(day from period) = 1),
  constraint payment_plans_unique unique (student_id, period)
);

create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  period      date not null,                         -- за какой месяц
  amount      numeric(10, 2) not null check (amount >= 0),
  paid_on     date not null default current_date,
  method      text,                                  -- перевод, наличные
  note        text,
  created_at  timestamptz not null default now(),
  constraint payments_period_is_month check (extract(day from period) = 1)
);

create index if not exists payments_student_period_idx
  on public.payments (student_id, period desc);

-- Задолженность: план минус факт. Вьюха, а не таблица — не расходится.
create or replace view public.student_debts as
select
  s.id                                   as student_id,
  s.name,
  p.period,
  coalesce(p.planned, 0)                 as planned,
  coalesce(sum(pay.amount), 0)           as paid,
  coalesce(p.planned, 0) - coalesce(sum(pay.amount), 0) as balance
from public.students s
join public.payment_plans p on p.student_id = s.id
left join public.payments pay
       on pay.student_id = s.id and pay.period = p.period
group by s.id, s.name, p.period, p.planned;

comment on view public.student_debts is
  'План, факт и остаток по каждому ученику и месяцу. balance > 0 — долг.';

-- ---------------------------------------------------------------------------
-- 5. Домашние задания и входящие ответы
--    page_url — адрес существующей страницы (например
--    /katerina-ege-2027/lesson-2026-09-29.html). Страницы не переезжают.
-- ---------------------------------------------------------------------------
create table if not exists public.homework_assignments (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students(id) on delete cascade,
  lesson_id    uuid references public.lessons(id) on delete set null,
  title        text not null,
  page_url     text,
  due_date     date,
  is_open      boolean not null default true,
  -- Персональный ключ для отправки ответа с публичной страницы сайта.
  -- Наружу никогда не отдаётся: используется только внутри submit_homework().
  submit_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists homework_student_idx
  on public.homework_assignments (student_id, is_open, due_date desc);

create table if not exists public.submissions (
  id               uuid primary key default gen_random_uuid(),
  assignment_id    uuid not null references public.homework_assignments(id) on delete cascade,
  student_id       uuid not null references public.students(id) on delete cascade,
  answers          jsonb not null,
  submitted_at     timestamptz not null default now(),
  score            numeric(5, 2),
  teacher_comment  text,
  checked_at       timestamptz,
  checked_by       uuid references public.profiles(id) on delete set null
);

create index if not exists submissions_assignment_idx
  on public.submissions (assignment_id, submitted_at desc);

create index if not exists submissions_unchecked_idx
  on public.submissions (submitted_at desc)
  where checked_at is null;

-- ---------------------------------------------------------------------------
-- 6. Служебное: updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['students', 'lessons', 'payment_plans', 'homework_assignments']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Профиль создаётся автоматически при регистрации пользователя
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    -- роль по умолчанию — student; учитель назначается вручную (см. docs/supabase-setup.md)
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
