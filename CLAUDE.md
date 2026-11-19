# CLAUDE.md — Site Cabinet Rollin – CENTURY 21 Les Chartrons

Instructions permanentes pour Claude Code. À lire en entier avant toute tâche.

## Le projet

Site vitrine et de génération de contacts de l'agence immobilière **Cabinet Rollin – CENTURY 21 Les Chartrons** (32 cours Evrard de Fayolle, 33000 Bordeaux). Projet mené par TheOtter (Simon Leloutre) pour l'agence.

- Objectif n°1 : générer des contacts. Cible n°1 : les propriétaires vendeurs (estimation → mandat). Puis les bailleurs (location, gestion), puis acheteurs et locataires.
- Hiérarchie des actions : 1. « Estimer mon bien » · 2. Appeler ou prendre rendez-vous · 3. Voir les biens.
- Site en **français uniquement**, vouvoiement, phrases courtes, 2 à 3 lignes par bloc.

## Où trouver quoi

| Dossier / fichier | Contenu |
|---|---|
| `docs/01-brief-projet.md` | Brief complet (cibles, ton, sections de chaque page, contenus réels, mentions légales des annonces). **Source de vérité sur le contenu.** |
| `docs/02-specification-technique.md` | Stack, architecture, routes, modèles de données, formulaires, SEO, accessibilité. |
| `docs/03-plan-de-developpement.md` | Lots de travail dans l'ordre, avec critères de fin. |
| `docs/04-charte-graphique.md` | Couleurs, typographies, règles de contraste (extrait de la charte CENTURY 21). |
| `docs/05-elements-a-fournir.md` | Ce que l'agence doit encore fournir, et son effet sur le code. |
| `docs/charte/` | Charte mondiale CENTURY 21 (PDF du 29/06/2018). |
| `maquette/LISEZMOI.md` | Comment lire les planches, table planche → route, annotations du canvas (= cahier des charges détaillé). |
| `maquette/planches/*.dc.html` | Les planches de la maquette V0 (desktop 1440 px, mobile 390 px). **Référence visuelle** : reproduire mise en page, hiérarchie, espacements, couleurs, textes. |
| `contenus/*.json` | Données de démonstration (annonces, équipe, quartiers, articles, agence) à charger dans le site. |

## Règles absolues

1. **Ne jamais inventer d'information.** Aucun chiffre, prix, avis, nom, date, horaire, texte juridique ou coordonnée qui ne soit pas dans `docs/` ou `contenus/`. Ce qui manque s'affiche comme emplacement entre `[crochets]` ou masque le bloc (voir la spec).
2. **Une note s'affiche toujours avec sa date** (Google, Qualitelis). Un chiffre d'activité avec sa période.
3. **Aucun avis inventé**, aucune photo générée ou de banque d'images. En attendant les vraies : emplacements gris étiquetés.
4. **Signaler, ne pas trancher**, tout point juridique ou technique incertain : ajouter une ligne dans `docs/questions-ouvertes.md` (à créer) et un commentaire `// À VALIDER :` dans le code. Points connus : encadrement des loyers à Bordeaux (fin d'expérimentation prévue le 24/11/2026, prolongation à vérifier), mentions RGPD, information sur les avis en ligne, mentions professionnelles, choix d'outils tiers.
5. **Charte CENTURY 21 stricte** : uniquement les couleurs de `docs/04-charte-graphique.md`. Jamais de texte or sur fond blanc. Aucune police à empattements. Ne jamais redessiner le logo : bloc typographique provisoire jusqu'à réception du SVG officiel.
6. **Pas de carrousel automatique, pas de pop-up**, animations sobres et désactivées si `prefers-reduced-motion`.
7. Ne pas ajouter de dépendance, de service tiers payant ou de traceur (analytics, cookies non essentiels) sans le noter dans `docs/questions-ouvertes.md` et obtenir l'accord de Simon.

## Façon de travailler

- Simon n'est pas développeur : expliquer en français simple ce qui a été fait, ce qui reste, et ce qu'il doit décider. Pas de jargon sans explication.
- Avancer **lot par lot** selon `docs/03-plan-de-developpement.md`. À la fin de chaque lot : lancer `npm run lint`, `npm run build` et les tests, puis résumer en 5 lignes max et proposer un commit.
- Avant de coder une page, relire sa planche desktop **et** mobile, ses annotations dans `maquette/LISEZMOI.md` et sa section dans `docs/01-brief-projet.md`.
- Composants réutilisables d'abord (en-tête, pied de page, carte de bien, boutons, FAQ, fil d'Ariane), pages ensuite.
- Données : toujours passer par la couche `lib/data/` (jamais d'import direct de JSON dans une page), pour pouvoir brancher plus tard un back-office ou le logiciel de l'agence sans réécrire les pages.
- Commits petits et en français (`feat: page Vendre`, `fix: contraste bouton`).

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Site en local sur http://localhost:3000, mis à jour à chaque modification |
| `npm run build` | Construit la version de production ; échoue si un fichier de `contenus/` est invalide |
| `npm run start` | Lance la version construite (après `npm run build`) |
| `npm run lint` | Vérifie la qualité du code (ESLint) |
| `npm test` | Tests de logique (Vitest, `tests/unit/`) : schémas des contenus, formatage |
| `npm run test:e2e` | Tests de parcours dans un navigateur, desktop 1440 px et mobile 390 px (Playwright, `tests/e2e/`) ; construit et lance le site sur le port 3100 |

Fin de lot : `npm run lint && npm run build && npm test && npm run test:e2e`.

Après un changement de structure d'un fichier de `contenus/` (nouveau champ), redémarrer `npm run dev` : le serveur local garde en mémoire les données déjà lues.

Stack en place : Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4 (jetons dans `app/globals.css`, palette par défaut supprimée), zod 4. Next.js 16 diffère des versions plus anciennes : consulter `node_modules/next/dist/docs/` avant d'utiliser une API (voir `AGENTS.md`). Projet de référence pour les choix techniques : `../Doxamed/New Site` (Tailwind, Payload, Resend).
