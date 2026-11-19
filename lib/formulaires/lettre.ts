"use server";

import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { erreursParChamp, identifierVisiteur, lireChamps } from "./outils";
import { CHAMP_PIEGE, lettreSchema, MENTION_DEMO, type EtatFormulaire } from "./schemas";

/**
 * Inscription à la lettre des propriétaires. À VALIDER : outil d'envoi des lettres (désinscription en un clic),
 * fréquence et durée de conservation des adresses. En attendant : demande transmise (simulée), rien n'est stocké.
 */
export async function inscrireLettre(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = lireChamps(formulaire, ["email", "consentement"]);
  const ok: EtatFormulaire = { statut: "envoye", message: `Merci, votre inscription est enregistrée. ${MENTION_DEMO}` };
  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") return ok;

  const resultat = lettreSchema.safeParse(valeurs);
  if (!resultat.success) return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs: erreursParChamp(resultat.error), valeurs };
  if (!autoriserEnvoi(`lettre:${await identifierVisiteur()}`, Date.now())) {
    return { statut: "erreur", message: "Trop de demandes envoyées. Réessayez dans quelques minutes.", valeurs };
  }
  await transmettreDemande({ formulaire: "lettre", pole: "gestion-locative", donnees: { email: resultat.data.email } });
  return ok;
}
