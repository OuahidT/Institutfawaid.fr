# Quality gate SEO — Institut Fawaid

Ce quality gate décide si un brouillon peut être présenté à Ouahid comme prêt. Il ne publie jamais l’article.

## Verdicts autorisés

- `READY_TO_PUBLISH` : tous les contrôles sont satisfaits et une validation humaine reste requise.
- `NEEDS_EDITORIAL_WORK` : le texte reste insuffisant après deux cycles de correction au maximum.
- `TECHNICAL_FAILURE` : un test, le build, la Preview ou le rendu bloque.
- `WAITING_FOR_HUMAN_APPROVAL` : un brouillon SEO actif existe déjà.
- `CANNOT_VERIFY_DRAFT_STATE` : GitHub n’a pas pu être contrôlé de manière fiable.

## Bloquants absolus

Le verdict ne peut pas être `READY_TO_PUBLISH` si un seul de ces points est présent :

- mauvaise intention de recherche ou sujet hors roadmap ;
- cannibalisation manifeste ou duplication importante d’un contenu existant ;
- contenu dialectal sans demande humaine explicite ;
- faits inventés sur l’Institut, chiffres non vérifiés ou promesses irréalistes ;
- affirmation douteuse présentée comme certaine ;
- contenu copié d’un concurrent, superficiel ou créé uniquement pour le SEO ;
- keyword stuffing, français artificiel, répétitions fortes ou structure confuse ;
- liens internes cassés ou CTA vers une page inexistante ;
- canonical incorrecte, draft indexable ou draft présent dans le sitemap ;
- échec du validateur roadmap, du validateur draft, de TypeScript, d’ESLint ou du build ;
- Preview inaccessible, problème visuel bloquant ou affichage mobile cassé.

Le score ne peut jamais compenser un bloquant.

## Grille éditoriale

Noter séparément chaque dimension sur 5 :

1. satisfaction de l’intention de recherche ;
2. utilité réelle pour le lecteur ;
3. profondeur et spécificité ;
4. naturel du français ;
5. pédagogie et clarté ;
6. intégration SEO naturelle ;
7. différenciation face aux contenus existants ;
8. cohérence avec Institut Fawaid.

Le total est sur 40. `READY_TO_PUBLISH` exige au moins 34/40, aucune dimension sous 4/5 et aucun bloquant.

## Processus en trois rôles

### Phase A — Rédacteur

Rédiger à partir de la roadmap, de l’intention, des mots-clés, du positionnement Fawaid et de la recherche actuelle. La longueur dépend uniquement de ce qui est nécessaire pour répondre sérieusement au sujet. Aucun remplissage ni nombre de mots cible.

### Phase B — Relecteur critique

Effectuer une passe séparée dont le rôle est de chercher activement les faiblesses : répétitions, passages creux, claims non vérifiés, risques SEO, structure, promotion excessive, formulations artificielles, duplication avec les contenus publiés et informations manquantes. Si un sous-agent séparé est disponible, l’utiliser pour cette critique.

### Phase C — Correction

Corriger uniquement les défauts justifiés, puis rescorrer. Deux cycles complets au maximum. Si les seuils ne sont toujours pas atteints, conclure `NEEDS_EDITORIAL_WORK` sans publier.

## Recherche et originalité

- Lire les contenus Fawaid qui risquent de se chevaucher.
- Examiner les résultats francophones actuels pour comprendre les attentes de recherche.
- Identifier ce qui peut être expliqué plus clairement ou plus utilement.
- Ne jamais copier un texte, un plan complet, une formulation ou un contenu propriétaire concurrent.
- Ne jamais inventer de volume de recherche.

## Faits autorisés sur l’Institut

Utiliser uniquement les faits encore présents dans le repository et les documents validés, notamment : plus de 10 ans d’expérience, plus de 700 étudiants accompagnés, cours en direct, professeurs qualifiés et expérimentés, grands débutants acceptés, arabe littéraire, progression structurée, adaptation au niveau et suivi personnalisé.

Ne jamais inventer de taux de réussite, certification, diplôme précis, statistique, témoignage, nombre d’élèves actuels, délai garanti ou résultat garanti.

## À VÉRIFIER PAR OUAHID

Cette section contient uniquement les affirmations dont la validation exige sa connaissance de l’Institut. Ne jamais lui déléguer le SEO, la cannibalisation, le copywriting, la technique, les métadonnées ou les données structurées.

Si aucun point métier ne l’exige, écrire exactement :

```text
Aucune vérification métier nécessaire.
```

## Contrôles techniques et visuels

Exécuter les cinq commandes de `docs/seo-automation.md`, puis vérifier la Preview en 1440, 768 et 390 px. Confirmer les codes HTTP, robots, absence de canonical pour le draft, absence du sitemap, liens, CTA, articles liés, menu mobile, débordements, overlay et erreurs console.

## Rapport utilisateur obligatoire

```text
==================================
ARTICLE SEO PRÊT À VÉRIFIER
==================================

Titre :
...

Sujet :
...

Mot-clé principal :
...

Preview :
<URL Vercel>

PR GitHub :
<URL>

Qualité éditoriale :
✅

SEO :
✅

Cannibalisation :
✅

Faits Institut Fawaid :
✅

Technique :
✅

Mobile :
✅

Score qualité :
XX/40

Verdict :
READY_TO_PUBLISH

À VÉRIFIER PAR OUAHID :

Aucune vérification métier nécessaire.

Tu peux simplement répondre :

« Publie »
ou
« Corrige : [ce que tu souhaites modifier] »
ou
« Abandonne »
==================================
```

Si un contrôle échoue, remplacer les coches concernées et utiliser sans ambiguïté le verdict approprié.
