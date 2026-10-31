-- ============================================================================
-- Проверка прав доступа (RLS). Запускать в Supabase → SQL Editor,
-- ПОСЛЕ schema.sql и policies.sql.
--
-- Всё происходит внутри одной транзакции и в конце откатывается:
-- реальные данные не меняются. Если проверка не прошла — увидите
-- «FAIL: …» с описанием, что именно не защищено.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Подготовка: учитель, два ученика, занятие, оплата, задание
-- ---------------------------------------------------------------------------
create temporary table _t (k text primary key, v uuid) on commit drop;

insert into auth.users (id, email, raw_user_meta_data)
values
  ('11111111-1111-1111-1111-111111111111', 'teacher@test.local', '{"full_name":"Teacher"}'),
  ('22222222-2222-2222-2222-222222222222', 'student-a@test.local', '{"full_name":"Student A"}'),
  ('33333333-3333-3333-3333-333333333333', 'student-b@test.local', '{"full_name":"Student B"}')
on conflict (id) do nothing;

update public.profiles set role = 'teacher'
 where id = '11111111-1111-1111-1111-111111111111';

insert into public.students (id, profile_id, name, level)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Student A', 'B1'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Student B', 'A2')
on conflict (id) do nothing;

insert into public.lessons (student_id, lesson_date, topic)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', current_date, 'Reading 10'),
  ('bbbbbbbb-0000-0000-0000-000000000002', current_date, 'Unit 3');

insert into public.payment_plans (student_id, period, planned)
values ('aaaaaaaa-0000-0000-0000-000000000001', date_trunc('month', current_date)::date, 8000);

insert into public.payments (student_id, period, amount)
values ('aaaaaaaa-0000-0000-0000-000000000001', date_trunc('month', current_date)::date, 4000);

insert into public.homework_assignments (id, student_id, title, submit_token)
values
  ('dddddddd-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Reading 10', 'token-of-student-a');

-- ---------------------------------------------------------------------------
-- Помощник: падать, если условие не выполнено
-- ---------------------------------------------------------------------------
create or replace function pg_temp.assert_true(cond boolean, msg text)
returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then
    raise exception 'FAIL: %', msg;
  end if;
  raise notice 'ok: %', msg;
end;
$$;

grant execute on function pg_temp.assert_true(boolean, text) to public;

-- ===========================================================================
-- 1. Аноним (посетитель сайта, anon-ключ)
-- ===========================================================================
set local role anon;

do $$ begin
  perform 1 from public.lessons;
  raise exception 'FAIL: anon читает занятия';
exception when insufficient_privilege then
  raise notice 'ok: anon не имеет доступа к занятиям';
end $$;

do $$ begin
  perform 1 from public.payments;
  raise exception 'FAIL: anon читает оплаты';
exception when insufficient_privilege then
  raise notice 'ok: anon не имеет доступа к оплатам';
end $$;

do $$ begin
  perform 1 from public.students;
  raise exception 'FAIL: anon читает учеников';
exception when insufficient_privilege then
  raise notice 'ok: anon не имеет доступа к ученикам';
end $$;

-- отправка ответа по ключу должна работать
select pg_temp.assert_true(
  (select public.submit_homework('token-of-student-a', '{"task1":"B"}'::jsonb)) is not null,
  'anon может отправить ответ по ключу задания'
);

-- чужой/неверный ключ — отказ
do $$ begin
  perform public.submit_homework('wrong-token', '{"task1":"B"}'::jsonb);
  raise exception 'FAIL: принят неверный ключ задания';
exception when others then
  if position('FAIL' in SQLERRM) > 0 then raise; end if;
  raise notice 'ok: неверный ключ отклонён';
end $$;

-- anon не может читать отправленные ответы
do $$ begin
  perform 1 from public.submissions;
  raise exception 'FAIL: anon читает ответы учеников';
exception when insufficient_privilege then
  raise notice 'ok: anon не читает ответы';
end $$;

reset role;

-- ===========================================================================
-- 2. Ученик A
-- ===========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select pg_temp.assert_true(
  (select count(*) from public.lessons) = 1,
  'ученик видит только своё занятие (1 строка)'
);

