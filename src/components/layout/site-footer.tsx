import Link from 'next/link';

import { TrustpilotWidget } from '@/components/sections/trustpilot-widget';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-fawaid-border bg-[linear-gradient(180deg,rgba(245,241,232,0.45),rgba(252,251,248,1))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr] md:items-start">
          <div className="space-y-2.5">
            <p className="font-heading text-xl font-semibold tracking-tight text-fawaid-text">{siteConfig.name}</p>
            <p className="max-w-sm text-sm leading-relaxed text-fawaid-muted">{siteConfig.baseline}</p>
            <TrustpilotWidget className="mx-auto pt-1 md:mx-0" />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-fawaid-accent2">Navigation</p>
            <ul className="space-y-2 text-sm text-fawaid-muted">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-fawaid-accent" href={item.href} scroll>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fawaid-accent2">Contact</p>
            <div className="rounded-2xl border border-fawaid-border bg-white/85 p-4 text-sm text-fawaid-muted shadow-soft">
              <p>
                Email:{' '}
                <a className="font-medium text-fawaid-accent transition hover:text-[#033E8F]" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-2">
                WhatsApp:{' '}
                <a className="font-medium text-fawaid-accent transition hover:text-[#033E8F]" href={siteConfig.whatsappHref}>
                  {siteConfig.whatsapp}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-fawaid-border pt-5 text-xs text-fawaid-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/mentions-legales" className="hover:text-fawaid-accent" scroll>
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-fawaid-accent" scroll>
              Politique de confidentialité
            </Link>
            <Link href="/cgv" className="hover:text-fawaid-accent" scroll>
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
