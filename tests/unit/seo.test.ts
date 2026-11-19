import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { TELEPHONE, TELEPHONE_E164 } from "@/components/layout/ErreurSegment";
import { getAgence } from "@/lib/data";
import { donneesFaq, estRenseigne, sansEmplacement, URL_SITE } from "@/lib/seo";

describe("référencement", () => {
  it("robots.txt bloque tout tant que le site n'est pas en production", () => {
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("sitemap : pages publiques, sans la page des composants", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(`${URL_SITE}/vendre`);
    expect(urls).toContain(`${URL_SITE}/biens/maison-de-ville-bourgeoise-palais-gallien`);
    expect(urls).toContain(`${URL_SITE}/quartiers/chartrons`);
    expect(urls).toContain(`${URL_SITE}/ressources/dpe-2026`);
    expect(urls.some((u) => u.includes("styleguide"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("FAQPage : les réponses avec un emplacement « [à fournir] » sont exclues", () => {
    const d = donneesFaq([
      { q: "Question complète ?", a: "Réponse complète." },
      { q: "Prix ?", a: "Prix moyen : [donnée à venir]." },
    ]);
    expect(d?.mainEntity).toHaveLength(1);
    expect(donneesFaq([{ q: "Prix ?", a: "[à fournir]" }])).toBeNull();
  });

  it("emplacements retirés des titres destinés aux moteurs", () => {
    expect(sansEmplacement("Chartrons · côté Bacalan [localisation exacte à confirmer]")).toBe("Chartrons · côté Bacalan");
    expect(estRenseigne("[Auteur à confirmer]")).toBe(false);
  });

  it("le numéro de la page d'erreur 500 est celui de l'agence", () => {
    expect(TELEPHONE).toBe(getAgence().telephone);
    expect(TELEPHONE_E164).toBe(getAgence().telephoneE164);
  });
});
