# Éléments à fournir par l'agence

La liste complète, tenue à jour, est dans le document partagé :
[Cabinet Rollin – CENTURY 21 Les Chartrons · Éléments à fournir par l'agence](https://claude.ai/artifact/8RSXQFuzJkucE7xJTtQtGb)

Elle compte 8 rubriques : identité, charte et logo · chiffres, notes et dates · mentions légales · équipe · annonces et biens vendus · offres, process et outils · quartiers et contenus · photos et vidéo.

## Ce que cela implique pour le code

- Tout ce qui figure dans cette liste existe dans le site sous forme d'**emplacement** (`[à fournir]`, `[à confirmer]`) ou de champ `null` dans `contenus/`. Ne jamais le remplacer par une valeur plausible.
- Prévoir chaque emplacement de façon à ce que la vraie donnée se branche **en modifiant un seul fichier** (JSON de `contenus/` ou composant unique comme `Logo`).
- Points qui bloquent la mise en ligne en production (pas la démonstration) : mentions professionnelles du pied de page, barème d'honoraires, textes RGPD et cookies, mentions obligatoires des annonces, accord écrit de chaque salarié pour son nom et sa photo, droits sur les photos, situation de l'encadrement des loyers à Bordeaux.
- Quand Simon transmet une donnée reçue de l'agence : la saisir, retirer l'emplacement correspondant et cocher la ligne dans `docs/questions-ouvertes.md`.
