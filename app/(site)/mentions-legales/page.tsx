import type { Metadata } from "next";
import { ListeLegale, PageLegale } from "@/components/legal/PageLegale";
import { getAgence } from "@/lib/data";
import { metaPage } from "@/lib/seo";

/** Mentions légales : structure et emplacements. À VALIDER : contenu complet à fournir par l'agence ou son juriste. */

export const metadata: Metadata = metaPage({
  titre: "Mentions légales",
  description: "Mentions légales de Cabinet Rollin – CENTURY 21 Les Chartrons, agence immobilière à Bordeaux.",
  chemin: "/mentions-legales",
});

const aFournir = (v: string | null) => v ?? "[à fournir]";

export default function PageMentionsLegales() {
  const agence = getAgence();
  const m = agence.mentionsProfessionnelles;
  return (
    <PageLegale
      titre="Mentions légales"
      chapeau={<p className="m-0">[Texte d&apos;introduction à fournir par l&apos;agence.]</p>}
      rubriques={[
        {
          titre: "Éditeur du site",
          contenu: (
            <ListeLegale
              lignes={[
                ["Nom", agence.nomTexte],
                ["Adresse", `${agence.adresse.rue}, ${agence.adresse.codePostal} ${agence.adresse.ville}`],
                ["Téléphone", agence.telephone],
                ["E-mail", "[à fournir]"],
                ["Forme juridique et capital", "[à fournir]"],
                ["Immatriculation (RCS, SIREN)", "[à fournir]"],
                ["Numéro de TVA intracommunautaire", "[à fournir]"],
              ]}
            />
          ),
        },
        { titre: "Directeur de la publication", contenu: <p className="m-0">[à fournir]</p> },
        {
          titre: "Activité réglementée",
          contenu: (
            <>
              <ListeLegale
                lignes={[
                  ["Carte professionnelle", `n° ${aFournir(m.carteProfessionnelle)}, délivrée par la CCI ${aFournir(m.cci)}`],
                  ["Garant financier", aFournir(m.garantFinancier)],
                  ["Assurance responsabilité civile professionnelle", aFournir(m.assuranceRCP)],
                ]}
              />
              <p className="m-0">Agence indépendante membre du réseau CENTURY 21. {m.mentionIndependance}</p>
            </>
          ),
        },
        { titre: "Médiateur de la consommation", contenu: <p className="m-0">{aFournir(m.mediateur)}</p> },
        { titre: "Hébergement du site", contenu: <p className="m-0">[Hébergeur, adresse et téléphone à fournir]</p> },
        { titre: "Propriété intellectuelle et crédits photos", contenu: <p className="m-0">[Texte à fournir par l&apos;agence.]</p> },
      ]}
    />
  );
}
