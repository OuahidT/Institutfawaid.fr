'use server';

import { randomBytes } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdminUser } from '@/lib/auth/admin';
import { toNullableInteger, toSafeInteger } from '@/lib/internal/courses';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseServiceClient } from '@/lib/supabase/service';

function getString(formData: FormData, key: string) {
  const rawValue = formData.get(key);
  return typeof rawValue === 'string' ? rawValue.trim() : '';
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseBooleanValue(value: string) {
  return ['1', 'true', 'yes', 'oui', 'on'].includes(value.toLowerCase());
}

export async function logoutAdminAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function createTeacherAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const name = getString(formData, 'name');
  const customSlug = getString(formData, 'slug');

  if (!name) return;

  const slug = customSlug || slugify(name);
  const secretToken = randomBytes(24).toString('hex');

  const { error } = await supabase.from('teachers').insert({
    name,
    slug,
    secret_token: secretToken,
  });

  if (error) {
    throw new Error(`Création professeur impossible: ${error.message}`);
  }

  revalidatePath('/admin');
}

export async function regenerateTeacherTokenAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const teacherId = getString(formData, 'teacher_id');
  if (!teacherId) return;

  const nextToken = randomBytes(24).toString('hex');

  const { error } = await supabase.from('teachers').update({ secret_token: nextToken }).eq('id', teacherId);
  if (error) throw new Error(`Rotation token impossible: ${error.message}`);

  revalidatePath('/admin');
}

export async function createStudentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const fullName = getString(formData, 'full_name');
  if (!fullName) return;

  const totalCoursesPurchased = Math.max(0, toSafeInteger(getString(formData, 'total_courses_purchased'), 0));
  const coursesCompleted = Math.max(0, toSafeInteger(getString(formData, 'courses_completed'), 0));

  const payload = {
    full_name: fullName,
    gender: getNullableString(formData, 'gender'),
    age: toNullableInteger(getString(formData, 'age')),
    whatsapp_number: getNullableString(formData, 'whatsapp_number'),
    course_type: getNullableString(formData, 'course_type'),
    hours_per_week: toNullableInteger(getString(formData, 'hours_per_week')),
    payment_method: getNullableString(formData, 'payment_method'),
    teacher_id: getNullableString(formData, 'teacher_id'),
    validated_timeslot: getNullableString(formData, 'validated_timeslot'),
    total_courses_purchased: totalCoursesPurchased,
    courses_completed: coursesCompleted,
    is_paused: parseBooleanValue(getString(formData, 'is_paused')),
  };

  const { data, error } = await supabase
    .from('students')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw new Error(`Création élève impossible: ${error.message}`);
  if (!data?.id) throw new Error('Création élève impossible: identifiant non retourné.');

  revalidatePath('/admin');
  redirect(`/admin/eleves/${data.id}`);
}

export async function createStudentCommentAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const studentId = getString(formData, 'student_id');
  const content = getString(formData, 'content');

  if (!studentId || !content) return;

  const { error } = await supabase.from('student_comments').insert({
    student_id: studentId,
    content,
    author_user_id: user.id,
    author_email: user.email ?? null,
  });

  if (error) throw new Error(`Ajout du commentaire impossible: ${error.message}`);

  revalidatePath(`/admin/eleves/${studentId}`);
}

export async function updateStudentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const studentId = getString(formData, 'student_id');
  if (!studentId) return;

  const fullName = getString(formData, 'full_name');
  if (!fullName) return;

  const payload = {
    full_name: fullName,
    gender: getNullableString(formData, 'gender'),
    age: toNullableInteger(getString(formData, 'age')),
    whatsapp_number: getNullableString(formData, 'whatsapp_number'),
    course_type: getNullableString(formData, 'course_type'),
    hours_per_week: toNullableInteger(getString(formData, 'hours_per_week')),
    payment_method: getNullableString(formData, 'payment_method'),
    teacher_id: getNullableString(formData, 'teacher_id'),
    validated_timeslot: getNullableString(formData, 'validated_timeslot'),
    total_courses_purchased: Math.max(0, toSafeInteger(getString(formData, 'total_courses_purchased'), 0)),
    courses_completed: Math.max(0, toSafeInteger(getString(formData, 'courses_completed'), 0)),
    is_paused: parseBooleanValue(getString(formData, 'is_paused')),
  };

  const { error } = await supabase.from('students').update(payload).eq('id', studentId);
  if (error) throw new Error(`Mise à jour élève impossible: ${error.message}`);

  revalidatePath('/admin');
  revalidatePath(`/admin/eleves/${studentId}`);
}

