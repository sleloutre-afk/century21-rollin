import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { getAnnonces } from "@/lib/data";
import { formaterSurface } from "@/lib/format/nombres";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Carte « Vendu » (accueil, Vendre, quartiers…). Prix de vente jamais affiché (accord du vendeur requis, spec §5).
 * Sans vente fournie : cartes vides étiquetées (proposition acceptée par Simon le 19/11/2026).
 */

export type Vente = { cle: string; quartier: string; type: string; delai: string };

const TYPES: Record<Annonce["type"], string> = { maison: "Maison", appartement: "Appartement" };

function versVente(a: Annonce): Vente {
  return {
    cle: a.slug,
    quartier: a.quartierLibelle,
    type: `${TYPES[a.type]} · ${formaterSurface(a.surfaceHabitable)}`,
    delai: a.delaiDeVenteJours === null ? "[—]" : String(a.delaiDeVenteJours),
  };
}

/** Les `nombre` dernières ventes, ou autant d'emplacements s'il n'y en a aucune. */
export function dernieresVentes(nombre: number): Vente[] {
  const vendus = getAnnonces()
    .filter((a) => a.statut === "vendu")
    .slice(0, nombre)
    .map(versVente);
  if (vendus.length > 0) return vendus;
  return Array.from({ length: nombre }, (_, i) => ({ cle: `vide-${i}`, quartier: "[Quartier]", type: "[Type · surface]", delai: "[—]" }));
}

export function CarteVendu({ vente, hauteur = "h-[200px] md:h-[300px]", compacte = false }: { vente: Vente; hauteur?: string; compacte?: boolean }) {
  return (
    <article className="group flex flex-col gap-3 md:gap-4">
      <EmplacementPhoto libelle="Photo du bien vendu" surFondSombre className={hauteur}>
        <Badge variante="vendu" className="absolute left-3 top-3 md:left-4 md:top-4" />
      </EmplacementPhoto>
      <div className="flex flex-col gap-1.5">
        <span className="font-display text-[13px] uppercase tracking-[0.16em] text-gold md:text-sm md:tracking-[0.18em]">{vente.quartier}</span>
        {compacte ? (
          <span className="text-[15px] text-grey-light md:text-base">
            {vente.type} · vendu en {vente.delai} jours
          </span>
        ) : (
          <>
            <span className="text-[17px]">{vente.type}</span>
            <span className="text-[15px] text-grey-light">Vendu en {vente.delai} jours</span>
          </>
        )}
      </div>
    </article>
  );
}
