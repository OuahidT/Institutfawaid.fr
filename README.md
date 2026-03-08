# Institut Fawaid — Site officiel (Next.js)

Site officiel de l’Institut Fawaid construit avec Next.js (App Router), TypeScript et Tailwind CSS.

## Lancer le projet

Prérequis : Node.js 20+.

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Où modifier les informations principales

- Email, WhatsApp, lien d’inscription, navigation, baseline : `src/config/site.ts`
- Tarifs et formules : `src/content/formulas.ts`
- Programmes : `src/content/programs.ts`
- Textes de la home : `src/content/home.ts`
- FAQ : `src/content/faq.ts`
- Bios équipe, mission, valeurs : `src/content/team.ts`
- Témoignages : `src/content/testimonials.ts`

## Informations légales à compléter

Les données légales sont centralisées dans `src/config/legal.ts`.

Champs actuellement optionnels (non affichés tant qu’ils sont vides) :
- `publisher.editorName`
- `publisher.legalForm`
- `publisher.address`
- `host.address`
- `retentionDuration`
- `cookiePolicy`
- `cancellationTerms`
- `refundTerms`

Compléter ces champs avant mise en ligne définitive si nécessaire.

## Formulaire de contact (Route Handler + Resend)

Le formulaire est dans `src/components/contact/contact-form.tsx`.
La route serveur est dans `app/api/contact/route.ts`.

Variables d’environnement requises :
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Exemple local (`.env.local`, non versionné) :

```bash
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=contact@institutfawaid.fr
CONTACT_FROM_EMAIL=noreply@institutfawaid.fr
```

Comportement :
- validation côté client
- revalidation stricte côté serveur
- envoi via API Resend
- affichage d’un vrai état succès/erreur (aucune simulation)

## Notes

- Les témoignages sont strictement alimentés depuis `src/content/testimonials.ts`.
- Le champ `videoUrl` est prévu dans le type `Testimonial` pour un ajout futur sans refactor.
