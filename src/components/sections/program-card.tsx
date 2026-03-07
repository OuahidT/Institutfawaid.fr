import type { Program } from '@/types/content';

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="h-full rounded-2xl border border-fawaid-border bg-white p-4 shadow-card transition hover:-translate-y-0.5">
      <h3 className="font-heading text-[19px] font-semibold text-fawaid-text">{program.name}</h3>
      <p className="mt-1 text-sm font-medium text-fawaid-accent2">{program.subtitle}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-fawaid-muted">{program.shortDescription}</p>
    </article>
  );
}
