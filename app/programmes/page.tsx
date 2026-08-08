import type { Metadata } from 'next';
import Image from 'next/image';

import { ButtonLink } from '@/components/ui/button-link';
import { siteConfig } from '@/config/site';
import { programs } from '@/content/programs';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Nos programmes | Institut Fawaid',
  description:
    'Découvrez les programmes de l’Institut Fawaid pour apprendre à lire, comprendre et pratiquer l’arabe avec progression.',
  path: '/programmes',
});

export default function ProgrammesPage() {
  return (
    <div className="section-shell space-y-9 py-7 md:py-10">
      <section className="grid overflow-hidden rounded-3xl border border-fawaid-border bg-white shadow-soft md:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-center space-y-3 px-5 py-7 md:px-8 md:py-8">
          <h1 className="font-heading text-2xl font-semibold leading-tight md:text-4xl">Nos programmes</h1>
          <p className="text-sm leading-relaxed text-fawaid-muted md:text-base">
            Nos programmes sont issus de plusieurs années d’enseignement et d’accompagnement, en présentiel comme en ligne. Ils sont construits pour s’adapter aux niveaux et aux rythmes de progression de chaque élève.
          </p>
        </div>

        <div className="relative aspect-[16/9] min-h-[230px] overflow-hidden md:aspect-auto md:min-h-[320px]">
          <Image
            src="/images/programs/programs-learning-desk.jpg"
            alt="Supports d’apprentissage de l’Institut Fawaid disposés sur un bureau"
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-fawaid-border bg-fawaid-surface/65 p-3.5 md:p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Navigation rapide</p>
        <div className="flex flex-wrap gap-2">
          {programs.map((program) => (
            <a
              key={`anchor-${program.id}`}
              href={`#${program.id}`}
              className="rounded-full border border-fawaid-border bg-white px-3 py-1.5 text-sm text-fawaid-muted transition hover:border-fawaid-accent hover:text-fawaid-accent"
            >
              {program.name}
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {programs.map((program) => (
          <article
            id={program.id}
            key={program.id}
            className="scroll-mt-24 rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6"
          >
            <div className="space-y-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-fawaid-text">{program.name}</h2>
                <p className="mt-1 text-sm font-medium text-fawaid-accent2">{program.subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed text-fawaid-muted md:text-[15px]">{program.description}</p>

              <ul className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
                <li className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fawaid-accent2">Niveau</p>
                  <p className="mt-1 text-sm text-fawaid-text">{program.meta.level}</p>
                </li>
                {program.meta.volume ? (
                  <li className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fawaid-accent2">Volume</p>
                    <p className="mt-1 text-sm text-fawaid-text">{program.meta.volume}</p>
                  </li>
                ) : null}
                <li className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fawaid-accent2">Prérequis</p>
                  <p className="mt-1 text-sm text-fawaid-text">{program.meta.prerequisites}</p>
                </li>
                <li className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fawaid-accent2">Résultat attendu</p>
                  <p className="mt-1 text-sm text-fawaid-text">{program.meta.outcome}</p>
                </li>
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-[linear-gradient(180deg,rgba(245,241,232,0.7),rgba(255,255,255,1))] p-6 shadow-soft md:p-7">
        <h2 className="font-heading text-2xl font-semibold text-fawaid-text">Vous ne savez pas quel programme choisir ?</h2>
        <p className="mt-2 text-sm leading-relaxed text-fawaid-muted md:text-base">
          Nous vous orientons selon votre niveau, vos objectifs et votre rythme pour vous proposer un parcours clair dès le départ.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
            {siteConfig.cta.orientation}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {siteConfig.cta.contact}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
