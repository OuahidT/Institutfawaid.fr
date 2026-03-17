import type { Metadata } from 'next';

import { RegistrationForm } from '@/components/inscription/registration-form';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...getPageMetadata({
    title: 'Inscription | Institut Fawaid',
    description:
      'Formulaire d’inscription en ligne à l’Institut Fawaid. Demande enregistrée puis validation finale après confirmation du créneau et paiement.',
    path: '/inscription',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistrationPage() {
  return (
    <div className="section-shell py-6 md:py-9">
      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-7">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Inscription</p>
          <h1 className="font-heading text-2xl font-semibold text-fawaid-text md:text-3xl">
            Rejoindre l’Institut Fawaid
          </h1>
          <p className="text-sm text-fawaid-muted md:text-base">
            Remplissez ce formulaire en 2 minutes. Notre équipe vous recontactera ensuite sur WhatsApp pour vous proposer
            un créneau et finaliser votre inscription.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-fawaid-border bg-fawaid-bg/60 p-4 md:p-5">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
