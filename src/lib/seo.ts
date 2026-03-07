import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
};

export function getPageMetadata({ title, description, path = '/' }: MetadataOptions): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.seo.ogImage],
    },
  };
}
