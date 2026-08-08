import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { FeatureCard } from '@/components/sections/feature-card';
import { FormulaCard } from '@/components/sections/formula-card';
import { ProgramCard } from '@/components/sections/program-card';
import { TestimonialVideoGrid } from '@/components/sections/testimonial-video-grid';
import { TimelineSteps } from '@/components/sections/timeline-steps';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionTitle } from '@/components/ui/section-title';
import { siteConfig } from '@/config/site';
import { formulaPlans } from '@/content/formulas';
import {
  finalCta,
  formulasPreview,
  homeHero,
  homeIntroduction,
  programsPreview,
  steps,
  testimonialsIntro,
  whyChooseItems,
} from '@/content/home';
import { programs } from '@/content/programs';
import { testimonials } from '@/content/testimonials';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...getPageMetadata({
    title: 'Institut Fawaid | Cours d’arabe en ligne',
    description:
      'Apprenez l’arabe avec méthode, clarté et régularité. Cours en direct, programmes structurés, formules flexibles et accompagnement humain.',
    path: '/',
  }),
  alternates: null,
};

export default function HomePage() {
  return (
    <>
      <link rel="canonical" href={`${siteConfig.url}/`} />
      <div className="section-shell space-y-11 py-6 md:space-y-12 md:py-9">
      <section className="grid gap-5 rounded-3xl border border-fawaid-border bg-white px-5 py-7 shadow-soft md:grid-cols-[1.08fr_0.92fr] md:px-8 md:py-8">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-fawaid-border bg-fawaid-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fawaid-accent2">
            {siteConfig.shortDescription}
          </p>
          <h1 className="font-heading text-3xl font-semibold leading-tight text-fawaid-text md:text-[2.8rem]">
            {homeHero.title}
          </h1>
          <p className="text-sm leading-relaxed text-fawaid-muted md:text-base">{homeHero.subtitle}</p>
          <div className="flex flex-wrap gap-2.5 pt-0.5">
            <ButtonLink
              href={siteConfig.inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap"
            >
              {siteConfig.cta.signup}
            </ButtonLink>
            <ButtonLink
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="whitespace-nowrap"
            >
              {siteConfig.cta.whatsapp}
            </ButtonLink>
          </div>
          <p className="text-sm text-fawaid-muted">{homeHero.microTrust}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-fawaid-border bg-white shadow-card">
          <div className="relative min-h-[220px] overflow-hidden md:min-h-[230px]">
            <Image
              src="/images/home/hero-online-arabic-learning.jpg"
              alt="Élève suivant un cours d’arabe en direct sur son ordinateur"
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute inset-x-4 bottom-4">
              <p className="inline-flex rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-fawaid-accent shadow-card backdrop-blur-sm">
                Cours d’arabe en direct, où que vous soyez
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
                <p className="text-xs text-fawaid-muted">Expérience</p>
                <p className="text-sm font-semibold text-fawaid-text">+10 ans</p>
              </div>
              <div className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2">
                <p className="text-xs text-fawaid-muted">Étudiants accompagnés</p>
                <p className="text-sm font-semibold text-fawaid-text">+500</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                'Cours en direct en visio',
                'Programmes structurés',
                'Accompagnement humain',
                'Adultes et enfants',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-1.5 rounded-xl border border-fawaid-border bg-fawaid-surface/60 px-2.5 py-2 text-xs leading-snug text-fawaid-muted"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fawaid-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card space-y-5">
        <SectionTitle title={homeIntroduction.title} description={homeIntroduction.text} />
        <ul className="grid gap-3 md:grid-cols-3">
          {homeIntroduction.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 rounded-xl border border-fawaid-border bg-fawaid-bg p-3 text-sm text-fawaid-muted"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fawaid-accent" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Pourquoi choisir l’Institut Fawaid" />
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {whyChooseItems.map((item) => (
            <FeatureCard key={item.title} title={item.title} text={item.text} icon={item.icon} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title={programsPreview.title} description={programsPreview.intro} />
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
        <ButtonLink href="/programmes" variant="secondary" className="inline-flex">
          Voir les programmes <ArrowRight className="ml-1 h-4 w-4" />
        </ButtonLink>
      </section>

      <section className="space-y-5">
        <SectionTitle title={formulasPreview.title} description={formulasPreview.intro} />
        <div className="grid gap-3.5 lg:grid-cols-3">
          {formulaPlans.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} />
          ))}
        </div>
        <p className="text-sm text-fawaid-muted">{formulasPreview.note}</p>
        <p className="text-sm font-medium text-fawaid-accent">{formulasPreview.solidarityLine}</p>
        <ButtonLink href="/formules" variant="secondary">
          Voir les formules
        </ButtonLink>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Comment ça marche" />
        <TimelineSteps steps={steps} />
      </section>

      <section className="space-y-5">
        <SectionTitle title={testimonialsIntro.title} description={testimonialsIntro.text} />
        <TestimonialVideoGrid testimonials={testimonials.slice(0, 3)} layout="preview" />
        <ButtonLink href="/temoignages" variant="secondary">
          Voir les témoignages
        </ButtonLink>
      </section>

      <section className="section-card space-y-5">
        <SectionTitle title={finalCta.title} description={finalCta.text} />
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href={siteConfig.inscriptionUrl} target="_blank" rel="noopener noreferrer">
            {siteConfig.cta.signup}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {siteConfig.cta.contact}
          </ButtonLink>
        </div>
      </section>
      </div>
    </>
  );
}
