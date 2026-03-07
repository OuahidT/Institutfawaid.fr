import {
  BookOpen,
  GraduationCap,
  Leaf,
  SlidersHorizontal,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  video: Video,
  graduation: GraduationCap,
  book: BookOpen,
  sliders: SlidersHorizontal,
  users: Users,
  leaf: Leaf,
};

type FeatureCardProps = {
  title: string;
  text: string;
  icon: string;
};

export function FeatureCard({ title, text, icon }: FeatureCardProps) {
  const Icon = iconMap[icon] ?? BookOpen;

  return (
    <article className="rounded-2xl border border-fawaid-border bg-white p-4 shadow-card transition hover:-translate-y-0.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-fawaid-surface text-fawaid-accent">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-2.5 font-heading text-[17px] font-semibold leading-snug text-fawaid-text">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-fawaid-muted">{text}</p>
    </article>
  );
}
