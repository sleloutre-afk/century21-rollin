import { z } from "zod";

/** Identifiant d'URL : minuscules, chiffres et tirets (ex. « gregory-coutant »). */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug invalide (minuscules, chiffres et tirets)");

/** Date au format AAAA-MM-JJ. `null` = non fournie. */
export const dateSchema = z.iso.date();

/** Texte non vide. */
export const texteSchema = z.string().trim().min(1);

/**
 * Localisations utilisables pour les annonces et le filtre « quartier » de la recherche.
 * - Les 6 secteurs de vente, qui ont chacun une page (contenus/quartiers.json).
 * - 4 quartiers ajoutés par Simon le 19/11/2026, sans page dédiée, et « autre ».
 */
export const SECTEURS_AVEC_PAGE = [
  "chartrons",
  "jardin-public",
  "fondaudege-david-johnston",
  "parc-riviere",
  "allee-haussmann",
  "bassins-a-flot",
] as const;

export const LOCALISATIONS_SANS_PAGE = [
  "palais-gallien",
  "croix-de-seguey",
  "saint-seurin",
  "bacalan",
  "autre",
] as const;

export const localisationSchema = z.enum([...SECTEURS_AVEC_PAGE, ...LOCALISATIONS_SANS_PAGE]);
export type Localisation = z.infer<typeof localisationSchema>;

export const secteurAvecPageSchema = z.enum(SECTEURS_AVEC_PAGE);
