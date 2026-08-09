# Guide simple — vos futurs articles SEO

## Que se passe-t-il automatiquement ?

Chaque lundi, l’automatisation vérifie d’abord qu’aucun article n’attend déjà votre réponse. Si tout est libre, elle choisit le prochain sujet prévu, rédige un brouillon, le relit, le corrige, teste le site et prépare un lien de Preview.

## Qu’est-ce qu’un brouillon ?

C’est un article en préparation. Il est placé dans un espace temporaire séparé appelé une branche et associé à une Pull Request, c’est-à-dire une fiche GitHub qui regroupe l’article et ses contrôles.

## À quoi sert la Preview ?

La Preview est une copie temporaire du site. Vous pouvez y lire l’article comme s’il était publié, avec un badge et un bandeau indiquant clairement qu’il s’agit d’un brouillon.

## Est-il visible sur le vrai site ?

Non. Le vrai site continue d’afficher uniquement les articles publiés. La Preview est protégée par Vercel et bloquée pour les moteurs de recherche.

## Que devez-vous vérifier ?

L’automatisation contrôle le SEO, le français, les répétitions, la technique, les liens, le mobile et les risques de cannibalisation. Vous vérifiez seulement que la lecture vous convient et les rares faits sur l’Institut indiqués sous « À VÉRIFIER PAR OUAHID ».

## Que se passe-t-il après votre réponse ?

- `Publie` : les dates et statuts sont finalisés, tous les tests sont relancés, puis l’article est ajouté au vrai site.
- `Corrige : ...` : le même brouillon est modifié, retesté et remplacé par une nouvelle Preview.
- `Abandonne` : la fiche et la branche temporaires sont supprimées ; rien ne change sur le vrai site.

Les brouillons ne s’accumulent pas : tant qu’un brouillon attend votre décision, l’automatisation refuse d’en créer un autre. Après publication ou abandon, sa branche temporaire est supprimée.

Vous n’avez pas besoin d’aller dans Google Search Console pour chaque article. Le sitemap du site permet à Google de découvrir normalement les articles publiés.

## Commandes à retenir

Publier :

`Publie`

Modifier :

`Corrige : [ma demande]`

Abandonner :

`Abandonne`
