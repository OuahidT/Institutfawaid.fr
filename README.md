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

## Formulaire de contact (V1)

Le formulaire est dans `src/components/contact/contact-form.tsx`.

Comportement actuel :
- validation côté front
- génération d’un `mailto:` prérempli vers `contact@institutfawaid.fr`
- bouton WhatsApp direct
- message explicatif si l’application mail ne s’ouvre pas

Pour brancher un vrai envoi :
1. Remplacer la logique `mailto` dans `onSubmit` par un appel API (`fetch` vers `/api/contact` ou service externe).
2. Conserver la validation front existante.
3. Ajouter un vrai état succès/erreur selon la réponse backend.

## Notes

- Les témoignages sont strictement alimentés depuis `src/content/testimonials.ts`.
- Le champ `videoUrl` est prévu dans le type `Testimonial` pour un ajout futur sans refactor.
