import { z } from "zod";
import type { Pole } from "@/lib/schemas/equipe";

/**
 * Module d'estimation (brief prompt 2 ; maquette EstimDesktop, EstimMobile).
 * Règles partagées par le navigateur (contrôle à chaque étape) et le serveur (contrôle final).
 */

export const TYPES = [
  { id: "appartement", libelle: "Appartement" },
  { id: "maison", libelle: "Maison" },
] as const;

export const EPOQUES = [
  { id: "avant-1949", libelle: "Avant 1949" },
  { id: "1949-1974", libelle: "1949 – 1974" },
  { id: "1975-2000", libelle: "1975 – 2000" },
  { id: "apres-2000", libelle: "Après 2000" },
] as const;

export const ETATS = [
  { id: "a-renover", libelle: "À rénover" },
  { id: "a-rafraichir", libelle: "À rafraîchir" },
  { id: "bon-etat", libelle: "Bon état" },
  { id: "refait-a-neuf", libelle: "Refait à neuf" },
] as const;

export const STATIONNEMENTS = [
  { id: "aucun", libelle: "Aucun" },
  { id: "place", libelle: "Place de parking" },
  { id: "box", libelle: "Box ou garage" },
] as const;

/** `?projet=` accepte ces identifiants (lien « Estimer mon loyer » de la page Faire louer ou gérer). */
export const PROJETS = [
  { id: "vendre", libelle: "Vendre", detail: "Estimer le prix de vente", pole: "transaction", loyer: false },
  { id: "faire-louer", libelle: "Faire louer", detail: "Estimer le loyer", pole: "location", loyer: true },
  { id: "confier-la-gestion", libelle: "Confier la gestion", detail: "Estimer le loyer et la gestion", pole: "gestion-locative", loyer: true },
  { id: "simple-curiosite", libelle: "Simple curiosité", detail: "Connaître la valeur de mon bien", pole: "transaction", loyer: false },
] as const satisfies readonly { id: string; libelle: string; detail: string; pole: Pole["id"]; loyer: boolean }[];

type Ids<T extends readonly { id: string }[]> = T[number]["id"];
const enumDe = <T extends readonly { id: string }[]>(liste: T, message: string) =>
  z.enum(liste.map((o) => o.id) as [Ids<T>, ...Ids<T>[]], { error: message });

/** Nombre saisi dans un champ texte : « 75 », « 75,5 ». Vide → absent. */
const nombre = (message: string) =>
  z.preprocess(
    (v) => (typeof v === "string" ? (v.trim() === "" ? undefined : Number(v.replace(",", "."))) : v),
    z.number({ error: message }),
  );

const facultatif = (schema: z.ZodNumber) =>
  z.preprocess((v) => (typeof v === "string" ? (v.trim() === "" ? undefined : Number(v.replace(",", "."))) : v), schema.optional());

export const etapeAdresse = z.object({
  adresse: z.string().trim().min(5, "Indiquez l'adresse du bien (numéro et rue)."),
});

export const etapeBien = z
  .object({
    type: enumDe(TYPES, "Choisissez le type de bien."),
    surface: nombre("Indiquez la surface habitable.").pipe(
      z.number().positive("La surface doit être supérieure à 0.").max(5000, "Surface trop grande : vérifiez la saisie."),
    ),
    pieces: nombre("Indiquez le nombre de pièces.").pipe(
      z.number().int("Nombre entier de pièces.").min(1, "Au moins 1 pièce.").max(50, "Nombre de pièces trop élevé."),
    ),
    chambres: facultatif(z.number().int("Nombre entier de chambres.").min(0).max(50, "Nombre de chambres trop élevé.")),
    terrain: facultatif(z.number().min(0, "Surface de terrain invalide.").max(1_000_000, "Surface de terrain trop grande.")),
  })
  .refine((b) => b.chambres === undefined || b.chambres < b.pieces || b.pieces === 1, {
    path: ["chambres"],
    message: "Le nombre de chambres doit être inférieur au nombre de pièces.",
  });

export const etapeCaracteristiques = z.object({
  epoque: enumDe(EPOQUES, "Choisissez l'époque de construction."),
  etat: enumDe(ETATS, "Choisissez l'état général."),
  stationnement: enumDe(STATIONNEMENTS, "Choisissez le stationnement."),
});

export const etapeProjet = z.object({
  projet: enumDe(PROJETS, "Choisissez votre projet."),
});

const telephone = z
  .string()
  .trim()
  .refine((v) => /^\+?[\d\s.\-()]+$/.test(v) && v.replace(/\D/g, "").length >= 10, "Indiquez un numéro de téléphone valide.");

export const etapeCoordonnees = z.object({
  nom: z.string().trim().min(2, "Indiquez votre prénom et votre nom.").max(120, "Nom trop long."),
  email: z.email("Indiquez une adresse e-mail valide."),
  telephone,
  consentement: z.literal("oui", { error: "Votre accord est nécessaire pour recevoir votre estimation." }),
});

/** Les 5 étapes, dans l'ordre (libellés de la colonne de suivi de la maquette). */
export const ETAPES = [
  { numero: 1, libelle: "Adresse", schema: etapeAdresse },
  { numero: 2, libelle: "Votre bien", schema: etapeBien },
  { numero: 3, libelle: "Caractéristiques", schema: etapeCaracteristiques },
  { numero: 4, libelle: "Projet", schema: etapeProjet },
  { numero: 5, libelle: "Coordonnées", schema: etapeCoordonnees },
] as const;

export const estimationSchema = etapeAdresse
  .extend(etapeCaracteristiques.shape)
  .extend(etapeProjet.shape)
  .extend(etapeCoordonnees.shape)
  .and(etapeBien);

export type Estimation = z.infer<typeof estimationSchema>;

/** Suite choisie sur l'écran de résultat. */
export const suiteSchema = z.object({
  choix: z.enum(["rappel", "estimation-seule"]),
  nom: etapeCoordonnees.shape.nom,
  email: etapeCoordonnees.shape.email,
  telephone,
});

export type ValeursParcours = Record<string, string>;

/** Erreurs d'une étape, par champ (premier message de chaque champ). */
export function erreursEtape(numero: number, valeurs: ValeursParcours): Record<string, string> {
  const etape = ETAPES.find((e) => e.numero === numero);
  if (!etape) return {};
  const resultat = etape.schema.safeParse(valeurs);
  if (resultat.success) return {};
  const erreurs: Record<string, string> = {};
  for (const probleme of resultat.error.issues) {
    const champ = String(probleme.path[0] ?? "formulaire");
    erreurs[champ] ??= probleme.message;
  }
  return erreurs;
}

export const libelleDe = <T extends readonly { id: string; libelle: string }[]>(liste: T, id: string | undefined) =>
  liste.find((o) => o.id === id)?.libelle ?? "";
