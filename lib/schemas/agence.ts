import { z } from "zod";
import { dateSchema, texteSchema } from "./communs";

const mention = texteSchema.nullable();

export const agenceSchema = z.strictObject({
  _source: z.string(),
  nomTexte: texteSchema,
  adresse: z.strictObject({
    rue: texteSchema,
    codePostal: z.string().regex(/^\d{5}$/),
    ville: texteSchema,
  }),
  telephone: texteSchema,
  telephoneE164: z.string().regex(/^\+33\d{9}$/),
  horaires: z.array(z.strictObject({ jours: texteSchema, plages: texteSchema })).min(1),
  histoire: z
    .array(z.strictObject({ annee: z.number().int().min(1900).max(2100), evenement: texteSchema }))
    .min(1),
  chiffres: z.strictObject({
    // Un chiffre d'activité s'affiche toujours avec sa période (CLAUDE.md, règle 2).
    periode: texteSchema,
    ventes: texteSchema,
    locations: texteSchema,
    biensGeres: texteSchema,
    professionnels: texteSchema,
  }),
  avis: z.strictObject({
    // Une note s'affiche toujours avec sa date (CLAUDE.md, règle 2) : `date: null` → « [date à fournir] ».
    google: z.strictObject({
      note: z.number().min(0).max(5),
      nombre: z.number().int().nonnegative(),
      date: dateSchema.nullable(),
    }),
    qualitelis: z.strictObject({
      transaction: z.number().min(0).max(10),
      gestion: z.number().min(0).max(10),
      date: dateSchema.nullable(),
      nombreReponses: z.number().int().nonnegative().nullable(),
    }),
  }),
  mentionsProfessionnelles: z.strictObject({
    carteProfessionnelle: mention,
    cci: mention,
    garantFinancier: mention,
    assuranceRCP: mention,
    mediateur: mention,
    mentionIndependance: mention,
  }),
  // À VALIDER : encadrement des loyers à Bordeaux (fin prévue le 24/11/2026).
  encadrementDesLoyers: texteSchema,
});

export type Agence = z.infer<typeof agenceSchema>;
