# Spécification technique

Version 1 — 19/11/2026. Les choix marqués **[à valider]** sont des propositions : les confirmer avec Simon avant de les mettre en œuvre.

## 1. Stack

| Sujet | Choix | Remarque |
|---|---|---|
| Framework | **Next.js**, dernière version stable, App Router, TypeScript strict | Créer le projet avec `create-next-app` (ne pas figer une version de mémoire). |
| Styles | Tailwind CSS, avec les couleurs et polices de la charte déclarées comme jetons de thème | Aucune autre couleur autorisée dans la config. |
| Polices | `next/font` : Barlow Semi Condensed (Google Fonts, 400/500/600) pour titres et chiffres ; Arial (police système) pour le texte | Typold et Oakes sont sous licence : à brancher seulement si l'agence fournit les fichiers. |
| Images | `next/image`, chargement différé, formats modernes | Emplacements gris étiquetés tant que les photos ne sont pas fournies. |
| Validation des données | `zod` (schémas des annonces, membres, articles, quartiers) | Le build échoue si un JSON ne respecte pas son schéma. |
| Tests | Vitest pour la logique (filtres, formatage des prix, schémas) ; Playwright pour 3 à 5 parcours clés | Playwright : estimation, recherche filtrée, formulaire de contact. |
| Hébergement | **Vercel** | Le plan gratuit (Hobby) est réservé à un usage non commercial : un site d'agence nécessite a priori le plan Pro **[à vérifier sur vercel.com/pricing et à valider avec Simon]**. |
| Contenus | Fichiers dans `contenus/` (JSON) pour la V1 ; articles possibles en MDX | Back-office prévu plus tard (voir §7). |

## 2. Rendu et performance

- Pages générées à la compilation (statique) partout où c'est possible : `generateStaticParams` pour `/biens/[slug]`, `/quartiers/[slug]`, `/equipe/[slug]`, `/ressources/[slug]`.
- Filtres de la recherche de biens côté client, **état des filtres dans l'URL** (`?transaction=vente&type=maison&budget=…&quartier=…`) pour le partage, le retour arrière et le référencement.
- Hero : vidéo légère en desktop avec image de remplacement (`poster`), **image seule sur mobile**. Pas de lecture automatique si `prefers-reduced-motion`.
- Cible Lighthouse mobile : ≥ 90 en performance, accessibilité, bonnes pratiques et SEO.

## 3. Routes

| Route | Page | Planche de référence |
|---|---|---|
| `/` | Accueil | `Main`, `Accueil-desktop-2`, `Accueil-mobile-1/2` |
| `/vendre` | Vendre | `VendreDesktop/Mobile` |
| `/estimation` | Module d'estimation (5 étapes + résultat) ; reçoit `?adresse=` depuis l'accueil et `?projet=` depuis « Faire louer ou gérer » | `EstimDesktop/Mobile` |
| `/acheter` | Accompagnement acheteur | `AcheterDesktop/Mobile` |
| `/biens` | Recherche (vue liste / carte), `?transaction=vente` ou `location` | `RechercheDesktop/Mobile` |
| `/biens/[slug]` | Fiche bien + galerie plein écran | `FicheDesktop/Mobile`, `FicheGalerie` |
| `/biens-vendus` | Biens vendus, filtre par quartier | `VendusDesktop/Mobile` |
| `/faire-louer-ou-gerer` | Bailleurs : location et gestion | `GererDesktop/Mobile` |
| `/quartiers` | Carte stylisée des 6 secteurs | `QuartiersDesktop/Mobile` |
| `/quartiers/[slug]` | Page quartier (un seul gabarit) | `QuartierDesktop/Mobile` |
| `/equipe` | Équipe, filtres par pôle | `EquipeDesktop/Mobile` |
| `/equipe/[slug]` | Fiche conseiller | `ConseillerDesktop/Mobile` |
| `/ressources` | Liste des articles, filtres par catégorie | `RessourcesDesktop/Mobile` |
| `/ressources/[slug]` | Article (un seul gabarit) | `ArticleDesktop/Mobile` |
| `/avis` | Avis clients, filtres par service | `AvisDesktop/Mobile` |
| `/agence` | L'agence | `AgenceDesktop/Mobile` |
| `/contact` | Contact et rendez-vous | `ContactDesktop/Mobile` |
| `/honoraires` | Barème d'honoraires (lien dans la barre utilitaire de toutes les pages) | — (contenu à fournir) |
| `/mentions-legales`, `/confidentialite`, `/cookies` | Pages légales | — (textes à fournir, ne pas rédiger de texte juridique définitif) |

Navigation : « Acheter » et « Trouver une location » du menu ouvrent `/biens` filtré (vente / location) ; la page `/acheter` est accessible depuis la recherche. Pages 404 et 500 aux couleurs du site.

## 4. Architecture du code (proposition)

```
app/                 routes (App Router), layout, sitemap.ts, robots.ts
components/          composants réutilisables (layout/, ui/, biens/, formulaires/, seo/)
lib/data/            accès aux données : getAnnonces(), getAnnonce(slug), getMembres()…
lib/schemas/         schémas zod
lib/format/          prix, surfaces, dates (fr-FR)
contenus/            données de démonstration (JSON)
public/              images, vidéo, logo (quand fournis)
tests/               Vitest et Playwright
```

`lib/data/` lit aujourd'hui `contenus/*.json`. Demain, il lira un back-office ou le flux du logiciel de l'agence : seules ces fonctions changeront.

## 5. Modèles de données

Les champs sont ceux de `contenus/*.json`. Règles :

