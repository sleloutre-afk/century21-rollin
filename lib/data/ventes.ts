import brut from "@/contenus/ventes.json";
import { fichierVentesSchema, type VentePubliee } from "@/lib/schemas/vente";
import { valider } from "./valider";

let cache: VentePubliee[] | undefined;

/** Biens vendus publiés (photo, type, code postal), du plus récent au plus ancien. */
export function getVentesPubliees(): VentePubliee[] {
  cache ??= valider(fichierVentesSchema, brut, "ventes.json").ventes;
  return cache;
}
