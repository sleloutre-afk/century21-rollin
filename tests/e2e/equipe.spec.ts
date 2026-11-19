import { expect, test } from "@playwright/test";

test("L'équipe : 21 personnes en 6 pôles, filtre par pôle dans l'adresse", async ({ page }) => {
  await page.goto("/equipe");
  await expect(page.locator("h1")).toContainText("Un spécialiste pour");
  await expect(page.locator("main li h3")).toHaveCount(21);
  await page.getByRole("group", { name: "Filtrer par pôle" }).getByRole("button", { name: "Location" }).click();
  await expect(page).toHaveURL(/pole=location/);
  await expect(page.locator("main li h3")).toHaveText(["Elodie Fournier", "Claire Chevet", "Léna Duporté"]);
});

test("cartes : spécialité et quartiers seulement s'ils sont connus", async ({ page }) => {
  await page.goto("/equipe?pole=suivi-des-ventes");
  await expect(page.getByText("Spécialité : Du mandat à l'acte")).toBeVisible();
  await expect(page.getByText("[à préciser]")).toHaveCount(0);
});

test("fiche conseiller : blocs vides masqués, conseils, rendez-vous", async ({ page }) => {
  await page.goto("/equipe/gregory-coutant");
  await expect(page.locator("h1")).toHaveText("Grégory Coutant");
  await expect(page.getByRole("heading", { name: "Ses biens en vente" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Ils parlent de Grégory" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Estimer son bien aux Chartrons/ })).toHaveAttribute("href", "/ressources/estimer-aux-chartrons");
  await expect(page.getByRole("form", { name: "Prendre rendez-vous" })).toBeVisible();
});

test("prise de rendez-vous : créneau obligatoire, puis confirmation (envoi simulé)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/equipe/gregory-coutant#rendez-vous");
  // Attendre que la page soit interactive avant de remplir le formulaire.
  await page.waitForLoadState("networkidle");
  const formulaire = page.getByRole("form", { name: "Prendre rendez-vous" });
  await formulaire.getByLabel("Nom").fill("Jeanne Martin");
  await formulaire.getByLabel("Téléphone").fill("06 12 34 56 78");
  await formulaire.getByRole("checkbox").check();
  await formulaire.getByRole("button", { name: "Choisissez un créneau" }).click();
  await expect(formulaire.getByText("Choisissez une heure.")).toBeVisible();
  await formulaire.getByText("15h00", { exact: true }).click();
  await formulaire.getByRole("button", { name: "Confirmer · Mar. à 15h00" }).click();
  await expect(page.getByRole("status").filter({ hasText: "avec Grégory Coutant" })).toBeVisible();
});

test("barre mobile de la fiche : Appeler · Prendre rendez-vous", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/equipe/gwendoline-delaire");
  await expect(page.getByRole("navigation", { name: "Actions rapides" }).getByRole("link")).toHaveText(["Appeler", "Prendre rendez-vous"]);
});
