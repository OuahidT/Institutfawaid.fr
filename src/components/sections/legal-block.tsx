import type { ReactNode } from 'react';

type LegalBlockProps = {
  title: string;
  children: ReactNode;
};

export function LegalBlock({ title, children }: LegalBlockProps) {
  return (
    <section className="rounded-2xl border border-fawaid-border bg-white p-6 shadow-soft">
      <h2 className="font-heading text-xl font-semibold text-fawaid-text">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-fawaid-muted">{children}</div>
    </section>
  );
}
