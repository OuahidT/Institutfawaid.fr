import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, PauseCircle, PencilLine, PlusCircle } from 'lucide-react';

import { CommentEditAutoClose } from '@/components/admin/comment-edit-autoclose';
import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import {
  addPurchasedCoursesAction,
  createStudentCommentAction,
  deleteStudentCommentAction,
  deleteLessonAction,
  deleteStudentAction,
  registerLessonForStudentAction,
  updateStudentCommentAction,
  updateLessonAction,
  updateStudentAction,
} from '@/lib/internal/admin-actions';
import { getStudentById, listStudentComments, listStudentLessons, listTeachers } from '@/lib/internal/admin-data';
import { getCoursesRemaining } from '@/lib/internal/courses';
import { toWhatsappHref } from '@/lib/internal/whatsapp';
import type { StudentComment } from '@/types/internal';

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
  searchParams: Promise<{ comment_update?: string | string[] }>;
};

const QUICK_DELTAS = [4, 8, 12] as const;

export default async function StudentDetailPage({ params, searchParams }: StudentDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const commentUpdateState = Array.isArray(resolvedSearchParams.comment_update)
    ? resolvedSearchParams.comment_update[0]
    : resolvedSearchParams.comment_update;

  const [student, teachers, lessons] = await Promise.all([getStudentById(id), listTeachers(), listStudentLessons(id, 200)]);

  let comments: StudentComment[] = [];
  try {
    comments = await listStudentComments(id, 300);
  } catch {
    comments = [];
  }

  if (!student) {
    notFound();
  }

  const coursesRemaining = getCoursesRemaining(student.total_courses_purchased, student.courses_completed);
  const whatsappHref = toWhatsappHref(student.whatsapp_number);

  return (
    <div className="space-y-4 md:space-y-5">
      <CommentEditAutoClose enabled={commentUpdateState === 'ok'} />

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <p className="text-sm text-fawaid-muted">
          <Link href="/admin" className="text-fawaid-accent hover:underline">
            Dashboard
          </Link>{' '}
          / Fiche élève
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-xl font-semibold text-fawaid-text sm:text-2xl">{student.full_name}</h1>
          {student.is_paused ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              <PauseCircle className="mr-1 h-3.5 w-3.5" />
              En pause
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm text-fawaid-muted">
          Professeur: {student.teacher?.name ?? 'Non assigné'} • WhatsApp: {student.whatsapp_number?.trim() || 'Non renseigné'}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
            <p className="text-xs text-fawaid-muted">Cours restants</p>
            <p className={`mt-0.5 text-2xl font-semibold ${coursesRemaining <= 0 ? 'text-red-700' : coursesRemaining === 1 ? 'text-amber-700' : 'text-fawaid-text'}`}>
              {coursesRemaining}
            </p>
          </article>
          <article className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
            <p className="text-xs text-fawaid-muted">Cours achetés</p>
            <p className="mt-0.5 text-2xl font-semibold text-fawaid-text">{student.total_courses_purchased}</p>
          </article>
          <article className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
            <p className="text-xs text-fawaid-muted">Cours effectués</p>
            <p className="mt-0.5 text-2xl font-semibold text-fawaid-text">{student.courses_completed}</p>
          </article>
          <article className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
            <p className="text-xs text-fawaid-muted">Heures / semaine</p>
            <p className="mt-0.5 text-2xl font-semibold text-fawaid-text">{student.hours_per_week ?? '—'}</p>
          </article>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-6">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-white px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              WhatsApp
            </a>
          ) : (
            <span className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-fawaid-bg px-3 text-xs font-semibold text-fawaid-muted">
              WhatsApp indisponible
            </span>
          )}

          {QUICK_DELTAS.map((delta) => (
            <form key={delta} action={addPurchasedCoursesAction}>
              <input type="hidden" name="student_id" value={student.id} />
              <input type="hidden" name="delta" value={delta} />
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-fawaid-accent bg-fawaid-accent px-3 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
              >
                +{delta}
              </button>
            </form>
          ))}

          <form action={deleteStudentAction} className="col-span-2 sm:col-span-1">
            <input type="hidden" name="student_id" value={student.id} />
            <ConfirmSubmitButton
              label="Supprimer"
              confirmMessage={`Confirmer la suppression définitive de ${student.full_name} ?`}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700"
            />
          </form>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <div className="flex items-center gap-2">
            <PencilLine className="h-4 w-4 text-fawaid-accent" />
            <h2 className="font-heading text-xl font-semibold text-fawaid-text">Modifier l’élève</h2>
          </div>

          <form action={updateStudentAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="student_id" value={student.id} />

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Prénom et nom</label>
              <input
                name="full_name"
                required
                defaultValue={student.full_name}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Genre</label>
              <input
                name="gender"
                defaultValue={student.gender ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Âge</label>
              <input
                name="age"
                type="number"
                min={0}
                defaultValue={student.age ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">WhatsApp</label>
              <input
                name="whatsapp_number"
                defaultValue={student.whatsapp_number ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Type de cours</label>
              <input
                name="course_type"
                defaultValue={student.course_type ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Heures / semaine</label>
              <input
                name="hours_per_week"
                type="number"
                min={0}
                defaultValue={student.hours_per_week ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Moyen de paiement</label>
              <input
                name="payment_method"
                defaultValue={student.payment_method ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Professeur assigné</label>
              <select
                name="teacher_id"
                defaultValue={student.teacher_id ?? ''}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              >
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
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Total cours achetés</label>
              <input
                name="total_courses_purchased"
                type="number"
                min={0}
                defaultValue={student.total_courses_purchased}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-fawaid-text">Cours effectués</label>
              <input
                name="courses_completed"
                type="number"
                min={0}
                defaultValue={student.courses_completed}
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
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
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-5 text-sm font-semibold text-white sm:w-auto"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-fawaid-accent" />
              <h2 className="font-heading text-lg font-semibold text-fawaid-text">Ajouter des cours achetés</h2>
            </div>
            <p className="mt-1 text-sm text-fawaid-muted">Ajustement libre si besoin (hors +4 / +8 / +12).</p>

            <form action={addPurchasedCoursesAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <input type="hidden" name="student_id" value={student.id} />
              <div className="w-full flex-1">
                <label className="mb-1 block text-sm text-fawaid-muted">Nombre de cours à ajouter</label>
                <input
                  name="delta"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white sm:w-auto"
              >
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
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-fawaid-muted">Créneau / note</label>
                <input
                  name="schedule_note"
                  required
                  placeholder="ex: vendredi de midi à 13h (ABS)"
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white sm:w-auto"
              >
                Déclarer le cours
              </button>
            </form>
          </article>
        </aside>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-xl font-semibold text-fawaid-text">Commentaires internes</h2>
        <p className="mt-1 text-sm text-fawaid-muted">
          Notes partagées entre administrateurs pour suivre les échanges et les points importants.
        </p>
        {commentUpdateState === 'error' ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            La modification du commentaire a échoué. Merci de réessayer.
          </p>
        ) : null}

        <form action={createStudentCommentAction} className="mt-4 space-y-2.5">
          <input type="hidden" name="student_id" value={student.id} />
          <div>
            <label htmlFor="student-comment-content" className="mb-1 block text-sm font-medium text-fawaid-text">
              Nouveau commentaire
            </label>
            <textarea
              id="student-comment-content"
              name="content"
              required
              rows={4}
              placeholder="Écrire une note interne..."
              className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base text-fawaid-text sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
          >
            Ajouter le commentaire
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
              Aucun commentaire pour le moment.
            </p>
          ) : (
            comments.map((comment) => {
              const createdAt = new Date(comment.created_at);
              const dateLabel = createdAt.toLocaleDateString('fr-FR');
              const timeLabel = createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

              return (
                <article key={comment.id} className="rounded-xl border border-fawaid-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fawaid-muted">
                    <span>{comment.author_email ?? 'Admin'}</span>
                    <time dateTime={comment.created_at}>
                      {dateLabel} à {timeLabel}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-fawaid-text">{comment.content}</p>

                  <div className="mt-3 flex flex-wrap items-start gap-2">
                    <details data-comment-edit className="rounded-lg border border-fawaid-border bg-fawaid-bg/60 px-3 py-2">
                      <summary className="cursor-pointer select-none text-xs font-semibold text-fawaid-accent">
                        Modifier
                      </summary>
                      <form action={updateStudentCommentAction} className="mt-2 space-y-2">
                        <input type="hidden" name="student_id" value={student.id} />
                        <input type="hidden" name="comment_id" value={comment.id} />
                        <textarea
                          name="content"
                          required
                          rows={4}
                          defaultValue={comment.content}
                          className="w-full min-w-[220px] rounded-lg border border-fawaid-border bg-white px-2.5 py-2 text-sm text-fawaid-text sm:min-w-[340px]"
                        />
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-fawaid-accent bg-fawaid-accent px-3 text-xs font-semibold text-white transition hover:bg-[#033E8F]"
                        >
                          Enregistrer
                        </button>
                      </form>
                    </details>

                    <form action={deleteStudentCommentAction}>
                      <input type="hidden" name="student_id" value={student.id} />
                      <input type="hidden" name="comment_id" value={comment.id} />
                      <ConfirmSubmitButton
                        label="Supprimer"
                        confirmMessage="Supprimer ce commentaire ?"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700"
                      />
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-xl font-semibold text-fawaid-text">Historique des cours</h2>

        <div className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="rounded-xl border border-fawaid-border p-3">
              <form action={updateLessonAction} className="grid gap-2 md:grid-cols-[170px_1fr_auto] md:items-end">
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="student_id" value={student.id} />
                <div>
                  <label className="mb-1 block text-xs text-fawaid-muted">Date</label>
                  <input
                    type="date"
                    name="lesson_date"
                    required
                    defaultValue={lesson.lesson_date}
                    className="w-full rounded-lg border border-fawaid-border px-2.5 py-2 text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-fawaid-muted">Note / créneau</label>
                  <input
                    name="schedule_note"
                    required
                    defaultValue={lesson.schedule_note}
                    className="w-full rounded-lg border border-fawaid-border px-2.5 py-2 text-base sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-fawaid-border px-3 text-sm font-semibold text-fawaid-accent md:w-auto"
                >
                  Corriger
                </button>
              </form>

              <form action={deleteLessonAction} className="mt-2">
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="student_id" value={student.id} />
                <ConfirmSubmitButton
                  label="Supprimer cette entrée"
                  confirmMessage="Supprimer ce cours et corriger automatiquement le compteur ?"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 px-2.5 text-sm font-semibold text-red-700 md:w-auto"
                />
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
