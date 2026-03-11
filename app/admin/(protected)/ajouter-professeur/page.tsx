import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, UsersRound } from 'lucide-react';

import { createTeacherAction } from '@/lib/internal/admin-actions';

export const metadata: Metadata = {
  title: 'Ajouter un professeur | Admin Fawaid',
  description: 'Création d’un professeur interne.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddTeacherPage() {
  return (
    <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Action rapide</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">Ajouter un professeur</h1>
          <p className="mt-1 text-sm text-fawaid-muted">Créez un professeur avec son identifiant interne et son token secret.</p>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-full border border-fawaid-border bg-white px-4 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <form action={createTeacherAction} className="mt-5 max-w-xl space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Nom du professeur</label>
          <input
            name="name"
            required
            placeholder="Ex: Hadj"
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Slug (optionnel)</label>
          <input
            name="slug"
            placeholder="ex: hadj"
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F] sm:w-auto"
        >
          <UsersRound className="mr-1.5 h-4 w-4" />
          Ajouter le professeur
        </button>
      </form>
    </section>
  );
}
