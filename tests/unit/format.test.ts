import { describe, expect, it } from "vitest";
import { formaterPrix, formaterSurface } from "@/lib/format/nombres";

// Intl utilise des espaces insécables : on les remplace par des espaces simples pour comparer.
const espaces = (s: string) => s.replace(/[  ]/g, " ");

describe("formatage à la française", () => {
  it("prix", () => {
    expect(espaces(formaterPrix(1099000))).toBe("1 099 000 €");
    expect(espaces(formaterPrix(380100))).toBe("380 100 €");
  });

  it("prix manquant : emplacement, jamais de valeur inventée", () => {
    expect(formaterPrix(null)).toBe("[prix à fournir]");
  });

  it("surface", () => {
    expect(espaces(formaterSurface(278.84))).toBe("278,84 m²");
    expect(espaces(formaterSurface(189))).toBe("189 m²");
  });
});
