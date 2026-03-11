# Institut Fawaid — Site officiel + V1 interne

Projet Next.js (App Router, TypeScript, Tailwind) avec :
- site vitrine public
- V1 interne d’administration (Supabase)
- formulaire professeur par lien secret

## 1) Lancer le projet

Prérequis : Node.js 20+.

```bash
npm install
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

## 2) Variables d’environnement

Créer un fichier `.env.local` (non versionné) en partant de `.env.example`.

Variables Supabase (V1 interne) :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Variables contact (site public) :
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Important :
- la clé `SUPABASE_SECRET_KEY` est uniquement utilisée côté serveur
- ne jamais l’exposer côté client

## 3) Supabase existant : setup minimal à faire

Le projet Supabase existe déjà. Ne pas recréer de nouveau projet.

Étapes :
1. Ouvrir le SQL Editor Supabase.
2. Exécuter le script : `supabase/sql/v1_internal.sql`.
3. Vérifier que les tables existent :
   - `teachers`
   - `students`
   - `lessons`
   - `student_comments`
4. Vérifier que les fonctions RPC existent :
   - `register_lesson_by_teacher_token`
   - `register_lesson_for_student`
   - `remove_lesson_and_reconcile`
   - `add_purchased_courses`
5. Dans Supabase Auth > Users, créer le compte admin (email + mot de passe).
6. Recommandé : dans Auth > Providers > Email, désactiver le signup public pour garder un seul compte admin.

## 4) Routes V1 interne

Admin :
- `/admin/login` : connexion admin
- `/admin` : dashboard protégé
- `/admin/eleves/[id]` : fiche élève (édition + historique)

Formulaire professeur (sans login) :
- `/formulaire-prof/[token]`

## 5) Où se trouve la logique interne

- Clients Supabase :
  - `src/lib/supabase/browser.ts`
  - `src/lib/supabase/server.ts`
  - `src/lib/supabase/service.ts`
  - `middleware.ts` + `src/lib/supabase/middleware.ts`
- Auth admin :
  - `src/lib/auth/admin.ts`
  - `app/admin/login/page.tsx`
  - `app/admin/(protected)/layout.tsx`
- Actions métier (CRUD, historique, tokens, formulaire prof) :
  - `src/lib/internal/admin-actions.ts`
- Requêtes de lecture :
  - `src/lib/internal/admin-data.ts`
- Calcul cours restants :
  - `src/lib/internal/courses.ts`

## 6) Import CSV Airtable (one-shot)

Script :
- `scripts/import-airtable-csv.mjs`

Commande (avec env local chargé par Node) :

```bash
node --env-file=.env.local scripts/import-airtable-csv.mjs data/airtable-export.csv
```

Ou via script npm (si les variables env sont déjà exportées dans le shell) :

```bash
npm run import:airtable -- data/airtable-export.csv
```

Par défaut, si aucun chemin n’est fourni, le script lit :
- `data/airtable-export.csv`

Colonnes prises en charge :
- Nom
- Genre
- Âge
- Numéro WhatsApp
- Type de cours
- Nombre d’heures par semaine
- Moyen de paiement
- Professeur assigné
- Créneau validé
- Total de cours achetés
- Cours effectués
- Arrêt / pause

Règle métier :
- `Cours restants` n’est jamais importé comme source de vérité
- le solde est calculé dans l’app : `total_courses_purchased - courses_completed`

Après import, vérifier dans `/admin` :
- liste élèves
- affectation prof
- compteurs achetés/effectués/restants

## 7) Gestion professeurs / liens secrets

Depuis `/admin`, section **Professeurs & liens secrets** :
- créer un professeur
- récupérer son lien secret de formulaire
- régénérer son token si nécessaire

Le lien secret suit la route :
- `/formulaire-prof/[token]`

## 8) Scénario de test V1 (local)

1. Se connecter sur `/admin/login` avec le compte Auth créé dans Supabase.
2. Dans `/admin`, créer un élève.
3. Ajouter des cours achetés (`+ cours`) depuis la ligne de l’élève.
4. Ouvrir la fiche `/admin/eleves/[id]`, modifier les champs, vérifier le solde.
5. Déclarer un cours depuis la fiche élève (admin).
6. Ajouter un commentaire interne dans la fiche élève et vérifier la date/heure affichée.
7. Ouvrir le lien `/formulaire-prof/[token]` correspondant et déclarer un cours.
8. Vérifier que l’historique est alimenté et que `courses_completed` s’incrémente.
9. Supprimer un cours déclaré par erreur et vérifier la réconciliation du compteur.

## 9) Données éditoriales du site public

- Config globale (email, WhatsApp, liens, nav) : `src/config/site.ts`
- Programmes : `src/content/programs.ts`
- Formules : `src/content/formulas.ts`
- FAQ : `src/content/faq.ts`
- Équipe : `src/content/team.ts`
- Témoignages : `src/content/testimonials.ts`
- Légal : `src/config/legal.ts`

## 10) Déploiement (Vercel)

Avant production, configurer dans Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
