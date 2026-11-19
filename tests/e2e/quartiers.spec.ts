import { expect, test } from "@playwright/test";

test("Nos quartiers : 6 secteurs, chacun avec sa page", async ({ page }) => {
  await page.goto("/quartiers");
  await expect(page.locator("h1")).toHaveText("Nos quartiers");
  for (const slug of ["chartrons", "jardin-public", "fondaudege-david-johnston", "parc-riviere", "allee-haussmann", "bassins-a-flot"]) {
    await expect(page.locator(`main a[href="/quartiers/${slug}"]:visible`).first()).toBeVisible();
  }
});

test("carte stylisée : cliquer un secteur met à jour la fiche", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/quartiers");
  const carte = page.getByRole("group", { name: "Carte stylisée des secteurs" });
  await expect(page.locator("#fiche-secteur")).toHaveText("Chartrons");
  await carte.getByRole("button", { name: "Bassins à flot" }).click();
  await expect(carte.getByRole("button", { name: "Bassins à flot" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#fiche-secteur")).toHaveText("Bassins à flot");
  await expect(page.getByRole("link", { name: /Découvrir le quartier/ }).first()).toHaveAttribute("href", "/quartiers/bassins-a-flot");
});

test("Chartrons : En bref, ambiance, marché sans chiffre inventé, biens du quartier, FAQ", async ({ page }) => {
  await page.goto("/quartiers/chartrons");
  await expect(page.locator("h1")).toHaveText("Chartrons");
  await expect(page.getByRole("heading", { name: "En bref" })).toBeVisible();
  await expect(page.getByText("Rue Notre-Dame et ses antiquaires.")).toBeVisible();
  await expect(page.getByText("Source : [à définir] · données au [date]")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vendre ou louer aux Chartrons" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("[Texte à relire");
  await expect(page.getByText("Par [membre de l'équipe] · Mis à jour le [date]")).toBeVisible();
});

test("Bassins à flot : aucun bien en vente, alerte proposée", async ({ page }) => {
  await page.goto("/quartiers/bassins-a-flot");
  await expect(page.getByRole("heading", { name: "Aucun bien en vente en ce moment" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Créer une alerte e-mail" })).toContainText("Bassins à flot");
  // Question sans réponse masquée (décision de Simon).
  await expect(page.getByText("Revendre un appartement acheté neuf")).toHaveCount(0);
});

test("secteur sans texte : blocs vides masqués, page utilisable", async ({ page }) => {
  await page.goto("/quartiers/parc-riviere");
  await expect(page.locator("h1")).toHaveText("Parc Rivière");
  await expect(page.getByRole("heading", { name: "En bref" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Les prix, rue par rue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Propriétaire dans le secteur Parc Rivière ?" })).toBeVisible();
});

test("champ adresse de taille normale sur téléphone", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/quartiers");
  const hauteur = await page.locator("#quartiers-adresse").evaluate((e) => e.getBoundingClientRect().height);
  expect(hauteur).toBeLessThan(80);
});
