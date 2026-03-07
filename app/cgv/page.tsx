import type { Metadata } from 'next';

import { LegalBlock } from '@/components/sections/legal-block';
import { PageHero } from '@/components/sections/page-hero';
import { siteConfig } from '@/config/site';
import { legalConfig } from '@/config/legal';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'CGV | Institut Fawaid',
  description: 'Conditions générales de vente de l’Institut Fawaid.',
  path: '/cgv',
});

export default function CgvPage() {
  return (
    <div className="section-shell space-y-10 py-8 md:py-12">
      <PageHero
        title="Conditions générales de vente"
        text="Les présentes informations résument les conditions actuellement communiquées par l’Institut Fawaid."
      />

      <div className="space-y-4">
        <LegalBlock title="Formules et prestations">
          <p>Cours en direct en visio, programmes structurés selon les niveaux et accompagnement humain.</p>
          <p>{legalConfig.trialLesson}</p>
        </LegalBlock>

        <LegalBlock title="Moyens de paiement">
          <ul className="list-disc space-y-1 pl-5">
            {legalConfig.paymentMethods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LegalBlock>

        <LegalBlock title="Absence et report">
          <p>{legalConfig.absencePolicy}</p>
        </LegalBlock>

        {legalConfig.cancellationTerms ? (
          <LegalBlock title="Annulation">
            <p>{legalConfig.cancellationTerms}</p>
          </LegalBlock>
        ) : null}

        {legalConfig.refundTerms ? (
          <LegalBlock title="Remboursement">
            <p>{legalConfig.refundTerms}</p>
          </LegalBlock>
        ) : null}

        <LegalBlock title="Contact">
          <p>
            Pour toute question sur les conditions, contactez-nous à{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-fawaid-accent">
              {siteConfig.email}
            </a>
            .
          </p>
        </LegalBlock>
      </div>
    </div>
  );
}
