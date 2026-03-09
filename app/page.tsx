import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { FeatureCard } from '@/components/sections/feature-card';
import { FormulaCard } from '@/components/sections/formula-card';
import { ProgramCard } from '@/components/sections/program-card';
import { TestimonialCard } from '@/components/sections/testimonial-card';
import { TimelineSteps } from '@/components/sections/timeline-steps';
import { TrustBand } from '@/components/sections/trust-band';
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

export const metadata: Metadata = getPageMetadata({
  title: 'Institut Fawaid | Cours d’arabe en ligne',
  description:
    'Apprenez l’arabe avec méthode, clarté et régularité. Cours en direct, programmes structurés, formules flexibles et accompagnement humain.',
  path: '/',
});

export default function HomePage() {
  return (
    <div className="section-shell space-y-12 py-6 md:py-9">
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

        <div className="relative overflow-hidden rounded-2xl border border-fawaid-border bg-gradient-to-br from-fawaid-surface to-white p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(4,75,173,0.22),transparent_50%),radial-gradient(circle_at_84%_12%,rgba(47,105,196,0.2),transparent_46%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Institut Fawaid</p>
                <p className="mt-1 font-arabic text-3xl leading-none text-fawaid-accent">العِلْمُ نُورٌ</p>
                <p className="text-xs text-fawaid-muted">Transmission, méthode et régularité.</p>
              </div>
              <div className="rounded-2xl border border-fawaid-border bg-white/85 p-2.5">
                <Image src="/images/logo.png" alt="Logo Institut Fawaid" width={62} height={62} className="h-14 w-14" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-fawaid-border bg-white/90 px-3 py-2">
                <p className="text-xs text-fawaid-muted">Expérience</p>
                <p className="text-sm font-semibold text-fawaid-text">10+ ans</p>
              </div>
              <div className="rounded-xl border border-fawaid-border bg-white/90 px-3 py-2">
                <p className="text-xs text-fawaid-muted">Étudiants</p>
                <p className="text-sm font-semibold text-fawaid-text">500+ accompagnés</p>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-fawaid-border bg-white/90 px-3 py-2 text-sm text-fawaid-muted">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-fawaid-accent" />
                Cours en direct en visio
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-fawaid-border bg-white/90 px-3 py-2 text-sm text-fawaid-muted">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-fawaid-accent" />
                Programmes structurés selon les niveaux
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-fawaid-border bg-white/90 px-3 py-2 text-sm text-fawaid-muted">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-fawaid-accent" />
                Accompagnement humain et accessible
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBand />

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
        <div className="grid gap-3.5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.name}-${testimonial.age}-${testimonial.location}`}
              testimonial={testimonial}
            />
          ))}
        </div>
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
  );
}
