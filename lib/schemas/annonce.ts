import { z } from "zod";
import { dateSchema, localisationSchema, slugSchema, texteSchema } from "./communs";

/**
 * Annonce (vente ou location). Champs repris de contenus/annonces.json.
 * `null` = information non fournie : le bloc correspondant est masqué sur la fiche,
 * sauf les mentions obligatoires qui affichent « [à fournir] » (spec §5).
 */

export const statutSchema = z.enum([
  "en_vente",
  // À VALIDER : statut « sous compromis » proposé par la spec, à confirmer par l'agence.
  "sous_compromis",
  "vendu",
  "en_location",
  "loue",
]);

export const transactionSchema = z.enum(["vente", "location"]);
export const typeBienSchema = z.enum(["maison", "appartement"]);
export const classeEnergieSchema = z.enum(["A", "B", "C", "D", "E", "F", "G"]);

const montant = z.number().nonnegative();

const photoSchema = z.strictObject({
  src: texteSchema,
  alt: texteSchema,
  legende: texteSchema.optional(),
});

/**
 * Bloc propre aux locations (brief §10, spec §5). Absent tant qu'aucune location n'est fournie.
 * À VALIDER : champs liés à l'encadrement des loyers à Bordeaux (fin prévue le 24/11/2026).
 */
const locationSchema = z.strictObject({
  loyerChargesComprises: montant.nullable(),
  charges: montant.nullable(),
  modeReglementCharges: texteSchema.nullable(),
  depotDeGarantie: montant.nullable(),
  honorairesLocation: montant.nullable(),
  honorairesEtatDesLieux: montant.nullable(),
  meuble: z.boolean().nullable(),
  loyerReferenceMajore: montant.nullable().optional(),
  complementDeLoyer: montant.nullable().optional(),
});

export const annonceSchema = z
  .strictObject({
    slug: slugSchema,
    statut: statutSchema,
    transaction: transactionSchema,
    type: typeBienSchema,
    titre: texteSchema,
    quartierLibelle: texteSchema,
    secteur: localisationSchema.nullable(),
    surfaceHabitable: z.number().positive(),
    pieces: z.number().int().positive(),
    chambres: z.number().int().nonnegative().nullable(),
    prixHonorairesInclus: montant.nullable(),
    prixHorsHonoraires: montant.nullable(),
    partHonorairesAcquereurPct: z.number().min(0).max(100).nullable(),
    exclusivite: z.boolean(),
    coupDeCoeur: z.boolean(),
    atouts: z.array(texteSchema),
    dpe: z.strictObject({
      classe: classeEnergieSchema.nullable(),
      valeur: z.number().nonnegative().nullable(),
      date: dateSchema.nullable(),
    }),
    ges: z.strictObject({
      classe: classeEnergieSchema.nullable(),
      valeur: z.number().nonnegative().nullable(),
    }),
    depensesEnergie: z.strictObject({
      min: montant.nullable(),
      max: montant.nullable(),
      // Année(s) des prix moyens de l'énergie : [2021, 2022, 2023] (anciens DPE) ou [2025]…
      anneesReferencePrix: z.array(z.number().int().min(2000).max(2100)).min(1).nullable(),
    }),
    copropriete: z.strictObject({
      estEnCopropriete: z.boolean().nullable(),
      nombreLots: z.number().int().positive().nullable(),
      chargesAnnuelles: montant.nullable(),
      // Texte libre : « aucune » ou description de la procédure en cours.
      procedureEnCours: texteSchema.nullable(),
    }),
    conseiller: slugSchema.nullable(),
    photos: z.array(photoSchema),
    description: texteSchema.nullable(),
    delaiDeVenteJours: z.number().int().nonnegative().nullable(),
    coordonnees: z.strictObject({ lat: z.number(), lng: z.number() }).nullable(),
    // Champs facultatifs (présents sur certaines annonces seulement)
    niveaux: z.number().int().positive().optional(),
    exterieur: texteSchema.optional(),
    stationnement: texteSchema.optional(),
    quartierPage: texteSchema.optional(),
    // Champs prévus par la spec, absents des données de démonstration
    reference: texteSchema.nullable().optional(),
    video: texteSchema.nullable().optional(),
    visiteVirtuelle: texteSchema.nullable().optional(),
    plan: texteSchema.nullable().optional(),
    dateMiseEnLigne: dateSchema.nullable().optional(),
    location: locationSchema.nullable().optional(),
    // Mention « Bien proposé par … EI, agent commercial (RSAC …) », reprise du site actuel.
    // À VALIDER : formulation exacte de la mention obligatoire des agents commerciaux.
    agentCommercial: z.strictObject({ nom: texteSchema, rsac: texteSchema }).nullable().optional(),
  })
  .superRefine((a, ctx) => {
    const statutsVente = ["en_vente", "sous_compromis", "vendu"];
    const statutsLocation = ["en_location", "loue"];
    const attendus = a.transaction === "vente" ? statutsVente : statutsLocation;
    if (!attendus.includes(a.statut)) {
      ctx.addIssue({
        code: "custom",
        path: ["statut"],
        message: `statut « ${a.statut} » incompatible avec une ${a.transaction}`,
      });
    }
    if (a.transaction === "vente" && a.statut !== "vendu" && a.prixHonorairesInclus === null) {
      ctx.addIssue({
        code: "custom",
        path: ["prixHonorairesInclus"],
        message: "une vente en cours doit avoir un prix honoraires inclus",
      });
    }
    if (a.transaction === "location" && !a.location) {
      ctx.addIssue({
        code: "custom",
        path: ["location"],
        message: "une location doit avoir son bloc « location »",
      });
    }
  });

export const fichierAnnoncesSchema = z.strictObject({
  _source: z.string(),
  annonces: z.array(annonceSchema),
});

export type Annonce = z.infer<typeof annonceSchema>;
