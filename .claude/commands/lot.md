---
description: Lancer un lot du plan de développement (ex. /lot 2)
argument-hint: numéro du lot
---

Réalise le lot $ARGUMENTS de `docs/03-plan-de-developpement.md`.

1. Relis `CLAUDE.md`, la section du lot, les planches concernées (desktop et mobile) et leurs annotations dans `maquette/LISEZMOI.md`.
2. Présente-moi d'abord un plan court (5 à 10 lignes) et attends mon accord.
3. Code le lot. N'invente aucune information : emplacements entre [crochets] pour ce qui manque.
4. Lance lint, build et tests, et corrige jusqu'à ce qu'ils passent.
5. Résume en français simple : ce qui est fait, comment le voir (URL locale), ce qui reste à décider (ajouté à `docs/questions-ouvertes.md`). Propose un message de commit.
