import brut from "@/contenus/annonces.json";
import { fichierAnnoncesSchema, type Annonce } from "@/lib/schemas/annonce";
import { valider } from "./valider";

let cache: Annonce[] | undefined;

/** Toutes les annonces (vente et location, tous statuts). */
export function getAnnonces(): Annonce[] {
  cache ??= valider(fichierAnnoncesSchema, brut, "annonces.json").annonces;
  return cache;
}

export function getAnnonce(slug: string): Annonce | undefined {
  return getAnnonces().find((a) => a.slug === slug);
}
