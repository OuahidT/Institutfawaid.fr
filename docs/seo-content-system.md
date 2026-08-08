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
- `status` : `draft` ou `published`.
- `conversionTarget` : `/programmes`, `/formules`, `/inscription`, `/contact` ou `whatsapp`.
- `publishedAt` et `updatedAt` : format `YYYY-MM-DD`. `updatedAt` ne peut pas précéder `publishedAt`.
- `secondaryKeywords` : liste contenant au moins une expression.
- `relatedArticles` : liste de slugs existants. L’ordre de la liste détermine l’ordre d’affichage.

Le corps Markdown ne doit pas contenir de H1 (`#`). La page génère déjà le H1 depuis `title`. Utiliser uniquement des H2 (`##`) et H3 (`###`).

## Brouillon et publication

Avec `status: "draft"`, l’article :

- n’apparaît pas dans `/ressources` ;
- n’est pas ajouté au sitemap ;
- n’est pas proposé dans « À lire également » ;
- n’a pas de page publique indexable.

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

## Garde-fous et vérification

Le build échoue explicitement en cas de champ requis absent, valeur non autorisée, date invalide, image sans texte alternatif, slug dupliqué, slug différent du nom de fichier, article lié inexistant ou hiérarchie de titres incorrecte.

Avant de pousser sur GitHub :

```bash
npm run lint
npm run build
```

Vérifier ensuite que `/ressources`, l’article, sa balise canonical et `/sitemap.xml` utilisent exclusivement `https://www.institutfawaid.fr`.
