import { BookOpenCheck, Compass, HandHeart, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/button-link';
import { PageHero } from '@/components/sections/page-hero';
import { SectionTitle } from '@/components/ui/section-title';
import { TestimonialCard } from '@/components/sections/testimonial-card';
import { siteConfig } from '@/config/site';
import { getPageMetadata } from '@/lib/seo';
import {
  founderBioParagraphs,
  missionStatement,
  mounirBioParagraphs,
  reasonsToLearn,
  teamMembers,
  valueDetails,
  values,
} from '@/content/team';
import { testimonials } from '@/content/testimonials';

export const metadata: Metadata = getPageMetadata({
  title: 'À propos | Institut Fawaid',
  description:
    'Découvrez la mission, l’histoire et l’équipe de l’Institut Fawaid, fondé sur la transmission et la pédagogie.',
  path: '/a-propos',
});

const founderTimeline = [
  {
    year: '2012',
    text: 'Début du parcours en France, avec un premier cycle d’apprentissage structuré de la lecture coranique et du Tajwid.',
  },
  {
    year: '2015–2016',
    text: 'Diplôme Universitaire d’arabe à la Sorbonne de Paris, puis poursuite des études auprès de l’Institut Al-Isbah d’Alexandrie.',
  },
  {
    year: '2017',
    text: 'Installation en Égypte pour approfondir la pratique linguistique et étudier à Alexandrie, Mounoufya et au Caire.',
  },
  {
    year: '2025',
    text: 'Poursuite de la spécialisation au Markaz Al-Itqān avec approfondissement en science du sarf.',
  },
];

const valueIcons = [BookOpenCheck, ShieldCheck, Compass, HandHeart];

export default function AProposPage() {
  return (
    <div className="section-shell space-y-10 py-7 md:py-10">
      <PageHero
        title="À propos"
        text="Un institut fondé sur la transmission, l’expérience et la volonté de rendre l’apprentissage de l’arabe accessible dans un cadre stable, clair et exigeant."
      />

      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-fawaid-text">Présentation</h2>
            <p className="mt-3 text-sm leading-relaxed text-fawaid-muted md:text-base">
              À l’Institut Fawaid, nous proposons un apprentissage structuré, immersif et conçu pour s’adapter à l’emploi du temps de chacun. Notre objectif est d’offrir un cadre sérieux, clair et durable pour progresser en lecture, écriture, compréhension et expression orale.
            </p>
          </div>
          <aside className="rounded-2xl border border-fawaid-border bg-fawaid-surface p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Mission</p>
            <p className="mt-2 text-sm leading-relaxed text-fawaid-text">{missionStatement}</p>
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Hadj Abou Salih — Fondateur de l’institut & professeur" />
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <article className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
            <div className="space-y-3 text-sm leading-relaxed text-fawaid-muted md:text-[15px]">
              {founderBioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Repères de parcours</p>
            <ol className="mt-4 space-y-4">
              {founderTimeline.map((item) => (
                <li key={item.year} className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3.5 py-3">
                  <p className="text-sm font-semibold text-fawaid-accent">{item.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fawaid-muted">{item.text}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-fawaid-text">
              {teamMembers[1].name} — {teamMembers[1].role}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-fawaid-muted md:text-[15px]">
              {mounirBioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-fawaid-border bg-fawaid-surface/75 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">
              Ce qu’il pilote au quotidien
            </p>
            <ul className="mt-3 space-y-2 text-sm text-fawaid-muted">
              <li className="rounded-lg border border-fawaid-border bg-white px-3 py-2">Suivi des élèves</li>
              <li className="rounded-lg border border-fawaid-border bg-white px-3 py-2">Organisation des cours</li>
              <li className="rounded-lg border border-fawaid-border bg-white px-3 py-2">Accompagnement pédagogique et amélioration continue</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Nos valeurs" />
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = valueIcons[index] ?? BookOpenCheck;

            return (
              <article key={value} className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-card">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fawaid-surface text-fawaid-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-fawaid-text">{value}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fawaid-muted">{valueDetails[value]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
        <SectionTitle
          title="Pourquoi apprendre avec nous"
          description="Nous accompagnons chaque élève dans un parcours concret, stable et orienté progression réelle."
        />
        <ul className="mt-4 grid gap-2.5 text-sm text-fawaid-muted md:grid-cols-2">
          {reasonsToLearn.map((reason) => (
            <li key={reason} className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3.5 py-2.5">
              {reason}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink href="/programmes">Voir les programmes</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {siteConfig.cta.contact}
          </ButtonLink>
        </div>
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6" id="temoignages">
        <SectionTitle title="Ils nous ont fait confiance" description="Retours d’élèves accompagnés par l’Institut Fawaid." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.name}-${testimonial.age}-${testimonial.location}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
