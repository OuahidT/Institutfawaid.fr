import type { TeamMember } from '@/types/content';

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="rounded-2xl border border-fawaid-border bg-white p-6 shadow-card">
      <h3 className="font-heading text-xl font-semibold text-fawaid-text">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-fawaid-accent2">{member.role}</p>
      <p className="mt-4 text-sm leading-relaxed text-fawaid-muted">{member.bio}</p>
    </article>
  );
}
