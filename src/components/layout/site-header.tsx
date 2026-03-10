'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/button-link';

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-fawaid-border bg-[rgba(252,251,248,0.96)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
        <Link href="/" scroll className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
          <Image src="/images/logo.png" alt="Logo Institut Fawaid" width={40} height={40} className="h-9 w-9" />
          <p className="font-heading text-base font-semibold tracking-tight text-fawaid-text sm:text-lg">
            {siteConfig.name}
          </p>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-fawaid-border p-2 text-fawaid-text lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigation principale">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                scroll
                className={cn(
                  'rounded-full px-2.5 py-2 text-[13px] font-medium transition hover:bg-fawaid-accentSoft hover:text-fawaid-accent xl:px-3 xl:text-sm',
                  active ? 'bg-fawaid-accentSoft text-fawaid-accent' : 'text-fawaid-muted'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/admin/login"
            scroll
            className="rounded-full px-3 py-2 text-[13px] font-medium text-fawaid-muted transition hover:bg-fawaid-accentSoft hover:text-fawaid-accent"
          >
            Connexion
          </Link>
          <ButtonLink
            href={siteConfig.inscriptionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-[13px] leading-none"
          >
            {siteConfig.cta.signup}
          </ButtonLink>
          <ButtonLink
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="px-4 py-2 text-[13px] leading-none"
          >
            {siteConfig.cta.whatsapp}
          </ButtonLink>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          'border-t border-fawaid-border bg-fawaid-bg lg:hidden',
          isOpen ? 'block animate-fadeUp' : 'hidden'
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Navigation mobile">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                scroll
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-fawaid-accentSoft hover:text-fawaid-accent',
                  active ? 'bg-fawaid-accentSoft text-fawaid-accent' : 'text-fawaid-muted'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 grid gap-2">
            <Link
              href="/admin/login"
              scroll
              onClick={() => setIsOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-xl border border-fawaid-border px-3 py-2 text-sm font-medium text-fawaid-muted transition hover:border-fawaid-accent hover:text-fawaid-accent"
            >
              Connexion
            </Link>
            <ButtonLink
              href={siteConfig.inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              {siteConfig.cta.signup}
            </ButtonLink>
            <ButtonLink
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="w-full"
            >
              {siteConfig.cta.whatsapp}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
