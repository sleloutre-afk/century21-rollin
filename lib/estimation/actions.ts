"use server";

import { headers } from "next/headers";
import { transmettreDemande } from "@/lib/formulaires/envoi";
import { autoriserEnvoi } from "@/lib/formulaires/limiteur";
import { CHAMP_PIEGE } from "@/lib/formulaires/schemas";
import { EPOQUES, ETATS, estimationSchema, libelleDe, PROJETS, STATIONNEMENTS, suiteSchema, TYPES, type ValeursParcours } from "./schema";

/**
 * Envoi de l'estimation (étape 5) puis de la suite choisie sur l'écran de résultat.
 * Contrôle complet côté serveur, champ piège, limitation du nombre d'envois, transmission simulée.
 */

export type ReponseEstimation = { ok: true } | { ok: false; message: string; erreurs?: Record<string, string> };

async function visiteur(): Promise<string> {
  const entetes = await headers();
  return entetes.get("x-forwarded-for")?.split(",")[0]?.trim() || entetes.get("x-real-ip") || "inconnu";
}

export async function envoyerEstimation(valeurs: ValeursParcours): Promise<ReponseEstimation> {
  if ((valeurs[CHAMP_PIEGE] ?? "") !== "") return { ok: true };

  const resultat = estimationSchema.safeParse(valeurs);
  if (!resultat.success) {
    const erreurs: Record<string, string> = {};
    for (const p of resultat.error.issues) erreurs[String(p.path[0] ?? "formulaire")] ??= p.message;
    return { ok: false, message: "Certaines réponses sont incomplètes : vérifiez les étapes signalées.", erreurs };
  }
  if (!autoriserEnvoi(`estimation:${await visiteur()}`, Date.now())) {
    return { ok: false, message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous." };
  }

  const e = resultat.data;
  const projet = PROJETS.find((p) => p.id === e.projet)!;
  await transmettreDemande({
    formulaire: "estimation",
    pole: projet.pole,
    donnees: {
      adresse: e.adresse,
      type: libelleDe(TYPES, e.type),
      surface: `${e.surface} m²`,
      pieces: String(e.pieces),
      chambres: e.chambres === undefined ? "" : String(e.chambres),
      terrain: e.type === "maison" && e.terrain !== undefined ? `${e.terrain} m²` : "",
      epoque: libelleDe(EPOQUES, e.epoque),
      etat: libelleDe(ETATS, e.etat),
      stationnement: libelleDe(STATIONNEMENTS, e.stationnement),
      projet: projet.libelle,
      nom: e.nom,
      email: e.email,
      telephone: e.telephone,
    },
  });
  return { ok: true };
}

export async function preciserSuite(valeurs: ValeursParcours): Promise<ReponseEstimation> {
  const resultat = suiteSchema.safeParse(valeurs);
  if (!resultat.success) return { ok: false, message: "Votre choix n'a pas pu être enregistré. Appelez-nous si besoin." };
  if (!autoriserEnvoi(`estimation:${await visiteur()}`, Date.now())) {
    return { ok: false, message: "Trop de demandes envoyées. Réessayez dans quelques minutes, ou appelez-nous." };
  }
  const projet = PROJETS.find((p) => p.id === valeurs.projet);
  await transmettreDemande({
    formulaire: "estimation-suite",
    pole: projet?.pole ?? "transaction",
    donnees: {
      suite: resultat.data.choix === "rappel" ? "Être rappelé par un expert du quartier" : "Recevoir seulement l'estimation",
      nom: resultat.data.nom,
      email: resultat.data.email,
      telephone: resultat.data.telephone,
    },
  });
  return { ok: true };
}
