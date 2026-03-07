import type { Metadata } from 'next';

import { LegalBlock } from '@/components/sections/legal-block';
import { PageHero } from '@/components/sections/page-hero';
import { siteConfig } from '@/config/site';
import { legalConfig } from '@/config/legal';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Mentions légales | Institut Fawaid',
  description: 'Mentions légales du site Institut Fawaid.',
  path: '/mentions-legales',
});

export default function MentionsLegalesPage() {
  return (
    <div className="section-shell space-y-10 py-8 md:py-12">
      <PageHero title="Mentions légales" text="Informations légales relatives au site Institut Fawaid." />

      <div className="space-y-4">
        <LegalBlock title="Éditeur du site">
          {legalConfig.publisher.editorName ? <p>Éditeur : {legalConfig.publisher.editorName}</p> : null}
          {legalConfig.publisher.legalForm ? <p>Statut juridique : {legalConfig.publisher.legalForm}</p> : null}
          {legalConfig.publisher.address ? <p>Adresse : {legalConfig.publisher.address}</p> : null}
          <p>Nom de marque : {siteConfig.name}</p>
          <p>URL : {siteConfig.url}</p>
          <p>
            Contact : <a className="text-fawaid-accent" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </LegalBlock>

        <LegalBlock title="Responsable de publication">
          <p>{legalConfig.publisher.publicationDirector}</p>
        </LegalBlock>

        <LegalBlock title="Hébergement">
          <p>Hébergeur : {legalConfig.host.name}</p>
          {legalConfig.host.website ? (
            <p>
              Site web :{' '}
              <a className="text-fawaid-accent" href={legalConfig.host.website} target="_blank" rel="noopener noreferrer">
                {legalConfig.host.website}
              </a>
            </p>
          ) : null}
          {legalConfig.host.address ? <p>Adresse : {legalConfig.host.address}</p> : null}
        </LegalBlock>

        <LegalBlock title="Propriété intellectuelle">
          <p>
            Les contenus publiés sur ce site (textes, structure, éléments graphiques) sont protégés. Toute reproduction
            ou diffusion non autorisée est interdite.
          </p>
        </LegalBlock>
      </div>
    </div>
  );
}
