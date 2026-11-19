import { describe, expect, it } from "vitest";
import { getFaq } from "@/lib/data";
import { erreursEtape, estimationSchema } from "@/lib/estimation/schema";

const complet = {
  adresse: "12 rue Notre-Dame 33000 Bordeaux",
  type: "maison",
  surface: "120,5",
  pieces: "5",
  chambres: "3",
  terrain: "",
  epoque: "avant-1949",
  etat: "bon-etat",
  stationnement: "aucun",
  projet: "vendre",
  nom: "Jeanne Martin",
  email: "jeanne@example.org",
  telephone: "06 12 34 56 78",
  consentement: "oui",
};

describe("estimation : contrôle de chaque étape", () => {
  it("adresse trop courte", () => {
    expect(erreursEtape(1, { adresse: "12" })).toHaveProperty("adresse");
  });

  it("surface avec virgule acceptée, chambres facultatives", () => {
    expect(erreursEtape(2, { type: "appartement", surface: "75,5", pieces: "3", chambres: "" })).toEqual({});
  });

  it("surface et pièces obligatoires", () => {
    const e = erreursEtape(2, { type: "appartement", surface: "", pieces: "" });
    expect(e).toHaveProperty("surface");
    expect(e).toHaveProperty("pieces");
  });

  it("plus de chambres que de pièces : refusé", () => {
    expect(erreursEtape(2, { type: "appartement", surface: "75", pieces: "3", chambres: "4" })).toHaveProperty("chambres");
  });

  it("consentement obligatoire à l'étape 5", () => {
    expect(erreursEtape(5, { ...complet, consentement: "" })).toHaveProperty("consentement");
  });

  it("projet inconnu refusé (ex. ?projet= trafiqué)", () => {
    expect(erreursEtape(4, { projet: "autre" })).toHaveProperty("projet");
  });
});

describe("estimation : contrôle complet côté serveur", () => {
  it("accepte un parcours complet", () => {
    expect(estimationSchema.safeParse(complet).success).toBe(true);
  });

  it("refuse un e-mail invalide", () => {
    expect(estimationSchema.safeParse({ ...complet, email: "jeanne" }).success).toBe(false);
  });
});

describe("FAQ vendeurs", () => {
  it("6 questions, sans réserve entre crochets (décision de Simon)", () => {
    const faq = getFaq("vendre");
    expect(faq).toHaveLength(6);
    expect(faq.some((f) => f.a.includes("[") || f.q.includes("["))).toBe(false);
  });
});
