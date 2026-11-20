# Questions ouvertes

Créé le 19/11/2026, avant le lot 0. Points à trancher, à demander à l'agence ou à vérifier.
Quand une réponse arrive : la noter sous la ligne, cocher la case, et retirer l'emplacement `[…]` correspondant dans le site.

Légende : **Qui** = qui doit répondre (Simon, Agence, Juriste). **Lot** = à quel moment de développement la réponse devient nécessaire.

## 1. Décisions de Simon

- [x] **Noms de l'équipe.** → *Simon, 19/11/2026 : ils sont tous déjà publiés avec leur photo sur le site actuel de l'agence (page « Notre équipe à votre service »). Les noms s'affichent.* Reste : récupérer les photos en haute définition auprès de l'agence (ou sur le site actuel, si l'agence le confirme), puis passer `accordPublication` à `true` dans `contenus/equipe.json`. — Lot : 7
  → *Simon, 20/11/2026 : photos reprises du site actuel de l'agence (20 sur 21, `accordPublication` passé à `true`).* Reste : versions en haute définition (les photos actuelles font 300 à 460 px de large) et portrait de Lucas Michelon. — Qui : Agence
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
- [x] **Photo de façade, carte « Propriétaires vendeurs »** (accueil), intégrée le 20/11/2026. → *Simon, 20/11/2026 : les images générées par IA sont acceptées par principe.*
- [ ] **Temps de lecture des articles** : calculé à 230 mots par minute (résultat : 2 minutes pour les 4 articles). — Qui : Simon · Lot : 8

## 7. Points ouverts au lot 3 (Vendre et estimation)

- [x] **Suggestions d'adresses** → *accord de Simon, 19/11/2026.* Base Adresse Nationale, via le service public de géocodage de la Géoplateforme (IGN), gratuit et sans clé. Les recherches passent par le site (`/api/adresses`) : l'adresse IP des visiteurs n'est pas transmise. Suggestions limitées à la Gironde. Reste à vérifier : limite de requêtes du service avant la mise en production. — Qui : Simon · Lot : 11
- [x] **FAQ vendeurs** → *Simon, 19/11/2026 : réserves entre crochets retirées, à relire avec l'agence.* Textes dans `contenus/faq.json`. Deux réponses ont été raccourcies, sans rien ajouter : « Combien coûte l'estimation ? » (la gratuité n'est pas affirmée) et « Combien de temps faut-il pour vendre ? » (pas de délai moyen). — Qui : Agence (relecture)
- [ ] **Résultat de l'estimation** : aucun chiffre affiché (spec §6). Il faut choisir la source des prix (DVF, base notariale, données de l'agence) et la méthode de calcul pour afficher une fourchette. — Qui : Simon + Agence
- [ ] **Conseiller référent sur l'écran de résultat** : table « secteur → conseiller » à fournir, et rattachement d'une adresse à un secteur (contours des 6 secteurs). En attendant : « [Prénom Nom] · secteur [selon l'adresse] ». — Qui : Agence
- [ ] **Deux envois par estimation** : la demande complète part à l'étape 5 (pour ne pas perdre le contact s'il quitte l'écran de résultat), puis le choix « être rappelé » ou « recevoir seulement mon estimation » part dans un second message. À confirmer avec l'agence quand l'envoi réel sera branché. — Qui : Agence
- [ ] **Encadrement des loyers** sur le résultat « faire louer / confier la gestion » : « [vérification à prévoir] » (sujet reporté par Simon). — Qui : Agence / Juriste
- [ ] **Choix pré-sélectionnés** du parcours (Appartement, Avant 1949, Bon état, Aucun stationnement, Vendre), repris de la maquette. Ils accélèrent la saisie mais peuvent être validés sans y penser : à garder ou à retirer ? — Qui : Simon
- [x] **Couleurs hors charte de la planche Vendre** : gris #DADBDC des emplacements de la méthode (remplacé par un filet Medium Grey) et numéros d'étapes en or foncé sur blanc (affichés en Obsessed Grey).

## 8. Points ouverts au lot 4 (biens, fiche, biens vendus, Acheter)

- [x] **Quartiers des annonces** → *Simon, 19/11/2026 : OK.* Rattachées dans `contenus/annonces.json` : 4 aux Chartrons, Palais Gallien, Croix de Seguey, Saint-Seurin, Bacalan (grand T4). Seules les annonces des 6 secteurs mènent à une page quartier.
- [x] **Vue carte** → *Simon, 19/11/2026 : OK.* Emplacement « carte · fournisseur à choisir », sans étiquettes de prix (coordonnées non fournies).
- [x] **Dates de mise en ligne** → *Simon, 19/11/2026 : dates FICTIVES sur les 30 derniers jours* (du 21/10 au 17/11/2026), pour le tri « Plus récents » et le badge « Nouveau ». À remplacer par les vraies dates. — Qui : Agence
- [x] **Descriptions des biens** → *Simon, 19/11/2026 : rédigées pour la démonstration*, à partir des seules caractéristiques connues (type, quartier, surface, pièces, atouts). À remplacer par les textes des conseillers. — Qui : Agence
- [x] **Nombre de chambres du grand T4** : 3 (repris de son titre « Grand T4, 3 chambres »).
- [ ] **Favoris** (cœur sur les cartes de la maquette) : non réalisés. Il faudrait garder la liste dans le navigateur du visiteur. À décider plus tard. — Qui : Simon
- [ ] **Vidéo, visite virtuelle, plan** : champs prévus (`video`, `visiteVirtuelle`, `plan`), vides pour l'instant. Comme le prévoit la spec, les onglets et blocs correspondants n'apparaissent que si le média est fourni. Format des fichiers à définir avec l'agence. — Qui : Agence
- [ ] **Caractéristiques non fournies** (année de construction, chauffage, taxe foncière) : présentes dans la maquette, absentes des données. Masquées. À ajouter au schéma si l'agence les fournit. — Qui : Agence
- [ ] **Référence des annonces** : « Réf. [—] » (champ `reference` prévu, vide). — Qui : Agence
- [ ] **Conseiller de chaque annonce** : bloc « [Prénom Nom] », bouton d'appel vers le standard de l'agence en attendant les lignes directes. — Qui : Agence
- [ ] **Seuils du filtre « Surface min. »** (30, 50, 75, 100, 150 m²) : choisis par défaut, la maquette n'en donnait pas. — Qui : Simon
- [ ] **Alerte e-mail** : demande transmise (simulée), rien n'est stocké. L'envoi automatique à chaque nouveau bien demande le back-office et l'outil d'e-mail (désinscription en un clic). — Qui : Simon · Après V1
- [ ] **Page « introuvable » d'un bien vendu ou supprimé** : elle s'affiche bien, marquée « noindex », mais avec le code 200 au lieu de 404 (fonctionnement de Next.js avec la préparation partielle des pages). Sans gravité pour Google. À revoir au lot 10 (page 404 complète, éventuelle redirection des biens vendus vers `/biens-vendus`). — Lot : 10
- [ ] **Étapes 5 et 6 de la page Acheter** : partenaires de financement et rôle exact de l'agence dans l'avant-contrat, à confirmer (« [Partenaires à confirmer] » conservé). — Qui : Agence

- [ ] **Mentions des 8 annonces reprises du site actuel (20/11/2026)** : DPE, GES, date du DPE, dépenses d'énergie, honoraires (tous à la charge du vendeur), copropriété, référence, conseiller et descriptions complètes. Classes DPE et GES lues sur les étiquettes du site actuel (cohérentes avec les valeurs). Restent à fournir : dépenses d'énergie de la maison Croix de Seguey et du T3 Saint-Seurin (absentes du site actuel aussi), statut de copropriété des 3 maisons, conseiller des 4 annonces sans mention « Bien proposé par ». — Qui : Agence
- [ ] **Mention des agents commerciaux** : reprise telle quelle du site actuel (« Bien proposé par … EI, agent commercial (RSAC …) »). Formulation à faire valider. — Qui : Juriste
- [ ] **Mention sous le prix quand les honoraires sont payés par le vendeur** : « Honoraires à la charge du vendeur » (le site actuel écrit « Honoraires charge vendeur »). — Qui : Agence

## 9. Points ouverts au lot 5 (Faire louer ou gérer)

- [x] **Réserves entre crochets** → *Simon, 19/11/2026 : retirées*, en gardant le texte existant. « Relevé de gérance », « Garantie des loyers impayés en option », étape 5 « Vous suivez vos loyers et vos dépenses. ». Première ligne de l'offre de mise en location reformulée sans parler de l'encadrement : « Estimation du loyer, plafonds applicables compris » (reprise de l'étape 1 du déroulé). Textes à relire avec l'agence. — Qui : Agence
- [x] **Deux questions de la FAQ bailleurs sans réponse** → *Simon, 19/11/2026 : masquées* jusqu'à la réponse de l'agence : « Puis-je confier un bien déjà loué ? » et « Que couvre la garantie des loyers impayés ? ». — Qui : Agence
- [ ] **Garantie des loyers impayés** : assureur, conditions d'éligibilité, plafonds et coût, à fournir. Nécessaire pour la question masquée et l'encart « Garanties ». — Qui : Agence
- [ ] **Relevé de gérance** : format et périodicité. — Qui : Agence
- [ ] **Réponse sur l'encadrement des loyers** (FAQ bailleurs) : phrase factuelle conservée (« prend fin le 24 novembre 2026, sauf adoption définitive de sa prolongation »). À mettre à jour selon le vote de la prolongation. — Qui : Agence / Juriste
- [x] **Section équipe** : fond blanc au lieu du Light Grey de la maquette, pour que les emplacements de portraits restent visibles (à revoir quand les vraies photos seront là).

## 10. Points ouverts au lot 6 (quartiers)

- [x] **Réserves des textes des Chartrons et des Bassins à flot** → *Simon, 19/11/2026 : retirées.* Éléments sans contenu masqués : pavé « Écoles » (les deux quartiers), « Commerces » des Bassins à flot, 5e point « En bref » des Bassins, questions « Combien de temps pour vendre aux Chartrons ? » et « Revendre un appartement acheté neuf ». Emplacements de chiffres conservés (prix au m², délai). Textes dans `contenus/quartiers.json`, à relire avec l'agence. — Qui : Agence
- [x] **Les 4 autres secteurs** → *Simon, 19/11/2026 :* pages créées sur le même gabarit ; En bref, ambiance, vie quotidienne et FAQ masqués jusqu'à réception des textes. — Qui : Agence (textes, photos)
- [ ] **Carte stylisée** : positions des 6 secteurs reprises de la maquette (en %, dans `contenus/quartiers.json`), approximatives, à valider par l'agence (allée Haussmann et Parc Rivière en particulier). — Qui : Agence
- [ ] **Marché immobilier** : la maquette distingue le prix au m² des appartements et des maisons, l'évolution sur 12 mois et le délai moyen de vente. Les données ne prévoient qu'un prix moyen par secteur : le modèle sera complété quand la source (DVF, base notariale, agence) sera choisie. — Qui : Simon + Agence
- [ ] **Auteur et date de mise à jour** des pages quartier (champs `auteur`, `dateMiseAJour`) : à fournir. — Qui : Agence
- [ ] **Conseiller référent de chaque secteur** (avec sa présentation à la première personne) : à fournir. — Qui : Agence
- [ ] **Préposition des 4 secteurs sans texte** : « dans le secteur Parc Rivière », faute de mieux (« au Jardin Public », « à Fondaudège » ?). Champ `prep` à compléter. — Qui : Agence
- [x] **Défaut corrigé** : sur téléphone, le champ « Adresse de votre bien » des blocs d'estimation (Vendre, Biens vendus, fiche bien, Acheter, Faire louer ou gérer, quartiers) était démesuré.

## 11. Points ouverts au lot 7 (équipe et fiche conseiller)

- [x] **Blocs vides des fiches** → *Simon, 19/11/2026 : masqués* (présentation, spécialité, chiffres, biens en vente, dernières ventes) ; ils apparaissent dès que les données sont saisies dans `contenus/equipe.json` (présentation, spécialité, secteurs) et `contenus/annonces.json` (champ `conseiller`). Cartes de la page Équipe : spécialité et quartiers seulement s'ils sont connus. Emplacements d'avis gardés pour les pôles transaction, location et gestion.
- [ ] **Pour chaque membre** : portrait (avec accord écrit), présentation à la première personne, spécialité, secteurs, ligne directe, e-mail. — Qui : Agence
- [ ] **Chiffres par conseiller** (biens vendus sur une période, avis le mentionnant) : la maquette les prévoit ; à fournir ou à calculer par le back-office. — Qui : Agence · Après V1
- [ ] **Prise de rendez-vous** : créneaux d'exemple (lun.–ven., 9h30–17h00, repris de la maquette), sans réservation réelle ; la demande est transmise (simulée) et l'agence rappelle pour confirmer. Outil d'agenda à choisir. — Qui : Simon + Agence
- [ ] **Photo de l'équipe devant l'agence** (haut de la page Équipe). — Qui : Agence
- [x] **Défaut corrigé (tous les formulaires)** : après une erreur (champ manquant), la case de consentement se décochait et le visiteur devait la recocher. Elle reste désormais cochée.

## 12. Points ouverts au lot 8 (ressources et articles)

- [x] **Réserves des 4 articles** → *Simon, 19/11/2026 : retirées* ; éléments sans contenu masqués : question « Puis-je confier la gestion d'un bien déjà loué ? », paragraphe « Écoles, crèches et équipements », encart « Ce que recherchent les acheteurs aux Chartrons », phrase sur la part de logements chauffés à l'électricité (chiffre manquant). Emplacements conservés : auteurs non confirmés et date de la note Qualitelis (règles absolues). Relecture de l'agence obligatoire. — Qui : Agence
- [x] **« Relu par l'agence »** (sous le titre des articles dans la maquette) : non affiché tant que la relecture n'a pas eu lieu. À ajouter après relecture.
- [x] **Temps de lecture** : 200 mots par minute, comme la maquette (3 min pour l'article DPE, 2 min pour les autres).
- [x] **Note Qualitelis sans date** dans le « En bref » de l'article 3 : complétée par « [date à fournir] ». Un test vérifie désormais qu'aucune note n'apparaît sans date dans les textes.
- [ ] **Points juridiques des articles, réserves retirées à la demande de Simon** : gel des loyers des logements F et G (cas concernés), phrase « À Bordeaux, l'encadrement des loyers s'ajoute à ces règles » (à revoir après le 24/11/2026), attestation DPE mise à jour sur le site de l'ADEME. À faire valider par l'agence ou son juriste avant mise en ligne. — Qui : Agence / Juriste
- [ ] **Auteurs des articles 1, 3 et 4**, date de mise à jour de chaque article, visuels. — Qui : Agence
- [ ] **Lettre des propriétaires** : outil d'envoi, fréquence, durée de conservation des adresses. Inscription simulée, rien n'est stocké. — Qui : Simon + Agence
- [ ] **Appel à l'action de l'article DPE** : le bouton « Prendre rendez-vous » mène à la page Faire louer ou gérer (lien de la maquette). Il pourra mener à la page Contact (lot 9). — Qui : Simon

## 13. Points ouverts au lot 9 (avis, agence, contact, pages légales)

- [x] **Blocs sans contenu masqués** → *Simon, 19/11/2026* : « Mot des dirigeants » (page L'agence), bouton « Laisser un avis Google » (remplacé par « Nous contacter » dans le bloc final de la page Avis), détails d'accès « Venir à l'agence » (tram, bus, stationnement, accessibilité ; l'adresse et l'emplacement de carte restent). Réserves retirées : délai de réponse (Contact), années et critères de la distinction Centurion.
- [ ] **Encart « D'où viennent ces avis ? »** (obligation d'information sur les avis en ligne, Code de la consommation) : emplacements conservés, texte à fournir par l'agence. Qualitelis : organisme indépendant [à confirmer]. — Qui : Agence / Juriste
- [ ] **Pages légales** (`/mentions-legales`, `/confidentialite`, `/cookies`, `/honoraires`) : plans et emplacements uniquement. À fournir : forme juridique, RCS, TVA, directeur de la publication, hébergeur de production, finalités et durées de conservation des données, droits, barème d'honoraires. — Qui : Agence / Juriste · bloquant pour la mise en production
- [x] **Cookies — état technique vérifié le 19/11/2026** : après visite des pages principales et envoi d'un formulaire, aucun cookie n'est déposé et aucun traceur n'est chargé. Aucun bandeau de consentement n'est donc nécessaire à ce jour. À revoir si un outil de mesure d'audience est ajouté (CLAUDE.md, règle 7).
- [ ] **Mot de Dominique et Myriam Rollin**, photos de la façade et de l'équipe, visuel officiel Centurion. — Qui : Agence
- [ ] **Lien « Laisser un avis Google »** (fiche Google de l'agence) et lien « Réseau CENTURY 21 » du pied de page. — Qui : Agence
- [ ] **Accès à l'agence** : station de tram, lignes de bus, stationnement, accessibilité. — Qui : Agence
- [ ] **Appel à l'action de l'article DPE** : peut désormais mener à `/contact#rendez-vous` plutôt qu'à la page Faire louer ou gérer. À décider. — Qui : Simon

## 14. Points ouverts au lot 10 (référencement, accessibilité, performance)

- [x] **Domaine de production** → *Simon, 19/11/2026 :* `https://www.century21-cabinet-rollin-bordeaux.com` (domaine du site actuel), réglable par la variable `NEXT_PUBLIC_SITE_URL` (`lib/seo.ts`).
- [x] **Outils de contrôle** → *accord de Simon, 19/11/2026 :* axe-core (`@axe-core/playwright`, outil de développement, ajouté aux tests) et Lighthouse (lancé ponctuellement, non ajouté au projet).
- [x] **Résultats Lighthouse sur téléphone (19/11/2026)** : performance 95 à 100, accessibilité 100, bonnes pratiques 100 ; référencement 66 en démonstration (pages volontairement bloquées) et 100 avec `SITE_INDEXABLE=oui`.
- [x] **Accessibilité** : 20 pages × 2 formats sans erreur axe (WCAG 2.1 A et AA) ; corrections : nom du logo et des vignettes de la galerie, barre de progression de l'estimation dans l'en-tête. Parcours testés au clavier : lien d'évitement, focus visible, menu, estimation complète, menu mobile.
- [ ] **Mise en production : activer le référencement** en définissant `SITE_INDEXABLE=oui` (robots.txt, balises robots). À ne faire qu'après le traitement des éléments bloquants (pages légales, mentions des annonces…). — Qui : Simon · Lot : après 11
- [ ] **Note Google dans les données structurées** : non déclarée (date non fournie ; Google ignore les étoiles qu'une entreprise déclare sur son propre site). À revoir avec le flux d'avis. — Qui : Simon
- [ ] **Horaires dans les données structurées** : non déclarés tant que le vendredi matin et le samedi ne sont pas confirmés. — Qui : Agence
- [ ] **Icône du site (favicon)** : icône provisoire neutre (carré Obsessed Grey, filet or, sans lettres), en attendant l'icône officielle du réseau. — Qui : Agence
- [ ] **Image d'aperçu de partage** (réseaux sociaux, messageries) : aucune pour l'instant, faute de photo et de logo. — Qui : Agence
- [ ] **Audit au lecteur d'écran** (VoiceOver) par une personne : les tests automatiques et clavier ne remplacent pas un essai réel. À faire avant la mise en production. — Qui : Simon

## 15. Lot 11 (mise en ligne de démonstration)

- [x] **Démonstration en ligne** (20/11/2026) : https://century21-rollin-sjc3.vercel.app — projet Vercel relié au dépôt GitHub (mise à jour automatique à chaque envoi sur `main`). Vérifié : pages, page 404, `robots.txt` et balises « ne pas référencer », en-têtes de sécurité, suggestions d'adresses ; 151 tests de parcours au vert sur le site en ligne ; Lighthouse mobile 100 / 100 / 100 (référencement volontairement bloqué), affichage principal en 1 s.
- [ ] **Dépôt GitHub encore public** (vérifié le 20/11/2026) : le brief, les notes internes, la maquette et la charte CENTURY 21 sont lisibles par tous. À passer en privé (*Settings* → *Danger Zone* → *Change visibility*). — Qui : Simon · urgent
- [ ] **Plan Vercel** : la démonstration tourne sur le plan gratuit (Hobby), réservé aux usages non commerciaux. Acceptable pour une présentation ponctuelle ; à revoir pour la production (Vercel Pro ou Clever Cloud). — Qui : Simon
- [ ] **Diffusion de l'adresse** : sans mot de passe (option payante), toute personne qui a l'adresse peut voir le site. À ne transmettre qu'à l'agence. — Qui : Simon
