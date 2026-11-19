import { z } from "zod";
import { slugSchema, texteSchema } from "./communs";

export const poleIdSchema = z.enum([
  "direction",
  "transaction",
  "suivi-des-ventes",
  "location",
  "gestion-locative",
  "accueil",
]);

export const poleSchema = z.strictObject({
  id: poleIdSchema,
  nom: texteSchema,
  desc: texteSchema,
});

export const membreSchema = z.strictObject({
  slug: slugSchema,
  nom: texteSchema,
  role: texteSchema,
  pole: poleIdSchema,
  specialite: texteSchema.nullable(),
  // Texte libre pour l'instant (« Tous les secteurs », « Toute la métropole »…).
  secteurs: texteSchema.nullable(),
  telephoneDirect: texteSchema.nullable(),
  email: z.email().nullable(),
  photo: texteSchema.nullable(),
  // Accord écrit de publication de la photo. Décision de Simon (19/11/2026) :
  // les noms s'affichent (déjà publiés sur le site actuel de l'agence).
  accordPublication: z.boolean(),
  presentation: texteSchema.nullable(),
});

export const fichierEquipeSchema = z.strictObject({
  _source: z.string(),
  poles: z.array(poleSchema),
  membres: z.array(membreSchema),
});

export type Pole = z.infer<typeof poleSchema>;
export type Membre = z.infer<typeof membreSchema>;
