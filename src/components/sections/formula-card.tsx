import { Check } from 'lucide-react';
import Image from 'next/image';

import type { FormulaPlan } from '@/types/content';
import { cn } from '@/lib/utils';

type FormulaCardProps = {
  formula: FormulaPlan;
  showImage?: boolean;
};

export function FormulaCard({ formula, showImage = false }: FormulaCardProps) {
  return (
    <article
      className={cn(
        'relative rounded-2xl border bg-white shadow-card transition hover:-translate-y-0.5',
        showImage ? 'overflow-hidden' : 'p-5 md:p-5',
        formula.recommended ? 'border-fawaid-accent/70' : 'border-fawaid-border'
      )}
    >
      {formula.badge ? (
        <span
          className={cn(
            'absolute left-5 z-10 rounded-full bg-fawaid-accent px-3 py-1 text-xs font-semibold text-white',
            showImage ? 'top-4 shadow-card' : '-top-3'
          )}
        >
          {formula.badge}
        </span>
      ) : null}

      {showImage ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-fawaid-surface">
          <Image
            src={formula.imageUrl}
            alt={formula.imageAlt}
            fill
            sizes="(min-width: 1024px) 31vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className={showImage ? 'p-5' : undefined}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">{formula.label}</p>
        <h3 className="mt-1.5 font-heading text-xl font-semibold text-fawaid-text">{formula.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fawaid-muted">{formula.description}</p>

        <ul className="mt-4 space-y-2">
          {formula.tiers.map((tier) => (
            <li key={`${formula.id}-${tier.hoursPerWeek}`} className="rounded-xl border border-fawaid-border bg-fawaid-bg px-3 py-2.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-fawaid-muted">
                  <Check className="h-4 w-4 text-fawaid-accent" />
                  <span>{tier.hoursPerWeek}</span>
                  <span>•</span>
                  <span>{tier.hoursPerMonth}</span>
                </div>
                <strong className="text-fawaid-text">{tier.price}</strong>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
