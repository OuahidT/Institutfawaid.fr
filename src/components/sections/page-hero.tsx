import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageHeroProps = {
  title: string;
  text: string;
  className?: string;
  actions?: ReactNode;
};

export function PageHero({ title, text, className, actions }: PageHeroProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-fawaid-border bg-white px-5 py-7 shadow-soft md:px-8 md:py-8',
        className
      )}
    >
      <div className="max-w-3xl space-y-3">
        <h1 className="font-heading text-2xl font-semibold leading-tight md:text-4xl">{title}</h1>
        <p className="text-sm text-fawaid-muted md:text-base">{text}</p>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
