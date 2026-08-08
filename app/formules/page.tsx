import type { Metadata } from 'next';

import { FormulaCard } from '@/components/sections/formula-card';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { siteConfig } from '@/config/site';
import {
  absencePolicy,
  formulaChoice,
  formulaPlans,
  formulasHelpingLine,
  includedItems,
  paymentMethods,
} from '@/content/formulas';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Nos formules | Institut Fawaid',
  description:
    'Comparez les formules Solo, Duo et Groupe de l’Institut Fawaid, avec un cadre sérieux, simple et accessible.',
  path: '/formules',
});

export default function FormulesPage() {
  return (
    <div className="section-shell space-y-9 py-7 md:py-10">
      <PageHero
        title="Nos formules"
        text="Apprenez seul, à deux ou en groupe, selon votre rythme et votre budget. Chaque formule est pensée pour offrir un cadre sérieux, simple et accessible."
      />

      <section className="space-y-4">
        <div className="rounded-2xl border border-fawaid-border bg-fawaid-surface/65 px-4 py-3 text-sm text-fawaid-muted">
          Prix par élève et par mois, selon le volume horaire choisi.
        </div>
        <div className="grid gap-3.5 lg:grid-cols-3">
          {formulaPlans.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} showImage />
          ))}
        </div>
      </section>

      <section className="grid gap-3.5 lg:grid-cols-2">
        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Ce qui est inclus</h2>
          <ul className="mt-3 space-y-2 text-sm text-fawaid-muted">
            {includedItems.map((item) => (
              <li key={item} className="rounded-lg border border-fawaid-border bg-fawaid-bg px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Moyens de paiement</h2>
          <ul className="mt-3 space-y-2 text-sm text-fawaid-muted">
            {paymentMethods.map((item) => (
              <li key={item} className="rounded-lg border border-fawaid-border bg-fawaid-bg px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Absence et report</h2>
          <p className="mt-3 text-sm leading-relaxed text-fawaid-muted">{absencePolicy}</p>
        </article>

        <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
          <h2 className="font-heading text-lg font-semibold text-fawaid-text">Quelle formule choisir ?</h2>
          <ul className="mt-3 space-y-2 text-sm text-fawaid-muted">
            {formulaChoice.map((item) => (
              <li key={item} className="rounded-lg border border-fawaid-border bg-fawaid-bg px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-fawaid-border bg-[linear-gradient(180deg,rgba(245,241,232,0.7),rgba(255,255,255,1))] p-6 shadow-soft md:p-7">
        <h2 className="font-heading text-2xl font-semibold text-fawaid-text">Un accompagnement adapté à votre situation</h2>
        <p className="mt-2 text-sm leading-relaxed text-fawaid-muted md:text-base">
          Choisissez une formule claire, puis échangez avec nous pour confirmer le meilleur rythme de progression.
        </p>
        <p className="mt-2 text-sm font-medium text-fawaid-accent">{formulasHelpingLine}</p>
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
