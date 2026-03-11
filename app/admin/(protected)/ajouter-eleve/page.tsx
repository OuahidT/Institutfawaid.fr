import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, UserPlus } from 'lucide-react';

import { createStudentAction } from '@/lib/internal/admin-actions';
import { listTeachers } from '@/lib/internal/admin-data';

export const metadata: Metadata = {
  title: 'Ajouter un élève | Admin Fawaid',
  description: 'Création rapide d’un élève.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AddStudentPage() {
  const teachers = await listTeachers();

  return (
    <section className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Action rapide</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-fawaid-text">Ajouter un élève</h1>
          <p className="mt-1 text-sm text-fawaid-muted">Créez un élève sans quitter l’interface interne.</p>
        </div>

        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-full border border-fawaid-border bg-white px-4 text-sm font-semibold text-fawaid-accent transition hover:border-fawaid-accent"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <form action={createStudentAction} className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Prénom et nom</label>
          <input
            name="full_name"
            required
            placeholder="Prénom et nom"
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Numéro WhatsApp</label>
          <input
            name="whatsapp_number"
            placeholder="Ex: +33 6 XX XX XX XX"
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Professeur assigné</label>
          <select name="teacher_id" className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm">
            <option value="">Non assigné</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Type de cours</label>
          <select
            name="course_type"
            required
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionner
            </option>
            <option value="Solo">Solo</option>
            <option value="Duo">Duo</option>
            <option value="Groupe">Groupe</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Heures / semaine</label>
          <select
            name="hours_per_week"
            required
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionner
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Moyen de paiement</label>
          <select
            name="payment_method"
            required
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionner
            </option>
            <option value="PayPal">PayPal</option>
            <option value="Wero">Wero</option>
            <option value="Virement bancaire">Virement bancaire</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Total cours achetés</label>
          <input
            name="total_courses_purchased"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Cours effectués</label>
          <input
            name="courses_completed"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-fawaid-text">Créneau validé</label>
          <input
            name="validated_timeslot"
            placeholder="Ex: lundi 18h-19h"
            className="w-full rounded-xl border border-fawaid-border px-3 py-2.5 text-base sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="sm:col-span-2 inline-flex h-11 items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-4 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
        >
          <UserPlus className="mr-1.5 h-4 w-4" />
          Créer l’élève
        </button>
      </form>
    </section>
  );
}
