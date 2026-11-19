import { describe, expect, it } from "vitest";
import annonces from "@/contenus/annonces.json";
import { getAgence, getAnnonces, getArticles, getLocalisations, getMembres, getSecteurs, verifierContenus } from "@/lib/data";
import { annonceSchema } from "@/lib/schemas/annonce";
import { secteurSchema } from "@/lib/schemas/quartier";

describe("contenus/ : les 5 fichiers respectent leur schéma", () => {
  it("agence.json", () => {
    expect(getAgence().nomTexte).toBe("Cabinet Rollin – CENTURY 21 Les Chartrons");
  });

  it("annonces.json", () => {
    expect(getAnnonces()).toHaveLength(8);
  });

  it("equipe.json", () => {
    expect(getMembres()).toHaveLength(21);
  });

  it("quartiers.json", () => {
    expect(getSecteurs()).toHaveLength(6);
  });

  it("articles.json", () => {
    expect(getArticles().map((a) => a.numero)).toEqual([1, 2, 3, 4]);
  });

  it("les liens entre fichiers sont cohérents", () => {
    expect(() => verifierContenus()).not.toThrow();
  });

  it("le filtre quartier propose les 6 secteurs, les 4 quartiers ajoutés et « Autre »", () => {
    expect(getLocalisations().map((l) => l.nom)).toEqual([
      "Chartrons",
      "Jardin Public",
      "Fondaudège–David Johnston",
      "Parc Rivière",
      "Allée Haussmann",
      "Bassins à flot",
      "Palais Gallien",
      "Croix de Seguey",
      "Saint-Seurin",
      "Bacalan",
      "Autre",
    ]);
  });
});

describe("les schémas refusent les données invalides", () => {
  const annonce = annonces.annonces[0];

  it("champ inconnu (faute de frappe)", () => {
    expect(annonceSchema.safeParse({ ...annonce, prixx: 1 }).success).toBe(false);
  });

  it("vente en cours sans prix", () => {
    expect(annonceSchema.safeParse({ ...annonce, prixHonorairesInclus: null }).success).toBe(false);
  });

  it("statut incompatible avec la transaction", () => {
    expect(annonceSchema.safeParse({ ...annonce, statut: "loue" }).success).toBe(false);
  });

  it("classe DPE hors de A à G", () => {
    expect(annonceSchema.safeParse({ ...annonce, dpe: { ...annonce.dpe, classe: "H" } }).success).toBe(false);
  });

  it("prix au m² sans source", () => {
    const secteur = { slug: "chartrons", nom: "Chartrons", court: "Chartrons", photoVignette: "Photo", carte: { gauche: 1, haut: 1, largeur: 1, hauteur: 1 }, accroche: null, prixMoyenM2: 5000, sourcePrix: null, conseillerReferent: null };
    expect(secteurSchema.safeParse(secteur).success).toBe(false);
  });
});
