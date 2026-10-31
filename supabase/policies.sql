-- ============================================================================
-- Tatyana English Hub · права доступа (Row Level Security)
-- Запускать ПОСЛЕ schema.sql. Скрипт идемпотентный.
--
-- Правила в одну строку:
--   anon            — не видит ничего; может только отправить ответ на домашку
--                     через submit_homework() с персональным ключом;
--   authenticated   — учитель видит всё, ученик — только свои строки;
--   service_role    — служебный ключ, живёт только на сервере/в CI.
--
-- ВАЖНО: anon-ключ Supabase публичен по дизайну. Вся защита — в этих политиках,
-- а не в секретности ключа. service_role в браузер не попадает никогда.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Вспомогательные функции
-- ---------------------------------------------------------------------------
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

create or replace function public.current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.students where profile_id = auth.uid() limit 1;
$$;

grant execute on function public.is_teacher() to authenticated;
grant execute on function public.current_student_id() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Включаем RLS на всех таблицах
-- ---------------------------------------------------------------------------
alter table public.profiles              enable row level security;
alter table public.students              enable row level security;
alter table public.lessons               enable row level security;
alter table public.payment_plans         enable row level security;
alter table public.payments              enable row level security;
alter table public.homework_assignments  enable row level security;
alter table public.submissions           enable row level security;

-- ---------------------------------------------------------------------------
-- 2a. Права на таблицы.
--     RLS не заменяет гранты: если роли не выдан доступ к таблице, запрос
--     упадёт с «permission denied» ещё до проверки политик. В Supabase такие
--     гранты обычно есть по умолчанию, но полагаться на это нельзя —
--     выставляем явно, чтобы схема вела себя одинаково везде.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on
  public.profiles,
  public.students,
  public.lessons,
  public.payment_plans,
  public.payments,
  public.submissions
to authenticated;

grant select, insert, update, delete on public.homework_assignments to authenticated;
grant select on public.student_debts to authenticated;

-- Служебная роль: обходит RLS, но права на объекты всё равно нужны.
grant all on all tables in schema public to service_role;

-- На всякий случай отзываем доступ у анонима к таблицам целиком.
revoke all on public.profiles             from anon;
revoke all on public.students             from anon;
revoke all on public.lessons              from anon;
revoke all on public.payment_plans        from anon;
revoke all on public.payments             from anon;
revoke all on public.homework_assignments from anon;
revoke all on public.submissions          from anon;

-- ---------------------------------------------------------------------------
-- 3. profiles
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_own_or_teacher on public.profiles;
create policy profiles_select_own_or_teacher on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_teacher());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_teacher())
  with check (id = auth.uid() or public.is_teacher());

-- Профиль: роль нельзя поднять самому себе.
-- Политика разрешает менять свою строку, но право на колонку role никому,
-- кроме служебной роли, не выдаётся: иначе ученик одним запросом
-- `update profiles set role='teacher'` получил бы доступ ко всему.
revoke update on public.profiles from authenticated;
grant update (full_name, email) on public.profiles to authenticated;
revoke insert, delete on public.profiles from authenticated;

-- Второй слой защиты: запрет на смену роли из обычного подключения.
-- Сработает, даже если кто-то по ошибке снова выдаст право на колонку.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'supabase_admin', 'service_role') then
    raise exception 'роль профиля меняет только администратор';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------------
-- 4. students
-- ---------------------------------------------------------------------------
drop policy if exists students_teacher_all on public.students;
create policy students_teacher_all on public.students
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists students_select_own on public.students;
create policy students_select_own on public.students
  for select to authenticated
  using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 5. lessons — ученик видит только свои занятия
-- ---------------------------------------------------------------------------
drop policy if exists lessons_teacher_all on public.lessons;
create policy lessons_teacher_all on public.lessons
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists lessons_select_own on public.lessons;
create policy lessons_select_own on public.lessons
  for select to authenticated
  using (student_id = public.current_student_id());

-- ---------------------------------------------------------------------------
-- 6. Оплаты — только учитель. Ученику деньги не показываем вообще.
-- ---------------------------------------------------------------------------
drop policy if exists payment_plans_teacher_only on public.payment_plans;
create policy payment_plans_teacher_only on public.payment_plans
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists payments_teacher_only on public.payments;
create policy payments_teacher_only on public.payments
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- ---------------------------------------------------------------------------
-- 7. homework_assignments
--    Ученику видны только его задания. Колонка submit_token наружу не отдаётся:
--    доступ к ней закрыт ниже на уровне прав на колонки.
-- ---------------------------------------------------------------------------
drop policy if exists homework_teacher_all on public.homework_assignments;
create policy homework_teacher_all on public.homework_assignments
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists homework_select_own on public.homework_assignments;
create policy homework_select_own on public.homework_assignments
  for select to authenticated
  using (student_id = public.current_student_id());

revoke select on public.homework_assignments from authenticated;
grant select (id, student_id, lesson_id, title, page_url, due_date, is_open, created_at, updated_at)
  on public.homework_assignments to authenticated;

-- ---------------------------------------------------------------------------
-- 8. submissions
--    Ученик видит свои ответы. Проверять (менять score/comment) может только
--    учитель. Вставка — исключительно через функцию с ключом.
-- ---------------------------------------------------------------------------
drop policy if exists submissions_teacher_all on public.submissions;
create policy submissions_teacher_all on public.submissions
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists submissions_select_own on public.submissions;
create policy submissions_select_own on public.submissions
  for select to authenticated
  using (student_id = public.current_student_id());

-- прямой insert запрещён всем: только submit_homework()
revoke insert on public.submissions from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 9. Отправка ответа с публичной страницы ученика
--
--    Страницы на GitHub Pages не имеют логина. Поэтому отправка идёт через
--    функцию с персональным ключом задания:
--      * ключ проверяется на сервере внутри SECURITY DEFINER функции;
--      * anon не может читать таблицы;
--      * спам ограничен: не больше 10 отправок в час на одно задание.
-- ---------------------------------------------------------------------------
create or replace function public.submit_homework(p_token text, p_answers jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  a            public.homework_assignments;
  v_recent     int;
  v_id         uuid;
begin
  if p_token is null or length(trim(p_token)) = 0 then
    raise exception 'submit_homework: пустой ключ задания';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'submit_homework: ответ должен быть объектом JSON';
  end if;

  select * into a
  from public.homework_assignments
  where submit_token = trim(p_token)
    and is_open = true;

  if not found then
    raise exception 'submit_homework: задание не найдено или закрыто';
  end if;

  select count(*) into v_recent
  from public.submissions
  where assignment_id = a.id
    and submitted_at > now() - interval '1 hour';

  if v_recent >= 10 then
    raise exception 'submit_homework: слишком много отправок за час, попробуйте позже';
  end if;

  insert into public.submissions (assignment_id, student_id, answers)
  values (a.id, a.student_id, p_answers)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_homework(text, jsonb) from public;
grant execute on function public.submit_homework(text, jsonb) to anon, authenticated;

comment on function public.submit_homework(text, jsonb) is
  'Приём ответа с публичной страницы ученика по персональному ключу задания. '
  'Чтение ответов доступно только учителю через RLS на submissions.';

-- ---------------------------------------------------------------------------
-- 10. Проверка результата политик (выполняется вручную после применения)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments'
      and policyname = 'payments_teacher_only'
  ) then
    raise exception 'RLS: политика на payments не создана';
  end if;
  raise notice 'RLS: базовые политики на месте';
end;
$$;
