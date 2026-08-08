import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getPublishedResourceArticles } from '@/lib/resources';

const routes = [
  '/',
  '/programmes',
  '/formules',
  '/a-propos',
  '/temoignages',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/cgv',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
  const articles = getPublishedResourceArticles();

  if (articles.length === 0) {
    return staticPages;
  }

  const latestResourceDate = articles.reduce(
    (latest, article) => {
      const articleDate = article.updatedAt ?? article.publishedAt;
      return articleDate > latest ? articleDate : latest;
    },
    articles[0].updatedAt ?? articles[0].publishedAt
  );

  return [
    ...staticPages,
    {
      url: `${siteConfig.url}/ressources`,
      lastModified: latestResourceDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${siteConfig.url}/ressources/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
