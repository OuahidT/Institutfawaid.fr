import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { isSeoDraftPreview } from '@/lib/seo-preview';

export default function robots(): MetadataRoute.Robots {
  if (isSeoDraftPreview()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
