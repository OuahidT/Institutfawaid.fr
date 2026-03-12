'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdminUser } from '@/lib/auth/admin';
import { toSafeInteger } from '@/lib/internal/courses';
import { getSupabaseServiceClient } from '@/lib/supabase/service';

function getString(formData: FormData, key: string) {
  const rawValue = formData.get(key);
  return typeof rawValue === 'string' ? rawValue.trim() : '';
}

function getNullableString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getRedirectPath(formData: FormData, fallback: string) {
  const raw = getString(formData, 'redirect_to');
  if (!raw.startsWith('/')) return fallback;
  return raw;
}

export async function updateRegistrationRequestAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  if (!registrationRequestId) return;

  const assignedTeacherId = getNullableString(formData, 'assigned_teacher_id');
  const validatedTimeslot = getNullableString(formData, 'validated_timeslot');
  const purchasedCoursesRaw = getString(formData, 'purchased_courses');
  const purchasedCourses =
    purchasedCoursesRaw.length > 0 ? Math.max(0, toSafeInteger(purchasedCoursesRaw, 0)) : null;

  const { error } = await supabase
    .from('registration_requests')
    .update({
      assigned_teacher_id: assignedTeacherId,
      validated_timeslot: validatedTimeslot,
      purchased_courses: purchasedCourses,
      processed_by_user_id: user.id,
      processed_by_email: user.email ?? null,
    })
    .eq('id', registrationRequestId);

  if (error) {
    redirect(`/admin/inscriptions/${registrationRequestId}?status=save-error`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/inscriptions');
  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
  redirect(`/admin/inscriptions/${registrationRequestId}?status=saved`);
}

export async function deleteRegistrationRequestAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  if (!registrationRequestId) return;

  const redirectTo = getRedirectPath(formData, '/admin/inscriptions');

  const { error } = await supabase
    .from('registration_requests')
    .update({
      status: 'deleted',
      deleted_at: new Date().toISOString(),
      processed_by_user_id: user.id,
      processed_by_email: user.email ?? null,
    })
    .eq('id', registrationRequestId)
    .eq('status', 'pending');

  if (error) {
    redirect(`${redirectTo}?status=delete-error`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/inscriptions');
  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
  redirect(redirectTo);
}

export async function validateRegistrationRequestAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  if (!registrationRequestId) return;

  const { data: studentId, error } = await supabase.rpc('validate_registration_request', {
    p_registration_request_id: registrationRequestId,
    p_processed_by_user_id: user.id,
    p_processed_by_email: user.email ?? null,
  });

  if (error || !studentId) {
    redirect(`/admin/inscriptions/${registrationRequestId}?status=validation-error`);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/inscriptions');
  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
  revalidatePath(`/admin/eleves/${studentId}`);
  redirect(`/admin/eleves/${studentId}`);
}

export async function createRegistrationCommentAction(formData: FormData) {
  const user = await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  const content = getString(formData, 'content');
  if (!registrationRequestId || !content) return;

  const { error } = await supabase.from('registration_request_comments').insert({
    registration_request_id: registrationRequestId,
    content,
    author_user_id: user.id,
    author_email: user.email ?? null,
  });

  if (error) {
    redirect(`/admin/inscriptions/${registrationRequestId}?status=comment-create-error`);
  }

  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
}

export async function updateRegistrationCommentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  const commentId = getString(formData, 'comment_id');
  const content = getString(formData, 'content');

  if (!registrationRequestId) return;

  if (!commentId || !content) {
    redirect(`/admin/inscriptions/${registrationRequestId}?comment_update=error`);
  }

  const { error } = await supabase
    .from('registration_request_comments')
    .update({
      content,
    })
    .eq('id', commentId)
    .eq('registration_request_id', registrationRequestId);

  if (error) {
    redirect(`/admin/inscriptions/${registrationRequestId}?comment_update=error`);
  }

  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
  redirect(`/admin/inscriptions/${registrationRequestId}?comment_update=ok`);
}

export async function deleteRegistrationCommentAction(formData: FormData) {
  await requireAdminUser();
  const supabase = getSupabaseServiceClient();

  const registrationRequestId = getString(formData, 'registration_request_id');
  const commentId = getString(formData, 'comment_id');
  if (!registrationRequestId || !commentId) return;

  const { error } = await supabase
    .from('registration_request_comments')
    .delete()
    .eq('id', commentId)
    .eq('registration_request_id', registrationRequestId);

  if (error) {
    redirect(`/admin/inscriptions/${registrationRequestId}?status=comment-delete-error`);
  }

  revalidatePath(`/admin/inscriptions/${registrationRequestId}`);
}
