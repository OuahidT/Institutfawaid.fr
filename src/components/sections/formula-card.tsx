import { Check } from 'lucide-react';

import type { FormulaPlan } from '@/types/content';
import { cn } from '@/lib/utils';

export function FormulaCard({ formula }: { formula: FormulaPlan }) {
  return (
    <article
      className={cn(
        'relative rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 md:p-5',
        formula.recommended ? 'border-fawaid-accent/70' : 'border-fawaid-border'
      )}
    >
      {formula.badge ? (
        <span className="absolute -top-3 left-5 rounded-full bg-fawaid-accent px-3 py-1 text-xs font-semibold text-white">
          {formula.badge}
        </span>
      ) : null}
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
    </article>
  );
}
