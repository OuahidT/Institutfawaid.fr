import { ArrowRight, CheckCircle2, Quote } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

import { FeatureCard } from '@/components/sections/feature-card';
import { FormulaCard } from '@/components/sections/formula-card';
import { ProgramCard } from '@/components/sections/program-card';
import { TestimonialCard } from '@/components/sections/testimonial-card';
import { TimelineSteps } from '@/components/sections/timeline-steps';
import { TrustBand } from '@/components/sections/trust-band';
import { ButtonLink } from '@/components/ui/button-link';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { SectionTitle } from '@/components/ui/section-title';
import { siteConfig } from '@/config/site';
import { faqItems } from '@/content/faq';
import { formulaPlans } from '@/content/formulas';
import {
  aboutSummary,
  finalCta,
  formulasPreview,
  homeFaqShort,
  homeHero,
  homeIntroduction,
  programsPreview,
  steps,
  testimonialsIntro,
  whyChooseItems,
} from '@/content/home';
import { programs } from '@/content/programs';
import { teamMembers } from '@/content/team';
import { testimonials } from '@/content/testimonials';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Institut Fawaid | Cours d’arabe en ligne',
  description:
    'Apprenez l’arabe avec méthode, clarté et régularité. Cours en direct, programmes structurés, formules flexibles et accompagnement humain.',
  path: '/',
});

export default function HomePage() {
  const shortFaq = homeFaqShort
    .map((question) => faqItems.find((item) => item.question === question))
    .filter((item): item is (typeof faqItems)[number] => Boolean(item));

  return (
    <div className="section-shell space-y-14 py-7 md:py-10">
      <section className="grid gap-6 rounded-3xl border border-fawaid-border bg-white px-5 py-8 shadow-soft md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-9">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-fawaid-border bg-fawaid-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fawaid-accent2">
            {siteConfig.shortDescription}
          </p>
          <h1 className="font-heading text-3xl font-semibold leading-tight text-fawaid-text md:text-[2.8rem]">
            {homeHero.title}
          </h1>
          <p className="text-sm leading-relaxed text-fawaid-muted md:text-base">{homeHero.subtitle}</p>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href={siteConfig.inscriptionUrl} target="_blank" rel="noopener noreferrer">
              {siteConfig.cta.signup}
            </ButtonLink>
            <ButtonLink href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" variant="secondary">
              {siteConfig.cta.whatsapp}
            </ButtonLink>
          </div>
          <p className="text-sm text-fawaid-muted">{homeHero.microTrust}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-fawaid-border bg-fawaid-surface p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(4,75,173,0.2),transparent_50%),radial-gradient(circle_at_84%_12%,rgba(47,105,196,0.22),transparent_46%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">Institut Fawaid</p>
                <p className="mt-1 font-arabic text-3xl leading-none text-fawaid-accent">العِلْمُ نُورٌ</p>
              </div>
              <div className="rounded-2xl border border-fawaid-border bg-white/85 p-2.5">
                <Image src="/images/logo.png" alt="Logo Institut Fawaid" width={62} height={62} className="h-14 w-14" />
              </div>
            </div>

            <div className="grid gap-2.5">
              <div className="rounded-xl border border-fawaid-border bg-white/86 px-3 py-2 text-sm text-fawaid-muted">
                Pédagogie structurée et progressive
              </div>
              <div className="rounded-xl border border-fawaid-border bg-white/86 px-3 py-2 text-sm text-fawaid-muted">
                Cours en direct en visio avec professeurs qualifiés
              </div>
              <div className="rounded-xl border border-fawaid-border bg-white/86 px-3 py-2 text-sm text-fawaid-muted">
                Accompagnement sérieux, humain et accessible
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
              className="flex items-start gap-2 rounded-xl border border-fawaid-border bg-fawaid-bg p-3.5 text-sm text-fawaid-muted"
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

      <section className="section-card space-y-5">
        <SectionTitle title={aboutSummary.title} description={aboutSummary.text} />
        <div className="grid gap-3.5 md:grid-cols-2">
          <article className="rounded-2xl border border-fawaid-border bg-white p-4">
            <h3 className="font-heading text-lg font-semibold text-fawaid-text">{teamMembers[0].name}</h3>
            <p className="text-sm text-fawaid-accent2">{teamMembers[0].role}</p>
            <p className="mt-2 text-sm leading-relaxed text-fawaid-muted">
              Plus de 10 ans d’expérience en transmission de la langue arabe avec une méthode progressive et rigoureuse.
            </p>
          </article>
          <article className="rounded-2xl border border-fawaid-border bg-white p-4">
            <h3 className="font-heading text-lg font-semibold text-fawaid-text">{teamMembers[1].name}</h3>
            <p className="text-sm text-fawaid-accent2">{teamMembers[1].role}</p>
            <p className="mt-2 text-sm leading-relaxed text-fawaid-muted">
              Coordination pédagogique, suivi des élèves et organisation fluide pour une expérience claire et fiable.
            </p>
          </article>
        </div>
        <ButtonLink href="/a-propos" variant="secondary">
          Découvrir l’institut
        </ButtonLink>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Comment ça marche" />
        <TimelineSteps steps={steps} />
      </section>

      <section className="space-y-5" id="temoignages">
        <SectionTitle title={testimonialsIntro.title} description={testimonialsIntro.text} />
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.slice(0, 4).map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.name}-${testimonial.age}-${testimonial.location}`}
              testimonial={testimonial}
            />
          ))}
        </div>
        <ButtonLink href="/a-propos#temoignages" variant="secondary">
          Voir tous les témoignages
        </ButtonLink>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-fawaid-accent2">
          <Quote className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">FAQ courte</p>
        </div>
        <FaqAccordion items={shortFaq} />
        <ButtonLink href="/faq" variant="secondary">
          Voir la FAQ
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
