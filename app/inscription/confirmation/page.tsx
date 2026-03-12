import Link from 'next/link';
import type { Metadata } from 'next';

import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...getPageMetadata({
    title: 'Confirmation inscription | Institut Fawaid',
    description: 'Confirmation de réception de la demande d’inscription Institut Fawaid.',
    path: '/inscription/confirmation',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistrationConfirmationPage() {
  return (
    <div className="section-shell py-8 md:py-12">
      <section className="mx-auto max-w-3xl rounded-3xl border border-fawaid-border bg-white p-6 shadow-soft md:p-8">
        <h1 className="font-heading text-2xl font-semibold text-fawaid-text md:text-3xl">Inscription reçue</h1>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-fawaid-text md:text-base">
          <p>Jazakum Allahu khayran pour votre inscription à l’Institut Fawaid.</p>
          <p>
            📌 Votre demande a bien été enregistrée. Nous vous contacterons sous peu pour valider votre créneau et
            finaliser votre inscription.
          </p>
          <p>
            📌 Attention : Votre inscription sera confirmée uniquement après validation d’un créneau et réception du
            paiement.
          </p>
          <p>BarakAllahu fikoum pour votre confiance, et à très bientôt InshaAllah ! 😊</p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-fawaid-accent bg-fawaid-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#033E8F]"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
