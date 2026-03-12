-- V2 inscriptions natives (public + admin)
-- A exécuter dans le SQL Editor du projet Supabase EXISTANT.

create table if not exists public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  gender text,
  age integer,
  whatsapp_number text not null,
  normalized_whatsapp_number text,
  arabic_level text not null,
  course_type text,
  hours_per_week integer,
  payment_method text,
  discovery_source text,
  applicant_note text,
  availabilities jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  validated_at timestamptz,
  deleted_at timestamptz,
  created_student_id uuid references public.students(id) on delete set null,
  assigned_teacher_id uuid references public.teachers(id) on delete set null,
  validated_timeslot text,
  purchased_courses integer,
  processed_by_user_id uuid,
  processed_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (age is null or age >= 0),
  check (hours_per_week is null or hours_per_week >= 0),
  check (purchased_courses is null or purchased_courses >= 0),
  check (jsonb_typeof(availabilities) = 'object'),
  check (status in ('pending', 'validated', 'deleted'))
);

create table if not exists public.registration_request_comments (
  id uuid primary key default gen_random_uuid(),
  registration_request_id uuid not null references public.registration_requests(id) on delete cascade,
  author_user_id uuid,
  author_email text,
  content text not null check (length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_registration_requests_status_submitted_at
on public.registration_requests(status, submitted_at asc);
create index if not exists idx_registration_requests_created_student_id
on public.registration_requests(created_student_id);
create index if not exists idx_registration_requests_teacher_id
on public.registration_requests(assigned_teacher_id);
create index if not exists idx_registration_requests_whatsapp
on public.registration_requests(normalized_whatsapp_number);

create index if not exists idx_registration_request_comments_request_id
on public.registration_request_comments(registration_request_id);
create index if not exists idx_registration_request_comments_created_at
on public.registration_request_comments(created_at);

drop trigger if exists registration_requests_set_updated_at on public.registration_requests;
create trigger registration_requests_set_updated_at
before update on public.registration_requests
for each row
execute function public.set_updated_at();

alter table public.registration_requests enable row level security;
alter table public.registration_request_comments enable row level security;

drop policy if exists "registration_requests_authenticated_all" on public.registration_requests;
drop policy if exists "registration_request_comments_authenticated_all" on public.registration_request_comments;

create policy "registration_requests_authenticated_all"
on public.registration_requests
for all
to authenticated
using (true)
with check (true);

create policy "registration_request_comments_authenticated_all"
on public.registration_request_comments
for all
to authenticated
using (true)
with check (true);

create or replace function public.validate_registration_request(
  p_registration_request_id uuid,
  p_processed_by_user_id uuid default null,
  p_processed_by_email text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.registration_requests%rowtype;
  v_student_id uuid;
  v_whatsapp text;
begin
  select *
  into v_request
  from public.registration_requests rr
  where rr.id = p_registration_request_id
  for update;

  if v_request.id is null then
    raise exception 'REGISTRATION_NOT_FOUND';
  end if;

  if v_request.status <> 'pending' then
    raise exception 'REGISTRATION_NOT_PENDING';
  end if;

  if v_request.assigned_teacher_id is null then
    raise exception 'ASSIGNED_TEACHER_REQUIRED';
  end if;

  if v_request.validated_timeslot is null or length(trim(v_request.validated_timeslot)) = 0 then
    raise exception 'VALIDATED_TIMESLOT_REQUIRED';
  end if;

  if v_request.purchased_courses is null or v_request.purchased_courses <= 0 then
    raise exception 'PURCHASED_COURSES_REQUIRED';
  end if;

  v_whatsapp := coalesce(v_request.normalized_whatsapp_number, v_request.whatsapp_number);

  insert into public.students (
    full_name,
    gender,
    age,
    whatsapp_number,
    course_type,
    hours_per_week,
    payment_method,
    teacher_id,
    validated_timeslot,
    total_courses_purchased,
    courses_completed,
    is_paused
  )
  values (
    v_request.full_name,
    v_request.gender,
    v_request.age,
    v_whatsapp,
    v_request.course_type,
    v_request.hours_per_week,
    v_request.payment_method,
    v_request.assigned_teacher_id,
    v_request.validated_timeslot,
    v_request.purchased_courses,
    0,
    false
  )
  returning id into v_student_id;

  insert into public.student_comments (
    student_id,
    author_user_id,
    author_email,
    content
  )
  values (
    v_student_id,
    p_processed_by_user_id,
    p_processed_by_email,
    'Élève créé depuis le formulaire d’inscription.'
  );

  update public.registration_requests
  set
    status = 'validated',
    validated_at = now(),
    created_student_id = v_student_id,
    processed_by_user_id = p_processed_by_user_id,
    processed_by_email = p_processed_by_email
  where id = v_request.id;

  return v_student_id;
end;
$$;

revoke all on function public.validate_registration_request(uuid, uuid, text) from public;
grant execute on function public.validate_registration_request(uuid, uuid, text) to authenticated, service_role;
