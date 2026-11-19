# Site Cabinet Rollin – CENTURY 21 Les Chartrons

Dossier prêt pour le développement avec Claude Code dans VS Code.

## Contenu du dossier

- `CLAUDE.md` : les règles que Claude Code lit automatiquement à chaque session (ne rien inventer, charte, façon de travailler).
- `docs/` : brief, spécification technique, plan en 11 lots, charte, éléments à fournir.
- `maquette/` : les planches de la maquette V0 et leurs annotations.
- `contenus/` : annonces, équipe, quartiers, articles et infos de l'agence, en données.
- `.claude/commands/lot.md` : une commande `/lot` pour lancer chaque étape.

## Avant de commencer (une seule fois)

1. Vérifier que **Node.js** est installé sur le Mac : dans le terminal de VS Code, taper `node -v`. Il faut une version récente (20 ou plus). Sinon, l'installer depuis nodejs.org (version LTS).
2. Ouvrir ce dossier dans VS Code : *Fichier → Ouvrir le dossier… → Projets/Century21-Chartrons*.
3. Ouvrir Claude Code (icône Claude dans la barre latérale de VS Code).

## Lancer le développement

Copier ce premier message dans Claude Code :

> Lis CLAUDE.md, puis docs/02-specification-technique.md et docs/03-plan-de-developpement.md. Résume-moi en 10 lignes ce que tu as compris du projet et liste les questions que tu te poses. Ensuite seulement, lance le lot 0.

Puis, lot après lot : taper `/lot 1`, `/lot 2`, etc. Claude Code présente un plan, attend votre accord, code, vérifie, puis résume.

Pour voir le site pendant le développement : demander à Claude Code de lancer le serveur local, puis ouvrir l'adresse qu'il indique (en général http://localhost:3000).

## À décider ou à vérifier de votre côté

- **Vercel** : le plan gratuit est réservé à un usage non commercial ; pour le site d'une agence, prévoir a priori le plan Pro (à vérifier sur vercel.com/pricing).
- **Outils tiers** à choisir : envoi des e-mails des formulaires, carte, agenda de rendez-vous, flux d'avis Google, flux d'annonces du logiciel de l'agence. Claude Code ne les branchera pas sans votre accord.
- **Encadrement des loyers à Bordeaux** : fin de l'expérimentation prévue le 24 novembre 2026, sauf prolongation. À vérifier avant de publier les textes concernés.
- Les éléments demandés à l'agence : voir `docs/05-elements-a-fournir.md`.
