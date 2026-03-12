import Link from 'next/link';
import type { Metadata } from 'next';
import { MessageCircle, PencilLine } from 'lucide-react';
import { notFound } from 'next/navigation';

import { CommentEditAutoClose } from '@/components/admin/comment-edit-autoclose';
import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import {
  createRegistrationCommentAction,
  deleteRegistrationCommentAction,
  deleteRegistrationRequestAction,
  updateRegistrationCommentAction,
  updateRegistrationRequestAction,
  validateRegistrationRequestAction,
} from '@/lib/internal/registration-actions';
import { getRegistrationRequestById, listRegistrationRequestComments } from '@/lib/internal/registration-data';
import { listTeachers } from '@/lib/internal/admin-data';
import {
  sanitizeAvailabilities,
  serializeHoursPerWeek,
  REGISTRATION_ACTIVE_AVAILABILITY_SLOTS,
  REGISTRATION_DAY_KEYS,
  REGISTRATION_DAY_LABELS,
  REGISTRATION_SLOT_LABELS,
} from '@/lib/registration/constants';
import { toWhatsappHref } from '@/lib/internal/whatsapp';

export const metadata: Metadata = {
  title: "Fiche d'inscription | Admin Fawaid",
  description: "Traitement d'une inscription en attente.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type RegistrationDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getStatusBadge(status: string) {
  if (status === 'validated') {
    return {
      text: 'Validée',
      className: 'border-green-200 bg-green-50 text-green-700',
    };
  }

  if (status === 'deleted') {
    return {
      text: 'Supprimée',
      className: 'border-slate-200 bg-slate-50 text-slate-700',
    };
  }

  return {
    text: 'En attente',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  };
}

function getFeedbackMessage(status: string | undefined) {
  if (!status) return null;
  if (status === 'saved') return { tone: 'ok', text: 'Informations de validation enregistrées.' };
  if (status === 'save-error') return { tone: 'error', text: "Impossible d'enregistrer les informations." };
  if (status === 'validation-error') return {
    tone: 'error',
    text: "Validation impossible. Vérifiez professeur, créneau validé et nombre de cours achetés.",
  };
  if (status === 'comment-create-error') return { tone: 'error', text: "Impossible d'ajouter le commentaire." };
  if (status === 'comment-delete-error') return { tone: 'error', text: 'Impossible de supprimer le commentaire.' };
  if (status === 'delete-error') return { tone: 'error', text: "Impossible de supprimer l'inscription." };
  return null;
}

