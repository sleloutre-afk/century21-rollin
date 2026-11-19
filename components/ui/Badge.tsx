/**
 * Étiquettes posées sur les photos et les cartes.
 * - exclusivite / pole : fond Obsessed Grey, texte or (contraste 7:1).
 * - nouveau : fond blanc, texte Obsessed Grey (non dessiné dans la maquette : style le plus sobre).
 * - vendu / categorie : fond or, texte Obsessed Grey.
 */

export type VarianteBadge = "exclusivite" | "nouveau" | "compromis" | "vendu" | "categorie" | "pole";

const VARIANTES: Record<VarianteBadge, string> = {
  exclusivite: "bg-grey-dark text-gold px-3 py-[7px] text-[13px] tracking-[0.18em]",
  nouveau: "bg-white text-grey-dark px-3 py-[7px] text-[13px] tracking-[0.18em]",
  compromis: "bg-white text-grey-dark px-3 py-[7px] text-[13px] tracking-[0.18em]",
  vendu: "bg-gold text-grey-dark px-3.5 py-2 text-sm font-semibold tracking-[0.22em]",
  categorie: "bg-gold text-grey-dark px-2.5 py-[5px] text-[13px] font-semibold tracking-[0.16em]",
  pole: "bg-grey-dark text-gold px-2.5 py-[5px] text-xs tracking-[0.16em]",
};

const LIBELLES: Partial<Record<VarianteBadge, string>> = {
  exclusivite: "Exclusivité",
  nouveau: "Nouveau",
  compromis: "Sous compromis",
  vendu: "Vendu",
};

export function Badge({ variante, children, className = "" }: { variante: VarianteBadge; children?: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block font-display uppercase leading-tight ${VARIANTES[variante]} ${className}`}>
      {children ?? LIBELLES[variante]}
    </span>
  );
}
