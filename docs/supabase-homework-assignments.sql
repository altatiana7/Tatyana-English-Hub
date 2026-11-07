-- Выдача домашки (запущено в Supabase 7 ноября 2026, SQL Editor).
-- Таблица выдач + три функции. Код учителя проверяет существующая get_arina_homework,
-- поэтому сам код здесь нигде не хранится. Напрямую к таблице доступа нет, только через функции.
-- Используется: altatiana7.github.io/timofey-teacher/assign.html (выдать/отозвать) и
-- altatiana7.github.io/timofey-homework/ (показывает только выданное).

create table if not exists public.homework_assignments (
  id bigint generated always as identity primary key,
  student text not null,
  item_id text not null,
  title text not null,
  given_at timestamptz default now(),
  revoked_at timestamptz
);
create unique index if not exists homework_assignments_active_uq
  on public.homework_assignments (student, item_id) where revoked_at is null;
alter table public.homework_assignments enable row level security;
revoke all on public.homework_assignments from anon, authenticated;

-- Выдать (нужен код учителя; код проверяет существующая функция)
create or replace function public.give_homework(p_teacher_code text, p_student text, p_item_id text, p_title text)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  perform 1 from public.get_arina_homework(p_teacher_code) limit 1;
  if coalesce(trim(p_student), '') = '' or coalesce(trim(p_item_id), '') = '' then
    raise exception 'bad_input';
  end if;
  select a.id into v_id from public.homework_assignments a
    where a.student = lower(trim(p_student)) and a.item_id = trim(p_item_id) and a.revoked_at is null;
  if v_id is not null then return v_id; end if;
  insert into public.homework_assignments (student, item_id, title)
    values (lower(trim(p_student)), trim(p_item_id), coalesce(nullif(trim(p_title), ''), trim(p_item_id)))
    returning id into v_id;
  return v_id;
end $$;

-- Отозвать (тоже по коду учителя); возвращает, сколько записей отозвано
create or replace function public.revoke_homework(p_teacher_code text, p_student text, p_item_id text)
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  perform 1 from public.get_arina_homework(p_teacher_code) limit 1;
  update public.homework_assignments
     set revoked_at = now()
   where student = lower(trim(p_student)) and item_id = trim(p_item_id) and revoked_at is null;
  get diagnostics n = row_count;
  return n;
end $$;

-- Что сейчас выдано ученику (читает сайт ученика, код не нужен)
create or replace function public.get_given_homework(p_student text)
returns table(item_id text, title text, given_at timestamptz)
language sql security definer set search_path = public as $$
  select a.item_id, a.title, a.given_at
    from public.homework_assignments a
   where a.student = lower(trim(p_student)) and a.revoked_at is null
   order by a.id;
$$;

grant execute on function public.give_homework(text, text, text, text) to anon, authenticated;
grant execute on function public.revoke_homework(text, text, text) to anon, authenticated;
grant execute on function public.get_given_homework(text) to anon, authenticated;

-- Начальные выдачи Тимофея (уже внесены):
--   ('timofey', 'digital-life', 'On Screen: Digital Life', null)
--   ('timofey', 'oge-reading-2026-11-06', 'ОГЭ Reading, 6 ноября', '2026-11-06')
