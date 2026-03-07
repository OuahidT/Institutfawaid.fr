import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

const routes = [
  '/',
  '/programmes',
  '/formules',
  '/a-propos',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/cgv',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
