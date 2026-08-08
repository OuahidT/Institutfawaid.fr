import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ResourceCard } from '@/components/resources/resource-card';
import { PageHero } from '@/components/sections/page-hero';
import { getPublishedResourceArticles } from '@/lib/resources';
import { getPageMetadata } from '@/lib/seo';
import { RESOURCE_CATEGORIES } from '@/types/resources';

export function generateMetadata(): Metadata {
  const hasPublishedArticles = getPublishedResourceArticles().length > 0;

  return {
    ...getPageMetadata({
      title: 'Conseils & Ressources | Institut Fawaid',
      description:
        'Conseils, méthodes et ressources pour apprendre la langue arabe, progresser avec régularité et choisir un parcours adapté.',
      path: '/ressources',
    }),
    robots: hasPublishedArticles
      ? undefined
      : {
          index: false,
          follow: false,
          noarchive: true,
        },
  };
}

export default function ResourcesPage() {
  const articles = getPublishedResourceArticles();

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="section-shell space-y-9 py-7 md:space-y-11 md:py-10">
      <PageHero
        title="Conseils & Ressources"
        text="Des repères clairs pour apprendre la langue arabe, progresser avec méthode et avancer régulièrement selon votre niveau et vos objectifs."
      />

      <section aria-labelledby="resource-categories-title" className="rounded-2xl border border-fawaid-border bg-fawaid-surface/65 p-4 md:p-5">
        <h2 id="resource-categories-title" className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">
          Thématiques éditoriales
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Catégories des ressources">
          {RESOURCE_CATEGORIES.map((category) => (
            <li key={category} className="rounded-full border border-fawaid-border bg-white px-3 py-1.5 text-sm text-fawaid-muted">
              {category}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest-resources-title" className="space-y-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Dernières publications</p>
          <h2 id="latest-resources-title" className="mt-2 font-heading text-2xl font-semibold text-fawaid-text md:text-3xl">
            Nos conseils pour progresser en arabe
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ResourceCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
