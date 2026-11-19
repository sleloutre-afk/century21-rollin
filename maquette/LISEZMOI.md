# Maquette V0 — planches et annotations

Source : [maquette Claude Design](https://claude.ai/artifact/MSEkcKhmTEVYjx9svxwxXT) (canvas « Cabinet Rollin – CENTURY 21 Les Chartrons · Maquette V0 »), exportée le 19/11/2026.

## Comment lire les planches

- Chaque fichier `planches/*.dc.html` est une planche du canvas : HTML avec styles en ligne, à lire comme **référence visuelle et de contenu**, pas comme code à réutiliser.
- `<x-dc>` contient le gabarit ; `sc-for` / `sc-if` sont des boucles et conditions ; `{{valeur}}` est une donnée fournie par le script `<script type="text/x-dc">` (classe `Component`, méthode `renderVals()`). Les données de démonstration (annonces, équipe, quartiers, étapes de l'estimation) sont dans ce script.
- Ces fichiers ne s'ouvrent pas seuls dans un navigateur (ils dépendent du moteur du canvas). Pour voir le rendu, ouvrez la maquette en ligne.
- Les planches « importeuses » (Etape2, Resultat, Article2–4, QuartierBassins, RechercheDesktopCarte) ne sont pas exportées : elles affichent la même planche avec un autre réglage (`startStep`, `article`, `quartier`, `startView`).
- Desktop = 1440 px de large, mobile = 390 px.

## Planches → routes

| Planche | Titre | Route Next.js | Exportée |
|---|---|---|---|
| `Main` | Accueil · desktop · 1/2 (en-tête → estimation) | `/` | oui |
| `Accueil-desktop-2` | Accueil · desktop · 2/2 (en-tête compacté → pied de page) | `/` | oui |
| `Accueil-mobile-1` | Accueil · mobile · 1/2 | `/` | oui |
| `Accueil-mobile-2` | Accueil · mobile · 2/2 | `/` | oui |
| `VendreDesktop` | Vendre · desktop | `/vendre` | oui |
| `VendreMobile` | Vendre · mobile | `/vendre` | oui |
| `EstimDesktop` | Estimation · desktop · étape 1 (parcours cliquable) | `/estimation` | oui |
| `EstimDesktopEtape2` | Estimation · desktop · étape 2 | `/estimation` | non (importeuse) |
| `EstimDesktopResultat` | Estimation · desktop · résultat | `/estimation` | non (importeuse) |
| `EstimMobile` | Estimation · mobile · 1 Adresse (cliquable) | `/estimation` | oui |
| `EstimMobileEtape2` | Estimation · mobile · 2 Votre bien | `/estimation` | non (importeuse) |
| `EstimMobileEtape3` | Estimation · mobile · 3 Caractéristiques | `/estimation` | non (importeuse) |
| `EstimMobileEtape4` | Estimation · mobile · 4 Projet | `/estimation` | non (importeuse) |
| `EstimMobileEtape5` | Estimation · mobile · 5 Coordonnées | `/estimation` | non (importeuse) |
| `EstimMobileResultat` | Estimation · mobile · résultat | `/estimation` | non (importeuse) |
| `AcheterDesktop` | Acheter · desktop | `/acheter` | oui |
| `AcheterMobile` | Acheter · mobile | `/acheter` | oui |
| `RechercheDesktop` | Recherche · desktop · vue liste (bascule Liste / Carte cliquable) | `/biens` | oui |
| `RechercheDesktopCarte` | Recherche · desktop · vue carte | `/biens?vue=carte` | non (importeuse) |
| `RechercheMobile` | Recherche · mobile | `/biens` | oui |
| `FicheDesktop` | Fiche bien · desktop · Palais Gallien | `/biens/[slug]` | oui |
| `FicheGalerie` | Fiche bien · galerie plein écran (cliquable) | `/biens/[slug] (galerie)` | oui |
| `FicheMobile` | Fiche bien · mobile | `/biens/[slug]` | oui |
| `VendusDesktop` | Biens vendus · desktop (filtres cliquables) | `/biens-vendus` | oui |
| `VendusMobile` | Biens vendus · mobile | `/biens-vendus` | oui |
| `GererDesktop` | Faire louer ou gérer · desktop | `/faire-louer-ou-gerer` | oui |
| `GererMobile` | Faire louer ou gérer · mobile | `/faire-louer-ou-gerer` | oui |
| `QuartiersDesktop` | Nos quartiers · desktop (carte cliquable) | `/quartiers` | oui |
| `QuartiersMobile` | Nos quartiers · mobile | `/quartiers` | oui |
| `QuartierDesktop` | Quartier · Chartrons · desktop (gabarit) | `/quartiers/[slug]` | oui |
| `QuartierBassinsDesktop` | Quartier · Bassins à flot · desktop (même gabarit) | `/quartiers/[slug]` | non (importeuse) |
| `QuartierMobile` | Quartier · Chartrons · mobile | `/quartiers/[slug]` | oui |
| `QuartierBassinsMobile` | Quartier · Bassins à flot · mobile | `/quartiers/[slug]` | non (importeuse) |
| `EquipeDesktop` | L'équipe · desktop (filtres cliquables) | `/equipe` | oui |
| `EquipeMobile` | L'équipe · mobile | `/equipe` | oui |
| `ConseillerDesktop` | Fiche conseiller · Grégory Coutant · desktop | `/equipe/[slug]` | oui |
| `ConseillerMobile` | Fiche conseiller · Grégory Coutant · mobile | `/equipe/[slug]` | oui |
| `RessourcesDesktop` | Ressources · desktop (filtres cliquables) | `/ressources` | oui |
| `RessourcesMobile` | Ressources · mobile | `/ressources` | oui |
| `ArticleDesktop` | Article 1 · DPE 2026 · desktop (gabarit) | `/ressources/[slug]` | oui |
| `ArticleDesktop2` | Article 2 · Estimer aux Chartrons · desktop | `/ressources/[slug]` | non (importeuse) |
| `ArticleDesktop3` | Article 3 · Gestion locative · desktop | `/ressources/[slug]` | non (importeuse) |
| `ArticleDesktop4` | Article 4 · Vivre aux Chartrons · desktop | `/ressources/[slug]` | non (importeuse) |
| `ArticleMobile` | Article · mobile (gabarit, article 1) | `/ressources/[slug]` | oui |
| `AvisDesktop` | Avis clients · desktop (filtres cliquables) | `/avis` | oui |
| `AvisMobile` | Avis clients · mobile | `/avis` | oui |
| `AgenceDesktop` | L'agence · desktop | `/agence` | oui |
| `AgenceMobile` | L'agence · mobile | `/agence` | oui |
| `ContactDesktop` | Contact · desktop (projet et créneaux cliquables) | `/contact` | oui |
| `ContactMobile` | Contact · mobile | `/contact` | oui |

## Annotations du canvas

Notes posées à côté des planches. Elles font partie du cahier des charges.


### Accueil · desktop 1440 px


### Accueil · mobile 390 px

- **EN-TÊTE FIXE** — Il se compacte au défilement (état compact en haut de la planche 2/2). Téléphone cliquable et « Estimer mon bien » toujours visibles. Barre utilitaire : barème d'honoraires accessible depuis toutes les pages. Logo : bloc typographique provisoire, à remplacer par le SVG officiel fourni par le réseau.
- **HERO** — Emplacement vidéo (fichier à fournir), image de remplacement et voile réglable (Tweaks). Le champ adresse ouvre directement le module d'estimation, adresse pré-remplie. La date de la note Google est à compléter.
- **DYNAMIQUE · ANNONCES** — Cartes alimentées par le back-office, mêmes champs pour toutes : quartier, type, surface, pièces, prix honoraires inclus, part acquéreur, DPE / GES, badge Exclusivité. La sélection « coup de cœur » se coche dans le back-office. Le mini-moteur envoie ses filtres vers la page de recherche.
- **DYNAMIQUE · BIENS VENDUS** — Une annonce passée au statut « Vendu » apparaît ici automatiquement, avec son quartier et son délai de vente (champ à saisir). Données à fournir par l'agence : emplacements laissés vides.
- **QUARTIERS** — Prix moyen au m² volontairement vide : aucun chiffre inventé. Source à choisir avec l'agence. Avec de vraies photos, le cartouche blanc garantit la lisibilité du texte.
- **ESTIMATION** — Parcours complet en 5 étapes + écran de résultat : prompt 2. Mention RGPD et consentement prévus sur chaque formulaire.
- **EN-TÊTE COMPACTÉ** — État après défilement : 64 px, sans barre utilitaire, logo réduit.
- **ÉQUIPE · À VÉRIFIER** — Portraits à fournir, avec l'accord écrit de chaque salarié. La liste du prompt compte 21 personnes, le texte annonce 20 professionnels : chiffre à confirmer.
- **DYNAMIQUE · AVIS** — Flux Google mis à jour automatiquement (prénom, note, extrait, date). Défilement manuel uniquement, jamais automatique. Aucun avis inventé : emplacements en attendant la connexion au flux. Mention sur le contrôle des avis à valider.
- **DYNAMIQUE · RESSOURCES** — Les 3 derniers articles publiés depuis le back-office : catégorie, auteur (membre de l'équipe), temps de lecture, date de mise à jour.
- **CONTACT** — Formulaire court + prise de rendez-vous en ligne. Case de consentement RGPD obligatoire.
- **PIED DE PAGE · À COMPLÉTER** — Mentions professionnelles obligatoires : n° de carte professionnelle et CCI, garant financier, assurance RCP, médiateur de la consommation.
- **MOBILE** — Barre d'actions fixe en bas d'écran : Appeler · Estimer · Nos biens. Elle est montrée en bas de chaque planche. Hero : image fixe à la place de la vidéo, pour la vitesse de chargement. Un seul groupe d'information par écran, rangées défilables au doigt.

### Vendre · desktop et mobile


### Module d'estimation

- **SEO · STRUCTURE** — Fil d'Ariane, un seul H1, hiérarchie de titres logique. Action principale : « Estimer mon bien », répétée en tête, en milieu et en fin de page.
- **MÉTHODE EN 4 ÉTAPES** — Grille alternée photo / texte. L'étape 4 présente Gwendoline Delaire, qui suit chaque vente du mandat à l'acte. Photos de mise en situation à prévoir avec l'agence (pas de banque d'images).
- **DYNAMIQUE · PREUVES** — Les 3 dernières ventes et les avis Google filtrés sur le service « vente ». Note Qualitelis transaction datée. Aucun avis inventé.
- **CONSEILLERS · À COMPLÉTER** — Secteur de chaque conseiller à fournir : il sert aussi à afficher le bon référent à la fin de l'estimation.
- **FAQ VENDEURS · À VALIDER** — Balisage FAQPage (schema.org) prévu. Réponses courtes et prudentes : coût de l'estimation, délai moyen et liste des diagnostics à faire valider par l'agence.
- **VENDRE · MOBILE** — Mêmes sections, empilées. Conseillers et ventes en rangées défilables au doigt. FAQ repliée. Barre d'actions fixe en bas.
- **PARCOURS D'ESTIMATION** — Cliquez sur Lecture sur l'étape 1 pour parcourir les 5 étapes jusqu'au résultat. L'adresse saisie sur l'accueil arrive pré-remplie. Résultat : fourchette de prix, ou de loyer si le projet est de faire louer ou gérer. Aucun chiffre affiché tant que l'algorithme et sa source (DVF, base notariale…) ne sont pas choisis. Le conseiller référent est choisi selon le secteur de l'adresse.
- **MOBILE** — Un seul groupe de questions par écran, gros boutons de choix (48 px min.), bouton Continuer toujours visible en bas. Consentement RGPD à l'étape 5.

### Acheter · desktop et mobile

- **RÔLE DE LA PAGE** — Plus courte que « Vendre ». Action principale : la recherche, accessible dès le haut de page. Les acheteurs venus d'un portail arrivent plutôt sur une fiche bien ; cette page sert à ceux qui passent par le menu.
- **DYNAMIQUE · RECHERCHE** — Le formulaire ouvre la page de recherche (prompt 4) avec les filtres pré-remplis. Les 3 derniers biens à vendre s'affichent automatiquement.
- **DÉROULÉ · À CONFIRMER** — Étape 5 : partenaires de financement (courtiers) à confirmer avec l'agence. Étape 6 : rôle exact de l'agence dans la rédaction de l'avant-contrat à valider.
- **DYNAMIQUE · ALERTE E-MAIL** — Un e-mail à chaque nouveau bien correspondant, géré par le back-office. Critères repris de la dernière recherche. Consentement RGPD et désinscription en un clic.
- **PASSERELLE VERS L'ESTIMATION** — Pour les acheteurs qui ont aussi un bien à vendre : l'adresse saisie ouvre le module d'estimation.
- **ACHETER · MOBILE** — Recherche directement sous le titre, déroulé vertical, barre d'actions fixe en bas.

### Recherche de biens


### Fiche bien


### Biens vendus

- **DYNAMIQUE · RECHERCHE** — Les 8 annonces viennent du back-office. Filtres et tri s'appliquent sans recharger la page ; l'adresse de la page garde les filtres (partage, retour arrière, SEO). Barre de filtres fixe au défilement.
- **VUE CARTE** — Liste à gauche, carte à droite qui reste visible. Une étiquette de prix par bien. Fond de carte sobre, aux couleurs de la charte. Fournisseur de carte à choisir au développement.
- **ALERTE** — « Créer une alerte » enregistre les filtres en cours et l'e-mail ; envoi automatique à chaque nouveau bien correspondant.
- **RECHERCHE · MOBILE** — Filtres dans un panneau, barre Filtres · Trier · Carte fixe en haut. Cartes de biens empilées.
- **GABARIT ALIMENTÉ PAR DONNÉES** — Mêmes champs pour toutes les annonces : galerie, vidéo, visite virtuelle, plan, points forts, description, caractéristiques, DPE / GES, dépenses d'énergie, copropriété, conseiller, quartier. Un champ vide masque son bloc.
- **MENTIONS OBLIGATOIRES** — Prix honoraires inclus et part acquéreur ; classes DPE et GES ; fourchette de dépenses d'énergie avec année de référence ; mention « logement à consommation énergétique excessive » si F ou G ; copropriété ; lien Géorisques. Toutes les valeurs du Palais Gallien sont à fournir.
- **CONSEILLER DU BIEN · À FOURNIR** — Nom, photo et ligne directe du conseiller en charge du bien. Le bouton « Demander une visite » ouvre un formulaire court.
- **QUARTIER** — Le Palais Gallien ne fait pas partie des 6 secteurs du prompt : choisir la page quartier vers laquelle renvoyer.
- **GALERIE PLEIN ÉCRAN** — Ouverte au clic sur une photo. Navigation au clavier et au doigt, compteur, onglets Photos · Vidéo · Visite virtuelle · Plan.
- **FICHE · MOBILE** — Galerie en tête, défilable au doigt. Barre fixe propre à la fiche : Appeler · Demander une visite.
- **DYNAMIQUE · BIENS VENDUS** — Une annonce passée au statut « Vendu » rejoint cette page automatiquement. Champ « délai de vente » à saisir dans le back-office. Prix de vente non affiché, sauf accord du vendeur.
- **BIENS VENDUS · MOBILE** — Filtres par quartier en rangée défilable, grille sur 2 colonnes.

### Faire louer ou gérer · desktop et mobile

- **OFFRES · À VALIDER** — Contenu des deux offres repris de l'article « Ce que fait vraiment votre gestionnaire ». Aucun tarif affiché : renvoi au barème. Garantie des loyers impayés, périodicité du relevé de gérance : à confirmer avec l'agence.
- **ENCART DPE** — Calendrier vérifié : G interdit à la location depuis le 1er janvier 2025, F en 2028, E en 2034. Renvoie vers l'article DPE 2026.
- **ACTION PRINCIPALE** — « Estimer mon loyer » ouvre le module d'estimation, projet « Faire louer » ou « Confier la gestion » : le résultat affiche alors une fourchette de loyer.
- **FAQ BAILLEURS · À METTRE À JOUR** — La réponse sur l'encadrement des loyers dépend du vote définitif de la prolongation (fin prévue le 24 novembre 2026). Deux réponses restent à fournir par l'agence. Balisage FAQPage prévu.
- **ÉQUIPE · À VÉRIFIER** — Rôles repris du prompt. Intitulé de poste de Marie Brac de la Perrière (« assistante ») à préciser : gestion ou agence ?
- **MOBILE** — Les deux offres sont empilées, gestion en fond sombre. Équipe en rangée défilable, FAQ repliée.

### Nos quartiers


### Pages quartier : Chartrons et Bassins à flot

- **CARTE STYLISÉE · À VALIDER** — Carte simplifiée, pas une carte géographique exacte : la position relative des 6 secteurs est approximative et doit être validée par l'agence (en particulier allée Haussmann et Parc Rivière). Cliquer un secteur met à jour la fiche à droite.
- **NOS QUARTIERS · MOBILE** — Carte réduite en tête, puis liste des 6 secteurs avec vignette photo.
- **UN SEUL GABARIT** — Chartrons et Bassins à flot utilisent le même fichier, alimenté par des données (réglage « quartier » dans Tweaks). Les 4 autres secteurs suivront le même modèle. Auteur et date de mise à jour affichés sous le titre (SEO et moteurs IA).
- **EN BREF · À FAIRE VALIDER** — Points factuels limités à ce qui est connu et vérifiable (histoire du quartier, rue Notre-Dame, tram B, Jardin Public, Cité du Vin, base sous-marine). Les lignes de bus, écoles et commerces restent à compléter par l'agence.
- **MARCHÉ · AUCUN CHIFFRE INVENTÉ** — Prix au m², évolution, délai de vente et graphique sont des emplacements. Source à choisir (DVF, base notariale, données de l'agence) et à afficher avec sa date.
- **BASSINS À FLOT · ÉTAT VIDE** — Aucune des 8 annonces n'y est située : la page montre l'état « aucun bien en vente » avec la création d'alerte. Les biens vendus restent visibles.
- **PAGES QUARTIER · MOBILE** — Même gabarit, sections empilées, biens en rangée défilable. Barre d'actions fixe en bas.

### L'équipe


### Fiche conseiller

- **FILTRES PAR PÔLE** — Direction, Transaction, Suivi des ventes, Location, Gestion locative, Accueil. Barre de filtres fixe au défilement. Cliquez une carte de Grégory Coutant pour ouvrir sa fiche.
- **À FOURNIR PAR L'AGENCE** — Portraits (avec accord écrit de chacun), spécialité et quartiers de chaque conseiller transaction. La liste du prompt compte 21 personnes : chiffre « 20 professionnels » à corriger ou confirmer. Balisage schema.org Person prévu pour chaque fiche.
- **ÉQUIPE · MOBILE** — Filtres en rangée défilable, grille sur 2 colonnes.
- **FICHE CONSEILLER · À RÉDIGER** — Présentation à la première personne, spécialité et apport concret : à faire rédiger par Grégory Coutant. Aucun bien ne lui est attribué dans la maquette : ses biens en cours et vendus seront filtrés par le back-office.
- **PRISE DE RENDEZ-VOUS** — Créneaux reliés à l'agenda du conseiller (outil à choisir). Les créneaux affichés sont des exemples d'interface. Cliquables dans la maquette.
- **FICHE · MOBILE** — Barre fixe propre à la fiche : Appeler · Prendre rendez-vous.

### Ressources


### Gabarit article · 4 articles


### Article · mobile

- **DYNAMIQUE · RESSOURCES** — Articles publiés depuis le back-office : catégorie, auteur (membre de l'équipe), date de mise à jour, temps de lecture calculé automatiquement. Filtres par catégorie cliquables. Inscription à la lettre d'information des propriétaires avec consentement.
- **RESSOURCES · MOBILE** — Article à la une, filtres en rangée défilable, liste compacte.
- **UN SEUL GABARIT D'ARTICLE** — Titre, chapeau, auteur et date, image, sommaire fixe, En bref, intertitres, encadré « Le conseil de l'agence », FAQ de 3 questions (balisage FAQPage), appel à l'action adapté au sujet, articles liés. Les 4 articles utilisent le même fichier (réglage « article » dans Tweaks).
- **RÉDACTION · À RELIRE PAR L'AGENCE** — 500 à 700 mots par article. Seuls les faits fournis sont utilisés ; le reste est entre [crochets]. Article 1 : faits DPE vérifiés (arrêté du 13 août 2025, JO du 26 août 2025, coefficient 2,3 → 1,9, calendrier G 2025 / F 2028 / E 2034). Le chiffre de 850 000 logements est présenté comme l'estimation initiale du gouvernement.
- **ARTICLE · MOBILE** — Sommaire replié en tête, puis le même contenu en une colonne. Les 4 articles s'affichent avec le même gabarit (réglage « article »).

### Avis clients


### L'agence


### Contact

- **DYNAMIQUE · AVIS** — Flux Google mis à jour automatiquement, filtrable par service (vente, location, gestion). Le service de chaque avis est attribué dans le back-office. Notes globales datées. Aucun avis inventé : emplacements.
- **INFORMATION SUR LES AVIS · À VALIDER** — Le Code de la consommation impose d'indiquer si les avis font l'objet d'un contrôle et comment ils sont classés. Texte de l'encart à valider par l'agence. Avis mis en avant : uniquement avec l'accord du client.
- **L'AGENCE · À FOURNIR** — Mot de Dominique et Myriam Rollin, photo de l'agence et de l'équipe, distinction Centurion (années à confirmer, 2026 incluse), visuel officiel de la distinction fourni par le réseau. Balisage RealEstateAgent prévu.
- **CONTACT** — Formulaire court par type de projet : il oriente la demande vers le bon pôle. Prise de rendez-vous en ligne (outil à choisir). Consentement RGPD. Accès (tram, stationnement) et horaire du samedi : à compléter.
