"use server";

import { headers } from "next/headers";
import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { CHAMP_PIEGE, demandeRappelSchema, PROJETS, type DemandeRappel, type EtatFormulaire } from "./schemas";

/**
 * Formulaire « Un conseiller vous rappelle » (accueil, contact).
 * Contrôle côté serveur, champ piège, limitation du nombre d'envois, puis transmission (simulée).
 */
export async function demanderRappel(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = {
    nom: String(formulaire.get("nom") ?? ""),
    telephone: String(formulaire.get("telephone") ?? ""),
    projet: String(formulaire.get("projet") ?? ""),
    message: String(formulaire.get("message") ?? ""),
    consentement: String(formulaire.get("consentement") ?? ""),
  };

  // Robot : on fait comme si tout s'était bien passé, sans rien transmettre.
  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") {
    return { statut: "envoye", message: MESSAGE_ENVOYE };
  }

  const resultat = demandeRappelSchema.safeParse(valeurs);
  if (!resultat.success) {
    const erreurs: EtatFormulaire["erreurs"] = {};
    for (const probleme of resultat.error.issues) {
      const champ = probleme.path[0] as keyof DemandeRappel;
      erreurs[champ] ??= probleme.message;
    }
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs, valeurs };
  }

  const entetes = await headers();
  const visiteur = entetes.get("x-forwarded-for")?.split(",")[0]?.trim() || entetes.get("x-real-ip") || "inconnu";
  if (!autoriserEnvoi(`rappel:${visiteur}`, Date.now())) {
    return {
      statut: "erreur",
      message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous.",
      valeurs,
    };
  }

  const projet = PROJETS.find((p) => p.id === resultat.data.projet)!;
  await transmettreDemande({
    formulaire: "rappel",
    pole: projet.pole,
    donnees: {
      nom: resultat.data.nom,
      telephone: resultat.data.telephone,
      projet: projet.libelle,
      message: resultat.data.message,
    },
  });

  return { statut: "envoye", message: MESSAGE_ENVOYE };
}

// À VALIDER : retirer la mention « démonstration » quand l'envoi réel sera branché.
const MESSAGE_ENVOYE =
  "Merci. Votre demande est enregistrée : un conseiller vous rappelle. [Démonstration : aucun message n'est encore transmis à l'agence.]";
