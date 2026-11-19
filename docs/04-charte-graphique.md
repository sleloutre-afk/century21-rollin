# Charte graphique — extrait pour le développement

Source : charte mondiale CENTURY 21 « Masterbrand Guidelines » du 29/06/2018 (`docs/charte/`). Une déclinaison CENTURY 21 France a été demandée à l'agence : si elle arrive, elle prime.

## Couleurs (exclusivement)

| Jeton | Nom charte | Hex | Rôle |
|---|---|---|---|
| `gold` | Relentless Gold | `#BEAF87` | Primaire : aplats, boutons principaux, filets |
| `grey-dark` | Obsessed Grey | `#252526` | Primaire : texte courant, fonds sombres |
| `gold-dark` | Dark Gold | `#A19276` | Secondaire : survol des boutons or, filets, focus |
| `grey-medium` | Medium Grey | `#808285` | Secondaire : textes secondaires sur fond sombre, filets |
| `grey-light` | Light Grey | `#E6E7E8` | Secondaire : fonds de section, emplacements photo |
| `white` | Blanc | `#FFFFFF` | Fond principal |

Seule exception : les couleurs réglementaires des étiquettes DPE et GES (reprises dans `maquette/planches/FicheDesktop.dc.html`).

## Contrastes

- **Jamais de texte or sur fond blanc** (#BEAF87 sur blanc ≈ 2,2:1 ; #A19276 sur blanc ≈ 3,05:1 : insuffisant pour du texte courant).
- L'or s'emploie en aplat, en filet, ou en texte sur fond Obsessed Grey.
- Texte des boutons or : Obsessed Grey.
- Texte courant : Obsessed Grey sur blanc ou Light Grey.
- Vérifier tout autre couple de couleurs avant usage (outil de contraste, seuil 4,5:1 pour le texte courant, 3:1 pour le texte large).

## Typographies

| Usage | Charte | Dans le site (en attendant les licences) |
|---|---|---|
| Titres | Typold (Extended pour titres courts, Condensed pour titres longs) | Barlow Semi Condensed 500/600 |
| Texte courant | Oakes (Arial est l'alternative autorisée) | Arial |
| Chiffres, accroches, mentions légales | Barlow Semi Condensed | Barlow Semi Condensed 400/500 |

Aucune police à empattements. Typold et Oakes : à intégrer uniquement si l'agence fournit les fichiers sous licence web.

## Logo

- Utiliser exclusivement le fichier officiel (bloc « CENTURY 21. » avec le nom de l'agence dessous). **Fichier SVG à fournir par l'agence.**
- En attendant : bloc typographique provisoire, identique à la maquette, clairement remplaçable (un seul composant `Logo`).
- Ne jamais recomposer, déformer ou recolorer le logo.

## Style

Magazine immobilier haut de gamme : photos grand format, grille parfois asymétrique, beaucoup d'espace blanc, typographie généreuse, pas d'ornements. Photos des biens héroïnes. Zoom doux au survol des photos. Apparitions au défilement et compteurs sobres, coupés si `prefers-reduced-motion`.
