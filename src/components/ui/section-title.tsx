import { cn } from '@/lib/utils';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('space-y-3', align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fawaid-accent2">{eyebrow}</p>
      ) : null}
      <h2 className="font-heading text-2xl font-semibold leading-tight text-fawaid-text md:text-3xl">{title}</h2>
      {description ? <p className="max-w-3xl text-fawaid-muted">{description}</p> : null}
    </div>
  );
}
