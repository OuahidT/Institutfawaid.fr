# Système éditorial SEO — Conseils & Ressources

Les articles publics de l’Institut Fawaid sont des fichiers Markdown versionnés dans GitHub. Aucun CMS, base de données ou service externe n’est nécessaire.

## Créer un article

Créer un fichier dans `content/ressources/` avec un nom identique au slug :

```text
content/ressources/mon-sujet.md
```

Utiliser ce frontmatter complet :

```md
---
slug: "mon-sujet"
title: "Titre visible de l’article"
seoTitle: "Titre SEO de l’article | Institut Fawaid"
description: "Description destinée aux moteurs de recherche."
excerpt: "Résumé court affiché sur la carte et sous le titre."
publishedAt: "2026-08-08"
updatedAt: "2026-08-08"
author: "Institut Fawaid"
category: "Débuter en arabe"
primaryKeyword: "mot-clé principal"
secondaryKeywords:
  - "mot-clé secondaire"
searchIntent: "Informationnelle"
featuredImage: "/images/resources/mon-sujet.jpg"
featuredImageAlt: "Description précise et utile de l’image"
status: "draft"
relatedArticles: []
conversionTarget: "/inscription"
---

Introduction de l’article sans titre H1 dans le Markdown.

## Premier intertitre

Contenu structuré avec des paragraphes, listes, liens, citations ou tableaux.

### Sous-partie

Suite du contenu.
```

Ce bloc est un modèle documentaire : ce n’est pas un article publié.

## Champs et valeurs autorisées

Tous les champs du modèle sont obligatoires, sauf `updatedAt`, `featuredImage` et `featuredImageAlt`. `featuredImageAlt` devient obligatoire dès qu’une image est définie.

- `slug` : minuscules, chiffres et tirets ; doit être identique au nom du fichier.
- `author` : utiliser actuellement `Institut Fawaid`. Un nom individuel pourra être utilisé plus tard sans biographie automatique.
- `category` : `Débuter en arabe`, `Lecture & alphabet`, `Arabe littéraire`, `Méthode & progression` ou `Choisir ses cours`.
- `searchIntent` : `Informationnelle`, `Commerciale` ou `Navigationnelle`. Cette liste est fermée afin de conserver une classification prévisible.
- `status` : `draft` ou `published`.
- `conversionTarget` : `/programmes`, `/formules`, `/inscription`, `/contact` ou `whatsapp`.
- `publishedAt` et `updatedAt` : format `YYYY-MM-DD`. `updatedAt` ne peut pas précéder `publishedAt`.
- `secondaryKeywords` : liste contenant au moins une expression.
- `relatedArticles` : liste de slugs existants. L’ordre de la liste détermine l’ordre d’affichage.

Le corps Markdown ne doit pas contenir de H1 (`#`). La page génère déjà le H1 depuis `title`. Utiliser uniquement des H2 (`##`) et H3 (`###`).

## Brouillon et publication

Avec `status: "draft"`, l’article :

- n’apparaît pas dans `/ressources` en production ;
- n’est pas ajouté au sitemap ;
- n’est pas proposé dans « À lire également » ;
- n’a pas de page publique indexable.

Sur une branche `seo/<slug>` déployée dans l’environnement Vercel Preview, le draft devient temporairement visible pour validation. Il affiche un badge et un bandeau de brouillon, reste absent du sitemap, ne possède pas de canonical et reçoit `noindex`, `nofollow` et `noarchive`. Si `VERCEL_ENV` ne vaut pas exactement `preview`, le draft reste inaccessible.

Pour publier, relire et valider le contenu, puis remplacer le statut par `published`. Au déploiement suivant, la page, les métadonnées, les données structurées, le sitemap et les liens de navigation sont générés automatiquement.

Tant qu’il n’existe aucun article publié, `/ressources` retourne une 404 avec `noindex`, et la section reste absente du menu et du sitemap. Le premier article `published` active automatiquement la section : aucun autre fichier ne doit être modifié.

## Articles liés

Déclarer uniquement des slugs existants :

```yaml
relatedArticles:
  - "premier-article"
  - "deuxieme-article"
```

Seuls les articles liés déjà publiés sont affichés. Le système n’invente aucune suggestion si la liste est vide ou si certains articles liés sont encore en brouillon.

## CTA et conversion

`conversionTarget` pilote le bouton principal de fin d’article. Un second bouton propose naturellement de contacter l’Institut. Les destinations et WhatsApp réutilisent `siteConfig` ; ne recopier aucun numéro ni URL externe dans un article.

## Image principale

