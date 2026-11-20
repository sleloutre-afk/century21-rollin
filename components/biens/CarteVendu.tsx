import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import type { Vente } from "@/lib/biens/ventes";

/**
 * Carte « Vendu » (accueil, Vendre, Biens vendus…). Affichage seul : les données viennent de lib/biens/ventes.ts.
 * Sur fond sombre, le quartier est en or ; sur fond clair, en Obsessed Grey (jamais de texte or sur blanc).
 */
export function CarteVendu({
  vente,
  hauteur = "h-[200px] md:h-[300px]",
  compacte = false,
  surFondSombre = true,
  niveauTitre,
}: {
  vente: Vente;
  hauteur?: string;
  compacte?: boolean;
  surFondSombre?: boolean;
  /** Sur la page Biens vendus, le type du bien est un titre (h2). */
  niveauTitre?: 2;
}) {
  const discret = surFondSombre ? "text-grey-light" : "";
  const TitreType = niveauTitre ? "h2" : "span";
  return (
    <article className="group flex flex-col gap-3 md:gap-4">
      {vente.photo ? (
        <div className={`relative overflow-hidden bg-grey-medium ${hauteur}`}>
          <Image
            src={vente.photo.src}
            alt={vente.photo.alt}
            fill
            sizes="(min-width: 768px) 25vw, 240px"
            className="object-cover transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045]"
          />
          <Badge variante="vendu" className="absolute left-3 top-3 md:left-4 md:top-4" />
        </div>
      ) : (
        <EmplacementPhoto libelle="Photo du bien vendu" surFondSombre={surFondSombre} className={hauteur}>
          <Badge variante="vendu" className="absolute left-3 top-3 md:left-4 md:top-4" />
        </EmplacementPhoto>
      )}
      <div className="flex flex-col gap-1.5">
        <span className={`font-display text-[13px] uppercase tracking-[0.16em] md:text-sm md:tracking-[0.18em] ${surFondSombre ? "text-gold" : ""}`}>
          {vente.quartier}
        </span>
        {compacte ? (
          <span className={`text-[15px] md:text-base ${discret}`}>
            {vente.type}
            {vente.delai && ` · vendu en ${vente.delai} jours`}
          </span>
        ) : (
          <>
            <TitreType className="m-0 font-sans text-[17px] font-normal normal-case">{vente.type}</TitreType>
            {vente.delai && <span className={`text-[15px] ${discret}`}>Vendu en {vente.delai} jours</span>}
          </>
        )}
      </div>
    </article>
  );
}
