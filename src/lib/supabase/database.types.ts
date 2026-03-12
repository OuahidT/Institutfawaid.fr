export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      teachers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          secret_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          secret_token?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          secret_token?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          full_name: string;
          gender: string | null;
          age: number | null;
          whatsapp_number: string | null;
          course_type: string | null;
          hours_per_week: number | null;
          payment_method: string | null;
          teacher_id: string | null;
          validated_timeslot: string | null;
          total_courses_purchased: number;
          courses_completed: number;
          is_paused: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          gender?: string | null;
          age?: number | null;
          whatsapp_number?: string | null;
          course_type?: string | null;
          hours_per_week?: number | null;
          payment_method?: string | null;
          teacher_id?: string | null;
          validated_timeslot?: string | null;
          total_courses_purchased?: number;
          courses_completed?: number;
          is_paused?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          gender?: string | null;
          age?: number | null;
          whatsapp_number?: string | null;
          course_type?: string | null;
          hours_per_week?: number | null;
          payment_method?: string | null;
          teacher_id?: string | null;
          validated_timeslot?: string | null;
          total_courses_purchased?: number;
          courses_completed?: number;
          is_paused?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'students_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          student_id: string;
          teacher_id: string;
          lesson_date: string;
          schedule_note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          teacher_id: string;
          lesson_date: string;
          schedule_note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          teacher_id?: string;
          lesson_date?: string;
          schedule_note?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lessons_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
        ];
      };
      student_comments: {
        Row: {
          id: string;
          student_id: string;
          author_user_id: string | null;
          author_email: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          author_user_id?: string | null;
          author_email?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          author_user_id?: string | null;
          author_email?: string | null;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'student_comments_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      registration_requests: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          gender: string | null;
          age: number | null;
          whatsapp_number: string;
          normalized_whatsapp_number: string | null;
          arabic_level: string;
          course_type: string | null;
          hours_per_week: number | null;
          payment_method: string | null;
          discovery_source: string | null;
          applicant_note: string | null;
          availabilities: Json;
          status: string;
          submitted_at: string;
          validated_at: string | null;
          deleted_at: string | null;
          created_student_id: string | null;
          assigned_teacher_id: string | null;
          validated_timeslot: string | null;
          purchased_courses: number | null;
          processed_by_user_id: string | null;
          processed_by_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          gender?: string | null;
          age?: number | null;
          whatsapp_number: string;
          normalized_whatsapp_number?: string | null;
          arabic_level: string;
          course_type?: string | null;
          hours_per_week?: number | null;
          payment_method?: string | null;
          discovery_source?: string | null;
          applicant_note?: string | null;
          availabilities?: Json;
          status?: string;
          submitted_at?: string;
          validated_at?: string | null;
          deleted_at?: string | null;
          created_student_id?: string | null;
          assigned_teacher_id?: string | null;
          validated_timeslot?: string | null;
          purchased_courses?: number | null;
          processed_by_user_id?: string | null;
          processed_by_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          gender?: string | null;
          age?: number | null;
          whatsapp_number?: string;
          normalized_whatsapp_number?: string | null;
          arabic_level?: string;
          course_type?: string | null;
          hours_per_week?: number | null;
          payment_method?: string | null;
          discovery_source?: string | null;
          applicant_note?: string | null;
          availabilities?: Json;
          status?: string;
          submitted_at?: string;
          validated_at?: string | null;
          deleted_at?: string | null;
          created_student_id?: string | null;
          assigned_teacher_id?: string | null;
          validated_timeslot?: string | null;
          purchased_courses?: number | null;
          processed_by_user_id?: string | null;
          processed_by_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'registration_requests_assigned_teacher_id_fkey';
            columns: ['assigned_teacher_id'];
            isOneToOne: false;
            referencedRelation: 'teachers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registration_requests_created_student_id_fkey';
            columns: ['created_student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      registration_request_comments: {
        Row: {
          id: string;
          registration_request_id: string;
          author_user_id: string | null;
          author_email: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          registration_request_id: string;
          author_user_id?: string | null;
          author_email?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          registration_request_id?: string;
          author_user_id?: string | null;
          author_email?: string | null;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'registration_request_comments_registration_request_id_fkey';
            columns: ['registration_request_id'];
            isOneToOne: false;
            referencedRelation: 'registration_requests';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      register_lesson_by_teacher_token: {
        Args: {
          p_teacher_token: string;
          p_student_id: string;
          p_lesson_date: string;
          p_schedule_note: string;
        };
        Returns: string;
      };
      register_lesson_for_student: {
        Args: {
          p_student_id: string;
          p_lesson_date: string;
          p_schedule_note: string;
        };
        Returns: string;
      };
      remove_lesson_and_reconcile: {
        Args: {
          p_lesson_id: string;
        };
        Returns: string;
      };
      add_purchased_courses: {
        Args: {
          p_student_id: string;
          p_delta: number;
        };
        Returns: number;
      };
      validate_registration_request: {
        Args: {
          p_registration_request_id: string;
          p_processed_by_user_id?: string | null;
          p_processed_by_email?: string | null;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type TeacherRow = Database['public']['Tables']['teachers']['Row'];
export type StudentRow = Database['public']['Tables']['students']['Row'];
export type LessonRow = Database['public']['Tables']['lessons']['Row'];
export type StudentCommentRow = Database['public']['Tables']['student_comments']['Row'];
export type RegistrationRequestRow = Database['public']['Tables']['registration_requests']['Row'];
export type RegistrationRequestCommentRow = Database['public']['Tables']['registration_request_comments']['Row'];
