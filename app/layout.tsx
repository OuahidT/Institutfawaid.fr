import type { Metadata } from 'next';
import { Inter, Manrope, Noto_Naskh_Arabic } from 'next/font/google';
import Script from 'next/script';

import './globals.css';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { RouteScrollReset } from '@/components/layout/route-scroll-reset';
import { WhatsAppSticky } from '@/components/ui/whatsapp-sticky';
import { siteConfig } from '@/config/site';
import { isSeoDraftPreview, seoPreviewRobots } from '@/lib/seo-preview';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const notoArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

const faviconVersion = '20260308-1';
const canonicalHomeUrl = `${siteConfig.url}/`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  robots: isSeoDraftPreview() ? seoPreviewRobots : undefined,
  icons: {
    icon: [
      {
        url: `/icon.png?v=${faviconVersion}`,
        type: 'image/png',
        sizes: 'any',
      },
    ],
    shortcut: [
      {
        url: `/icon.png?v=${faviconVersion}`,
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: `/apple-icon.png?v=${faviconVersion}`,
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: canonicalHomeUrl,
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
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.seo.ogImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: canonicalHomeUrl,
    email: siteConfig.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: siteConfig.email,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: canonicalHomeUrl,
    inLanguage: 'fr',
  };

  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable} ${notoArabic.variable}`}>
      <body>
        <RouteScrollReset />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppSticky />
        </div>
      </body>
    </html>
  );
}
