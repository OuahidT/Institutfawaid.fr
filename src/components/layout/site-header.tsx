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
      <div className="mx-auto flex w-full max-w-7xl flex-nowrap items-center justify-between gap-2 px-4 py-2 md:px-5">
        <Link href="/" scroll className="flex shrink-0 items-center" onClick={() => setIsOpen(false)}>
          <Image src="/images/logo.png" alt="Logo Institut Fawaid" width={48} height={48} className="h-11 w-11" />
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

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Navigation principale">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                scroll
                className={cn(
                  'whitespace-nowrap rounded-full px-2 py-2 text-xs font-medium transition hover:bg-fawaid-accentSoft hover:text-fawaid-accent xl:px-2.5 xl:text-[13px]',
                  active ? 'bg-fawaid-accentSoft text-fawaid-accent' : 'text-fawaid-muted'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <ButtonLink
            href={siteConfig.inscriptionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-[13px] leading-none"
          >
            {siteConfig.cta.signup}
          </ButtonLink>
          <ButtonLink
            href="/admin/login"
            variant="secondary"
            className="px-3.5 py-2 text-[13px] leading-none"
          >
            Connexion
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
            <ButtonLink
              href={siteConfig.inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              {siteConfig.cta.signup}
            </ButtonLink>
            <Link
              href="/admin/login"
              scroll
              onClick={() => setIsOpen(false)}
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-fawaid-border bg-white px-5 py-2.5 text-sm font-semibold tracking-tight text-fawaid-accent transition hover:border-fawaid-accent hover:text-[#033E8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2"
            >
              Connexion
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
