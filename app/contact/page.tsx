import { Mail, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact/contact-form';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button-link';
import { SectionTitle } from '@/components/ui/section-title';
import { siteConfig } from '@/config/site';
import { getPageMetadata } from '@/lib/seo';

export const metadata: Metadata = getPageMetadata({
  title: 'Contact | Institut Fawaid',
  description:
    'Contactez l’Institut Fawaid pour être orienté vers le programme et la formule les plus adaptés à votre profil.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="section-shell space-y-9 py-7 md:py-10">
      <PageHero
        title="Contact"
        text="Vous avez une question, vous souhaitez être orienté vers le bon programme ou choisir la formule qui vous convient ? Écrivez-nous, nous vous répondrons avec sérieux et simplicité."
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-fawaid-border bg-white p-4 shadow-soft md:p-5">
          <SectionTitle title="Coordonnées" />
          <div className="mt-4 space-y-3 text-sm text-fawaid-muted">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-fawaid-accent" />
              <a href={`mailto:${siteConfig.email}`} className="font-medium text-fawaid-accent">
                {siteConfig.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-fawaid-accent" />
              <a href={siteConfig.whatsappHref} className="font-medium text-fawaid-accent">
                {siteConfig.whatsapp}
              </a>
            </p>
          </div>
          <p className="mt-4 rounded-xl border border-fawaid-border bg-fawaid-surface/70 px-3.5 py-2.5 text-sm text-fawaid-muted">
            Réponse en général sous 24h ouvrées.
          </p>
          <div className="mt-4">
            <ButtonLink href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
              {siteConfig.cta.whatsapp}
            </ButtonLink>
          </div>
        </article>

        <ContactForm />
      </section>

      <section className="grid gap-3.5 md:grid-cols-2">
        <article className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
          <SectionTitle
            title="Vous ne savez pas quoi choisir ?"
            description="Expliquez-nous votre situation, nous vous aiderons à identifier le programme et la formule les plus adaptés."
          />
          <div className="mt-4">
            <ButtonLink href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" variant="secondary">
              {siteConfig.cta.orientation}
            </ButtonLink>
          </div>
        </article>

        <article className="rounded-3xl border border-fawaid-border bg-white p-5 shadow-soft md:p-6">
          <SectionTitle
            title="Déjà prêt à nous rejoindre ?"
            description="Vous pouvez également utiliser le formulaire d’inscription si vous êtes déjà prêt à commencer."
          />
          <div className="mt-4">
            <ButtonLink href={siteConfig.inscriptionUrl} target="_blank" rel="noopener noreferrer">
              Accéder au formulaire d’inscription
            </ButtonLink>
          </div>
        </article>
      </section>
    </div>
  );
}
