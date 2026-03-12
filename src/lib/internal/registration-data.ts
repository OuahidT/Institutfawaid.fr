import 'server-only';

import type { RegistrationRequestCommentRow } from '@/lib/supabase/database.types';
import { getSupabaseServiceClient } from '@/lib/supabase/service';
import type { RegistrationRequestWithRelations } from '@/types/internal';

export async function countPendingRegistrationRequests() {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from('registration_requests')
    .select('id', { head: true, count: 'exact' })
    .eq('status', 'pending');

  if (error) {
    if (error.code === '42P01') return 0;
    throw error;
  }

  return count ?? 0;
}

export async function listPendingRegistrationRequests() {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('registration_requests')
    .select(
      `
      *,
      assigned_teacher:teachers!registration_requests_assigned_teacher_id_fkey (
        id,
        name,
        slug
      ),
      created_student:students!registration_requests_created_student_id_fkey (
        id,
        full_name
      )
    `
    )
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  if (error) {
    if (error.code === '42P01') return [] as RegistrationRequestWithRelations[];
    throw error;
  }

  return (data ?? []) as RegistrationRequestWithRelations[];
}

export async function getRegistrationRequestById(registrationRequestId: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('registration_requests')
    .select(
      `
      *,
      assigned_teacher:teachers!registration_requests_assigned_teacher_id_fkey (
        id,
        name,
        slug
      ),
      created_student:students!registration_requests_created_student_id_fkey (
        id,
        full_name
      )
    `
    )
    .eq('id', registrationRequestId)
    .maybeSingle();

  if (error) {
    if (error.code === '42P01') return null;
    throw error;
  }

  return (data as RegistrationRequestWithRelations | null) ?? null;
}

export async function listRegistrationRequestComments(registrationRequestId: string, limit = 200) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('registration_request_comments')
    .select('*')
    .eq('registration_request_id', registrationRequestId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (error.code === '42P01') return [] as RegistrationRequestCommentRow[];
    throw error;
  }

  return ((data ?? []).reverse()) as RegistrationRequestCommentRow[];
}
