import type { Metadata } from "next";
import { PageLegale } from "@/components/legal/PageLegale";
import { metaPage } from "@/lib/seo";

/**
 * Gestion des cookies : structure et emplacements. À VALIDER : texte à fournir par l'agence.
 * État technique au 19/11/2026 (docs/questions-ouvertes.md) : le site ne dépose aucun cookie ni traceur ;
 * aucun bandeau n'est donc affiché. Toute mesure d'audience future devra être décidée avec Simon (CLAUDE.md, règle 7).
 */

export const metadata: Metadata = metaPage({
  titre: "Gestion des cookies",
  description: "Gestion des cookies sur le site de Cabinet Rollin – CENTURY 21 Les Chartrons.",
  chemin: "/cookies",
});

export default function PageCookies() {
  return (
    <PageLegale
      titre="Gestion des cookies"
      chapeau={<p className="m-0">[Texte d&apos;introduction à fournir par l&apos;agence.]</p>}
      rubriques={[
        { titre: "Cookies utilisés sur ce site", contenu: <p className="m-0">[à fournir]</p> },
        { titre: "Mesure d'audience", contenu: <p className="m-0">[à fournir selon l&apos;outil choisi]</p> },
        { titre: "Gérer vos préférences", contenu: <p className="m-0">[à fournir]</p> },
      ]}
    />
  );
}
