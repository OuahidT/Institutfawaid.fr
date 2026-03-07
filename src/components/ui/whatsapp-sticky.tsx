import { MessageCircle } from 'lucide-react';

import { siteConfig } from '@/config/site';

export function WhatsAppSticky() {
  return (
    <a
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Parler sur WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-fawaid-border bg-white px-3 py-2 text-sm font-semibold text-fawaid-accent shadow-card transition hover:-translate-y-0.5 hover:border-fawaid-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fawaid-accent focus-visible:ring-offset-2 sm:bottom-5 sm:right-5 sm:px-4"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
