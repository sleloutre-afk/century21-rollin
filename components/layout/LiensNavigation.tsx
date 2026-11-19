"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { estActif, type Lien } from "@/lib/navigation";

/**
 * Liens de menu avec la page en cours signalée (aria-current).
 * `LiensNavigation` est la version sans page en cours (affichée pendant le prérendu),
 * `LiensNavigationActifs` lit l'adresse de la page : à placer dans un <Suspense>.
 */

type Props = {
  liens: Lien[];
  classeLien: string;
  classeActif?: string;
  onNaviguer?: () => void;
};

export function LiensNavigation({ liens, classeLien, classeActif = "", onNaviguer, chemin = null }: Props & { chemin?: string | null }) {
  return (
    <>
      {liens.map((lien) => {
        const actif = estActif(lien.href, chemin);
        return (
          <Link
            key={lien.href}
            href={lien.href}
            aria-current={actif ? "page" : undefined}
            onClick={onNaviguer}
            className={`${classeLien} ${actif ? classeActif : ""}`}
          >
            {lien.libelle}
          </Link>
        );
      })}
    </>
  );
}

export function LiensNavigationActifs(props: Props) {
  const chemin = usePathname();
  return <LiensNavigation {...props} chemin={chemin} />;
}