- `null` = information non fournie. **Un champ vide masque son bloc** sur la fiche (sauf les mentions obligatoires, qui affichent un emplacement `[à fournir]` tant que le site n'est pas en ligne, et doivent bloquer la publication d'une annonce en production).
- **Annonce de vente** — obligatoires avant publication : prix honoraires inclus ; part des honoraires à la charge de l'acquéreur en % du prix hors honoraires (si applicable) ; classes DPE et GES ; fourchette des dépenses annuelles d'énergie et année de référence des prix ; mention « Logement à consommation énergétique excessive » pour les classes F et G ; copropriété (nombre de lots, charges annuelles moyennes, procédure en cours) ; lien vers Géorisques. Voir `docs/01-brief-projet.md` §10. **[Liste à faire valider par l'agence ou son juriste avant mise en ligne]**
- **Annonce de location** — loyer charges comprises, charges et leur mode de règlement, dépôt de garantie, honoraires de location (dont état des lieux), meublé ou non, surface habitable, DPE ; champs optionnels loyer de référence majoré et complément de loyer (encadrement des loyers, **dispositif à vérifier : fin prévue le 24/11/2026**).
- Statuts d'annonce : `en_vente`, `sous_compromis` **[à valider]**, `vendu`, `en_location`, `loue`. Une annonce `vendu` rejoint `/biens-vendus` automatiquement, avec son quartier et son délai de vente ; le prix de vente n'est affiché qu'avec l'accord du vendeur.
- **Membre de l'équipe** — nom et photo publiés seulement si `accordPublication` est vrai ; sinon emplacement sans photo **[règle à valider : afficher le nom sans accord ?]**.
- Badges : `exclusivite`, `nouveau` (calculé sur la date de mise en ligne, durée **[à valider]**), `coupDeCoeur` (sélection de l'accueil).

## 6. Formulaires

Formulaires : estimation (5 étapes), contact (projet → pôle), demande de visite (fiche bien), alerte e-mail (recherche), prise de rendez-vous, inscription à la lettre d'information.

- Envoi via des Server Actions ou Route Handlers Next.js, validation zod côté serveur, protection anti-spam (champ piège + limitation de débit).
- Envoi par e-mail à l'agence via un service transactionnel **[outil à choisir, ex. Resend ou Brevo ; adresse de réception par pôle à fournir]**. Tant que l'outil n'est pas choisi : envoi simulé et journalisé en développement.
- Chaque formulaire : case de consentement non pré-cochée, courte mention RGPD et lien vers `/confidentialite` **[textes à fournir par l'agence]**. Pas de stockage des données en base sans décision écrite (durée de conservation, accès).
- Estimation : **aucune fourchette chiffrée** tant que la source de prix et la méthode ne sont pas validées (voir annotations). En attendant, l'écran de résultat affiche l'emplacement et propose le rappel par un conseiller. Le conseiller référent dépend du secteur de l'adresse **[table secteur → conseiller à fournir]**.
- Prise de rendez-vous : créneaux d'exemple dans l'interface, sans réservation réelle tant que l'outil d'agenda n'est pas choisi.

## 7. Intégrations à décider (ne pas implémenter sans accord)

| Besoin | Piste | Point de vigilance |
|---|---|---|
| Annonces réelles | Flux d'export du logiciel de transaction de l'agence | Logiciel et format inconnus. Données d'exemple en attendant. |
| Back-office (annonces, articles, avis mis en avant) | CMS headless ou back-office sur mesure | Choix à faire après la V1. |
| Avis Google | API Google (Places ou Business Profile) | Conditions d'affichage, de mise en cache et d'attribution de Google à vérifier ; nombre d'avis renvoyés limité selon l'API **[à vérifier]**. En attendant : emplacements, aucun avis inventé. |
| Carte (recherche, quartiers, contact) | MapLibre / Leaflet avec un fournisseur de tuiles, ou Google Maps | Coût et conditions du fournisseur ; les tuiles publiques d'OpenStreetMap ont une politique d'usage restrictive. Fournisseur à choisir. |
| Agenda / rendez-vous | Outil de réservation de l'agence | À choisir avec l'agence. |
| Mesure d'audience | Outil exempté de consentement si possible | Règles CNIL à vérifier ; aucun traceur sans décision. |

## 8. SEO et moteurs IA

- Métadonnées par page (API `metadata`), un seul H1, titres hiérarchisés, fil d'Ariane sur toutes les pages internes.
- `sitemap.ts` et `robots.ts`. URL canoniques. Balises Open Graph.
- Données structurées JSON-LD : `RealEstateAgent` (agence), `Person` (conseillers), `Article`, `BreadcrumbList`, `FAQPage` (FAQ des pages Vendre, Faire louer ou gérer, quartiers, articles). Ne mettre dans le JSON-LD que des informations affichées sur la page.
- Pages quartier et articles : bloc « En bref », auteur identifié et date de mise à jour visibles.

## 9. Accessibilité

- Viser WCAG 2.1 niveau AA (référentiel RGAA en France).
- Contrastes : voir `docs/04-charte-graphique.md`. Focus visible (filet Dark Gold 2 px). Navigation clavier complète, y compris galerie et parcours d'estimation.
- Cibles tactiles de 48 px minimum sur mobile. Libellés explicites sur tous les champs. `alt` descriptifs.
- Barre d'actions fixe en bas sur mobile (Appeler · Estimer · Nos biens ; sur la fiche bien : Appeler · Demander une visite ; sur la fiche conseiller : Appeler · Prendre rendez-vous).
