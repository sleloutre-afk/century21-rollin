import type { Metadata } from "next";
import { ListeLegale, PageLegale } from "@/components/legal/PageLegale";
import { getAgence } from "@/lib/data";

/**
 * Politique de confidentialité : structure, liste factuelle des formulaires du site et des données qu'ils demandent,
 * emplacements pour le reste. À VALIDER : finalités, bases légales, durées de conservation, destinataires et droits,
 * à rédiger par l'agence ou son juriste (RGPD). Aucune donnée n'est stockée par le site à ce jour (envois simulés).
 */

export const metadata: Metadata = { title: "Politique de confidentialité" };

// Formulaires du site et champs demandés (état du site, à tenir à jour).
const FORMULAIRES: [string, string][] = [
  ["Estimation en ligne", "adresse et caractéristiques du bien, projet, nom, e-mail, téléphone"],
  ["Un conseiller vous rappelle (accueil)", "nom, téléphone, projet, message facultatif"],
  ["Contact", "projet, nom, téléphone, e-mail facultatif, message facultatif"],
  ["Demande de visite (fiche bien)", "nom, téléphone, e-mail facultatif, message facultatif"],
  ["Prise de rendez-vous", "créneau souhaité, nom, téléphone"],
  ["Alerte e-mail", "e-mail, critères de recherche"],
  ["Lettre des propriétaires", "e-mail"],
];

export default function PageConfidentialite() {
  const agence = getAgence();
  return (
    <PageLegale
      titre="Politique de confidentialité"
      chapeau={<p className="m-0">[Texte d&apos;introduction à fournir par l&apos;agence.]</p>}
      rubriques={[
        {
          titre: "Responsable du traitement",
          contenu: (
            <ListeLegale
              lignes={[
                ["Nom", agence.nomTexte],
                ["Adresse", `${agence.adresse.rue}, ${agence.adresse.codePostal} ${agence.adresse.ville}`],
                ["Contact pour vos données", "[à fournir]"],
              ]}
            />
          ),
        },
        {
          titre: "Données demandées par les formulaires du site",
          contenu: (
            <>
              <ListeLegale lignes={FORMULAIRES} />
              <p className="m-0">
                Les suggestions d&apos;adresses du module d&apos;estimation sont fournies par la Base Adresse Nationale (service public de géocodage de
                l&apos;IGN) : l&apos;adresse saisie lui est transmise par le site.
              </p>
            </>
          ),
        },
        { titre: "Finalités et bases légales", contenu: <p className="m-0">[à fournir]</p> },
        { titre: "Durées de conservation", contenu: <p className="m-0">[à fournir]</p> },
        { titre: "Destinataires et sous-traitants", contenu: <p className="m-0">[à fournir : équipe de l&apos;agence, hébergeur, outil d&apos;envoi des e-mails…]</p> },
        { titre: "Vos droits", contenu: <p className="m-0">[Texte à fournir : accès, rectification, effacement, opposition, réclamation auprès de la CNIL.]</p> },
      ]}
    />
  );
}
