import { describe, expect, it } from "vitest";
import { getAnnonce } from "@/lib/data";
import { estNouveau, etiquetteEnergie, mentionPrix, prixAffiche, resumeBien } from "@/lib/biens/affichage";
import { decouperCompteur } from "@/lib/format/compteur";
import { estActif } from "@/lib/navigation";

const espaces = (s: string) => s.replace(/[  ]/g, " ");
const palaisGallien = getAnnonce("maison-de-ville-bourgeoise-palais-gallien")!;

describe("carte de bien", () => {
  it("résumé : surface · pièces · atouts", () => {
    expect(espaces(resumeBien(palaisGallien))).toBe("189 m² · 8 pièces · Pierre de taille, 3 niveaux, terrasse, box");
  });

  it("prix honoraires inclus", () => {
    expect(espaces(prixAffiche(palaisGallien))).toBe("1 099 000 €");
  });

  it("part acquéreur non fournie : emplacement", () => {
    expect(mentionPrix({ transaction: "vente", partHonorairesAcquereurPct: null })).toBe("Honoraires inclus · part acquéreur [à préciser]");
  });

  it("honoraires à la charge du vendeur", () => {
    expect(mentionPrix(palaisGallien)).toBe("Honoraires à la charge du vendeur");
  });

  it("part acquéreur fournie", () => {
    expect(mentionPrix({ transaction: "vente", partHonorairesAcquereurPct: 4.5 })).toBe(
      "Honoraires inclus · 4,5 % à la charge de l'acquéreur",
    );
  });

  it("classes énergie non fournies : emplacements", () => {
    expect(etiquetteEnergie({ dpe: { classe: null, valeur: null, date: null }, ges: { classe: null, valeur: null } })).toBe("DPE [–] · GES [–]");
  });

  it("classes énergie fournies", () => {
    expect(etiquetteEnergie(palaisGallien)).toBe("DPE D · GES D");
  });

  it("location sans loyer : emplacement", () => {
    expect(prixAffiche({ transaction: "location", prixHonorairesInclus: null, location: null })).toBe("[loyer à fournir]");
  });
});

describe("badge « Nouveau » (15 jours)", () => {
  const jour = new Date("2026-11-19T12:00:00");

  it("sans date de mise en ligne : jamais nouveau", () => {
    expect(estNouveau({ dateMiseEnLigne: null }, jour)).toBe(false);
  });

  it("mis en ligne il y a 3 jours : nouveau", () => {
    expect(estNouveau({ dateMiseEnLigne: "2026-11-16" }, jour)).toBe(true);
  });

  it("mis en ligne il y a 20 jours : plus nouveau", () => {
    expect(estNouveau({ dateMiseEnLigne: "2026-10-30" }, jour)).toBe(false);
  });
});

describe("menu : lien actif", () => {
  it("page et sous-pages", () => {
    expect(estActif("/quartiers", "/quartiers")).toBe(true);
    expect(estActif("/quartiers", "/quartiers/chartrons")).toBe(true);
    expect(estActif("/vendre", "/quartiers")).toBe(false);
  });

  it("l'accueil n'est actif que sur l'accueil", () => {
    expect(estActif("/", "/")).toBe(true);
    expect(estActif("/", "/vendre")).toBe(false);
  });

  it("« Acheter » et « Trouver une location » ne s'allument jamais tous les deux", () => {
    expect(estActif("/biens?transaction=vente", "/biens")).toBe(false);
    expect(estActif("/biens?transaction=location", "/biens")).toBe(false);
  });
});

describe("compteurs", () => {
  it("« 600+ » → 600 et « + »", () => {
    expect(decouperCompteur("600+")).toEqual({ prefixe: "", nombre: 600, suffixe: "+" });
  });

  it("valeur non numérique : rien à animer", () => {
    expect(decouperCompteur("[20 ou 21 : à confirmer]").nombre).toBeNull();
  });
});
