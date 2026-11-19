import Link from "next/link";

/**
 * Boutons de la maquette : or (action principale), sombre, contour.
 * Couleurs de survol : uniquement celles de la charte (la maquette utilisait du noir).
 * - or : fond Relentless Gold → Dark Gold au survol, texte Obsessed Grey (jamais de texte or sur blanc).
 * - sombre : fond Obsessed Grey, texte blanc → or au survol (contraste 7:1).
 * - contour : filet Obsessed Grey, fond Light Grey au survol.
 * - contourClair : pour les fonds sombres.
 */

export type VarianteBouton = "or" | "sombre" | "contour" | "contourClair";
export type TailleBouton = "moyen" | "grand";

const VARIANTES: Record<VarianteBouton, string> = {
  or: "bg-gold text-grey-dark hover:bg-gold-dark",
  sombre: "bg-grey-dark text-white hover:text-gold",
  contour: "border border-grey-dark text-grey-dark hover:bg-grey-light",
  contourClair: "border border-white text-white hover:border-gold hover:text-gold",
};

const TAILLES: Record<TailleBouton, string> = {
  moyen: "min-h-12 px-[22px] text-[15px]",
  grand: "min-h-14 px-8 text-[15px]",
};

export function classesBouton(variante: VarianteBouton = "or", taille: TailleBouton = "moyen", pleineLargeur = false) {
  return [
    "inline-flex items-center justify-center gap-2.5 text-center font-display font-semibold uppercase tracking-[0.12em] no-underline transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTES[variante],
    TAILLES[taille],
    pleineLargeur ? "w-full" : "",
  ].join(" ");
}

type Commun = {
  variante?: VarianteBouton;
  taille?: TailleBouton;
  pleineLargeur?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Bouton qui mène à une page (lien). */
export function BoutonLien({
  href,
  variante,
  taille,
  pleineLargeur,
  className = "",
  children,
  ...reste
}: Commun & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={`${classesBouton(variante, taille, pleineLargeur)} ${className}`} {...reste}>
      {children}
    </Link>
  );
}

/** Bouton qui déclenche une action (formulaire, ouverture d'un panneau…). */
export function Bouton({
  variante,
  taille,
  pleineLargeur,
  className = "",
  children,
  type = "button",
  ...reste
}: Commun & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type={type} className={`${classesBouton(variante, taille, pleineLargeur)} ${className}`} {...reste}>
      {children}
    </button>
  );
}

/** Lien texte souligné avec flèche (« Voir tous nos biens → »). */
export function LienFleche({
  href,
  surFondSombre = false,
  children,
  className = "",
}: {
  href: string;
  surFondSombre?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const couleurs = surFondSombre
    ? "text-white border-gold hover:text-gold"
    : "font-bold text-grey-dark border-grey-dark hover:border-gold-dark";
  return (
    <Link
      href={href}
      className={`inline-block self-start border-b pb-0.5 text-base no-underline transition-colors ${couleurs} ${className}`}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
