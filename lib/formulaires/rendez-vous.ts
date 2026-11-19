"use server";

import { getMembre } from "@/lib/data";
import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { erreursParChamp, identifierVisiteur, lireChamps } from "./outils";
import { CHAMP_PIEGE, MENTION_DEMO, rendezVousSchema, type EtatFormulaire } from "./schemas";

/**
 * Demande de rendez-vous. À VALIDER : outil d'agenda à choisir ; en attendant, la demande est transmise
 * (simulée) et le conseiller confirme par téléphone. Aucune réservation réelle.
 */
export async function demanderRendezVous(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = lireChamps(formulaire, ["conseiller", "jour", "heure", "nom", "telephone", "consentement"]);
  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") return { statut: "envoye", message: MENTION_DEMO };

  const resultat = rendezVousSchema.safeParse(valeurs);
  if (!resultat.success) {
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs: erreursParChamp(resultat.error), valeurs };
  }
  if (!autoriserEnvoi(`rdv:${await identifierVisiteur()}`, Date.now())) {
    return { statut: "erreur", message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous.", valeurs };
  }
  const membre = resultat.data.conseiller ? getMembre(resultat.data.conseiller) : undefined;
  await transmettreDemande({
    formulaire: "rendez-vous",
    pole: membre?.pole ?? "accueil",
    donnees: {
      conseiller: membre?.nom ?? "Agence",
      creneau: `${resultat.data.jour} à ${resultat.data.heure}`,
      nom: resultat.data.nom,
      telephone: resultat.data.telephone,
    },
  });
  const avec = membre ? ` avec ${membre.nom}` : "";
  return {
    statut: "envoye",
    message: `Merci. Votre demande de rendez-vous${avec} (${resultat.data.jour} à ${resultat.data.heure}) est enregistrée : nous vous rappelons pour la confirmer. ${MENTION_DEMO}`,
  };
}
