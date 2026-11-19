import Link from "next/link";

/** Fil d'Ariane des pages internes (spec §8). Le dernier élément est la page en cours. */

export type EtapeAriane = { libelle: string; href?: string };

export function FilAriane({ etapes }: { etapes: EtapeAriane[] }) {
  const toutes: EtapeAriane[] = [{ libelle: "Accueil", href: "/" }, ...etapes];
  return (
    <nav aria-label="Fil d'Ariane" className="border-b border-grey-light">
      <ol className="conteneur flex min-h-[52px] flex-wrap items-center gap-x-2.5 gap-y-1 py-2 text-sm">
        {toutes.map((etape, i) => {
          const derniere = i === toutes.length - 1;
          return (
            <li key={`${etape.libelle}-${i}`} className="flex items-center gap-2.5">
              {derniere || !etape.href ? (
                <span aria-current={derniere ? "page" : undefined} className={derniere ? "font-bold" : ""}>
                  {etape.libelle}
                </span>
              ) : (
                <Link href={etape.href} className="text-grey-dark no-underline hover:underline">
                  {etape.libelle}
                </Link>
              )}
              {!derniere && <span aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
