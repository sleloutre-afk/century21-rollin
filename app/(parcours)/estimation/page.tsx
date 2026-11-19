import type { Metadata } from "next";
import { Suspense } from "react";
import { Parcours } from "@/components/estimation/Parcours";
import { ParcoursAvecParametres } from "@/components/estimation/ParcoursAvecParametres";
import { getAgence } from "@/lib/data";
import { metaPage } from "@/lib/seo";

/**
 * Module d'estimation : page à part, sans menu ni pied de page (maquette EstimDesktop, EstimMobile),
 * pour que le propriétaire reste concentré sur ses réponses.
 */

export const metadata: Metadata = metaPage({
  titre: "Estimation en ligne",
  description: "Estimez votre bien aux Chartrons en 2 minutes, puis recevez l'avis d'un expert de votre quartier.",
  chemin: "/estimation",
});

export default function PageEstimation() {
  const { telephone, telephoneE164 } = getAgence();
  return (
    <Suspense fallback={<Parcours telephone={telephone} telephoneE164={telephoneE164} />}>
      <ParcoursAvecParametres telephone={telephone} telephoneE164={telephoneE164} />
    </Suspense>
  );
}