export async function addPurchasedCoursesAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const studentId = getString(formData, 'student_id');
  const delta = Math.max(1, toSafeInteger(getString(formData, 'delta'), 0));
  if (!studentId || !delta) return;

  const { error } = await supabase.rpc('add_purchased_courses', {
    p_student_id: studentId,
    p_delta: delta,
  });

  if (error) throw new Error(`Ajout de cours acheté impossible: ${error.message}`);

  revalidatePath('/admin');
  revalidatePath(`/admin/eleves/${studentId}`);
}

export async function deleteStudentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const studentId = getString(formData, 'student_id');
  if (!studentId) return;

  const { error } = await supabase.from('students').delete().eq('id', studentId);
  if (error) throw new Error(`Suppression élève impossible: ${error.message}`);

  revalidatePath('/admin');
  redirect('/admin');
}

export async function registerLessonForStudentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const studentId = getString(formData, 'student_id');
  const lessonDate = getString(formData, 'lesson_date');
  const scheduleNote = getString(formData, 'schedule_note');

  if (!studentId || !lessonDate || !scheduleNote) return;

  const { error } = await supabase.rpc('register_lesson_for_student', {
    p_student_id: studentId,
    p_lesson_date: lessonDate,
    p_schedule_note: scheduleNote,
  });

  if (error) throw new Error(`Déclaration du cours impossible: ${error.message}`);

  revalidatePath('/admin');
  revalidatePath(`/admin/eleves/${studentId}`);
}

export async function updateLessonAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const lessonId = getString(formData, 'lesson_id');
  const lessonDate = getString(formData, 'lesson_date');
  const scheduleNote = getString(formData, 'schedule_note');
  const studentId = getString(formData, 'student_id');

  if (!lessonId || !lessonDate || !scheduleNote) return;

  const { error } = await supabase
    .from('lessons')
    .update({
      lesson_date: lessonDate,
      schedule_note: scheduleNote,
    })
    .eq('id', lessonId);

  if (error) throw new Error(`Mise à jour du cours impossible: ${error.message}`);

  revalidatePath('/admin');
  if (studentId) revalidatePath(`/admin/eleves/${studentId}`);
}

export async function deleteLessonAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const lessonId = getString(formData, 'lesson_id');
  const studentId = getString(formData, 'student_id');
  if (!lessonId) return;

  const { error } = await supabase.rpc('remove_lesson_and_reconcile', {
    p_lesson_id: lessonId,
  });

  if (error) throw new Error(`Suppression du cours impossible: ${error.message}`);

  revalidatePath('/admin');
  if (studentId) revalidatePath(`/admin/eleves/${studentId}`);
}

export async function submitTeacherLessonAction(formData: FormData) {
  const supabase = getSupabaseServiceClient();

  const token = getString(formData, 'token');
  const studentId = getString(formData, 'student_id');
  const lessonDate = getString(formData, 'lesson_date');
  const scheduleNote = getString(formData, 'schedule_note');

  if (!token || !studentId || !lessonDate || !scheduleNote) {
    redirect(`/formulaire-prof/${token}?status=error`);
  }

  const { error } = await supabase.rpc('register_lesson_by_teacher_token', {
    p_teacher_token: token,
    p_student_id: studentId,
    p_lesson_date: lessonDate,
    p_schedule_note: scheduleNote,
  });

  if (error) {
    redirect(`/formulaire-prof/${token}?status=error`);
  }

  revalidatePath('/admin');
  redirect(`/formulaire-prof/${token}?status=success`);
}
