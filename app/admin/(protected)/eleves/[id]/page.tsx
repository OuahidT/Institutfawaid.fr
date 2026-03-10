import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import {
  addPurchasedCoursesAction,
  deleteLessonAction,
  deleteStudentAction,
  registerLessonForStudentAction,
  updateLessonAction,
  updateStudentAction,
} from '@/lib/internal/admin-actions';
import { getStudentById, listStudentLessons, listTeachers } from '@/lib/internal/admin-data';
import { getCoursesRemaining } from '@/lib/internal/courses';

export const metadata: Metadata = {
  title: 'Fiche élève | Admin Fawaid',
  description: 'Gestion détaillée d’un élève.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type StudentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  const [student, teachers, lessons] = await Promise.all([getStudentById(id), listTeachers(), listStudentLessons(id, 200)]);

  if (!student) {
    notFound();
  }

  const coursesRemaining = getCoursesRemaining(student.total_courses_purchased, student.courses_completed);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-fawaid-muted">
              <Link href="/admin" className="text-fawaid-accent hover:underline">
                Dashboard
              </Link>{' '}
              / Fiche élève
            </p>
            <h1 className="font-heading text-2xl font-semibold text-fawaid-text">{student.full_name}</h1>
            <p className="mt-1 text-sm text-fawaid-muted">
              Professeur : {student.teacher?.name ?? 'Non assigné'} • Restants :{' '}
              <span className="font-semibold text-fawaid-text">{coursesRemaining}</span>
            </p>
          </div>

          <form action={deleteStudentAction}>
            <input type="hidden" name="student_id" value={student.id} />
            <ConfirmSubmitButton
              label="Supprimer l’élève"
              confirmMessage={`Confirmer la suppression définitive de ${student.full_name} ?`}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
            />
          </form>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <h2 className="font-heading text-xl font-semibold text-fawaid-text">Modifier l’élève</h2>
          <form action={updateStudentAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="student_id" value={student.id} />

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Prénom et nom</label>
              <input
                name="full_name"
                required
                defaultValue={student.full_name}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Genre</label>
              <input name="gender" defaultValue={student.gender ?? ''} className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Âge</label>
              <input
                name="age"
                type="number"
                min={0}
                defaultValue={student.age ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">WhatsApp</label>
              <input
                name="whatsapp_number"
                defaultValue={student.whatsapp_number ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Type de cours</label>
              <input
                name="course_type"
                defaultValue={student.course_type ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Heures / semaine</label>
              <input
                name="hours_per_week"
                type="number"
                min={0}
                defaultValue={student.hours_per_week ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Moyen de paiement</label>
              <input
                name="payment_method"
                defaultValue={student.payment_method ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Professeur assigné</label>
              <select name="teacher_id" defaultValue={student.teacher_id ?? ''} className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm">
                <option value="">Non assigné</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Créneau validé</label>
              <input
                name="validated_timeslot"
                defaultValue={student.validated_timeslot ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Total cours achetés</label>
              <input
                name="total_courses_purchased"
                type="number"
                min={0}
                defaultValue={student.total_courses_purchased}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Cours effectués</label>
              <input
                name="courses_completed"
                type="number"
                min={0}
                defaultValue={student.courses_completed}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm text-fawaid-text">
                <input
                  type="checkbox"
                  name="is_paused"
                  value="true"
                  defaultChecked={student.is_paused}
                  className="h-4 w-4 rounded border-fawaid-border"
                />
                Élève en pause
              </label>
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="rounded-full border border-fawaid-accent bg-fawaid-accent px-5 py-2 text-sm font-semibold text-white">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Ajouter des cours achetés</h2>
            <form action={addPurchasedCoursesAction} className="mt-3 flex items-end gap-2">
              <input type="hidden" name="student_id" value={student.id} />
              <div className="flex-1">
                <label className="mb-1 block text-sm text-fawaid-muted">Nombre de cours à ajouter</label>
                <input name="delta" type="number" min={1} defaultValue={1} className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="rounded-full border border-fawaid-accent bg-fawaid-accent px-4 py-2 text-sm font-semibold text-white">
                Ajouter
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Déclarer un cours (admin)</h2>
            <form action={registerLessonForStudentAction} className="mt-3 space-y-2.5">
              <input type="hidden" name="student_id" value={student.id} />
              <div>
                <label className="mb-1 block text-sm text-fawaid-muted">Date du cours</label>
                <input
                  name="lesson_date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-fawaid-muted">Créneau / note</label>
                <input
                  name="schedule_note"
                  required
                  placeholder="ex: vendredi de midi à 13h (ABS)"
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2 text-sm"
                />
              </div>
              <button type="submit" className="rounded-full border border-fawaid-accent bg-fawaid-accent px-4 py-2 text-sm font-semibold text-white">
                Déclarer le cours
              </button>
            </form>
          </article>
        </aside>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-xl font-semibold text-fawaid-text">Historique des cours</h2>

        <div className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="rounded-xl border border-fawaid-border p-3">
              <form action={updateLessonAction} className="grid gap-2 md:grid-cols-[170px_1fr_auto_auto] md:items-end">
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="student_id" value={student.id} />
                <div>
                  <label className="mb-1 block text-xs text-fawaid-muted">Date</label>
                  <input
                    type="date"
                    name="lesson_date"
                    required
                    defaultValue={lesson.lesson_date}
                    className="w-full rounded-lg border border-fawaid-border px-2.5 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-fawaid-muted">Note / créneau</label>
                  <input
                    name="schedule_note"
                    required
                    defaultValue={lesson.schedule_note}
                    className="w-full rounded-lg border border-fawaid-border px-2.5 py-1.5 text-sm"
                  />
                </div>
                <button type="submit" className="rounded-lg border border-fawaid-border px-3 py-1.5 text-sm font-semibold text-fawaid-accent">
                  Corriger
                </button>
              </form>

              <form action={deleteLessonAction} className="mt-2">
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="student_id" value={student.id} />
                <ConfirmSubmitButton
                  label="Supprimer cette entrée"
                  confirmMessage="Supprimer ce cours et corriger automatiquement le compteur ?"
                  className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700"
                />
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
