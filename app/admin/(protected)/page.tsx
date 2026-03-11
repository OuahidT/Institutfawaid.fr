import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  Clock3,
  ExternalLink,
  Link2,
  MessageCircle,
  PauseCircle,
  Search,
  UserPlus,
  UsersRound,
} from 'lucide-react';

import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import { siteConfig } from '@/config/site';
import {
  addPurchasedCoursesAction,
  createStudentAction,
  createTeacherAction,
  deleteLessonAction,
  regenerateTeacherTokenAction,
} from '@/lib/internal/admin-actions';
import { listLessons, listStudents, listTeachers } from '@/lib/internal/admin-data';
import { getCoursesRemaining } from '@/lib/internal/courses';
import { toWhatsappHref } from '@/lib/internal/whatsapp';
import type { StudentWithTeacher } from '@/types/internal';

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

type StudentPriority = 'urgent' | 'followup' | 'normal';

type StudentDashboardItem = StudentWithTeacher & {
  remaining: number;
  priority: StudentPriority;
  whatsappHref: string | null;
};

const QUICK_DELTAS = [4, 8, 12] as const;

function getPriorityFromRemaining(remaining: number): StudentPriority {
  if (remaining <= 0) return 'urgent';
  if (remaining === 1) return 'followup';
  return 'normal';
}

function getPriorityWeight(priority: StudentPriority) {
  if (priority === 'urgent') return 0;
  if (priority === 'followup') return 1;
  return 2;
}

function sortByFollowUpPriority(a: StudentDashboardItem, b: StudentDashboardItem) {
  const weightDelta = getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
  if (weightDelta !== 0) return weightDelta;

  const remainingDelta = a.remaining - b.remaining;
  if (remainingDelta !== 0) return remainingDelta;

  return a.full_name.localeCompare(b.full_name, 'fr-FR');
}

function getRemainingStyles(remaining: number) {
  if (remaining <= 0) {
    return {
      badge: 'border-red-200 bg-red-50 text-red-700',
      value: 'text-red-700',
      text: 'Urgent',
    };
  }

  if (remaining === 1) {
    return {
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
      value: 'text-amber-700',
      text: 'A relancer',
    };
  }

  return {
    badge: 'border-fawaid-border bg-fawaid-bg text-fawaid-muted',
    value: 'text-fawaid-text',
    text: 'OK',
  };
}

function getRhythmLabel(student: StudentDashboardItem) {
  const hours = student.hours_per_week;
  if (typeof hours === 'number' && Number.isFinite(hours) && hours > 0) {
    return `${hours} cours / semaine`;
  }

  if (student.course_type?.trim()) {
    return student.course_type.trim();
  }

  return 'Non renseigné';
}

