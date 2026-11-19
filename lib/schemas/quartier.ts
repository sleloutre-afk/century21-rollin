import { z } from "zod";
import { dateSchema, secteurAvecPageSchema, slugSchema, texteSchema } from "./communs";
import { questionFaqSchema } from "./faq";

const pourcentage = z.number().min(0).max(100);

export const secteurSchema = z
  .strictObject({
    slug: secteurAvecPageSchema,
    nom: texteSchema,
    /** Nom court pour la carte du téléphone (« Fondaudège »). */
    court: texteSchema,
    /** Préposition pour les titres : « aux Chartrons ». Absente : « dans le secteur … ». */
    prep: texteSchema.optional(),
    accroche: texteSchema.nullable(),
    prixMoyenM2: z.number().positive().nullable(),
    // Source et date du prix (ex. « DVF, données 2025 »). Obligatoire dès qu'un prix est saisi.
    sourcePrix: texteSchema.nullable(),
    conseillerReferent: slugSchema.nullable(),
    /** Auteur (membre de l'équipe) et date de mise à jour de la page (spec §8). */
    auteur: slugSchema.nullable().optional(),
    dateMiseAJour: dateSchema.nullable().optional(),
    // Libellés des emplacements photo, en attendant les vraies photos.
    photoVignette: texteSchema,
    photo: texteSchema.optional(),
    photo2: texteSchema.optional(),
    photo3: texteSchema.optional(),
    // Contenus de la page quartier : absents → blocs masqués (spec §5).
    bref: z.array(texteSchema).min(3).max(5).optional(),
    ambianceTitre: texteSchema.optional(),
    ambiance: texteSchema.optional(),
    vivre: z.array(z.strictObject({ titre: texteSchema, texte: texteSchema })).optional(),
    faq: z.array(questionFaqSchema).optional(),
    /** Position sur la carte stylisée, en % (approximative, à valider par l'agence). */
    carte: z.strictObject({ gauche: pourcentage, haut: pourcentage, largeur: pourcentage, hauteur: pourcentage }),
  })
  .refine((s) => s.prixMoyenM2 === null || s.sourcePrix !== null, {
    path: ["sourcePrix"],
    message: "un prix au m² ne s'affiche jamais sans sa source datée",
  });

export const fichierQuartiersSchema = z.strictObject({
  _source: z.string(),
  secteurs: z.array(secteurSchema),
});

export type Secteur = z.infer<typeof secteurSchema>;
