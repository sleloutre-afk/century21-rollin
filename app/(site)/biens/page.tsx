import type { Metadata } from "next";
import { Suspense } from "react";
import { Recherche, RechercheAvecParametres } from "@/components/biens/Recherche";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { getAgence, getAnnonces, getLocalisations } from "@/lib/data";
import { metaPage } from "@/lib/seo";

/**
 * Recherche de biens : /biens?transaction=vente|location (menu « Acheter » et « Trouver une location »).
 * La page est préparée à l'avance ; les filtres de l'adresse sont appliqués dans le navigateur.
 */

export const metadata: Metadata = metaPage({
  titre: "Biens à vendre et à louer à Bordeaux",
  description: "Maisons et appartements à vendre et à louer aux Chartrons et dans les quartiers voisins, à Bordeaux.",
  chemin: "/biens",
});

export default async function PageBiens() {
  const { telephone, telephoneE164 } = getAgence();
  const props = {
    annonces: getAnnonces(),
    localisations: getLocalisations().map(({ id, nom }) => ({ id, nom })),
    nouveaux: await slugsNouveaux(),
    telephone,
    telephoneE164,
  };
  return (
    <Suspense fallback={<Recherche {...props} />}>
      <RechercheAvecParametres {...props} />
    </Suspense>
  );
}