function StudentRow({ student }: { student: StudentDashboardItem }) {
  const remainingStyles = getRemainingStyles(student.remaining);
  const rhythmLabel = getRhythmLabel(student);

  return (
    <article className="rounded-xl border border-fawaid-border bg-white p-3.5 shadow-soft sm:p-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(240px,0.9fr)_minmax(360px,1.1fr)_320px] xl:items-center xl:gap-4">
        <div className="min-w-0 xl:pr-3 xl:border-r xl:border-fawaid-border">
          <div className="flex flex-wrap items-start gap-2">
            <Link href={`/admin/eleves/${student.id}`} className="max-w-full truncate text-base font-semibold text-fawaid-accent hover:underline">
              {student.full_name}
            </Link>

            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${remainingStyles.badge}`}>
              {remainingStyles.text}
            </span>

            {student.is_paused ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                En pause
              </span>
            ) : null}
          </div>

          <p className="mt-2 truncate text-xs text-fawaid-muted">
            Professeur: <span className="font-medium text-fawaid-text">{student.teacher?.name ?? 'Non assigné'}</span>
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-4 xl:grid-cols-2 xl:gap-x-4 xl:gap-y-3">
          <div>
            <dt className="text-fawaid-muted">WhatsApp</dt>
            <dd className="mt-0.5 truncate text-fawaid-text">{student.whatsapp_number?.trim() || 'Non renseigné'}</dd>
          </div>

          <div>
            <dt className="text-fawaid-muted">Cours restants</dt>
            <dd className={`mt-0.5 text-base font-semibold ${remainingStyles.value}`}>{student.remaining}</dd>
          </div>

          <div>
            <dt className="text-fawaid-muted">Formule / rythme</dt>
            <dd className="mt-0.5 truncate font-medium text-fawaid-text">{rhythmLabel}</dd>
          </div>

          <div>
            <dt className="text-fawaid-muted">Statut</dt>
            <dd className="mt-0.5 font-medium text-fawaid-text">{remainingStyles.text}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-3 xl:gap-2">
          <div className="contents xl:col-span-3 xl:grid xl:grid-cols-2 xl:gap-2">
            {student.whatsappHref ? (
              <a
                href={student.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-white px-2 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                WhatsApp
              </a>
            ) : (
              <span className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-fawaid-bg px-2 text-xs font-semibold text-fawaid-muted">
                WhatsApp indisponible
              </span>
            )}

            <Link
              href={`/admin/eleves/${student.id}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-white px-2 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              Fiche
            </Link>
          </div>

          {QUICK_DELTAS.map((delta) => (
            <form key={`${student.id}-${delta}`} action={addPurchasedCoursesAction}>
              <input type="hidden" name="student_id" value={student.id} />
              <input type="hidden" name="delta" value={delta} />
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-fawaid-accent bg-fawaid-accent px-2 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
              >
                +{delta}
              </button>
            </form>
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const teacherId = typeof params.teacher_id === 'string' ? params.teacher_id : '';

  const [teachers, students, lessons] = await Promise.all([
    listTeachers(),
    listStudents({ query, teacherId }),
    listLessons(40),
  ]);

  const enrichedStudents: StudentDashboardItem[] = students.map((student) => {
    const remaining = getCoursesRemaining(student.total_courses_purchased, student.courses_completed);

    return {
      ...student,
      remaining,
      priority: getPriorityFromRemaining(remaining),
      whatsappHref: toWhatsappHref(student.whatsapp_number),
    };
  });

  const activeStudents = enrichedStudents
    .filter((student) => !student.is_paused)
    .sort(sortByFollowUpPriority);

  const pausedStudents = enrichedStudents
    .filter((student) => student.is_paused)
    .sort((a, b) => a.full_name.localeCompare(b.full_name, 'fr-FR'));

  const urgentCount = activeStudents.filter((student) => student.remaining <= 0).length;
  const followupCount = activeStudents.filter((student) => student.remaining === 1).length;
  const pausedCount = pausedStudents.length;

  return (
    <div className="space-y-4 md:space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Pilotage quotidien</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">Dashboard élèves</h1>
          <p className="mt-1 text-sm text-fawaid-muted">
            Les actions clés sont accessibles immédiatement pour gérer les relances et les paiements en quelques clics.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <a
              href="#admin-create-student"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un élève
            </a>
            <a
              href="#admin-create-teacher"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              <UsersRound className="mr-2 h-4 w-4" />
              Ajouter un professeur
            </a>
            <a
              href="#admin-teacher-links"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Gérer les liens profs
            </a>
          </div>
        </article>

        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Suivi rapide</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Urgent</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-red-700">
                <AlertTriangle className="h-5 w-5" />
                {urgentCount}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">A relancer</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-amber-700">
                <Clock3 className="h-5 w-5" />
                {followupCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">En pause</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-slate-700">
                <PauseCircle className="h-5 w-5" />
                {pausedCount}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <form method="get" className="grid gap-2 lg:grid-cols-[1fr_260px_auto] lg:items-center">
          <label className="sr-only" htmlFor="admin-student-search">
            Rechercher un élève
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fawaid-muted" />
            <input
              id="admin-student-search"
              name="q"
              defaultValue={query}
              placeholder="Rechercher un élève..."
              className="w-full rounded-xl border border-fawaid-border bg-white py-2.5 pl-9 pr-3 text-base text-fawaid-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent sm:text-sm"
            />
          </div>

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
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F] lg:w-auto"
          >
            Filtrer
          </button>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-semibold text-fawaid-text">Liste principale des élèves</h2>
              <p className="text-xs text-fawaid-muted">Tri automatique par priorité de relance</p>
            </div>

            <div className="mt-3 space-y-3">
              {activeStudents.length === 0 ? (
                <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
                  Aucun élève actif pour ce filtre.
                </p>
              ) : (
                activeStudents.map((student) => <StudentRow key={student.id} student={student} />)
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Élèves en pause</h2>
            <p className="mt-1 text-sm text-fawaid-muted">Distincts du suivi prioritaire, tout en restant accessibles.</p>

            <div className="mt-3 space-y-3">
              {pausedStudents.length === 0 ? (
                <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
                  Aucun élève en pause.
                </p>
              ) : (
                pausedStudents.map((student) => <StudentRow key={student.id} student={student} />)
              )}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article id="admin-create-student" className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Ajouter un élève</h2>
            <form action={createStudentAction} className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
              <input
                name="full_name"
                required
                placeholder="Prénom et nom"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input
                name="whatsapp_number"
                placeholder="Numéro WhatsApp"
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
              <input
                name="course_type"
                placeholder="Type de cours"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />

              <input
                name="hours_per_week"
                type="number"
                min={0}
                placeholder="Heures / semaine"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input
                name="payment_method"
                placeholder="Moyen de paiement"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />

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

              <input
                name="validated_timeslot"
                placeholder="Créneau validé"
                className="sm:col-span-2 w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm xl:col-span-1"
              />

              <button
                type="submit"
                className="sm:col-span-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white xl:col-span-1"
              >
                Créer l’élève
              </button>
            </form>
          </article>

          <article id="admin-create-teacher" className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Ajouter un professeur</h2>
            <form action={createTeacherAction} className="mt-3 space-y-2.5">
              <input
                name="name"
                required
                placeholder="Nom du professeur"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <input
                name="slug"
                placeholder="Slug (optionnel)"
                className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white"
              >
                Ajouter le professeur
              </button>
            </form>
          </article>

          <article id="admin-teacher-links" className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Liens secrets professeurs</h2>
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

                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <a
                        href={teacherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-xs font-semibold text-fawaid-accent"
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Ouvrir
                      </a>

                      <form action={regenerateTeacherTokenAction}>
                        <input type="hidden" name="teacher_id" value={teacher.id} />
                        <button
                          type="submit"
                          className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-xs font-semibold text-fawaid-accent"
                        >
                          Régénérer le token
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
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
