import brut from "@/contenus/avis.json";
import { fichierAvisSchema, type Avis } from "@/lib/schemas/avis";
import { valider } from "./valider";

let cache: Avis[] | undefined;

/** Avis clients publiés, du plus récent au plus ancien. */
export function getAvis(): Avis[] {
  cache ??= valider(fichierAvisSchema, brut, "avis.json").avis;
  return cache;
}
