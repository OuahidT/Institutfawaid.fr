import 'server-only';

import type { StudentCommentRow, StudentRow, TeacherRow } from '@/lib/supabase/database.types';
import { getSupabaseServiceClient } from '@/lib/supabase/service';
import type { LessonWithRelations, StudentWithTeacher } from '@/types/internal';

export type StudentFilters = {
  query?: string;
  teacherId?: string;
};

export async function listTeachers() {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from('teachers').select('*').order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listStudents(filters: StudentFilters = {}) {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from('students')
    .select(
      `
      *,
      teacher:teachers!students_teacher_id_fkey (
        id,
        name,
        slug
      )
    `
    )
    .order('created_at', { ascending: false });

  if (filters.query) {
    query = query.ilike('full_name', `%${filters.query}%`);
  }

  if (filters.teacherId) {
    query = query.eq('teacher_id', filters.teacherId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as StudentWithTeacher[];
}

export async function getStudentById(studentId: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('students')
    .select(
      `
      *,
      teacher:teachers!students_teacher_id_fkey (
        id,
        name,
        slug
      )
    `
    )
    .eq('id', studentId)
    .maybeSingle();

  if (error) throw error;
  return (data as StudentWithTeacher | null) ?? null;
}

export async function listLessons(limit = 40) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('lessons')
    .select(
      `
      *,
      student:students!lessons_student_id_fkey (
        id,
        full_name
      ),
      teacher:teachers!lessons_teacher_id_fkey (
        id,
        name
      )
    `
    )
    .order('lesson_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as LessonWithRelations[];
}

export async function listStudentLessons(studentId: string, limit = 100) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('student_id', studentId)
    .order('lesson_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function listStudentComments(studentId: string, limit = 200) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('student_comments')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  // If the comments table is not yet deployed in Supabase, keep admin pages usable.
  if (error) {
    if (error.code === '42P01') {
      return [] as StudentCommentRow[];
    }
    throw error;
  }
  return ((data ?? []).reverse()) as StudentCommentRow[];
}

export async function getTeacherByToken(token: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from('teachers').select('*').eq('secret_token', token).maybeSingle();

  if (error) throw error;
  return (data as TeacherRow | null) ?? null;
}

export async function listStudentsByTeacher(teacherId: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as StudentRow[];
}
