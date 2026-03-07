import type { Testimonial } from '@/types/content';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-fawaid-border bg-white p-4 shadow-card">
      <p className="text-sm leading-relaxed text-fawaid-muted">“{testimonial.quote}”</p>
      <p className="border-t border-fawaid-border/70 pt-3 text-sm font-semibold text-fawaid-text">
        {testimonial.name}, {testimonial.age} ans — {testimonial.location}
      </p>
    </article>
  );
}
