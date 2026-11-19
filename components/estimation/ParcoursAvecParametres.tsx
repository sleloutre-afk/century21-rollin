"use client";

import { useSearchParams } from "next/navigation";
import { Parcours } from "./Parcours";

/**
 * Lit ?adresse= (champ de l'accueil, de Vendre…) et ?projet= (page Faire louer ou gérer)
 * pour pré-remplir le parcours. À placer dans un <Suspense> (adresse connue seulement à la visite).
 */
export function ParcoursAvecParametres(props: { telephone: string; telephoneE164: string }) {
  const parametres = useSearchParams();
  return (
    <Parcours
      {...props}
      adresseInitiale={(parametres.get("adresse") ?? "").slice(0, 200)}
      projetInitial={parametres.get("projet") ?? undefined}
    />
  );
}
