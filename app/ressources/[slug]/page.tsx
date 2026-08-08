import { CalendarDays, Clock3, RefreshCcw, UserRound } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleCta } from '@/components/resources/article-cta';
import { ResourceCard } from '@/components/resources/resource-card';
import { siteConfig } from '@/config/site';
import {
  getPublishedResourceArticle,
  getPublishedResourceArticles,
  getRelatedPublishedArticles,
  renderResourceArticle,
} from '@/lib/resources';

type ResourceArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedResourceArticles().map((article) => ({ slug: article.slug }));
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export async function generateMetadata({ params }: ResourceArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedResourceArticle(slug);

  if (!article) {
    notFound();
  }

  const canonical = `${siteConfig.url}/ressources/${article.slug}`;
  const image = article.featuredImage
    ? {
        url: article.featuredImage,
        alt: article.featuredImageAlt ?? article.title,
      }
    : {
        url: siteConfig.seo.ogImage,
        alt: siteConfig.name,
      };

  return {
    title: { absolute: article.seoTitle },
    description: article.description,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
    authors: [{ name: article.author }],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: article.seoTitle,
      description: article.description,
      url: canonical,
      siteName: siteConfig.name,
      locale: 'fr_FR',
      publishedTime: `${article.publishedAt}T00:00:00.000Z`,
      modifiedTime: `${article.updatedAt ?? article.publishedAt}T00:00:00.000Z`,
      authors: [article.author],
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.description,
      images: [image],
    },
  };
}

export default async function ResourceArticlePage({ params }: ResourceArticlePageProps) {
  const { slug } = await params;
  const article = getPublishedResourceArticle(slug);

  if (!article) {
    notFound();
  }

  const renderedContent = await renderResourceArticle(article.content);
  const relatedArticles = getRelatedPublishedArticles(article);
  const canonical = `${siteConfig.url}/ressources/${article.slug}`;
  const authorType = article.author === siteConfig.name ? 'Organization' : 'Person';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      '@type': authorType,
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    ...(article.featuredImage
      ? { image: new URL(article.featuredImage, siteConfig.url).toString() }
      : {}),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: `${siteConfig.url}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Conseils & Ressources',
        item: `${siteConfig.url}/ressources`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonical,
      },
    ],
  };

  return (
    <div className="section-shell py-7 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <article>
        <nav aria-label="Fil d’Ariane" className="mb-5 overflow-x-auto text-sm text-fawaid-muted">
          <ol className="flex min-w-max items-center gap-2">
            <li><Link href="/" className="rounded-sm hover:text-fawaid-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent">Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/ressources" className="rounded-sm hover:text-fawaid-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent">Conseils & Ressources</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="max-w-[16rem] truncate text-fawaid-text sm:max-w-md">{article.title}</li>
          </ol>
        </nav>

        <header className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">{article.category}</p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-fawaid-text md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-fawaid-muted md:text-lg">{article.excerpt}</p>

            <dl className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-fawaid-border pt-5 text-sm text-fawaid-muted">
              <div className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-fawaid-accent" aria-hidden="true" />
                <dt className="sr-only">Auteur</dt>
                <dd>{article.author}</dd>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-fawaid-accent" aria-hidden="true" />
                <dt className="sr-only">Date de publication</dt>
                <dd>Publié le {formatDate(article.publishedAt)}</dd>
              </div>
              {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                <div className="inline-flex items-center gap-1.5">
                  <RefreshCcw className="h-4 w-4 text-fawaid-accent" aria-hidden="true" />
                  <dt className="sr-only">Date de mise à jour</dt>
                  <dd>Mis à jour le {formatDate(article.updatedAt)}</dd>
                </div>
              ) : null}
              <div className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-fawaid-accent" aria-hidden="true" />
                <dt className="sr-only">Temps de lecture</dt>
                <dd>{article.readingTimeMinutes} min de lecture</dd>
              </div>
            </dl>
          </div>
        </header>

        {article.featuredImage && article.featuredImageAlt ? (
          <div className="relative mx-auto mt-6 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl border border-fawaid-border bg-fawaid-surface shadow-card">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt}
              fill
              priority
              sizes="(min-width: 1152px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="resource-content mx-auto max-w-3xl py-9 md:py-12" dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </article>

      <div className="mx-auto max-w-4xl space-y-10">
        <ArticleCta conversionTarget={article.conversionTarget} />

        {relatedArticles.length > 0 ? (
          <section aria-labelledby="related-articles-title" className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Poursuivre votre lecture</p>
              <h2 id="related-articles-title" className="mt-2 font-heading text-2xl font-semibold text-fawaid-text md:text-3xl">
                À lire également
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <ResourceCard key={relatedArticle.slug} article={relatedArticle} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
