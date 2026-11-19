import { getAnnonces } from "@/lib/data";
import { formaterSurface } from "@/lib/format/nombres";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Biens vendus : une annonce au statut « vendu » apparaît automatiquement (accueil, Vendre, Biens vendus).
 * Prix de vente jamais transmis à l'affichage (accord du vendeur requis, spec §5).
 * Sans vente fournie : emplacements étiquetés (proposition acceptée par Simon le 19/11/2026).
 */

export type Vente = { cle: string; quartier: string; secteur: string | null; type: string; delai: string; emplacement: boolean };

const TYPES: Record<Annonce["type"], string> = { maison: "Maison", appartement: "Appartement" };

function versVente(a: Annonce): Vente {
  return {
    cle: a.slug,
    quartier: a.quartierLibelle,
    secteur: a.secteur,
    emplacement: false,
    type: `${TYPES[a.type]} · ${formaterSurface(a.surfaceHabitable)}`,
    delai: a.delaiDeVenteJours === null ? "[—]" : String(a.delaiDeVenteJours),
  };
}

export function toutesLesVentes(): Vente[] {
  return getAnnonces()
    .filter((a) => a.statut === "vendu")
    .map(versVente);
}

export function emplacementsVentes(nombre: number): Vente[] {
  return Array.from({ length: nombre }, (_, i) => ({ cle: `vide-${i}`, quartier: "[Quartier]", secteur: null, type: "[Type · surface]", delai: "[—]", emplacement: true }));
}

/** Les `nombre` dernières ventes, ou autant d'emplacements s'il n'y en a aucune. */
export function dernieresVentes(nombre: number): Vente[] {
  const ventes = toutesLesVentes().slice(0, nombre);
  return ventes.length > 0 ? ventes : emplacementsVentes(nombre);
}
