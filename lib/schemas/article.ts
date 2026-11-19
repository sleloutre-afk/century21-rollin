import { z } from "zod";
import { dateSchema, slugSchema, texteSchema } from "./communs";

export const categorieArticleSchema = z.enum(["Vendre", "Louer", "Faire gérer", "Quartiers"]);

const sectionSchema = z.strictObject({
  id: slugSchema,
  h2: texteSchema,
  p: z.array(texteSchema).min(1),
});

const questionSchema = z.strictObject({
  q: texteSchema,
  a: texteSchema,
});

export const articleSchema = z.strictObject({
  cat: texteSchema,
  filtre: z.array(categorieArticleSchema).min(1),
  titre: texteSchema,
  court: texteSchema,
  chapeau: texteSchema,
  auteur: texteSchema,
  role: texteSchema,
  // Libellé de l'emplacement photo, en attendant le vrai visuel.
  photo: texteSchema,
  // Bloc « En bref » : 3 à 5 points factuels (brief §9).
  bref: z.array(texteSchema).min(3).max(5),
  sections: z.array(sectionSchema).min(1),
  conseilApres: z.number().int().nonnegative(),
  conseil: texteSchema,
  acheteurs: z.boolean(),
  acheteursApres: z.number().int().nonnegative().optional(),
  faq: z.array(questionSchema).min(1),
  cta: z.strictObject({
    titre: texteSchema,
    texte: texteSchema,
    btn: texteSchema,
    // Liens vers les planches de la maquette : convertis en routes au lot 8.
    href: texteSchema,
    hrefM: texteSchema,
  }),
  // Champs prévus par la spec (§8), absents des données de démonstration.
  slug: slugSchema.optional(),
  dateMiseAJour: dateSchema.nullable().optional(),
});

export const fichierArticlesSchema = z.strictObject({
  _source: z.string(),
  articles: z.record(z.string().regex(/^\d+$/), articleSchema),
});

export type Article = z.infer<typeof articleSchema>;
