"use server";

import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { erreursParChamp, identifierVisiteur, lireChamps } from "./outils";
import { alerteSchema, CHAMP_PIEGE, MENTION_DEMO, type EtatFormulaire } from "./schemas";

/**
 * Alerte e-mail (recherche, Acheter).
 * À VALIDER : l'envoi automatique à chaque nouveau bien demande un back-office et un outil d'e-mail,
 * avec désinscription en un clic. En attendant : demande transmise (simulée), rien n'est stocké.
 */
export async function creerAlerte(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = lireChamps(formulaire, ["email", "criteres", "consentement"]);
  const ok: EtatFormulaire = { statut: "envoye", message: `C'est noté : vous serez prévenu des nouveaux biens correspondant à votre recherche. ${MENTION_DEMO}` };

  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") return ok;

  const resultat = alerteSchema.safeParse(valeurs);
  if (!resultat.success) {
    return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs: erreursParChamp(resultat.error), valeurs };
  }
  if (!autoriserEnvoi(`alerte:${await identifierVisiteur()}`, Date.now())) {
    return { statut: "erreur", message: "Trop de demandes envoyées. Réessayez dans quelques minutes.", valeurs };
  }
  await transmettreDemande({ formulaire: "alerte", pole: "transaction", donnees: { email: resultat.data.email, criteres: resultat.data.criteres } });
  return ok;
}
