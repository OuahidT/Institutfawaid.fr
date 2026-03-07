import { ButtonLink } from '@/components/ui/button-link';

export default function NotFound() {
  return (
    <div className="section-shell py-20">
      <section className="section-card text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fawaid-accent2">Erreur 404</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-fawaid-text">Page introuvable</h1>
        <p className="mx-auto mt-3 max-w-xl text-fawaid-muted">
          La page que vous recherchez n’existe pas ou a été déplacée. Revenez à l’accueil ou contactez-nous.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Retour à l’accueil</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Nous contacter
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
