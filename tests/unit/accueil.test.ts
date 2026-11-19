import { describe, expect, it } from "vitest";
import { getArticles } from "@/lib/data";
import { versSlug } from "@/lib/data/articles";
import { autoriserEnvoi } from "@/lib/formulaires/limiteur";
import { demandeRappelSchema } from "@/lib/formulaires/schemas";

describe("articles : adresse et temps de lecture", () => {
  it("adresse tirée du titre court, sans accents", () => {
    expect(versSlug("Estimer aux Chartrons")).toBe("estimer-aux-chartrons");
    expect(getArticles().map((a) => a.slug)).toEqual(["dpe-2026", "estimer-aux-chartrons", "gestion-locative", "vivre-aux-chartrons"]);
  });

  it("temps de lecture calculé (articles de 500 à 700 mots)", () => {
    for (const a of getArticles()) {
      expect(a.tempsLecture).toBeGreaterThanOrEqual(1);
      expect(a.tempsLecture).toBeLessThanOrEqual(5);
    }
  });
});

describe("formulaire « Un conseiller vous rappelle »", () => {
  const valide = { nom: "Jeanne Martin", telephone: "06 12 34 56 78", projet: "vendre", message: "", consentement: "oui" };

  it("accepte une demande complète", () => {
    expect(demandeRappelSchema.safeParse(valide).success).toBe(true);
  });

  it("refuse sans consentement (case non pré-cochée)", () => {
    expect(demandeRappelSchema.safeParse({ ...valide, consentement: "" }).success).toBe(false);
  });

  it("refuse un numéro trop court ou avec des lettres", () => {
    expect(demandeRappelSchema.safeParse({ ...valide, telephone: "06 12" }).success).toBe(false);
    expect(demandeRappelSchema.safeParse({ ...valide, telephone: "appelez-moi" }).success).toBe(false);
  });

  it("refuse un projet inconnu", () => {
    expect(demandeRappelSchema.safeParse({ ...valide, projet: "autre" }).success).toBe(false);
  });

  it("limite à 5 envois en 10 minutes par visiteur", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(autoriserEnvoi("test-limite", t + i)).toBe(true);
    expect(autoriserEnvoi("test-limite", t + 10)).toBe(false);
    expect(autoriserEnvoi("test-limite", t + 11 * 60 * 1000)).toBe(true);
  });
});
