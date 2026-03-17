import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  Clock3,
  Inbox,
  Link2,
  MessageCircle,
  PauseCircle,
  Search,
  UserPlus,
  UsersRound,
} from 'lucide-react';

import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import { addPurchasedCoursesAction, deleteLessonAction } from '@/lib/internal/admin-actions';
import { listLessons, listStudents, listTeachers } from '@/lib/internal/admin-data';
import { countPendingRegistrationRequests } from '@/lib/internal/registration-data';
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
type QuickFilter = 'all' | 'urgent' | 'followup' | 'paused';

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

function parseQuickFilter(rawValue: string): QuickFilter {
  if (rawValue === 'urgent' || rawValue === 'followup' || rawValue === 'paused') return rawValue;
  return 'all';
}

function buildDashboardHref({
  query,
  teacherId,
  quickFilter,
}: {
  query: string;
  teacherId: string;
  quickFilter: QuickFilter;
}) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (teacherId) params.set('teacher_id', teacherId);
  if (quickFilter !== 'all') params.set('quick_filter', quickFilter);
  const queryString = params.toString();
  return queryString ? `/admin?${queryString}` : '/admin';
}

function getStudentStatusStyles(student: StudentDashboardItem) {
  if (student.is_paused) {
    return {
      badge: 'border-slate-200 bg-slate-50 text-slate-700',
      value: 'text-slate-700',
      text: 'En pause',
    };
  }

  const remaining = student.remaining;
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
  const statusStyles = getStudentStatusStyles(student);
  const rhythmLabel = getRhythmLabel(student);

  return (
    <article className="rounded-xl border border-fawaid-border bg-white p-3.5 shadow-soft sm:p-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(240px,0.9fr)_minmax(360px,1.1fr)_360px] xl:items-center xl:gap-4">
        <div className="min-w-0 xl:pr-3 xl:border-r xl:border-fawaid-border">
          <div className="flex flex-wrap items-start gap-2">
            <Link
              href={`/admin/eleves/${student.id}`}
              className="max-w-full truncate text-base font-semibold text-fawaid-accent underline-offset-2 transition hover:text-[#033E8F] hover:underline"
            >
              {student.full_name}
            </Link>

            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusStyles.badge}`}>{statusStyles.text}</span>
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
            <dd className={`mt-0.5 text-base font-semibold ${statusStyles.value}`}>{student.remaining}</dd>
          </div>

          <div>
            <dt className="text-fawaid-muted">Formule / rythme</dt>
            <dd className="mt-0.5 truncate font-medium text-fawaid-text">{rhythmLabel}</dd>
          </div>

          <div>
            <dt className="text-fawaid-muted">Statut</dt>
            <dd className="mt-0.5 font-medium text-fawaid-text">{statusStyles.text}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-5 xl:gap-2">
          {student.whatsappHref ? (
            <a
              href={student.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-2 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-fawaid-border bg-white px-3.5 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              WhatsApp
            </a>
          ) : (
            <span className="sm:col-span-2 inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-fawaid-bg px-2 text-xs font-semibold text-fawaid-muted">
              WhatsApp indisponible
            </span>
          )}

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
  const quickFilter = parseQuickFilter(typeof params.quick_filter === 'string' ? params.quick_filter : '');

  const [teachers, students, lessons, pendingRegistrationsCount] = await Promise.all([
    listTeachers(),
    listStudents({ query, teacherId }),
    listLessons(40),
    countPendingRegistrationRequests(),
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
  const totalStudentsCount = enrichedStudents.length;

  const visibleActiveStudents =
    quickFilter === 'urgent'
      ? activeStudents.filter((student) => student.remaining <= 0)
      : quickFilter === 'followup'
        ? activeStudents.filter((student) => student.remaining === 1)
        : quickFilter === 'paused'
          ? []
          : activeStudents;

  const visiblePausedStudents = quickFilter === 'paused' || quickFilter === 'all' ? pausedStudents : [];
  const showActiveSection = quickFilter !== 'paused';
  const showPausedSection = quickFilter === 'all' || quickFilter === 'paused';

  return (
    <div className="space-y-4 md:space-y-5">
      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <div className="grid gap-2 sm:grid-cols-3">
          <Link
            href="/admin/ajouter-eleve"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un élève
          </Link>
          <Link
            href="/admin/ajouter-professeur"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
          >
            <UsersRound className="mr-2 h-4 w-4" />
            Ajouter un professeur
          </Link>
          <Link
            href="/admin/liens-professeurs"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-fawaid-border bg-fawaid-bg px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Gérer les liens profs
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mt-1 text-base font-semibold text-fawaid-text">Inscriptions en attente : {pendingRegistrationsCount}</p>
            <p className="mt-1 text-sm text-fawaid-muted">Demandes reçues depuis le formulaire d’inscription natif.</p>
          </div>
          <Link
            href="/admin/inscriptions"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-white px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
          >
            <Inbox className="mr-1.5 h-4 w-4" />
            Ouvrir les inscriptions
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-lg font-semibold text-fawaid-text">Suivi rapide</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={buildDashboardHref({ query, teacherId, quickFilter: 'all' })}
            className={`rounded-xl border px-3 py-2 transition ${
              quickFilter === 'all'
                ? 'border-fawaid-accent bg-fawaid-accentSoft'
                : 'border-fawaid-border bg-fawaid-bg hover:border-fawaid-accent'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-fawaid-muted">Total d’étudiants</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-fawaid-text">
              <UsersRound className="h-5 w-5 text-fawaid-accent" />
              {totalStudentsCount}
            </p>
          </Link>
          <Link
            href={buildDashboardHref({ query, teacherId, quickFilter: 'urgent' })}
            className={`rounded-xl border px-3 py-2 transition ${
              quickFilter === 'urgent'
                ? 'border-red-300 bg-red-100 ring-1 ring-red-200'
                : 'border-red-200 bg-red-50 hover:border-red-300'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Urgent</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-red-700">
              <AlertTriangle className="h-5 w-5" />
              {urgentCount}
            </p>
          </Link>
          <Link
            href={buildDashboardHref({ query, teacherId, quickFilter: 'followup' })}
            className={`rounded-xl border px-3 py-2 transition ${
              quickFilter === 'followup'
                ? 'border-amber-300 bg-amber-100 ring-1 ring-amber-200'
                : 'border-amber-200 bg-amber-50 hover:border-amber-300'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">À relancer</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-amber-700">
              <Clock3 className="h-5 w-5" />
              {followupCount}
            </p>
          </Link>
          <Link
            href={buildDashboardHref({ query, teacherId, quickFilter: 'paused' })}
            className={`rounded-xl border px-3 py-2 transition ${
              quickFilter === 'paused'
                ? 'border-slate-300 bg-slate-100 ring-1 ring-slate-200'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">En pause</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-slate-700">
              <PauseCircle className="h-5 w-5" />
              {pausedCount}
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <form method="get" className="grid gap-2 lg:grid-cols-[1fr_260px_auto] lg:items-center">
          <input type="hidden" name="quick_filter" value={quickFilter === 'all' ? '' : quickFilter} />
          <label className="sr-only" htmlFor="admin-student-search">
            Rechercher un élève
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fawaid-muted" />
            <input
              id="admin-student-search"
              name="q"
              defaultValue={query}
              placeholder="Rechercher un élève ou un WhatsApp..."
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

      <section className="space-y-4">
        {showActiveSection ? (
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-semibold text-fawaid-text">Liste principale des élèves</h2>
              <p className="text-xs text-fawaid-muted">Tri automatique par priorité de relance</p>
            </div>

            <div className="mt-3 space-y-3">
              {visibleActiveStudents.length === 0 ? (
                <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
                  Aucun élève actif pour ce filtre.
                </p>
              ) : (
                visibleActiveStudents.map((student) => <StudentRow key={student.id} student={student} />)
              )}
            </div>
          </article>
        ) : null}

        {showPausedSection ? (
          <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
            <h2 className="font-heading text-lg font-semibold text-fawaid-text">Élèves en pause</h2>
            <p className="mt-1 text-sm text-fawaid-muted">Distincts du suivi prioritaire, tout en restant accessibles.</p>

            <div className="mt-3 space-y-3">
              {visiblePausedStudents.length === 0 ? (
                <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
                  Aucun élève en pause.
                </p>
              ) : (
                visiblePausedStudents.map((student) => <StudentRow key={student.id} student={student} />)
              )}
            </div>
          </article>
        ) : null}
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
