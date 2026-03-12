import type {
  LessonRow,
  RegistrationRequestCommentRow,
  RegistrationRequestRow,
  StudentCommentRow,
  StudentRow,
  TeacherRow,
} from '@/lib/supabase/database.types';

export type StudentWithTeacher = StudentRow & {
  teacher: Pick<TeacherRow, 'id' | 'name' | 'slug'> | null;
};

export type LessonWithRelations = LessonRow & {
  student: Pick<StudentRow, 'id' | 'full_name'> | null;
  teacher: Pick<TeacherRow, 'id' | 'name'> | null;
};

export type StudentComment = StudentCommentRow;

export type RegistrationRequestWithRelations = RegistrationRequestRow & {
  assigned_teacher: Pick<TeacherRow, 'id' | 'name' | 'slug'> | null;
  created_student: Pick<StudentRow, 'id' | 'full_name'> | null;
};

export type RegistrationRequestComment = RegistrationRequestCommentRow;
