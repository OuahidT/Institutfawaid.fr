import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { ResourceArticle } from '@/types/resources';

type ResourceCardProps = {
  article: ResourceArticle;
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function ResourceCard({ article }: ResourceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fawaid-border bg-white shadow-card transition hover:-translate-y-0.5 hover:border-fawaid-accent/45">
      {article.featuredImage && article.featuredImageAlt ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-fawaid-border bg-fawaid-surface">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fawaid-accent2">
          {article.category}
        </p>
        <h2 className="mt-2 font-heading text-xl font-semibold leading-snug text-fawaid-text">
          <Link
            href={`/ressources/${article.slug}`}
            className="rounded-sm outline-none transition hover:text-fawaid-accent focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fawaid-muted">{article.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-fawaid-border pt-4 text-xs text-fawaid-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {dateFormatter.format(new Date(`${article.publishedAt}T00:00:00.000Z`))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingTimeMinutes} min de lecture
          </span>
        </div>

        <Link
          href={`/ressources/${article.slug}`}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-fawaid-accent outline-none transition hover:text-[#033E8F] focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2"
          aria-label={`Lire l’article : ${article.title}`}
        >
          Lire l’article <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
