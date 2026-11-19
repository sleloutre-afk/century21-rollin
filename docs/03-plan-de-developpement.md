# Plan de développement

Un lot = une session de travail avec Claude Code. Ne passer au lot suivant qu'après validation de Simon. À chaque fin de lot : lint, build et tests verts, résumé court, commit.

## Lot 0 — Mise en place

- Créer le projet Next.js (App Router, TypeScript, Tailwind, ESLint) **dans ce dossier**, sans écraser `CLAUDE.md`, `docs/`, `maquette/`, `contenus/`.
- Jetons de la charte dans la config Tailwind ; polices via `next/font`.
- `lib/schemas/` (zod) et `lib/data/` qui chargent et valident `contenus/*.json`.
- Vitest et Playwright installés, un test de chaque.
- Compléter la section « Commandes » de `CLAUDE.md`. Créer `docs/questions-ouvertes.md`.

**Fini quand** : `npm run dev` affiche une page vide aux couleurs du site, `npm run build` passe, les schémas valident les 5 fichiers de `contenus/`.

## Lot 1 — Système graphique et gabarit

- En-tête (barre utilitaire avec lien barème, navigation, téléphone cliquable, « Estimer mon bien », état compacté au défilement), menu mobile, barre d'actions fixe mobile.
- Pied de page complet avec emplacements des mentions professionnelles.
- Composants : boutons (or, sombre, contour), carte de bien, emplacement photo, fil d'Ariane, FAQ (`details`/`summary`), bloc « En bref », titres de section, compteurs animés, rangée défilable manuelle.
- Page `/styleguide` (non indexée) qui montre tous les composants.

**Fini quand** : la page styleguide reproduit fidèlement les éléments des planches, contrastes vérifiés.

## Lot 2 — Accueil

Les 13 sections du brief (§7), desktop et mobile, d'après `Main`, `Accueil-desktop-2`, `Accueil-mobile-1/2`. Le champ adresse du hero ouvre `/estimation?adresse=…`.

## Lot 3 — Vendre et estimation

`/vendre` puis `/estimation` (5 étapes, résultat, consentement RGPD, envoi simulé). Aucune fourchette chiffrée (voir spec §6).

## Lot 4 — Biens

`/biens` (liste, filtres dans l'URL, vue carte avec emplacement de carte), `/biens/[slug]` (galerie plein écran clavier et tactile, DPE/GES, mentions obligatoires, conseiller, formulaire de visite), `/biens-vendus`, `/acheter`.

## Lot 5 — Faire louer ou gérer

`/faire-louer-ou-gerer`, lien vers l'estimation avec projet pré-sélectionné.

## Lot 6 — Quartiers

`/quartiers` (carte stylisée cliquable) et `/quartiers/[slug]` (un gabarit, contenus Chartrons et Bassins à flot repris de la planche ; état « aucun bien en vente »).

## Lot 7 — Équipe

`/equipe` (filtres par pôle) et `/equipe/[slug]` (fiche, créneaux d'exemple).

## Lot 8 — Ressources

`/ressources` et `/ressources/[slug]` (sommaire fixe, En bref, encadré conseil, FAQ, articles liés, temps de lecture calculé). Contenu : `contenus/articles.json`.

## Lot 9 — Avis, agence, contact, pages légales

`/avis`, `/agence`, `/contact`, `/honoraires`, `/mentions-legales`, `/confidentialite`, `/cookies` (structures et emplacements ; pas de texte juridique inventé).

## Lot 10 — SEO, accessibilité, performance

JSON-LD, sitemap, robots, métadonnées, audit Lighthouse mobile, audit clavier et lecteur d'écran, 404/500.

## Lot 11 — Mise en ligne de démonstration

Déploiement Vercel (aperçu protégé ou non indexé), pour la présentation à l'agence. Le site ne passe en production qu'une fois `docs/05-elements-a-fournir.md` traité et les points juridiques validés.

## Après la V1 (hors périmètre actuel)

Back-office, flux d'annonces du logiciel de l'agence, flux d'avis, envoi d'e-mails réel, agenda, alertes e-mail, carte réelle.
