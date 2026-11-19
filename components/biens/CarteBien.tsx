import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { etiquetteEnergie, mentionPrix, prixAffiche, resumeBien } from "@/lib/biens";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Carte d'annonce (maquette : Main, « Nos coups de cœur »). Mêmes champs pour toutes les annonces.
 * - format « grande » : carte vedette (photo 480 px, titre plus grand) ;
 * - format « standard » : photo 300 px.
 * Le badge « Nouveau » est calculé par la page appelante (voir lib/biens.ts).
 */

type Props = {
  annonce: Annonce;
  format?: "grande" | "standard";
  nouveau?: boolean;
  /** Niveau du titre de la carte dans la page. */
  niveauTitre?: 2 | 3;
};

export function CarteBien({ annonce, format = "standard", nouveau = false, niveauTitre = 3 }: Props) {
  const Titre = niveauTitre === 2 ? "h2" : "h3";
  const grande = format === "grande";
  return (
    <Link href={`/biens/${annonce.slug}`} className="group flex flex-col text-grey-dark no-underline">
      {/* Aucune photo fournie pour l'instant : emplacement étiqueté. Les vraies photos
          (annonce.photos) seront affichées avec next/image au lot 4. */}
      <EmplacementPhoto
        libelle={`Photo · ${annonce.titre}`}
        className={grande ? "h-[250px] md:h-[480px]" : "h-[250px] md:h-[300px]"}
      >
        <div className="absolute left-3.5 top-3.5 flex gap-2 md:left-[18px] md:top-[18px]">
          {annonce.exclusivite && <Badge variante="exclusivite" />}
          {nouveau && <Badge variante="nouveau" />}
        </div>
      </EmplacementPhoto>
      <div className="flex flex-col gap-1.5 pt-4 md:gap-2 md:pt-5">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <span className="font-display text-[13px] uppercase tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
            {annonce.quartierLibelle}
          </span>
          <span className="flex-none border border-grey-medium px-2 py-[3px] text-[11px] md:text-xs">{etiquetteEnergie(annonce)}</span>
        </div>
        <Titre className={`m-0 font-medium leading-[1.05] ${grande ? "text-2xl md:text-[32px]" : "text-2xl md:text-[26px]"}`}>
          {annonce.titre}
        </Titre>
        <p className="m-0 text-[15px] md:text-base">{resumeBien(annonce)}</p>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-grey-light pt-2.5 md:pt-3">
          <span className={`font-display font-semibold ${grande ? "text-[26px] md:text-[32px]" : "text-[26px] md:text-[28px]"}`}>
            {prixAffiche(annonce)}
          </span>
          <span className="text-right text-[11px] md:text-xs">{mentionPrix(annonce)}</span>
        </div>
      </div>
    </Link>
  );
}
