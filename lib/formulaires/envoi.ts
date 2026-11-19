/**
 * Transmission des demandes à l'agence.
 * À VALIDER : outil d'envoi des e-mails (piste retenue : Resend, comme sur Doxamed) et adresse de
 * réception de chaque pôle, à fournir par l'agence. En attendant : envoi SIMULÉ, rien ne part.
 * Aucune donnée n'est stockée (spec §6 : pas de stockage sans décision écrite).
 */

export type Demande = {
  formulaire: "rappel" | "estimation" | "estimation-suite" | "visite" | "alerte" | "rendez-vous" | "lettre";
  pole: string;
  donnees: Record<string, string>;
};

export async function transmettreDemande(demande: Demande): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    // Journal de développement uniquement, pour vérifier le contenu de la demande.
    console.info("[envoi simulé]", JSON.stringify(demande));
  }
}
