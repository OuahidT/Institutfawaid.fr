-- V1 interne Institut Fawaid
-- A exécuter dans le SQL Editor du projet Supabase EXISTANT.

create extension if not exists pgcrypto;

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  secret_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text,
  age integer,
  whatsapp_number text,
  course_type text,
  hours_per_week integer,
  payment_method text,
  teacher_id uuid references public.teachers(id) on delete set null,
  validated_timeslot text,
  total_courses_purchased integer not null default 0 check (total_courses_purchased >= 0),
  courses_completed integer not null default 0 check (courses_completed >= 0),
  is_paused boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (age is null or age >= 0),
  check (hours_per_week is null or hours_per_week >= 0)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  lesson_date date not null,
  schedule_note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.student_comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  author_user_id uuid,
  author_email text,
  content text not null check (length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_students_teacher_id on public.students(teacher_id);
create index if not exists idx_students_full_name on public.students(full_name);
create index if not exists idx_lessons_student_id on public.lessons(student_id);
create index if not exists idx_lessons_teacher_id on public.lessons(teacher_id);
create index if not exists idx_lessons_lesson_date on public.lessons(lesson_date desc);
create index if not exists idx_student_comments_student_id on public.student_comments(student_id);
create index if not exists idx_student_comments_created_at on public.student_comments(created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.lessons enable row level security;
alter table public.student_comments enable row level security;

drop policy if exists "teachers_authenticated_all" on public.teachers;
drop policy if exists "students_authenticated_all" on public.students;
drop policy if exists "lessons_authenticated_all" on public.lessons;
drop policy if exists "student_comments_authenticated_all" on public.student_comments;

create policy "teachers_authenticated_all"
on public.teachers
for all
to authenticated
using (true)
with check (true);

create policy "students_authenticated_all"
on public.students
for all
to authenticated
using (true)
with check (true);

create policy "lessons_authenticated_all"
on public.lessons
for all
to authenticated
using (true)
with check (true);

create policy "student_comments_authenticated_all"
on public.student_comments
for all
to authenticated
using (true)
with check (true);

create or replace function public.register_lesson_by_teacher_token(
  p_teacher_token text,
  p_student_id uuid,
  p_lesson_date date,
  p_schedule_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_teacher_id uuid;
  v_lesson_id uuid;
begin
  if p_schedule_note is null or length(trim(p_schedule_note)) = 0 then
    raise exception 'SCHEDULE_NOTE_REQUIRED';
  end if;

  select t.id into v_teacher_id
  from public.teachers t
  where t.secret_token = p_teacher_token;

  if v_teacher_id is null then
    raise exception 'INVALID_TEACHER_TOKEN';
  end if;

  perform 1
  from public.students s
  where s.id = p_student_id
    and s.teacher_id = v_teacher_id
  for update;

  if not found then
    raise exception 'STUDENT_NOT_FOUND_FOR_TEACHER';
  end if;

  update public.students
  set courses_completed = courses_completed + 1
  where id = p_student_id;

  insert into public.lessons (student_id, teacher_id, lesson_date, schedule_note)
  values (p_student_id, v_teacher_id, p_lesson_date, p_schedule_note)
  returning id into v_lesson_id;

  return v_lesson_id;
end;
$$;

revoke all on function public.register_lesson_by_teacher_token(text, uuid, date, text) from public;
grant execute on function public.register_lesson_by_teacher_token(text, uuid, date, text) to authenticated, service_role;

create or replace function public.register_lesson_for_student(
  p_student_id uuid,
  p_lesson_date date,
  p_schedule_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_teacher_id uuid;
  v_lesson_id uuid;
begin
  if p_schedule_note is null or length(trim(p_schedule_note)) = 0 then
    raise exception 'SCHEDULE_NOTE_REQUIRED';
  end if;

  select s.teacher_id into v_teacher_id
  from public.students s
  where s.id = p_student_id
  for update;

  if not found then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  if v_teacher_id is null then
    raise exception 'STUDENT_WITHOUT_TEACHER';
  end if;

  update public.students
  set courses_completed = courses_completed + 1
  where id = p_student_id;

  insert into public.lessons (student_id, teacher_id, lesson_date, schedule_note)
  values (p_student_id, v_teacher_id, p_lesson_date, p_schedule_note)
  returning id into v_lesson_id;

  return v_lesson_id;
end;
$$;

revoke all on function public.register_lesson_for_student(uuid, date, text) from public;
grant execute on function public.register_lesson_for_student(uuid, date, text) to authenticated, service_role;

create or replace function public.remove_lesson_and_reconcile(
  p_lesson_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid;
begin
  select l.student_id into v_student_id
  from public.lessons l
  where l.id = p_lesson_id
  for update;

  if not found then
    raise exception 'LESSON_NOT_FOUND';
  end if;

  delete from public.lessons where id = p_lesson_id;

  update public.students
  set courses_completed = greatest(courses_completed - 1, 0)
  where id = v_student_id;

  return v_student_id;
end;
$$;

revoke all on function public.remove_lesson_and_reconcile(uuid) from public;
grant execute on function public.remove_lesson_and_reconcile(uuid) to authenticated, service_role;

create or replace function public.add_purchased_courses(
  p_student_id uuid,
  p_delta integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
begin
  if p_delta is null or p_delta <= 0 then
    raise exception 'INVALID_DELTA';
  end if;

  update public.students
  set total_courses_purchased = total_courses_purchased + p_delta
  where id = p_student_id
  returning total_courses_purchased into v_total;

  if v_total is null then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  return v_total;
end;
$$;

revoke all on function public.add_purchased_courses(uuid, integer) from public;
grant execute on function public.add_purchased_courses(uuid, integer) to authenticated, service_role;

insert into public.teachers (name, slug)
values
  ('Hadj', 'hadj'),
  ('Oumeima', 'oumeima'),
  ('Abdelkader', 'abdelkader'),
  ('Ibrahim', 'ibrahim')
on conflict (slug) do nothing;
