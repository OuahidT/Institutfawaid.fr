import type { LessonRow, StudentRow, TeacherRow } from '@/lib/supabase/database.types';

export type StudentWithTeacher = StudentRow & {
  teacher: Pick<TeacherRow, 'id' | 'name' | 'slug'> | null;
};

export type LessonWithRelations = LessonRow & {
  student: Pick<StudentRow, 'id' | 'full_name'> | null;
  teacher: Pick<TeacherRow, 'id' | 'name'> | null;
};