export default async function RegistrationDetailPage({ params, searchParams }: RegistrationDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;
  const commentUpdateState =
    typeof resolvedSearchParams.comment_update === 'string' ? resolvedSearchParams.comment_update : undefined;

  const [registration, teachers, comments] = await Promise.all([
    getRegistrationRequestById(id),
    listTeachers(),
    listRegistrationRequestComments(id, 300),
  ]);

  if (!registration) {
    notFound();
  }

  const feedbackMessage = getFeedbackMessage(status);
  const statusBadge = getStatusBadge(registration.status);
  const availabilities = sanitizeAvailabilities(registration.availabilities);
  const whatsappHref = toWhatsappHref(registration.normalized_whatsapp_number || registration.whatsapp_number);
  const isPending = registration.status === 'pending';
  const hoursLabel = serializeHoursPerWeek(registration.hours_per_week);

  return (
    <div className="space-y-4 md:space-y-5">
      <CommentEditAutoClose enabled={commentUpdateState === 'ok'} />

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <p className="text-sm text-fawaid-muted">
          <Link href="/admin/inscriptions" className="text-fawaid-accent hover:underline">
            Inscriptions en attente
          </Link>{' '}
          / Fiche inscription
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-xl font-semibold text-fawaid-text sm:text-2xl">{registration.full_name}</h1>
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusBadge.className}`}>
            {statusBadge.text}
          </span>
        </div>

        <p className="mt-1 text-sm text-fawaid-muted">
          Demande reçue le {new Date(registration.submitted_at).toLocaleDateString('fr-FR')}
          {registration.validated_at ? ` • Validée le ${new Date(registration.validated_at).toLocaleDateString('fr-FR')}` : ''}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
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

          {registration.created_student_id ? (
            <Link
              href={`/admin/eleves/${registration.created_student_id}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border bg-white px-3 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
            >
              Ouvrir l’élève créé
            </Link>
          ) : null}
        </div>

        {feedbackMessage ? (
          <p
            className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
              feedbackMessage.tone === 'ok'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {feedbackMessage.text}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-lg font-semibold text-fawaid-text">Réponses du formulaire</h2>

        <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs text-fawaid-muted">E-mail</dt>
            <dd className="mt-1 text-fawaid-text">{registration.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Nom</dt>
            <dd className="mt-1 text-fawaid-text">{registration.full_name}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Genre</dt>
            <dd className="mt-1 text-fawaid-text">{registration.gender || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Âge</dt>
            <dd className="mt-1 text-fawaid-text">{registration.age ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">WhatsApp</dt>
            <dd className="mt-1 text-fawaid-text">{registration.whatsapp_number}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Niveau</dt>
            <dd className="mt-1 text-fawaid-text">{registration.arabic_level}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Type de cours</dt>
            <dd className="mt-1 text-fawaid-text">{registration.course_type || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Heures / semaine</dt>
            <dd className="mt-1 text-fawaid-text">{hoursLabel === 'autre' ? 'Autre' : hoursLabel}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Moyen de paiement</dt>
            <dd className="mt-1 text-fawaid-text">{registration.payment_method || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-fawaid-muted">Source de découverte</dt>
            <dd className="mt-1 text-fawaid-text">{registration.discovery_source || '—'}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs text-fawaid-muted">Remarque</dt>
            <dd className="mt-1 whitespace-pre-wrap text-fawaid-text">{registration.applicant_note || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-lg font-semibold text-fawaid-text">Disponibilités déclarées</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {REGISTRATION_DAY_KEYS.map((day) => {
            const dayAvailability = availabilities[day];
            const selectedSlots = REGISTRATION_ACTIVE_AVAILABILITY_SLOTS.filter((slot) => dayAvailability[slot]);
            const slotsToDisplay = selectedSlots.length > 0 ? selectedSlots : (['unavailable'] as const);

            return (
              <article key={day} className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-fawaid-muted">{REGISTRATION_DAY_LABELS[day]}</p>
                <ul className="mt-2 space-y-1.5">
                  {slotsToDisplay.map((slot) => (
                    <li key={`${day}-${slot}`}>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                          slot === 'unavailable'
                            ? 'border-slate-200 bg-slate-100 text-slate-700'
                            : 'border-fawaid-accent/20 bg-fawaid-accentSoft text-fawaid-accent'
                        }`}
                      >
                        {REGISTRATION_SLOT_LABELS[slot]}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <PencilLine className="h-4 w-4 text-fawaid-accent" />
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Validation de l’inscription</h2>
        </div>

        {isPending ? (
          <>
            <p className="mt-1 text-sm text-fawaid-muted">
              Complétez ces champs après confirmation du créneau et réception du paiement.
            </p>

            <form action={updateRegistrationRequestAction} className="mt-4 grid gap-3 md:grid-cols-3">
              <input type="hidden" name="registration_request_id" value={registration.id} />

              <div>
                <label className="mb-1 block text-sm font-medium text-fawaid-text">Professeur assigné</label>
                <select
                  name="assigned_teacher_id"
                  defaultValue={registration.assigned_teacher_id ?? ''}
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
                  defaultValue={registration.validated_timeslot ?? ''}
                  placeholder="Ex: lundi 18h-19h"
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-fawaid-text">Nombre de cours achetés</label>
                <input
                  name="purchased_courses"
                  type="number"
                  min={0}
                  defaultValue={registration.purchased_courses ?? ''}
                  className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
                />
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
                >
                  Enregistrer les informations
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-3">
              <form action={validateRegistrationRequestAction}>
                <input type="hidden" name="registration_request_id" value={registration.id} />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
                >
                  Valider l’inscription
                </button>
              </form>

              <form action={deleteRegistrationRequestAction}>
                <input type="hidden" name="registration_request_id" value={registration.id} />
                <input type="hidden" name="redirect_to" value="/admin/inscriptions" />
                <ConfirmSubmitButton
                  label="Supprimer l’inscription"
                  confirmMessage="Supprimer cette inscription de la file en attente ?"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 px-4 text-sm font-semibold text-red-700"
                />
              </form>
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-3 text-sm text-fawaid-muted">
            <p className="font-medium text-fawaid-text">Inscription non active</p>
            <p className="mt-1">
              Statut actuel: {registration.status === 'deleted' ? 'supprimée' : 'validée'}.
            </p>
            {registration.created_student_id ? (
              <p className="mt-1">
                Élève créé:{' '}
                <Link href={`/admin/eleves/${registration.created_student_id}`} className="text-fawaid-accent hover:underline">
                  ouvrir la fiche élève
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft">
        <h2 className="font-heading text-lg font-semibold text-fawaid-text">Commentaires internes</h2>
        <p className="mt-1 text-sm text-fawaid-muted">Suivi interne de la demande avant validation finale.</p>
        {commentUpdateState === 'error' ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            La modification du commentaire a échoué. Merci de réessayer.
          </p>
        ) : null}

        <form action={createRegistrationCommentAction} className="mt-4 space-y-2.5">
          <input type="hidden" name="registration_request_id" value={registration.id} />
          <div>
            <label htmlFor="registration-comment-content" className="mb-1 block text-sm font-medium text-fawaid-text">
              Nouveau commentaire
            </label>
            <textarea
              id="registration-comment-content"
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
                      <form action={updateRegistrationCommentAction} className="mt-2 space-y-2">
                        <input type="hidden" name="registration_request_id" value={registration.id} />
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

                    <form action={deleteRegistrationCommentAction}>
                      <input type="hidden" name="registration_request_id" value={registration.id} />
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
    </div>
  );
}
