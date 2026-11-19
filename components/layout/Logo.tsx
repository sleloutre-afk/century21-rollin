import Link from "next/link";

/**
 * Logo PROVISOIRE : bloc typographique repris de la maquette.
 * À remplacer par le fichier SVG officiel fourni par le réseau (docs/04-charte-graphique.md).
 * C'est le seul endroit à modifier : tout le site utilise ce composant.
 * À VALIDER : libellé exact du bloc logo à confirmer par l'agence.
 */

type Props = {
  taille?: "normal" | "compact" | "pied";
  surFondSombre?: boolean;
  /** Le logo est un lien vers l'accueil (en-tête) ou un simple bloc (pied de page). */
  lien?: boolean;
};

const TAILLES = {
  normal: { marque: "text-2xl", agence: "text-xs", gap: "gap-[3px]" },
  compact: { marque: "text-[19px]", agence: "text-[11px]", gap: "gap-[2px]" },
  pied: { marque: "text-[26px]", agence: "text-[15px]", gap: "gap-1.5" },
} as const;

export function Logo({ taille = "normal", surFondSombre = false, lien = true }: Props) {
  const t = TAILLES[taille];
  const couleur = surFondSombre ? "text-white" : "text-grey-dark";
  const contenu = (
    <>
      <span className={`font-display font-semibold leading-none tracking-[0.07em] ${t.marque}`}>CENTURY 21.</span>
      <span className={`leading-none tracking-[0.02em] ${t.agence}`}>Cabinet Rollin · Les Chartrons</span>
    </>
  );

  if (!lien) {
    return <span className={`flex flex-col ${t.gap} ${couleur}`}>{contenu}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="Cabinet Rollin – CENTURY 21 Les Chartrons, accueil"
      className={`flex flex-none flex-col no-underline transition-all duration-300 ${t.gap} ${couleur}`}
    >
      {contenu}
    </Link>
  );
}