Déposer l’image dans `public/images/resources/`, puis renseigner son chemin public et un texte alternatif précis :

```yaml
featuredImage: "/images/resources/mon-sujet.jpg"
featuredImageAlt: "Description de ce que montre réellement l’image"
```

Sans image, supprimer les deux champs. Les cartes et le template restent complets sans visuel.

## Roadmap éditoriale interne

La source de vérité de la planification SEO se trouve dans `content/seo-roadmap.json`. Ce fichier JSON est destiné à Codex et aux futures tâches éditoriales internes. Il n’est pas lu par les routes Next.js, n’alimente pas le template Conseils & Ressources et ne constitue jamais une source de contenu public.

Chaque entrée possède une priorité unique. Plus le nombre est faible, plus le sujet doit être traité tôt parmi les entrées du même type et éligibles. Les priorités 9 à 19 sont volontairement libres pour de futurs articles choisis après analyse des performances SEO ; elles ne correspondent pas à des contenus oubliés.

Les deux types ont des rôles distincts :

- `resource_article` : article éditorial destiné à `content/ressources/`. Les priorités 1 à 19 lui sont réservées.
- `landing_page` : future page commerciale. Les priorités 20 et suivantes lui sont réservées. Elle ne doit jamais être créée avec le template Conseils & Ressources ni par le flux automatisé d’articles.

Les statuts de roadmap sont :

- `published` : contenu déjà publié ; il ne doit pas être recréé.
- `planned` : sujet validé et disponible pour une future préparation.
- `draft` : brouillon déjà créé ou en cours de travail ; il ne doit pas être recréé.
- `paused` : sujet temporairement écarté.

Pour une `landing_page`, `category` et `conversionTarget` valent `null`, car ces champs décrivent uniquement le template des articles. Toutes les autres propriétés restent présentes afin de garantir une structure JSON uniforme.

### Sélection du prochain article

Une future tâche éditoriale devra suivre exactement cet ordre :

1. lire `content/seo-roadmap.json` ;
2. ignorer toutes les entrées `landing_page` ;
3. ignorer les statuts `published`, `draft` et `paused` ;
4. sélectionner le `resource_article` avec `status: "planned"` dont la priorité est la plus faible ;
5. vérifier qu’aucun fichier portant ce slug n’existe déjà dans `content/ressources/` ;
6. créer uniquement un brouillon avec `status: "draft"` ;
7. ne jamais publier automatiquement tant que ce mode n’a pas été explicitement activé.

Cette procédure documente une règle de sélection ; aucune automatisation n’est mise en place à ce stade.

## Règles anti-cannibalisation

1. Un `primaryKeyword` ne peut appartenir qu’à une seule URL principale.
2. Une future automatisation ne doit jamais créer un article si, en dehors de l’entrée sélectionnée, son `primaryKeyword` existe déjà dans la roadmap, si son intention correspond déjà à une page existante ou si son sujet est trop proche d’un contenu `published` ou `planned`.
3. Les mots-clés commerciaux suivants sont réservés aux pages commerciales et ne doivent pas devenir les mots-clés principaux d’articles informationnels :
   - `cours d'arabe en ligne`
   - `cours arabe littéraire en ligne`
   - `cours arabe débutant`
   - `cours particulier arabe`
   - `cours d'arabe femme`
   - `cours arabe enfant`
4. Le mot-clé `cours d’arabe en ligne` reste prioritairement associé à la homepage et à l’offre commerciale existante, jamais à un article de blog principal.
5. Aucun contenu consacré aux dialectes ne doit être créé sans demande explicite future.

## Garde-fous et vérification

Le build échoue explicitement en cas de champ requis absent, intention de recherche non autorisée, autre valeur non autorisée, date invalide, image sans texte alternatif, slug dupliqué, slug différent du nom de fichier, article lié inexistant ou hiérarchie de titres incorrecte.

Le validateur léger `scripts/validate-seo-roadmap.ts` contrôle le JSON, les valeurs autorisées, les champs propres à chaque type ainsi que l’unicité des priorités, slugs, URLs cibles et mots-clés principaux. Il vérifie aussi les relations entre entrées. Il s’exécute avec une commande dédiée et n’est pas branché sur la génération des pages :

```bash
npm run validate:seo-roadmap
```

Avant de pousser sur GitHub :

```bash
npm run validate:seo-roadmap
npm run validate:seo-draft
npx tsc --noEmit
npm run lint
npm run build
```

Vérifier ensuite que `/ressources`, l’article, sa balise canonical et `/sitemap.xml` utilisent exclusivement `https://www.institutfawaid.fr`.
