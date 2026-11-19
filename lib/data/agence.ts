import brut from "@/contenus/agence.json";
import { agenceSchema, type Agence } from "@/lib/schemas/agence";
import { valider } from "./valider";

let cache: Agence | undefined;

export function getAgence(): Agence {
  cache ??= valider(agenceSchema, brut, "agence.json");
  return cache;
}
