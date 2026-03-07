import type { Metadata } from 'next';

import { LegalBlock } from '@/components/sections/legal-block';
import { PageHero } from '@/components/sections/page-hero';
import { siteConfig } from '@/config/site';
import { legalConfig } from '@/config/legal';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Politique de confidentialité | Institut Fawaid',
  description: 'Politique de confidentialité du site Institut Fawaid.',
  path: '/politique-de-confidentialite',
});

export default function PrivacyPage() {
  return (
    <div className="section-shell space-y-10 py-8 md:py-12">
      <PageHero
        title="Politique de confidentialité"
        text="Cette page présente les informations essentielles sur la collecte et l’utilisation des données sur le site Institut Fawaid."
      />

      <div className="space-y-4">
        <LegalBlock title="Données collectées">
          <ul className="list-disc space-y-1 pl-5">
            {legalConfig.collectedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LegalBlock>

        <LegalBlock title="Finalités du traitement">
          <ul className="list-disc space-y-1 pl-5">
            {legalConfig.processingPurposes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LegalBlock>

        {legalConfig.retentionDuration ? (
          <LegalBlock title="Durée de conservation">
            <p>{legalConfig.retentionDuration}</p>
          </LegalBlock>
        ) : null}

        {legalConfig.cookiePolicy ? (
          <LegalBlock title="Cookies">
            <p>{legalConfig.cookiePolicy}</p>
          </LegalBlock>
        ) : null}

        <LegalBlock title="Vos droits">
          <ul className="list-disc space-y-1 pl-5">
            {legalConfig.userRights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Pour exercer vos droits, vous pouvez écrire à{' '}
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
