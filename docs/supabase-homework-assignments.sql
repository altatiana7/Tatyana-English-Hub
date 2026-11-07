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

-- give_homework(p_teacher_code, p_student, p_item_id, p_title) -> id
-- revoke_homework(p_teacher_code, p_student, p_item_id)        -> сколько отозвано
-- get_given_homework(p_student)                                -> item_id, title, given_at (код не нужен)
-- Полный текст функций: см. историю этого файла в чате от 7 ноября 2026 или запросите у Claude.
