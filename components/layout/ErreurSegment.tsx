"use client";

import { useEffect } from "react";
import { PageErreur } from "./PageErreur";

/**
 * Page 500 (erreur imprévue dans une page), affichée dans le gabarit du site. Composant navigateur (exigence de Next.js).
 * Numéro de l'agence repris de contenus/agence.json (le fichier de données ne peut pas être lu ici).
 */
export const TELEPHONE = "05 57 87 79 79";
export const TELEPHONE_E164 = "+33557877979";

export function ErreurSegment({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Journal du navigateur uniquement (aucun outil de suivi des erreurs branché).
    console.error(error);
  }, [error]);

  return (
    <PageErreur
      code="Erreur 500"
      titre="Un problème est survenu"
      texte="La page n'a pas pu s'afficher. Réessayez dans un instant, ou appelez-nous."
      telephone={TELEPHONE}
      telephoneE164={TELEPHONE_E164}
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-14 cursor-pointer items-center border-0 bg-white px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-grey-light"
        >
          Réessayer
        </button>
      }
    />
  );
}
