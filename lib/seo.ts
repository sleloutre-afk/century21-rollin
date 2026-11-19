import type { Metadata } from "next";

/**
 * Référencement : adresse du site, indexation, métadonnées des pages, données structurées (spec §8).
 *
 * - URL_SITE : adresse de production, réglable par la variable d'environnement NEXT_PUBLIC_SITE_URL.
 *   Par défaut : domaine du site actuel de l'agence (accord de Simon, 19/11/2026).
 * - INDEXABLE : le site n'est référencé que si SITE_INDEXABLE=oui (à activer à la mise en production, lot 11+).
 */
export const URL_SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.century21-cabinet-rollin-bordeaux.com").replace(/\/$/, "");
export const INDEXABLE = process.env.SITE_INDEXABLE === "oui";
export const NOM_SITE = "Cabinet Rollin – CENTURY 21 Les Chartrons";

export const urlAbsolue = (chemin: string) => `${URL_SITE}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;

/** Métadonnées d'une page : titre, description, adresse de référence (canonique) et aperçu de partage. */
export function metaPage({ titre, description, chemin, indexable = true }: { titre: string; description: string; chemin: string; indexable?: boolean }): Metadata {
  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: { title: titre, description, url: chemin, siteName: NOM_SITE, locale: "fr_FR", type: "website" },
    ...(indexable ? {} : { robots: { index: false, follow: false } }),
  };
}

/** Une donnée structurée ne reprend que du texte réellement affiché, sans emplacement « [à fournir] ». */
export const estRenseigne = (texte: string | null | undefined): texte is string => !!texte && !texte.includes("[");

/** FAQPage (schema.org) : seules les questions dont la réponse est complète sont déclarées. */
export function donneesFaq(questions: { q: string; a: string }[]) {
  const completes = questions.filter((f) => estRenseigne(f.q) && estRenseigne(f.a));
  if (completes.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: completes.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Retire les emplacements « [à confirmer] » d'un texte destiné aux titres et descriptions des moteurs. */
export const sansEmplacement = (texte: string) => texte.replace(/\s*\[[^\]]*\]/g, "").trim();
