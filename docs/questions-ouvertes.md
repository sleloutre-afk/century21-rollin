# Questions ouvertes

Créé le 19/11/2026, avant le lot 0. Points à trancher, à demander à l'agence ou à vérifier.
Quand une réponse arrive : la noter sous la ligne, cocher la case, et retirer l'emplacement `[…]` correspondant dans le site.

Légende : **Qui** = qui doit répondre (Simon, Agence, Juriste). **Lot** = à quel moment de développement la réponse devient nécessaire.

## 1. Décisions de Simon

- [x] **Noms de l'équipe.** → *Simon, 19/11/2026 : ils sont tous déjà publiés avec leur photo sur le site actuel de l'agence (page « Notre équipe à votre service »). Les noms s'affichent.* Reste : récupérer les photos en haute définition auprès de l'agence (ou sur le site actuel, si l'agence le confirme), puis passer `accordPublication` à `true` dans `contenus/equipe.json`. — Lot : 7
- [x] **Quartiers des annonces.** → *Simon, 19/11/2026 : ajouter Palais Gallien, Croix de Seguey, Saint-Seurin, Bacalan et « Autre ».* Fait au lot 0 : 11 valeurs dans `lib/schemas/communs.ts` et `lib/data/quartiers.ts`. Ces 5 valeurs n'ont pas de page quartier. Reste : renseigner le champ `secteur` de chaque annonce dans `contenus/annonces.json` (lot 4). Le grand T4 « Chartrons · côté Bacalan » sera rattaché à Bacalan, sauf avis contraire.
- [x] **Biens vendus : aucune donnée.** → *Proposition acceptée par Simon le 19/11/2026* : cartes vides étiquetées « [Bien vendu à fournir] », comme dans la maquette. — Lot : 2, 4
- [x] **Locations : aucune annonce.** → *Proposition acceptée par Simon le 19/11/2026* : état « Aucune location disponible pour le moment » avec la création d'alerte (désactivée tant que l'envoi d'e-mails n'est pas branché). — Lot : 4
- [x] **Badge « Nouveau ».** → *Proposition acceptée par Simon le 19/11/2026* : champ `dateMiseEnLigne` prévu dans le schéma (vide pour l'instant), durée de 15 jours, modifiable. — Lot : 1
- [x] **Tranches de budget du mini-moteur.** → *Proposition acceptée par Simon le 19/11/2026* : celles de la maquette. — Lot : 2, 4
- [x] **Outils tiers.** → *Simon, 19/11/2026 : choisir le plus simple et le plus cohérent.* Référence : le site Doxamed (`../Doxamed/New Site`). Pistes retenues, **à brancher seulement le moment venu, après accord de Simon sur le compte et le coût** :
  - E-mails des formulaires : **Resend** (déjà utilisé sur Doxamed). En attendant : envoi simulé. — Lot : 3
  - Back-office (après la V1) : **Payload**, intégré au site comme sur Doxamed. — Après V1
  - Carte, agenda, avis Google, flux d'annonces, mesure d'audience : à décider au lot concerné. En attendant : emplacements et créneaux d'exemple.
- [x] **Hébergement de la version de test.** → *Simon, 19/11/2026 : Vercel.* Dépôt du code : https://github.com/sleloutre-afk/century21-rollin. — Lot : 11
- [ ] **Hébergement de la production** (site public de l'agence) : Vercel, dont le plan gratuit est réservé à un usage non commercial (plan Pro a priori nécessaire, à vérifier sur vercel.com/pricing), ou Clever Cloud comme Doxamed ? À décider avant la mise en ligne. — Qui : Simon · Lot : après 11
- [ ] **Statut « sous compromis ».** La spec le propose « à valider ». L'agence souhaite-t-elle l'afficher (bandeau sur la carte du bien) ? Prévu dans le schéma. — Qui : Agence · Lot : 4
- [ ] **Redirections de l'ancien site.** Comme sur Doxamed, rediriger les adresses actuelles (century21-cabinet-rollin-bordeaux.com/…) vers les nouvelles pages, pour ne pas perdre le référencement Google. Il faudra la liste des pages actuelles (Search Console de l'agence, ou relevé du site actuel). — Qui : Simon / Agence · Lot : 10

## 2. À demander à l'agence (contenus)

Ces points figurent déjà, pour la plupart, dans la liste partagée des éléments à fournir. Ils sont repris ici quand ils ont un effet direct sur le code.

- [ ] **Page quartier du Palais Gallien** (`quartierPage` à choisir) : Palais Gallien n'a pas de page ; vers quel secteur renvoyer depuis la fiche bien ? — Lot : 4
- [ ] **Localisation exacte du grand T4 « côté Bacalan ».** — Lot : 4
- [ ] **Articles : date de mise à jour.** `contenus/articles.json` ne contient ni date, ni identifiant d'URL (les articles sont numérotés 1 à 4). La date est obligatoire à l'affichage (spec §8). Les champs `slug` et `dateMiseAJour` sont prévus dans le schéma ; la date reste `[date à fournir]`. — Lot : 8
- [ ] **Auteurs des articles 1, 3 et 4**, et confirmation de Grégory Coutant pour l'article 2. — Lot : 8
- [ ] **Effectif : 20 ou 21 professionnels ?** Le texte du site dit 20, la liste compte 21 personnes. — Lot : 2, 7, 9
- [ ] **Intitulé de poste de Marie Brac de la Perrière** (assistante gestion locative ou agence ?) et rôle exact de Grégory Coutant. — Lot : 7
- [ ] **Secteur de chaque conseiller transaction** (sert aussi à choisir le référent à la fin de l'estimation) et conseiller référent de chaque quartier. — Lot : 3, 6, 7
- [ ] **Conseiller de chaque annonce** (nom, ligne directe). — Lot : 4
- [ ] **Horaires** : vendredi matin et samedi. — Lot : 1 (pied de page), 9
- [ ] **Dates des notes** Google (« au JJ/MM/2026 ») et Qualitelis, et période des chiffres d'activité (année 2025 ou 12 derniers mois). Sans date, la note s'affiche avec `[date à fournir]`. — Lot : 1, 2
- [ ] **Distinction Centurion** : années exactes (2016 à 2026 ?) et visuel officiel. — Lot : 2, 9
- [ ] **Libellé exact du bloc logo** et fichier SVG officiel. — Lot : 1
- [ ] **Polices Typold et Oakes** (fichiers sous licence web), sinon Barlow Semi Condensed et Arial (en place au lot 0). — Lot : 1
- [ ] **Déclinaison France de la charte CENTURY 21**, si elle existe (elle primerait sur la charte mondiale de 2018). — Lot : 1

## 3. Points juridiques à faire valider

Le site les affiche comme emplacements. Il ne rédige aucun texte juridique définitif.

- [ ] **Encadrement des loyers à Bordeaux.** Fin de l'expérimentation prévue le 24/11/2026, sauf adoption définitive de la prolongation. → *Simon, 19/11/2026 : à traiter plus tard.* Les champs « loyer de référence majoré » et « complément de loyer » sont prévus (facultatifs) dans le schéma. À trancher avant la mise en ligne. — Qui : Agence / Juriste · Lot : 4, 5
- [ ] **Mentions obligatoires des annonces** (vente et location) : liste de la spec §5 à faire valider. — Qui : Juriste · Lot : 4
- [ ] **Mentions professionnelles du pied de page** : carte professionnelle et CCI, garant financier, assurance RCP, médiateur, formulation de la mention d'indépendance exigée par le réseau. — Qui : Agence · Lot : 1
- [ ] **Textes RGPD** des formulaires, politique de confidentialité, page cookies, durée de conservation des demandes. — Qui : Agence / Juriste · Lot : 3, 9
- [ ] **Information sur les avis en ligne** (contrôle et classement des avis, Code de la consommation) : texte de l'encart. — Qui : Agence / Juriste · Lot : 2, 9
- [ ] **Conditions d'affichage des avis Google** (attribution, mise en cache, nombre d'avis renvoyés par l'API). — Qui : à vérifier au moment du branchement · Lot : après V1
- [ ] **Article DPE** : gel des loyers F et G depuis le 24/08/2022 et conditions de téléchargement d'une attestation mise à jour sur le site de l'ADEME. — Qui : Agence · Lot : 8
- [ ] **Barème d'honoraires** : contenu de la page `/honoraires`. — Qui : Agence · Lot : 9

## 4. Incohérences repérées dans le dossier

Elles ne bloquent pas le travail. Je les signale pour que le dossier soit corrigé si besoin.

- [ ] **Annotations de la maquette décalées** (`maquette/LISEZMOI.md`). Plusieurs annotations sont rangées sous le titre de la section suivante. Par exemple, les notes de l'accueil desktop sont sous « Accueil · mobile », celles de la recherche et de la fiche bien sous « Biens vendus », et celles des avis et de l'agence sous « Contact ». Je les lis d'après leur contenu, pas d'après leur titre.
- [x] **« 600 propriétaires » ou « 600 biens gérés » ?** L'appel à l'action de l'article 3 disait « Plus de 600 propriétaires nous font déjà confiance ». → *Simon, 19/11/2026 : « 600 biens gérés ».* Corrigé dans `contenus/articles.json` : « Plus de 600 biens gérés par notre équipe. »
- [ ] **Consigne « ne pas toucher à `docs/` »** : le plan du lot 0 demande pourtant de créer ce fichier et de compléter la section « Commandes » de `CLAUDE.md`. Seules ces deux modifications ont été faites au lot 0 ; rien d'autre n'a changé dans `docs/`, `maquette/` et `contenus/` (hors correction « 600 biens gérés » demandée par Simon ensuite).
- [ ] **Champs qui manquent dans les données pour appliquer la spec** : pas de champs « location » (loyer, charges, dépôt de garantie…), pas de date de mise en ligne, pas de date ni de slug pour les articles. Ils sont prévus dans les schémas (facultatifs), sans modification des fichiers de `contenus/`.
- [ ] **Paramètre `?vue=carte`** : la maquette l'utilise pour la vue carte de la recherche, la spec ne le cite pas dans la liste des filtres de l'URL. Je l'ajouterai aux paramètres de l'URL (lot 4).
- [x] **Avis, Agence et Contact absents du menu principal** (brief §7) → résolu par la maquette : ils sont dans la barre utilitaire de l'en-tête (avec le barème), dans le menu mobile et dans le pied de page.
- [x] **Deux couleurs hors charte dans la maquette** : gris #3A3A3B (emplacements photo sur fond sombre) et noir #000000 (survol des boutons sombres et des liens). → *Proposition acceptée par Simon le 19/11/2026* : emplacements sur fond sombre en Obsessed Grey avec filet Medium Grey ; boutons sombres dont le texte passe en or au survol.
- [x] **« Plus de 600 propriétaires nous confient déjà leur bien »** (carte « Je fais louer ou gérer », planche Main) → écrit « Plus de 600 biens gérés par notre équipe » au lot 2, comme décidé pour l'article 3.
- [x] **Or foncé sur fond blanc dans la maquette** : numéros « 01 / 02 / 03 » des cartes d'aiguillage et étoiles des avis (#A19276 sur blanc, contraste insuffisant, interdit par la charte). → Affichés en Obsessed Grey.

## 5. Points ouverts au lot 1 (gabarit et composants)

- [ ] **Menu mobile** : non dessiné dans la maquette (seul le bouton l'est). Réalisé en plein écran, même style que l'en-tête : à valider sur `/styleguide` et sur téléphone. — Qui : Simon
- [ ] **Badge « Nouveau »** : non dessiné dans la maquette. Réalisé en blanc avec texte Obsessed Grey, à côté du badge « Exclusivité ». Durée proposée : 15 jours (`lib/biens.ts`). — Qui : Simon
- [ ] **Lien « Réseau CENTURY 21 » du pied de page** : adresse du site du réseau non fournie dans le dossier. Affiché « [lien à fournir] ». — Qui : Agence
- [ ] **Période des « biens en gestion »** : la maquette affiche « 600+ biens en gestion » sans période. Par prudence (un chiffre d'activité s'affiche avec sa période), la période est ajoutée comme pour les ventes et les locations, en attendant la réponse de l'agence. — Qui : Agence
- [ ] **Barre utilitaire** : « 32 cours Evrard de Fayolle, Bordeaux · Du lundi au vendredi », comme dans la maquette. À compléter si l'agence ouvre le samedi. — Qui : Agence

## 6. Points ouverts au lot 2 (accueil)

- [x] **Étoiles sur les emplacements d'avis** → *Simon, 19/11/2026 : afficher 5 étoiles.* À la connexion du flux Google, chaque carte affichera la note réelle de l'avis. — Lot : après V1
- [x] **« Agence Centurion depuis 2016 »** → *Simon, 19/11/2026 : sans « à confirmer ».* La mention « [années suivantes à confirmer, 2026 incluse] » a été retirée de la frise (`contenus/agence.json`). À garder en tête : la formule « depuis 2016 » suppose une distinction chaque année.
- [x] **Formulaire de rappel** → *Simon, 19/11/2026 : contrôle des champs et anti-spam réels, envoi simulé.* Le message de confirmation porte la mention « [Démonstration : aucun message n'est encore transmis à l'agence.] », à retirer au branchement de l'envoi réel.
- [x] **Adresses des articles** → *Simon, 19/11/2026 : tirées du titre court* (`/ressources/dpe-2026`, `/ressources/estimer-aux-chartrons`, `/ressources/gestion-locative`, `/ressources/vivre-aux-chartrons`). Modifiables au lot 8.
- [ ] **Adresses de réception des demandes** par pôle (transaction, location, gestion locative) : à fournir par l'agence, nécessaires pour brancher l'envoi réel (Resend). — Qui : Agence · Lot : 3 ou 9
- [ ] **Anti-spam en production** : la limite de 5 envois en 10 minutes par visiteur est gardée en mémoire du serveur. Suffisant pour la démonstration ; à renforcer à la mise en production (stockage partagé ou protection de l'outil d'envoi). — Qui : Simon · Lot : 11
- [ ] **Lien « Itinéraire »** (planche Accueil-mobile-2, bloc contact) : non réalisé, il dépend du fournisseur de carte à choisir. — Qui : Simon · Lot : 9
- [ ] **Temps de lecture des articles** : calculé à 230 mots par minute (résultat : 2 minutes pour les 4 articles). — Qui : Simon · Lot : 8
