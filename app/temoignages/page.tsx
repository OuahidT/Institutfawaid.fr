import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/page-hero';
import { TestimonialVideoGrid } from '@/components/sections/testimonial-video-grid';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionTitle } from '@/components/ui/section-title';
import { siteConfig } from '@/config/site';
import { testimonials } from '@/content/testimonials';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Témoignages | Institut Fawaid',
  description:
    'Découvrez les retours d’élèves accompagnés par l’Institut Fawaid dans leur apprentissage de la langue arabe.',
  path: '/temoignages',
});

export default function TestimonialsPage() {
  return (
    <div className="section-shell space-y-9 py-7 md:py-10">
      <PageHero
        title="Témoignages"
        text="Retours d’élèves accompagnés à l’Institut Fawaid. Ces témoignages reflètent des parcours réels et des progressions vécues."
      />

      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
        <SectionTitle title="Ils nous ont fait confiance" />
        <div className="mt-5">
          <TestimonialVideoGrid testimonials={testimonials} />
        </div>
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-[linear-gradient(180deg,rgba(245,241,232,0.65),rgba(255,255,255,1))] p-6 shadow-soft md:p-7">
        <SectionTitle
          title="Vous souhaitez démarrer à votre tour ?"
          description="Nous vous orientons vers le programme et la formule les plus adaptés à votre niveau."
        />
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink href={siteConfig.inscriptionUrl} target="_blank" rel="noopener noreferrer">
            {siteConfig.cta.signup}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {siteConfig.cta.contact}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
