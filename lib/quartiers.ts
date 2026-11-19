import type { Secteur } from "@/lib/schemas/quartier";

/**
 * Textes partagés par les pages des quartiers (accueil, /quartiers, /quartiers/[slug]).
 * Un prix au m² ne s'affiche jamais sans sa source datée.
 */
export function prixAuM2(s: Pick<Secteur, "prixMoyenM2" | "sourcePrix">, court = false): string {
  if (s.prixMoyenM2 === null || s.sourcePrix === null) return court ? "Prix au m² : [à venir]" : "Prix moyen au m² : [donnée à venir]";
  const montant = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(s.prixMoyenM2);
  return `Prix moyen au m² : ${montant} (${s.sourcePrix})`;
}

/** « aux Chartrons », ou « dans le secteur Parc Rivière » si la préposition n'est pas fournie. */
export function dansLeQuartier(s: Pick<Secteur, "prep" | "nom">): string {
  return s.prep ?? `dans le secteur ${s.nom}`;
}
