import { expect, test } from "@playwright/test";

/** Données structurées (JSON-LD), adresse de référence et non-indexation de la démonstration (spec §8). */

async function typesJsonLd(page: import("@playwright/test").Page): Promise<string[]> {
  const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocs.map((b) => JSON.parse(b)["@type"]);
}

const CAS: [string, string[]][] = [
  ["/", ["RealEstateAgent"]],
  ["/vendre", ["FAQPage", "BreadcrumbList"]],
  ["/faire-louer-ou-gerer", ["FAQPage", "BreadcrumbList"]],
  ["/quartiers/chartrons", ["FAQPage", "BreadcrumbList"]],
  ["/equipe/gregory-coutant", ["Person", "BreadcrumbList"]],
  ["/ressources/estimer-aux-chartrons", ["Article", "FAQPage", "BreadcrumbList"]],
  ["/agence", ["RealEstateAgent", "BreadcrumbList"]],
];

for (const [url, attendus] of CAS) {
  test(`données structurées : ${url}`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto(url);
    const types = await typesJsonLd(page);
    for (const t of attendus) expect(types, url).toContain(t);
  });
}

test("aucune donnée structurée ne contient d'emplacement « [à fournir] »", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  for (const [url] of CAS) {
    await page.goto(url);
    for (const bloc of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      // Le fil d'Ariane reprend le titre de la page, qui peut légitimement en contenir : on le vérifie à part.
      if (JSON.parse(bloc)["@type"] === "BreadcrumbList") continue;
      // Emplacements du type « [à fournir] », « [à confirmer] » (les crochets de la syntaxe JSON sont normaux).
      expect(bloc, url).not.toMatch(/\[[^\]"{]*(fournir|confirmer|préciser|venir|rédiger|—)/);
    }
  }
});

test("adresse de référence, aperçu de partage et démonstration non indexée", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/vendre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.century21-cabinet-rollin-bordeaux.com/vendre");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Vendre/);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});
