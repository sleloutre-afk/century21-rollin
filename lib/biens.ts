import type { Annonce } from "@/lib/schemas/annonce";
import { formaterPrix, formaterSurface } from "@/lib/format/nombres";

/**
 * Règles d'affichage des annonces, partagées par les cartes, la recherche et les fiches.
 */

/** À VALIDER : durée pendant laquelle une annonce porte le badge « Nouveau » (proposition : 15 jours). */
export const DUREE_BADGE_NOUVEAU_JOURS = 15;

/**
 * Le badge « Nouveau » dépend de la date du jour : la page appelante la fournit
 * (aucune lecture de l'horloge dans les composants, pour garder des pages statiques).
 */
export function estNouveau(annonce: Pick<Annonce, "dateMiseEnLigne">, maintenant: Date): boolean {
  if (!annonce.dateMiseEnLigne) return false;
  const miseEnLigne = new Date(`${annonce.dateMiseEnLigne}T00:00:00`);
  const ecartJours = (maintenant.getTime() - miseEnLigne.getTime()) / 86_400_000;
  return ecartJours >= 0 && ecartJours < DUREE_BADGE_NOUVEAU_JOURS;
}

/** « 189 m² · 8 pièces · Pierre de taille, 3 niveaux, terrasse, box » */
export function resumeBien(annonce: Pick<Annonce, "surfaceHabitable" | "pieces" | "atouts">): string {
  const pieces = `${annonce.pieces} pièce${annonce.pieces > 1 ? "s" : ""}`;
  const atouts = annonce.atouts.map((a, i) => (i === 0 ? a : a.charAt(0).toLowerCase() + a.slice(1))).join(", ");
  return [formaterSurface(annonce.surfaceHabitable), pieces, atouts].filter(Boolean).join(" · ");
}

/** Prix affiché sur la carte : prix honoraires inclus (vente) ou loyer charges comprises (location). */
export function prixAffiche(annonce: Pick<Annonce, "transaction" | "prixHonorairesInclus" | "location">): string {
  if (annonce.transaction === "location") {
    const loyer = annonce.location?.loyerChargesComprises ?? null;
    return loyer === null ? "[loyer à fournir]" : `${formaterPrix(loyer)} / mois`;
  }
  return formaterPrix(annonce.prixHonorairesInclus);
}

/**
 * Mention sous le prix (mentions obligatoires, brief §10).
 * À VALIDER : formulation exacte à faire valider par l'agence ou son juriste.
 */
export function mentionPrix(annonce: Pick<Annonce, "transaction" | "partHonorairesAcquereurPct">): string {
  if (annonce.transaction === "location") return "Charges comprises";
  const pct = annonce.partHonorairesAcquereurPct;
  if (pct === null) return "Honoraires inclus · part acquéreur [à préciser]";
  if (pct === 0) return "Honoraires inclus · à la charge du vendeur";
  const pctTexte = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(pct);
  return `Honoraires inclus · ${pctTexte} % à la charge de l'acquéreur`;
}

/** « DPE D · GES B », avec « [–] » pour une classe non fournie. */
export function etiquetteEnergie(annonce: Pick<Annonce, "dpe" | "ges">): string {
  return `DPE ${annonce.dpe.classe ?? "[–]"} · GES ${annonce.ges.classe ?? "[–]"}`;
}
