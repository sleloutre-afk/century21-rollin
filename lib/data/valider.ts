import type { z } from "zod";

/**
 * Valide un fichier de contenus/ avec son schéma.
 * En cas d'erreur, lève une exception lisible : le build (et la page en développement) échoue.
 */
export function valider<S extends z.ZodType>(schema: S, donnees: unknown, fichier: string): z.output<S> {
  const resultat = schema.safeParse(donnees);
  if (!resultat.success) {
    const details = resultat.error.issues
      .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n");
    throw new Error(`contenus/${fichier} ne respecte pas son schéma :\n${details}`);
  }
  return resultat.data;
}
