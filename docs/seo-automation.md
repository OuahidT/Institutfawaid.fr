# Automatisation SEO supervisée — Institut Fawaid

Ce document est la procédure technique de référence du workflow éditorial SEO. L’automatisation prépare et vérifie les brouillons, mais ne publie jamais sans le message explicite `Publie` de Ouahid.

## Données Google Search Console

Le workflow `.github/workflows/search-console-data.yml` joue uniquement le rôle de collecteur. Il s’authentifie auprès de Google avec Workload Identity Federation et `google-github-actions/auth`, sans clé JSON, puis appelle Search Analytics en lecture seule.

Il récupère les dimensions `query` et `page` ainsi que `clicks`, `impressions`, `ctr` et `position` pour les 28 derniers jours complets, les 28 jours précédents et 90 jours de contexte. Les dates suivent le fuseau officiel de Search Console (`America/Los_Angeles`), demandent uniquement les données finalisées et excluent en plus les trois jours les plus récents.

Le résultat remplace toujours `data/seo/search-console/latest.json`. Il n’est jamais écrit dans `public/` et aucun historique de snapshots n’est accumulé dans l’arborescence. Le workflow s’exécute le dimanche avant 09:15 à Paris et peut aussi être lancé manuellement.

Cette collecte n’analyse pas la roadmap et ne crée pas la tâche planifiée « Stratège SEO ». Cette étape reste séparée jusqu’à la validation d’un premier test réel.

## Principes non négociables

- `main` représente uniquement la production réelle.
- Un brouillon vit sur une branche temporaire `seo/<slug>` et dans une Pull Request vers `main`.
- Une seule PR ou branche SEO peut être active à la fois.
- En cas d’état GitHub impossible à vérifier, le verdict est `CANNOT_VERIFY_DRAFT_STATE` et aucun fichier n’est créé.
- Les `landing_page` sont toujours ignorées par l’automatisation d’articles.
- Aucun contenu dialectal ou aucune image principale ne sont générés automatiquement.
- Un score élevé ne contourne jamais un bloquant du quality gate.

## États de vérité

Sur `main`, une entrée reste `planned` tant que sa PR n’est pas fusionnée. Sur la branche `seo/<slug>`, la même entrée passe à `draft` et `content/ressources/<slug>.md` utilise également `status: "draft"`.

Lors de la publication, la branche passe simultanément l’article et la roadmap à `published`, actualise `publishedAt` et `updatedAt`, repasse tous les contrôles, puis fusionne la PR. Un abandon ferme la PR, supprime la branche et laisse `main` sur `planned`. Un abandon avec mise en pause effectue ensuite une modification isolée `planned` vers `paused` sur `main`.

## Verrou anti-double-draft

Avant toute sélection ou génération, exécuter strictement ces contrôles :

1. rechercher avec l’application GitHub toutes les PR ouvertes dont le titre commence par `[SEO Draft]` ou dont la branche commence par `seo/` ;
2. rechercher toutes les branches distantes `seo/*` ;
3. si un élément existe, arrêter avec `WAITING_FOR_HUMAN_APPROVAL` et retourner le slug, le titre, la PR et la Preview si elle est disponible ;
4. si GitHub n’est pas vérifiable, arrêter avec `CANNOT_VERIFY_DRAFT_STATE` ;
5. seulement si le verrou est libre, exécuter `npm run validate:seo-roadmap` ;
6. puis exécuter `npm run seo:next`.

`npm run seo:check-draft` fournit une vérification déterministe supplémentaire par l’API GitHub. Un échec réseau ou une réponse non vérifiable produit `CANNOT_VERIFY_DRAFT_STATE`. Cette commande ne remplace pas le contrôle connector-first de l’automatisation Codex.

## Sélecteur déterministe

`npm run seo:next` lit `content/seo-roadmap.json` sans modifier de fichier. Il filtre exclusivement :

```text
type = resource_article
status = planned
```

Il retourne l’entrée dont la priorité est la plus faible avec `NEXT_ARTICLE_AVAILABLE`, ou `NO_PLANNED_RESOURCE_ARTICLE` si aucune entrée n’est éligible. Avant de créer le brouillon, vérifier encore qu’aucun fichier `content/ressources/<slug>.md` n’existe.

## Création d’un brouillon

1. partir du dernier commit de `main` ;
2. créer `seo/<slug>` ;
3. lire la roadmap, le système éditorial, le quality gate et les articles publiés proches ;
4. effectuer une recherche Web actuelle sur le sujet sans copier de plan ni de formulation ;
5. créer l’article Markdown avec la date réelle du brouillon et `status: "draft"` ;
6. passer uniquement l’entrée correspondante de la roadmap à `draft` sur la branche ;
7. ajouter à `relatedArticles` uniquement les slugs de `relatedTo` réellement présents et `published` sur `main` ;
8. respecter `conversionTarget` avec un CTA naturel ;
9. ne pas générer de `featuredImage` ;
10. appliquer les phases Rédacteur, Relecteur critique et Correction décrites dans `docs/seo-quality-gate.md`, avec deux cycles de correction au maximum ;
11. exécuter tous les contrôles techniques ;
12. pousser la branche et ouvrir une PR brouillon intitulée `[SEO Draft] <workingTitle>`.

