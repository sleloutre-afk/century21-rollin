import type { Avis } from "@/lib/schemas/avis";

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 2026-10 » → « octobre 2026 » ; « 2026 » → « 2026 ». */
export function dateAvis(date: string): string {
  const [annee, mois] = date.split("-");
  return mois ? `${MOIS[Number(mois) - 1]} ${annee}` : annee;
}

/**
 * Carte d'un avis client (accueil, Avis, Vendre, Faire louer ou gérer, fiche conseiller).
 * Note sur 5 : étoiles ; note sur 10 (Qualitelis) : chiffre. Source et date toujours affichées.
 */
export function CarteAvis({
  avis,
  bordure = false,
  masqueMobile = false,
  className = "",
}: {
  avis: Avis;
  bordure?: boolean;
  /** Carte masquée sur téléphone (une seule carte visible). */
  masqueMobile?: boolean;
  className?: string;
}) {
  const etoiles = avis.noteMax === 5;
  return (
    <figure className={`m-0 ${masqueMobile ? "hidden md:flex" : "flex"} h-full flex-col gap-4 p-6 text-grey-dark md:p-8 ${bordure ? "border border-grey-light" : "bg-white"} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {etoiles ? (
          <span role="img" aria-label={`Note ${avis.note} sur 5`} className="text-lg tracking-[3px]">
            {"★".repeat(Math.round(avis.note))}
            {"☆".repeat(5 - Math.round(avis.note))}
          </span>
        ) : (
          <span className="font-display text-xl font-medium">
            {avis.note}
            <span className="text-sm">/10</span>
          </span>
        )}
        <span className="font-display text-[13px] uppercase tracking-[0.14em]">{avis.metier}</span>
      </div>
      <blockquote className="m-0 flex-1 text-base leading-normal md:text-lg">«&nbsp;{avis.texte}&nbsp;»</blockquote>
      <figcaption className="flex justify-between gap-3 border-t border-grey-light pt-3.5 text-sm">
        <strong>{avis.auteur}</strong>
        <span>
          Avis {avis.source} · {dateAvis(avis.date)}
        </span>
      </figcaption>
    </figure>
  );
}
