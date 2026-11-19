import { describe, expect, it } from "vitest";
import { decrireCriteres, ecrireFiltres, filtrer, FILTRES_PAR_DEFAUT, lireFiltres, similaires, trier } from "@/lib/biens/recherche";
import { getAnnonce, getAnnonces, getLocalisations } from "@/lib/data";

const annonces = getAnnonces();
const lire = (q: string) => lireFiltres(new URLSearchParams(q));

describe("recherche : lecture et écriture de l'adresse", () => {
  it("valeurs par défaut et valeurs inconnues ignorées", () => {
    expect(lire("")).toEqual(FILTRES_PAR_DEFAUT);
    expect(lire("transaction=autre&type=chateau&tri=hasard&budget=-5")).toEqual(FILTRES_PAR_DEFAUT);
  });

  it("aller-retour adresse → filtres → adresse", () => {
    const q = "transaction=vente&type=appartement&budget=500000&pieces=3&quartier=chartrons&tri=prix-asc&vue=carte";
    expect(ecrireFiltres(lire(q))).toBe(q);
  });
});

describe("recherche : filtres", () => {
  it("8 biens en vente, aucune location fournie", () => {
    expect(filtrer(annonces, lire("transaction=vente"))).toHaveLength(8);
    expect(filtrer(annonces, lire("transaction=location"))).toHaveLength(0);
  });

  it("quartier : 4 annonces aux Chartrons", () => {
    expect(filtrer(annonces, lire("quartier=chartrons")).map((a) => a.slug)).toHaveLength(4);
  });

  it("budget, type, surface et pièces minimales", () => {
    expect(filtrer(annonces, lire("budget=300000")).every((a) => (a.prixHonorairesInclus ?? 0) <= 300_000)).toBe(true);
    expect(filtrer(annonces, lire("type=maison"))).toHaveLength(3);
    expect(filtrer(annonces, lire("surface=100")).every((a) => a.surfaceHabitable >= 100)).toBe(true);
    expect(filtrer(annonces, lire("pieces=5")).map((a) => a.pieces)).toEqual([8, 10]);
  });
});

describe("recherche : tri", () => {
  it("plus récents d'abord (date de mise en ligne)", () => {
    expect(trier(filtrer(annonces, lire("")), "recents")[0].slug).toBe("maison-de-ville-bourgeoise-palais-gallien");
  });

  it("prix croissant et décroissant", () => {
    const prix = (tri: "prix-asc" | "prix-desc") => trier(annonces, tri).map((a) => a.prixHonorairesInclus);
    expect(prix("prix-asc")[0]).toBe(250_000);
    expect(prix("prix-desc")[0]).toBe(1_099_000);
  });
});

describe("biens similaires et alerte", () => {
  it("3 biens, sans le bien en cours", () => {
    const courante = getAnnonce("t3-cle-en-main-chartrons-pres-des-quais")!;
    const liste = similaires(annonces, courante);
    expect(liste).toHaveLength(3);
    expect(liste.map((a) => a.slug)).not.toContain(courante.slug);
  });

  it("critères de l'alerte en clair", () => {
    expect(decrireCriteres(lire("type=appartement&quartier=chartrons&pieces=3&budget=500000"), getLocalisations()).map((c) => c.replace(/[\u00a0\u202f]/g, " "))).toEqual([
      "Achat",
      "Appartement",
      "Chartrons",
      "3 pièces et +",
      "Jusqu'à 500 000 €",
    ]);
  });
});
