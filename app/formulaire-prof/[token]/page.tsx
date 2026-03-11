import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { submitTeacherLessonAction } from '@/lib/internal/admin-actions';
import { getTeacherByToken, listStudentsByTeacher } from '@/lib/internal/admin-data';
import { getCoursesRemaining } from '@/lib/internal/courses';

export const metadata: Metadata = {
  title: 'Formulaire professeur | Institut Fawaid',
  description: 'Déclaration de cours professeur.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type TeacherFormPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeacherFormPage({ params, searchParams }: TeacherFormPageProps) {
  const { token } = await params;
  const query = await searchParams;

  const teacher = await getTeacherByToken(token);
  if (!teacher) notFound();

  const students = await listStudentsByTeacher(teacher.id);
  const status = typeof query.status === 'string' ? query.status : '';

  return (
    <div className="section-shell py-5 md:py-10">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-fawaid-border bg-white p-4 shadow-soft sm:p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fawaid-accent2">Formulaire professeur</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-fawaid-text sm:text-2xl">Déclaration de cours — {teacher.name}</h1>
        <p className="mt-2 text-sm text-fawaid-muted">
          Sélectionnez l’élève, la date, puis indiquez le créneau ou la mention d’absence (ABS).
        </p>

        {status === 'success' ? (
          <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:text-[15px]">
            Cours enregistré avec succès.
          </p>
        ) : null}

        {status === 'error' ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:text-[15px]">
            Erreur lors de l’enregistrement. Vérifiez les champs puis réessayez.
          </p>
        ) : null}

        <form action={submitTeacherLessonAction} className="mt-5 space-y-4 sm:space-y-5">
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="student_id" className="mb-1 block text-sm font-medium text-fawaid-text">
              Élève
            </label>
            <select
              id="student_id"
              name="student_id"
              required
              className="w-full rounded-xl border border-fawaid-border px-3.5 py-3 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent"
            >
              <option value="">Sélectionner un élève</option>
              {students.map((student) => {
                const remaining = getCoursesRemaining(student.total_courses_purchased, student.courses_completed);
                return (
                  <option key={student.id} value={student.id}>
                    {student.full_name} — restants: {remaining}
                    {student.is_paused ? ' (pause)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="lesson_date" className="mb-1 block text-sm font-medium text-fawaid-text">
              Date du cours
            </label>
            <input
              id="lesson_date"
              type="date"
              name="lesson_date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-xl border border-fawaid-border px-3.5 py-3 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent"
            />
          </div>

          <div>
            <label htmlFor="schedule_note" className="mb-1 block text-sm font-medium text-fawaid-text">
              Horaire / note
            </label>
            <input
              id="schedule_note"
              name="schedule_note"
              required
              placeholder="Ex: vendredi de midi à 13h (ABS)"
              className="w-full rounded-xl border border-fawaid-border px-3.5 py-3 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-5 text-base font-semibold text-white transition hover:bg-[#033E8F]"
          >
            Enregistrer le cours
          </button>
        </form>
      </section>
    </div>
  );
}
