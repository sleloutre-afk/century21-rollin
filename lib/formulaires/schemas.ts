import { z } from "zod";
import type { Pole } from "@/lib/schemas/equipe";

/** Nom du champ piège, invisible pour les visiteurs : s'il est rempli, c'est un robot. */
export const CHAMP_PIEGE = "site_web";

/** Projets proposés dans le formulaire « Un conseiller vous rappelle » (maquette : accueil, contact). */
export const PROJETS = [
  { id: "vendre", libelle: "Vendre", pole: "transaction" },
  { id: "faire-louer", libelle: "Faire louer", pole: "location" },
  { id: "faire-gerer", libelle: "Faire gérer", pole: "gestion-locative" },
  { id: "acheter", libelle: "Acheter", pole: "transaction" },
] as const satisfies readonly { id: string; libelle: string; pole: Pole["id"] }[];

export type ProjetId = (typeof PROJETS)[number]["id"];

const projetIds = PROJETS.map((p) => p.id) as [ProjetId, ...ProjetId[]];

/** Numéro français ou international : au moins 10 chiffres, espaces, points, tirets et « + » acceptés. */
const telephone = z
  .string()
  .trim()
  .refine((v) => /^\+?[\d\s.\-()]+$/.test(v) && v.replace(/\D/g, "").length >= 10, "Indiquez un numéro de téléphone valide.");

export const demandeRappelSchema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "Nom trop long."),
  telephone,
  projet: z.enum(projetIds, { error: "Choisissez votre projet." }),
  message: z.string().trim().max(2000, "Message trop long (2 000 caractères au maximum).").optional().default(""),
  // Case non pré-cochée : obligatoire pour envoyer (spec §6).
  consentement: z.literal("oui", { error: "Votre accord est nécessaire pour être recontacté." }),
});

export type DemandeRappel = z.infer<typeof demandeRappelSchema>;

/** Formulaire « Demander une visite » de la fiche bien. */
export const demandeVisiteSchema = z.object({
  annonce: z.string().trim().min(1),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "Nom trop long."),
  telephone,
  email: z.union([z.literal(""), z.email("Indiquez une adresse e-mail valide.")]).optional().default(""),
  message: z.string().trim().max(2000, "Message trop long (2 000 caractères au maximum).").optional().default(""),
  consentement: z.literal("oui", { error: "Votre accord est nécessaire pour être recontacté." }),
});

/** Alerte e-mail (recherche, Acheter) : critères de la recherche en cours. */
export const alerteSchema = z.object({
  email: z.email("Indiquez une adresse e-mail valide."),
  criteres: z.string().trim().max(500).optional().default(""),
  consentement: z.literal("oui", { error: "Votre accord est nécessaire pour recevoir les nouveaux biens." }),
});

/** Résultat renvoyé au formulaire après l'envoi. */
export type EtatFormulaire = {
  statut: "initial" | "envoye" | "erreur";
  message?: string;
  erreurs?: Record<string, string>;
  /** Valeurs saisies, renvoyées en cas d'erreur pour ne pas les perdre. */
  valeurs?: Record<string, string>;
};

/** Mention affichée tant que l'envoi réel n'est pas branché. À VALIDER : à retirer au branchement de Resend. */
export const MENTION_DEMO = "[Démonstration : aucun message n'est encore transmis à l'agence.]";
