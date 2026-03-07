import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { SectionTitle } from '@/components/ui/section-title';
import { siteConfig } from '@/config/site';
import { faqItems } from '@/content/faq';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'FAQ | Institut Fawaid',
  description:
    'Retrouvez les réponses aux questions fréquentes sur les cours, les programmes, les formules et l’inscription.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <div className="section-shell space-y-9 py-7 md:py-10">
      <PageHero
        title="FAQ"
        text="Retrouvez les réponses essentielles pour choisir votre programme, votre formule et démarrer dans un cadre clair."
      />

      <section>
        <FaqAccordion items={faqItems} />
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-[linear-gradient(180deg,rgba(245,241,232,0.65),rgba(255,255,255,1))] p-6 shadow-soft md:p-7">
        <SectionTitle
          title="Une question plus spécifique ?"
          description="Nous vous orientons rapidement selon votre niveau, vos objectifs et vos disponibilités."
        />
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
            {siteConfig.cta.whatsapp}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {siteConfig.cta.contact}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
