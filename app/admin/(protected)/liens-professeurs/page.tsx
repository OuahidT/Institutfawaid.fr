import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, Link2 } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { regenerateTeacherTokenAction } from '@/lib/internal/admin-actions';
import { listTeachers } from '@/lib/internal/admin-data';

export const metadata: Metadata = {
  title: 'Liens professeurs | Admin Fawaid',
  description: 'Gestion des liens secrets des professeurs.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function TeacherLinksPage() {
  const teachers = await listTeachers();

  return (
    <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Action rapide</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">Liens professeurs</h1>
          <p className="mt-1 text-sm text-fawaid-muted">Ouvrez ou régénérez les liens secrets utilisés pour la déclaration des cours.</p>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-full border border-fawaid-border bg-white px-4 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {teachers.length === 0 ? (
          <p className="rounded-xl border border-fawaid-border bg-fawaid-bg px-4 py-3 text-sm text-fawaid-muted">
            Aucun professeur disponible.
          </p>
        ) : (
          teachers.map((teacher) => {
            const teacherUrl = `${siteConfig.url}/formulaire-prof/${teacher.secret_token}`;

            return (
              <article key={teacher.id} className="rounded-xl border border-fawaid-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-fawaid-text">{teacher.name}</p>
                    <p className="text-xs text-fawaid-muted">{teacher.slug}</p>
                  </div>
                  <span className="rounded-full border border-fawaid-border bg-fawaid-bg px-2 py-0.5 text-[11px] font-semibold text-fawaid-muted">
                    Token actif
                  </span>
                </div>

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
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-sm font-semibold text-fawaid-accent"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Ouvrir le formulaire
                  </a>

                  <form action={regenerateTeacherTokenAction}>
                    <input type="hidden" name="teacher_id" value={teacher.id} />
                    <button
                      type="submit"
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-fawaid-border px-2.5 text-sm font-semibold text-fawaid-accent"
                    >
                      <Link2 className="mr-1 h-4 w-4" />
                      Régénérer le token
                    </button>
                  </form>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
