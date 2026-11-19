import brut from "@/contenus/equipe.json";
import { fichierEquipeSchema, type Membre, type Pole } from "@/lib/schemas/equipe";
import { valider } from "./valider";

let cache: { poles: Pole[]; membres: Membre[] } | undefined;

function charger() {
  cache ??= valider(fichierEquipeSchema, brut, "equipe.json");
  return cache;
}

export function getPoles(): Pole[] {
  return charger().poles;
}

export function getMembres(): Membre[] {
  return charger().membres;
}

export function getMembre(slug: string): Membre | undefined {
  return getMembres().find((m) => m.slug === slug);
}