## Contrôles avant push

```bash
npm run validate:seo-roadmap
npm run validate:seo-draft
npx tsc --noEmit
npm run lint
npm run build
```

Aucun contrôle ne peut être ignoré. L’échec d’une commande produit `TECHNICAL_FAILURE`.

## Aperçu Vercel des drafts

Les drafts sont visibles uniquement lorsque `process.env.VERCEL_ENV === "preview"`. Cette variable système est exposée officiellement par Vercel au build et au runtime. Toute autre valeur, y compris une variable absente, désactive les drafts : le système échoue donc de manière fermée.

En Preview uniquement :

- `/ressources` inclut les drafts et affiche un badge `BROUILLON` ;
- `/ressources/<slug>` accepte un draft et affiche `APERÇU BROUILLON — NON PUBLIÉ` ;
- la date est présentée comme date de préparation, pas comme publication ;
- le draft reçoit `noindex`, `nofollow` et `noarchive` ;
- aucune canonical n’est émise pour la page draft ;
- les données structurées `BlogPosting` et `BreadcrumbList` du draft ne sont pas émises ;
- le sitemap continue d’utiliser exclusivement `getPublishedResourceArticles()` et n’inclut jamais le draft.

L’ensemble d’une Preview reçoit également un `robots.txt` bloquant, une directive robots globale et l’en-tête `X-Robots-Tag: noindex, nofollow, noarchive`. La protection Vercel existante ne doit jamais être diminuée.

En Production, `getVisibleResourceArticles()` revient toujours aux seuls articles `published`. Un draft absent de `generateStaticParams()` reste inaccessible et renvoie 404.

## Vérification de la Preview

Attendre l’état Vercel `READY`, puis ouvrir réellement `/ressources` et `/ressources/<slug>`. Si la Deployment Protection demande une connexion, utiliser le lien temporaire sécurisé fourni par Vercel et le signaler à Ouahid.

Contrôler avec un navigateur :

- desktop autour de 1440 px ;
- tablette autour de 768 px ;
- mobile autour de 390 px ;
- header et menu mobile ;
- breadcrumbs, H1, excerpt, H2, H3, listes et liens ;
- badge, bandeau de brouillon, CTA, articles liés et footer ;
- absence de débordement, d’overlay d’erreur et d’erreur console ;
- code 200 du draft en Preview, directives noindex et absence dans le sitemap.

Après cette vérification, appliquer une dernière fois le quality gate. Le verdict doit être exactement l’un de ceux-ci :

- `READY_TO_PUBLISH`
- `NEEDS_EDITORIAL_WORK`
- `TECHNICAL_FAILURE`
- `WAITING_FOR_HUMAN_APPROVAL`
- `CANNOT_VERIFY_DRAFT_STATE`

## Correction demandée

Après `Corrige : ...`, retrouver exactement une PR SEO active, modifier sa branche existante, conserver le même article, refaire le quality gate et tous les tests, attendre la nouvelle Preview puis renvoyer le nouveau lien et le nouveau verdict. Ne jamais créer une seconde branche.

## Publication demandée

Après `Publie` :

1. vérifier qu’il existe exactement une PR SEO active ;
2. confirmer que le dernier verdict est `READY_TO_PUBLISH` et que la Preview est encore `READY` ;
3. vérifier que le SHA testé est toujours celui de la branche ;
4. passer l’article et la roadmap de `draft` à `published` ;
5. remplacer `publishedAt` et `updatedAt` par la date réelle ;
6. relancer roadmap, draft, TypeScript, ESLint et build ;
7. vérifier metadata, canonical et sitemap attendus ;
8. pousser la branche et attendre les contrôles de PR ;
9. fusionner uniquement si tout est vert ;
10. attendre la Production Vercel `READY` ;
11. contrôler la page, la canonical, robots, sitemap, navigation, CTA et liens en production ;
12. supprimer la branche `seo/<slug>` et confirmer qu’aucune PR SEO ne reste ouverte.

La Search Console n’exige aucune soumission manuelle pour chaque article : la découverte normale s’effectue via le sitemap.

## Abandon

- `Abandonne` : fermer la PR sans merge, supprimer la branche, ne rien modifier sur `main`.
- `Abandonne et mets en pause` : effectuer l’abandon, puis passer uniquement l’entrée concernée de `planned` à `paused` sur `main`, valider et déployer cette modification.

## Rapport utilisateur

Le message à Ouahid reste court et suit le format défini dans `docs/seo-quality-gate.md`. Le rapport technique détaillé appartient à la PR. Ouahid ne doit contrôler que les éventuels faits métier listés sous `À VÉRIFIER PAR OUAHID` et l’impression générale de lecture.
