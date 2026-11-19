import { headers } from "next/headers";
import type { z } from "zod";

/** Outils partagés par les formulaires (côté serveur uniquement). */

/** Identifiant du visiteur pour la limitation des envois (adresse IP transmise par l'hébergeur). */
export async function identifierVisiteur(): Promise<string> {
  const entetes = await headers();
  return entetes.get("x-forwarded-for")?.split(",")[0]?.trim() || entetes.get("x-real-ip") || "inconnu";
}

/** Premier message d'erreur de chaque champ. */
export function erreursParChamp(erreur: z.ZodError): Record<string, string> {
  const erreurs: Record<string, string> = {};
  for (const probleme of erreur.issues) erreurs[String(probleme.path[0] ?? "formulaire")] ??= probleme.message;
  return erreurs;
}

/** Lit les champs texte d'un formulaire. */
export function lireChamps(formulaire: FormData, noms: string[]): Record<string, string> {
  return Object.fromEntries(noms.map((n) => [n, String(formulaire.get(n) ?? "")]));
}
