import { getAnnonces, getVentesPubliees } from "@/lib/data";
import { formaterSurface } from "@/lib/format/nombres";
import type { Annonce } from "@/lib/schemas/annonce";
import type { VentePubliee } from "@/lib/schemas/vente";

/**
 * Biens vendus (accueil, Vendre, Biens vendus) : annonces au statut « vendu », puis biens vendus publiés
 * (contenus/ventes.json : photo, type et code postal seulement ; délai inconnu = ligne masquée).
 * Prix de vente jamais transmis à l'affichage (accord du vendeur requis, spec §5).
 * Sans vente fournie : emplacements étiquetés (proposition acceptée par Simon le 19/11/2026).
 */

export type Vente = {
  cle: string;
  quartier: string;
  secteur: string | null;
  type: string;
  /** Délai de vente en jours ; null = inconnu, la ligne est masquée. */
  delai: string | null;
  photo: { src: string; alt: string } | null;
  emplacement: boolean;
};

const TYPES: Record<Annonce["type"], string> = { maison: "Maison", appartement: "Appartement" };

function versVente(a: Annonce): Vente {
  return {
    cle: a.slug,
    quartier: a.quartierLibelle,
    secteur: a.secteur,
    emplacement: false,
    type: `${TYPES[a.type]} · ${formaterSurface(a.surfaceHabitable)}`,
    delai: a.delaiDeVenteJours === null ? null : String(a.delaiDeVenteJours),
    photo: a.photos[0] ?? null,
  };
}

function depuisVentePubliee(v: VentePubliee): Vente {
  return {
    cle: `vente-${v.reference}`,
    quartier: `${v.ville} · ${v.codePostal}`,
    secteur: null,
    emplacement: false,
    type: TYPES[v.type],
    delai: null,
    photo: v.photo,
  };
}

export function toutesLesVentes(): Vente[] {
  return getAnnonces()
    .filter((a) => a.statut === "vendu")
    .map(versVente)
    .concat(getVentesPubliees().map(depuisVentePubliee));
}

export function emplacementsVentes(nombre: number): Vente[] {
  return Array.from({ length: nombre }, (_, i) => ({ cle: `vide-${i}`, quartier: "[Quartier]", secteur: null, type: "[Type · surface]", delai: "[—]", photo: null, emplacement: true }));
}

/** Les `nombre` dernières ventes, ou autant d'emplacements s'il n'y en a aucune. */
export function dernieresVentes(nombre: number): Vente[] {
  const ventes = toutesLesVentes().slice(0, nombre);
  return ventes.length > 0 ? ventes : emplacementsVentes(nombre);
}
