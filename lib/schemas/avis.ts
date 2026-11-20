import { z } from "zod";
import { slugSchema, texteSchema } from "./communs";

/**
 * Avis client publié sur le site (contenus/avis.json), recopié mot pour mot depuis sa source.
 * Date au mois (« 2026-10 ») ou à l'année (« 2026 ») selon ce que la source indique.
 */
export const avisSchema = z
  .strictObject({
    id: slugSchema,
    metier: z.enum(["Estimation", "Vente", "Achat", "Location", "Gestion locative"]),
    // Filtre de la page Avis.
    service: z.enum(["vente", "location", "gestion"]),
    texte: texteSchema,
    auteur: texteSchema,
    source: z.enum(["Google", "Immodvisor", "Qualitelis"]),
    note: z.number().positive(),
    noteMax: z.union([z.literal(5), z.literal(10)]),
    date: z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/),
    // Conseiller cité dans l'avis (affiché sur sa fiche).
    conseiller: slugSchema.nullable(),
  })
  .refine((a) => a.note <= a.noteMax, { message: "note supérieure au maximum", path: ["note"] });

export const fichierAvisSchema = z.strictObject({
  _source: z.string(),
  avis: z.array(avisSchema),
});

export type Avis = z.infer<typeof avisSchema>;
