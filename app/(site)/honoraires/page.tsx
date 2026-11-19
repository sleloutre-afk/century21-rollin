import type { Metadata } from "next";
import { PageLegale } from "@/components/legal/PageLegale";
import { metaPage } from "@/lib/seo";

/**
 * Barème d'honoraires (lien dans la barre utilitaire et le pied de page de toutes les pages, brief §10).
 * À VALIDER : barème à fournir par l'agence (montants, TTC, part à la charge de l'acquéreur ou du locataire, date d'application).
 */

export const metadata: Metadata = metaPage({
  titre: "Barème d'honoraires",
  description: "Barème d'honoraires de Cabinet Rollin – CENTURY 21 Les Chartrons : transaction, location et gestion locative.",
  chemin: "/honoraires",
});

export default function PageHonoraires() {
  return (
    <PageLegale
      titre="Barème d'honoraires"
      chapeau={<p className="m-0">Barème applicable au [date à fournir].</p>}
      rubriques={[
        { titre: "Transaction (vente)", contenu: <p className="m-0">[Barème à fournir par l&apos;agence.]</p> },
        { titre: "Location", contenu: <p className="m-0">[Barème à fournir par l&apos;agence, honoraires d&apos;état des lieux compris.]</p> },
        { titre: "Gestion locative", contenu: <p className="m-0">[Barème à fournir par l&apos;agence.]</p> },
      ]}
    />
  );
}
