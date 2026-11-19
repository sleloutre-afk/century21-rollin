"use server";

import { getAnnonce } from "@/lib/data";
import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { erreursParChamp, identifierVisiteur, lireChamps } from "./outils";
import { CHAMP_PIEGE, demandeVisiteSchema, MENTION_DEMO, type EtatFormulaire } from "./schemas";

/** « Demander une visite » (fiche bien). Contrôle serveur, champ piège, limite d'envois, envoi simulé. */
export async function demanderVisite(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = lireChamps(formulaire, ["annonce", "nom", "telephone", "email", "message", "consentement"]);
  const ok: EtatFormulaire = { statut: "envoye", message: `Merci. Votre demande de visite est enregistrée : le conseiller vous rappelle. ${MENTION_DEMO}` };

  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") return ok;

  const resultat = demandeVisiteSchema.safeParse(valeurs);
  if (!resultat.success) {
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs: erreursParChamp(resultat.error), valeurs };
  }
  const annonce = getAnnonce(resultat.data.annonce);
  if (!annonce) return { statut: "erreur", message: "Ce bien n'est plus disponible. Appelez-nous.", valeurs };

  if (!autoriserEnvoi(`visite:${await identifierVisiteur()}`, Date.now())) {
    return { statut: "erreur", message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous.", valeurs };
  }

  await transmettreDemande({
    formulaire: "visite",
    pole: annonce.transaction === "location" ? "location" : "transaction",
    donnees: {
      bien: `${annonce.titre} · ${annonce.quartierLibelle} (${annonce.slug})`,
      conseiller: annonce.conseiller ?? "",
      nom: resultat.data.nom,
      telephone: resultat.data.telephone,
      email: resultat.data.email,
      message: resultat.data.message,
    },
  });
  return ok;
}