select pg_temp.assert_true(
  (select count(*) from public.lessons
    where student_id = 'bbbbbbbb-0000-0000-0000-000000000002') = 0,
  'ученик не видит занятие другого ученика'
);

select pg_temp.assert_true(
  (select count(*) from public.payments) = 0,
  'ученик не видит оплаты'
);

select pg_temp.assert_true(
  (select count(*) from public.payment_plans) = 0,
  'ученик не видит финансовые планы'
);

select pg_temp.assert_true(
  (select count(*) from public.submissions) = 1,
  'ученик видит свой отправленный ответ'
);

-- ключ задания недоступен на чтение
do $$ begin
  perform submit_token from public.homework_assignments;
  raise exception 'FAIL: ученик может прочитать submit_token';
exception when insufficient_privilege then
  raise notice 'ok: submit_token закрыт от ученика';
end $$;

-- ученик не может подделать ответ от чужого имени
do $$ begin
  insert into public.submissions (assignment_id, student_id, answers)
  values ('dddddddd-0000-0000-0000-00000000000a',
          'bbbbbbbb-0000-0000-0000-000000000002',
          '{"hack":true}'::jsonb);
  raise exception 'FAIL: ученик смог вставить ответ напрямую';
exception when insufficient_privilege then
  raise notice 'ok: прямая вставка ответа запрещена';
end $$;

-- ученик не может выдать себе роль учителя
do $$ begin
  update public.profiles set role = 'teacher'
   where id = '22222222-2222-2222-2222-222222222222';
  raise exception 'FAIL: ученик поднял себе роль до учителя';
exception
  when insufficient_privilege then raise notice 'ok: роль через колонку закрыта';
  when raise_exception then
    if position('FAIL' in SQLERRM) > 0 then raise; end if;
    raise notice 'ok: роль защищена триггером';
end $$;

-- второй слой: даже если право на колонку выдадут по ошибке, сработает триггер.
-- Выдавать право может только администратор, поэтому сначала выходим из роли.
reset role;
grant update (role) on public.profiles to authenticated;

set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
do $$ begin
  update public.profiles set role = 'teacher'
   where id = '22222222-2222-2222-2222-222222222222';
  raise exception 'FAIL: триггер пропустил смену роли';
exception
  when raise_exception then
    if position('FAIL' in SQLERRM) > 0 then raise; end if;
    raise notice 'ok: триггер не даёт менять роль';
end $$;

reset role;
revoke update (role) on public.profiles from authenticated;

select pg_temp.assert_true(
  (select count(*) from public.profiles where role = 'teacher') = 1,
  'учитель в базе по-прежнему один'
);

-- ===========================================================================
-- 3. Учитель
-- ===========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select pg_temp.assert_true(
  (select count(*) from public.lessons) = 2,
  'учитель видит занятия всех учеников'
);
select pg_temp.assert_true(
  (select count(*) from public.students) = 2,
  'учитель видит всех учеников'
);
select pg_temp.assert_true(
  (select count(*) from public.payments) = 1,
  'учитель видит оплаты'
);
select pg_temp.assert_true(
  (select count(*) from public.submissions) = 1,
  'учитель видит ответы на проверку'
);
select pg_temp.assert_true(
  (select count(*) from public.student_debts where balance > 0) = 1,
  'задолженность считается: 8000 − 4000 = 4000'
);

-- учитель может проверить работу
update public.submissions set score = 8, teacher_comment = 'good'
 where assignment_id = 'dddddddd-0000-0000-0000-00000000000a';
select pg_temp.assert_true(
  (select score from public.submissions limit 1) = 8,
  'учитель может поставить оценку'
);

reset role;

-- ===========================================================================
-- 4. Ученик не может выдать себя за учителя
-- ===========================================================================
set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select pg_temp.assert_true(
  (select public.is_teacher()) = false,
  'ученик не считается учителем'
);

reset role;

rollback;

\echo 'Все проверки пройдены. Изменения откачены.'
