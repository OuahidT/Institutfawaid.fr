import { MessageCircleQuestion } from 'lucide-react';

import { ButtonLink } from '@/components/ui/button-link';
import { siteConfig } from '@/config/site';
import type { ResourceConversionTarget } from '@/types/resources';

type ArticleCtaProps = {
  conversionTarget: ResourceConversionTarget;
};

const internalTargets: Record<Exclude<ResourceConversionTarget, 'whatsapp'>, string> = {
  '/programmes': 'Découvrir nos programmes',
  '/formules': 'Découvrir nos formules',
  '/inscription': 'Je m’inscris',
  '/contact': 'Nous contacter',
};

export function ArticleCta({ conversionTarget }: ArticleCtaProps) {
  const primaryHref = conversionTarget === 'whatsapp' ? siteConfig.whatsappHref : conversionTarget;
  const primaryLabel = conversionTarget === 'whatsapp'
    ? 'Échanger avec l’Institut'
    : internalTargets[conversionTarget];
  const primaryIsExternal = conversionTarget === 'whatsapp';
  const secondaryHref = primaryIsExternal ? '/contact' : siteConfig.whatsappHref;
  const secondaryLabel = primaryIsExternal ? siteConfig.cta.contact : 'J’ai encore une question';

  return (
    <section className="rounded-3xl border border-fawaid-border bg-[linear-gradient(145deg,rgba(234,241,255,0.9),rgba(255,255,255,1))] p-6 shadow-soft md:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">
          Passer à l’étape suivante
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-fawaid-text">
          Progressez en arabe avec un parcours structuré
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fawaid-muted md:text-base">
          Découvrez l’accompagnement de l’Institut Fawaid ou échangez avec nous pour choisir la solution adaptée à votre niveau et à vos objectifs.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink
            href={primaryHref}
            target={primaryIsExternal ? '_blank' : undefined}
            rel={primaryIsExternal ? 'noopener noreferrer' : undefined}
          >
            {primaryLabel}
          </ButtonLink>
          <ButtonLink
            href={secondaryHref}
            variant="secondary"
            target={primaryIsExternal ? undefined : '_blank'}
            rel={primaryIsExternal ? undefined : 'noopener noreferrer'}
          >
            <MessageCircleQuestion className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
