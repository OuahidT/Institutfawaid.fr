import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, MessageCircle } from 'lucide-react';

import { ConfirmSubmitButton } from '@/components/admin/confirm-submit-button';
import { deleteRegistrationRequestAction } from '@/lib/internal/registration-actions';
import { listPendingRegistrationRequests } from '@/lib/internal/registration-data';
import { toWhatsappHref } from '@/lib/internal/whatsapp';

export const metadata: Metadata = {
  title: 'Inscriptions en attente | Admin Fawaid',
  description: 'Traitement des nouvelles demandes d’inscription.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type RegistrationListPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getStatusMessage(status: string | undefined) {
  if (status === 'deleted') return 'Inscription supprimée de la file active.';
  if (status === 'delete-error') return "Impossible de supprimer l’inscription. Merci de réessayer.";
  return null;
}

export default async function RegistrationListPage({ searchParams }: RegistrationListPageProps) {
  const params = await searchParams;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const pendingRequests = await listPendingRegistrationRequests();

  return (
    <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Nouveau flux</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">Inscriptions en attente</h1>
          <p className="mt-1 text-sm text-fawaid-muted">
            Demandes triées de la plus ancienne à la plus récente, pour traitement humain.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-full border border-fawaid-border bg-white px-4 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {getStatusMessage(status) ? (
        <p className="mt-4 rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
          {getStatusMessage(status)}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        {pendingRequests.length === 0 ? (
          <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
            Aucune inscription en attente pour le moment.
          </p>
        ) : (
          pendingRequests.map((request) => {
            const whatsappHref = toWhatsappHref(request.normalized_whatsapp_number || request.whatsapp_number);

            return (
              <article key={request.id} className="rounded-xl border border-fawaid-border p-3.5">
                <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_minmax(420px,1.4fr)_240px] lg:items-center">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/inscriptions/${request.id}`}
                      className="max-w-full truncate text-base font-semibold text-fawaid-accent underline-offset-2 transition hover:text-[#033E8F] hover:underline"
                    >
                      {request.full_name}
                    </Link>
                    <p className="mt-1 text-xs text-fawaid-muted">
                      Demande reçue le {new Date(request.submitted_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-5">
                    <div>
                      <dt className="text-fawaid-muted">WhatsApp</dt>
                      <dd className="mt-0.5 truncate text-fawaid-text">
                        {request.whatsapp_number?.trim() || 'Non renseigné'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Niveau</dt>
                      <dd className="mt-0.5 truncate text-fawaid-text">{request.arabic_level}</dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Type</dt>
                      <dd className="mt-0.5 truncate text-fawaid-text">{request.course_type || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Heures/sem.</dt>
                      <dd className="mt-0.5 truncate text-fawaid-text">
                        {typeof request.hours_per_week === 'number' ? request.hours_per_week : 'Autre'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-fawaid-muted">Date</dt>
                      <dd className="mt-0.5 text-fawaid-text">
                        {new Date(request.submitted_at).toLocaleDateString('fr-FR')}
                      </dd>
                    </div>
                  </dl>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
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

                    <form action={deleteRegistrationRequestAction}>
                      <input type="hidden" name="registration_request_id" value={request.id} />
                      <input type="hidden" name="redirect_to" value="/admin/inscriptions" />
                      <ConfirmSubmitButton
                        label="Supprimer"
                        confirmMessage="Supprimer cette inscription de la file en attente ?"
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700"
                      />
                    </form>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
