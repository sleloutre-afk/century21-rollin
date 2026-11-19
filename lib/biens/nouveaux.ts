import { cacheLife } from "next/cache";
import { estNouveau } from "@/lib/biens/affichage";
import { getAnnonces } from "@/lib/data";

/**
 * Annonces portant le badge « Nouveau » aujourd'hui. Dépend de la date du jour :
 * résultat mis en cache et recalculé toutes les heures (Cache Components).
 */
export async function slugsNouveaux(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  const maintenant = new Date();
  return getAnnonces()
    .filter((a) => estNouveau(a, maintenant))
    .map((a) => a.slug);
}
