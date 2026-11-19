import brut from "@/contenus/quartiers.json";
import type { Localisation } from "@/lib/schemas/communs";
import { fichierQuartiersSchema, type Secteur } from "@/lib/schemas/quartier";
import { valider } from "./valider";

let cache: Secteur[] | undefined;

/** Les 6 secteurs de vente, qui ont chacun une page /quartiers/[slug]. */
export function getSecteurs(): Secteur[] {
  cache ??= valider(fichierQuartiersSchema, brut, "quartiers.json").secteurs;
  return cache;
}

export function getSecteur(slug: string): Secteur | undefined {
  return getSecteurs().find((s) => s.slug === slug);
}

/**
 * Quartiers sans page dédiée, ajoutés par Simon le 19/11/2026 pour localiser
 * les annonces situées hors des 6 secteurs. À déplacer dans contenus/ à terme.
 */
const LOCALISATIONS_SANS_PAGE: { id: Localisation; nom: string }[] = [
  { id: "palais-gallien", nom: "Palais Gallien" },
  { id: "croix-de-seguey", nom: "Croix de Seguey" },
  { id: "saint-seurin", nom: "Saint-Seurin" },
  { id: "bacalan", nom: "Bacalan" },
  { id: "autre", nom: "Autre" },
];

/** Toutes les valeurs du filtre « quartier » : les 6 secteurs puis les autres quartiers. */
export function getLocalisations(): { id: Localisation; nom: string; aUnePage: boolean }[] {
  return [
    ...getSecteurs().map((s) => ({ id: s.slug, nom: s.nom, aUnePage: true })),
    ...LOCALISATIONS_SANS_PAGE.map((l) => ({ ...l, aUnePage: false })),
  ];
}
