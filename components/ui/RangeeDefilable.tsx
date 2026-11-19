"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconeFlecheDroite, IconeFlecheGauche } from "./Icones";

/**
 * Rangée que l'utilisateur fait défiler lui-même : au doigt, à la molette ou avec les flèches.
 * Jamais de défilement automatique (CLAUDE.md, règle 6).
 * Chaque enfant direct est un élément de la rangée (largeur fixée par `largeurElement`).
 */

export function RangeeDefilable({
  libelle,
  children,
  largeurElement = "w-[280px] md:w-[360px]",
  fleches = true,
}: {
  /** Nom de la rangée pour les lecteurs d'écran (ex. « Biens vendus »). */
  libelle: string;
  children: React.ReactNode;
  largeurElement?: string;
  fleches?: boolean;
}) {
  const conteneur = useRef<HTMLUListElement>(null);
  const [debut, setDebut] = useState(true);
  const [fin, setFin] = useState(false);

  const mettreAJour = useCallback(() => {
    const el = conteneur.current;
    if (!el) return;
    setDebut(el.scrollLeft <= 4);
    setFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    mettreAJour();
    window.addEventListener("resize", mettreAJour);
    return () => window.removeEventListener("resize", mettreAJour);
  }, [mettreAJour]);

  const defiler = (sens: 1 | -1) => {
    const el = conteneur.current;
    if (!el) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sens * el.clientWidth * 0.85, behavior: reduit ? "auto" : "smooth" });
  };

  const elements = Array.isArray(children) ? children : [children];

  return (
    <div role="region" aria-label={libelle} className="flex flex-col gap-4">
      {fleches && (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            aria-label={`${libelle} : éléments précédents`}
            onClick={() => defiler(-1)}
            disabled={debut}
            className="flex size-[52px] cursor-pointer items-center justify-center border border-grey-dark bg-white text-grey-dark transition-opacity disabled:cursor-default disabled:opacity-40"
          >
            <IconeFlecheGauche />
          </button>
          <button
            type="button"
            aria-label={`${libelle} : éléments suivants`}
            onClick={() => defiler(1)}
            disabled={fin}
            className="flex size-[52px] cursor-pointer items-center justify-center bg-grey-dark text-white transition-opacity hover:text-gold disabled:cursor-default disabled:opacity-40"
          >
            <IconeFlecheDroite />
          </button>
        </div>
      )}
      <ul
        ref={conteneur}
        onScroll={mettreAJour}
        tabIndex={0}
        aria-label={`${libelle} (faire défiler horizontalement)`}
        className="m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth p-0 pb-2 motion-reduce:scroll-auto md:gap-6"
      >
        {elements.map((enfant, i) => (
          <li key={i} className={`flex-none snap-start ${largeurElement}`}>
            {enfant}
          </li>
        ))}
      </ul>
    </div>
  );
}
