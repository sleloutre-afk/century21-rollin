import { z } from "zod";
import { secteurAvecPageSchema, slugSchema, texteSchema } from "./communs";

export const secteurSchema = z
  .strictObject({
    slug: secteurAvecPageSchema,
    nom: texteSchema,
    accroche: texteSchema.nullable(),
    prixMoyenM2: z.number().positive().nullable(),
    // Source et date du prix (ex. « DVF, données 2025 »). Obligatoire dès qu'un prix est saisi.
    sourcePrix: texteSchema.nullable(),
    conseillerReferent: slugSchema.nullable(),
  })
  .refine((s) => s.prixMoyenM2 === null || s.sourcePrix !== null, {
    path: ["sourcePrix"],
    message: "un prix au m² ne s'affiche jamais sans sa source datée",
  });

export const fichierQuartiersSchema = z.strictObject({
  _source: z.string(),
  secteurs: z.array(secteurSchema),
  detail: z.string(),
});

export type Secteur = z.infer<typeof secteurSchema>;
