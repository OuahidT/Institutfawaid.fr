# Design System — Institut Fawaid

Version: V1 opérationnelle (site public + espace admin)  
Stack: Next.js + Tailwind CSS + TypeScript + Lucide

## 1) Direction de marque

Le système visuel repose sur 5 principes:

1. Clarté immédiate
2. Sobriété premium
3. Confiance institutionnelle
4. Chaleur humaine sans surcharge
5. Lisibilité mobile-first

Style global:

- Fonds lumineux et doux
- Accent bleu institutionnel
- Bordures légères
- Ombres discrètes
- Arrondis généreux mais sobres

## 2) Tokens de design

### Couleurs (Tailwind `theme.extend.colors.fawaid`)

| Token | Valeur | Usage |
|---|---|---|
| `fawaid-bg` | `#FCFBF8` | fond principal |
| `fawaid-surface` | `#F5F1E8` | surfaces secondaires douces |
| `fawaid-text` | `#171717` | texte principal |
| `fawaid-muted` | `#5B5B5B` | texte secondaire |
| `fawaid-accent` | `#044BAD` | action principale / liens forts |
| `fawaid-accent2` | `#2F69C4` | accents secondaires / labels |
| `fawaid-accentSoft` | `#EAF1FF` | fonds d’état actif doux |
| `fawaid-border` | `#DEE6F4` | bordures |

Couleurs d’état utilisées:

- Urgent: rouge doux (`border-red-200`, `bg-red-50`, `text-red-700`)
- À relancer: ambre doux (`border-amber-200`, `bg-amber-50`, `text-amber-700`)
- En pause: gris doux (`border-slate-200`, `bg-slate-50`, `text-slate-700`)
- Succès: vert doux (`border-green-200`, `bg-green-50`, `text-green-700`)

### Typographies

| Rôle | Font |
|---|---|
| Texte UI/Body | Inter (`--font-inter`) |
| Titres | Manrope (`--font-manrope`) |
| Texte arabe | Noto Naskh Arabic (`--font-noto-arabic`) |

Mapping Tailwind:

- `font-sans` → Inter
- `font-heading` → Manrope
- `font-arabic` → Noto Naskh Arabic

### Ombres

| Token | Valeur | Usage |
|---|---|---|
| `shadow-soft` | `0 12px 28px rgba(23, 23, 23, 0.06)` | grandes sections |
| `shadow-card` | `0 8px 20px rgba(4, 75, 173, 0.1)` | cartes / éléments actionnables |

### Animation

- Keyframe `fadeUp`: apparition verticale douce
- Animation `animate-fadeUp`: `700ms ease both`
- Respect de `prefers-reduced-motion` (animations et transitions neutralisées)

## 3) Grammaire de layout

### Containers

- `.section-shell`: `max-w-6xl`, padding horizontal responsive
- `.section-card`: carte section standard (`rounded-3xl`, bordure, fond blanc, `shadow-soft`)
- `.soft-divider`: séparateur doux (`border-fawaid-border`)

### Grands gabarits

- Header sticky avec fond translucide + blur
- Main en colonne (`min-h-screen`)
- Footer en 3 colonnes desktop, pile mobile

### Échelle de rayon

- `rounded-full`: CTA et badges ronds
- `rounded-3xl`: grands blocs de section
- `rounded-2xl`: cartes principales
- `rounded-xl`: champs et cartes compactes
- `rounded-lg`: éléments utilitaires secondaires

## 4) Typo scale observée

- `H1`: `text-3xl` mobile, jusqu’à `md:text-[2.8rem]`
- `H2 section`: `text-2xl` mobile, `md:text-3xl`
- `H3 carte`: `text-lg` à `text-xl` selon bloc
- Body: `text-sm` à `text-base`
- Meta labels: `text-xs` avec tracking uppercase

## 5) Composants UI (patterns)

### Boutons (`ButtonLink`)

Base commune:

- `rounded-full`
- `font-semibold`
- focus ring visible
- transitions douces

Variantes:

1. `primary`
   - fond `fawaid-accent`
   - texte blanc
   - hover `#033E8F`
2. `secondary`
   - fond blanc
   - texte accent
   - bordure douce puis accent au hover
3. `ghost`
   - transparent
   - bordure douce
   - hover surface

### Titres de section (`SectionTitle`)

- Optional eyebrow en `accent2` uppercase
- Titre Manrope fort
- Description max-width (`max-w-3xl`) pour la lisibilité

### Cartes principales

- Feature cards: icône + titre + texte, `shadow-card`, hover lift léger
- Program cards: hiérarchie titre / sous-titre / description
- Formula cards: badge optionnel, tiers tarifaires dans sous-cartes
- Testimonial cards: citation + signature séparée par bordure haute
- Steps cards: numéro rond + titre + description

### Formulaires

- Inputs/select/textarea: `rounded-xl`, bordure douce, padding confortable
- Taille de texte adaptée mobile (`text-base`) puis desktop (`sm:text-sm`)
- Messages d’erreur/succès en bannières douces colorées

### Éléments fixes

- Bouton WhatsApp sticky en bas à droite, discret et accessible

## 6) Navigation

### Header public

- Logo seul à gauche
- Menu desktop en une ligne, liens arrondis avec état actif `accentSoft`
- CTA: `Je m’inscris` + `Connexion`
- Menu mobile avec panneau `animate-fadeUp`

### Footer

- Colonne marque + baseline + Trustpilot
- Colonne navigation
- Colonne contact en carte
- Légal en ligne séparée

## 7) UX patterns clés

1. Information avant décoration
2. CTA visibles mais non agressifs
3. États utilisateur explicites (actif, erreur, succès, urgent)
4. Densité contrôlée en admin (desktop dense, mobile fluide)
5. Progression guidée (ex: inscription en étapes avec progression discrète)

## 8) Règles de cohérence

### À faire

- Utiliser les tokens `fawaid-*` plutôt que des couleurs hardcodées
- Garder les ombres subtiles
- Conserver des espacements respirants (`gap-3` à `gap-5` généralement)
- Préserver la hiérarchie typo (heading vs body)
- Maintenir les focus states accessibles

### À éviter

- Saturer les fonds avec des couleurs fortes
- Multiplier les styles de bouton non standard
- Alourdir les blocs avec trop de texte ou d’ornements
- Casser la logique mobile-first

## 9) Extension future recommandée

Pour stabiliser davantage:

1. Créer des tokens CSS variables (`:root`) en complément Tailwind pour theming
2. Ajouter un inventaire de composants avec captures (Storybook ou page interne)
3. Factoriser les patterns d’alertes et badges en composants dédiés
4. Ajouter une checklist d’accessibilité (contraste, focus, clavier)
