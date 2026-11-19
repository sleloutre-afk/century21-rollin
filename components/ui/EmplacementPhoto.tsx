/**
 * Emplacement gris étiqueté, en attendant les vraies photos (CLAUDE.md, règle 3 : aucune photo inventée).
 * Placé dans un élément `group`, il zoome doucement au survol (désactivé si prefers-reduced-motion).
 * Sur fond sombre : Obsessed Grey + filet Medium Grey (la maquette utilisait un gris hors charte, #3A3A3B).
 */

type Props = {
  libelle: string;
  surFondSombre?: boolean;
  /** Position de l'étiquette dans l'emplacement. */
  etiquette?: "bas-gauche" | "haut-droite";
  className?: string;
  children?: React.ReactNode;
};

export function EmplacementPhoto({ libelle, surFondSombre = false, etiquette = "bas-gauche", className = "", children }: Props) {
  const fond = surFondSombre ? "bg-grey-dark border border-grey-medium text-grey-light" : "bg-grey-light text-grey-dark";
  const position = etiquette === "bas-gauche" ? "items-end justify-start" : "items-start justify-end";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        role="img"
        aria-label={`Emplacement photo : ${libelle}`}
        className={`absolute inset-0 flex p-4 transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045] ${position} ${fond}`}
      >
        <span className="font-display text-xs uppercase tracking-[0.16em] md:text-[13px]">{libelle}</span>
      </div>
      {children}
    </div>
  );
}
