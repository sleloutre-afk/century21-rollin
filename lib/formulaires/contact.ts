"use server";

import { transmettreDemande } from "./envoi";
import { autoriserEnvoi } from "./limiteur";
import { erreursParChamp, identifierVisiteur, lireChamps } from "./outils";
import { CHAMP_PIEGE, contactSchema, MENTION_DEMO, PROJETS_CONTACT, type EtatFormulaire } from "./schemas";

/** Formulaire de la page Contact : la demande est orientée vers le pôle du projet choisi (envoi simulé). */
export async function envoyerContact(_precedent: EtatFormulaire, formulaire: FormData): Promise<EtatFormulaire> {
  const valeurs = lireChamps(formulaire, ["projet", "nom", "telephone", "email", "message", "consentement"]);
  const ok: EtatFormulaire = { statut: "envoye", message: `Merci. Votre demande est enregistrée : nous vous recontactons rapidement. ${MENTION_DEMO}` };
  if (String(formulaire.get(CHAMP_PIEGE) ?? "") !== "") return ok;

  const resultat = contactSchema.safeParse(valeurs);
  if (!resultat.success) return { statut: "erreur", message: "Vérifiez les champs signalés.", erreurs: erreursParChamp(resultat.error), valeurs };
  if (!autoriserEnvoi(`contact:${await identifierVisiteur()}`, Date.now())) {
    return { statut: "erreur", message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous.", valeurs };
  }
  const projet = PROJETS_CONTACT.find((p) => p.id === resultat.data.projet)!;
  await transmettreDemande({
    formulaire: "contact",
    pole: projet.pole,
    donnees: { projet: projet.libelle, nom: resultat.data.nom, telephone: resultat.data.telephone, email: resultat.data.email, message: resultat.data.message },
  });
  return ok;
}
