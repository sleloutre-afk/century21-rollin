import { z } from "zod";
import { texteSchema } from "./communs";

/**
 * Bien vendu publié sans fiche complète (contenus/ventes.json) : photo, type et code postal seulement,
 * comme sur la page « Nos dernières ventes » du site actuel. Une annonce au statut « vendu » reste
 * l'autre source des biens vendus (lib/biens/ventes.ts). Prix jamais affiché (spec §5).
 */
export const venteSchema = z.strictObject({
  reference: texteSchema,
  type: z.enum(["maison", "appartement"]),
  ville: texteSchema,
  codePostal: z.string().regex(/^\d{5}$/),
  photo: z.strictObject({ src: texteSchema, alt: texteSchema }),
});

export const fichierVentesSchema = z.strictObject({
  _source: z.string(),
  ventes: z.array(venteSchema),
});

export type VentePubliee = z.infer<typeof venteSchema>;
