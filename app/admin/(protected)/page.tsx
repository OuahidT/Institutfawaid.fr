import Link from 'next/link';
import type { Metadata } from 'next';

import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import { siteConfig } from '@/config/site';
import {
  addPurchasedCoursesAction,
  createStudentAction,
  createTeacherAction,
  deleteLessonAction,
  deleteStudentAction,
  regenerateTeacherTokenAction,
} from '@/lib/internal/admin-actions';
import { listLessons, listStudents, listTeachers } from '@/lib/internal/admin-data';
import { getCoursesRemaining } from '@/lib/internal/courses';

export const metadata: Metadata = {
  title: 'Dashboard admin | Institut Fawaid',
  description: 'Gestion interne des élèves et des cours.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const teacherId = typeof params.teacher_id === 'string' ? params.teacher_id : '';

  const [teachers, students, lessons] = await Promise.all([
    listTeachers(),
    listStudents({ query, teacherId }),
    listLessons(40),
  ]);

  return (
    <div className="space-y-4 md:space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <p className="text-xs text-fawaid-muted">Élèves suivis</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">{students.length}</p>
        </article>
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <p className="text-xs text-fawaid-muted">Professeurs actifs</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">{teachers.length}</p>
        </article>
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <p className="text-xs text-fawaid-muted">Historique (40 derniers)</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">{lessons.length}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr] xl:gap-5">
        <article className="space-y-4 rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-semibold text-fawaid-text">Élèves</h1>
              <p className="text-sm text-fawaid-muted">Recherche, filtrage et gestion rapide.</p>
            </div>
            <form method="get" className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_auto_auto] sm:items-center">
              <input
                name="q"
                defaultValue={query}
                placeholder="Rechercher un élève..."
                className="w-full rounded-xl border border-fawaid-border bg-white px-3 py-2.5 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent sm:text-sm"
              />
              <select
                name="teacher_id"
                defaultValue={teacherId}
                className="w-full rounded-xl border border-fawaid-border bg-white px-3 py-2.5 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent sm:text-sm"
              >
                <option value="">Tous les professeurs</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-xl border border-fawaid-accent bg-fawaid-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#033E8F] sm:w-auto"
              >
                Filtrer
              </button>
            </form>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-fawaid-border text-sm">
              <thead>
                <tr className="text-left text-fawaid-muted">
                  <th className="px-2 py-2 font-medium">Élève</th>
                  <th className="px-2 py-2 font-medium">Prof</th>
                  <th className="px-2 py-2 font-medium">Cours</th>
                  <th className="px-2 py-2 font-medium">Achetés</th>
                  <th className="px-2 py-2 font-medium">Effectués</th>
                  <th className="px-2 py-2 font-medium">Restants</th>
                  <th className="px-2 py-2 font-medium">Pause</th>
                  <th className="px-2 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fawaid-border">
                {students.map((student) => (
                  <tr key={student.id} className="align-top">
                    <td className="px-2 py-2">
                      <Link href={`/admin/eleves/${student.id}`} className="font-medium text-fawaid-accent hover:underline">
                        {student.full_name}
                      </Link>
                    </td>
                    <td className="px-2 py-2 text-fawaid-muted">{student.teacher?.name ?? 'Non assigné'}</td>
                    <td className="px-2 py-2 text-fawaid-muted">{student.course_type ?? '—'}</td>
                    <td className="px-2 py-2">{student.total_courses_purchased}</td>
                    <td className="px-2 py-2">{student.courses_completed}</td>
                    <td className="px-2 py-2 font-semibold">
                      {getCoursesRemaining(student.total_courses_purchased, student.courses_completed)}
                    </td>
                    <td className="px-2 py-2">
                      {student.is_paused ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Oui
                        </span>
                      ) : (
                        <span className="text-fawaid-muted">Non</span>
                      )}
                    </td>
                    <td className="space-y-2 px-2 py-2">
                      <form action={addPurchasedCoursesAction} className="flex items-center gap-1.5">
                        <input type="hidden" name="student_id" value={student.id} />
                        <input
                          type="number"
                          name="delta"
                          min={1}
                          defaultValue={1}
                          className="w-16 rounded-lg border border-fawaid-border px-2 py-1 text-xs"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-fawaid-accent bg-fawaid-accent px-2.5 py-1 text-xs font-semibold text-white"
                        >
                          + cours
                        </button>
                      </form>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/eleves/${student.id}`}
                          className="rounded-lg border border-fawaid-border px-2.5 py-1 text-xs font-semibold text-fawaid-accent"
                        >
                          Modifier
                        </Link>
                        <form action={deleteStudentAction}>
                          <input type="hidden" name="student_id" value={student.id} />
                          <ConfirmSubmitButton
                            label="Supprimer"
                            confirmMessage={`Supprimer définitivement ${student.full_name} ?`}
                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700"
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {students.map((student) => {
              const remaining = getCoursesRemaining(student.total_courses_purchased, student.courses_completed);

              return (
                <article key={student.id} className="rounded-xl border border-fawaid-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/admin/eleves/${student.id}`} className="text-base font-semibold text-fawaid-accent hover:underline">
                      {student.full_name}
                    </Link>
                    {student.is_paused ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Pause
                      </span>
                    ) : null}
                  </div>

                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div>
                      <dt className="text-fawaid-muted">Professeur</dt>
                      <dd className="mt-0.5 text-fawaid-text">{student.teacher?.name ?? 'Non assigné'}</dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Type</dt>
                      <dd className="mt-0.5 text-fawaid-text">{student.course_type ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Achetés</dt>
                      <dd className="mt-0.5 font-medium text-fawaid-text">{student.total_courses_purchased}</dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Effectués</dt>
                      <dd className="mt-0.5 font-medium text-fawaid-text">{student.courses_completed}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-fawaid-muted">Restants</dt>
                      <dd className="mt-0.5 text-base font-semibold text-fawaid-text">{remaining}</dd>
                    </div>
                  </dl>

                  <form action={addPurchasedCoursesAction} className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="student_id" value={student.id} />
                    <input
                      type="number"
                      name="delta"
                      min={1}
                      defaultValue={1}
                      className="h-10 w-20 rounded-lg border border-fawaid-border px-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-fawaid-accent bg-fawaid-accent px-3 text-sm font-semibold text-white"
                    >
                      Ajouter des cours
                    </button>
                  </form>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/eleves/${student.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-sm font-semibold text-fawaid-accent"
                    >
                      Modifier
                    </Link>
                    <form action={deleteStudentAction}>
                      <input type="hidden" name="student_id" value={student.id} />
                      <ConfirmSubmitButton
                        label="Supprimer"
                        confirmMessage={`Supprimer définitivement ${student.full_name} ?`}
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 px-2.5 text-sm font-semibold text-red-700"
                      />
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Créer un élève</h2>
            <form action={createStudentAction} className="mt-3 space-y-2.5">
              <input
                name="full_name"
                required
                placeholder="Prénom et nom"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <select name="teacher_id" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm">
                <option value="">Professeur assigné</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <input name="course_type" placeholder="Type de cours" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <input name="hours_per_week" type="number" min={0} placeholder="Heures / semaine" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <input
                name="total_courses_purchased"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Total cours achetés"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input
                name="courses_completed"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Cours effectués"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input name="whatsapp_number" placeholder="Numéro WhatsApp" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <input name="validated_timeslot" placeholder="Créneau validé" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <input name="payment_method" placeholder="Moyen de paiement" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <button type="submit" className="w-full rounded-full border border-fawaid-accent bg-fawaid-accent px-4 py-2.5 text-sm font-semibold text-white">
                Créer l’élève
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Professeurs & liens secrets</h2>
            <div className="mt-3 space-y-3">
              {teachers.map((teacher) => {
                const teacherUrl = `${siteConfig.url}/formulaire-prof/${teacher.secret_token}`;
                return (
                  <div key={teacher.id} className="rounded-xl border border-fawaid-border p-3">
                    <p className="font-medium text-fawaid-text">{teacher.name}</p>
                    <p className="mt-1 text-xs text-fawaid-muted">{teacher.slug}</p>
                    <input
                      readOnly
                      value={teacherUrl}
                      className="mt-2 w-full rounded-lg border border-fawaid-border bg-fawaid-bg px-2 py-1.5 text-[11px] text-fawaid-muted"
                    />
                    <form action={regenerateTeacherTokenAction} className="mt-2">
                      <input type="hidden" name="teacher_id" value={teacher.id} />
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-xs font-semibold text-fawaid-accent"
                      >
                        Régénérer le token
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>

            <form action={createTeacherAction} className="mt-4 space-y-2.5 border-t border-fawaid-border pt-4">
              <input
                name="name"
                required
                placeholder="Nom du professeur"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input name="slug" placeholder="Slug (optionnel)" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm" />
              <button type="submit" className="w-full rounded-full border border-fawaid-accent bg-fawaid-accent px-4 py-2.5 text-sm font-semibold text-white">
                Ajouter un professeur
              </button>
            </form>
          </article>
        </aside>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-xl font-semibold text-fawaid-text">Historique des cours déclarés</h2>
        <p className="mt-1 text-sm text-fawaid-muted">Dernières entrées enregistrées (cours faits ou absences décomptées).</p>

        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-fawaid-border text-sm">
            <thead>
              <tr className="text-left text-fawaid-muted">
                <th className="px-2 py-2 font-medium">Date cours</th>
                <th className="px-2 py-2 font-medium">Élève</th>
                <th className="px-2 py-2 font-medium">Professeur</th>
                <th className="px-2 py-2 font-medium">Créneau / note</th>
                <th className="px-2 py-2 font-medium">Créé le</th>
                <th className="px-2 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fawaid-border">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-2 py-2">{lesson.lesson_date}</td>
                  <td className="px-2 py-2">
                    {lesson.student ? (
                      <Link href={`/admin/eleves/${lesson.student.id}`} className="text-fawaid-accent hover:underline">
                        {lesson.student.full_name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-2 py-2">{lesson.teacher?.name ?? '—'}</td>
                  <td className="px-2 py-2">{lesson.schedule_note}</td>
                  <td className="px-2 py-2 text-fawaid-muted">{new Date(lesson.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-2 py-2">
                    <form action={deleteLessonAction}>
                      <input type="hidden" name="lesson_id" value={lesson.id} />
                      <input type="hidden" name="student_id" value={lesson.student_id} />
                      <ConfirmSubmitButton
                        label="Supprimer"
                        confirmMessage="Supprimer cette entrée de cours et corriger le compteur de l’élève ?"
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700"
                      />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="rounded-xl border border-fawaid-border p-3 text-sm">
              <p className="text-xs text-fawaid-muted">Date du cours</p>
              <p className="font-medium text-fawaid-text">{lesson.lesson_date}</p>

              <p className="mt-2 text-xs text-fawaid-muted">Élève</p>
              <p className="text-fawaid-text">
                {lesson.student ? (
                  <Link href={`/admin/eleves/${lesson.student.id}`} className="text-fawaid-accent hover:underline">
                    {lesson.student.full_name}
                  </Link>
                ) : (
                  '—'
                )}
              </p>

              <p className="mt-2 text-xs text-fawaid-muted">Professeur</p>
              <p className="text-fawaid-text">{lesson.teacher?.name ?? '—'}</p>

              <p className="mt-2 text-xs text-fawaid-muted">Créneau / note</p>
              <p className="break-words text-fawaid-text">{lesson.schedule_note}</p>

              <p className="mt-2 text-xs text-fawaid-muted">Créé le</p>
              <p className="text-fawaid-text">{new Date(lesson.created_at).toLocaleDateString('fr-FR')}</p>

              <form action={deleteLessonAction} className="mt-3">
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="student_id" value={lesson.student_id} />
                <ConfirmSubmitButton
                  label="Supprimer"
                  confirmMessage="Supprimer cette entrée de cours et corriger le compteur de l’élève ?"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 px-2.5 text-sm font-semibold text-red-700"
                />
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
