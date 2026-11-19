import { expect, test } from "@playwright/test";

test("le champ adresse du haut de page ouvre l'estimation, adresse pré-remplie", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Adresse de votre bien").fill("12 rue Notre-Dame");
  await page.locator("#h1-accueil").locator("..").getByRole("button", { name: /Estimer/ }).click();
  await expect(page).toHaveURL(/\/estimation\?adresse=12\+rue\+Notre-Dame/);
});

test("les 13 sections : un seul titre principal et les titres de section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  for (const titre of [
    "Par où commencer ?",
    "Nos coups de cœur",
    "Récemment vendus",
    "Six secteurs, connus rue par rue",
    "Un spécialiste pour chaque besoin",
    "Ils nous ont confié leur projet",
    "Une agence familiale, au cœur des Chartrons",
    "Les guides du propriétaire",
    "Parlons de votre projet",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: titre })).toHaveCount(1);
  }
});

test("une note s'affiche toujours avec sa date", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("468 avis Google · au [date à fournir]")).toBeVisible();
  await expect(page.getByText("Mesure au [date à fournir]")).toHaveCount(2);
});

test("aucune vente fournie : cartes « Vendu » vides étiquetées", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", { has: page.getByRole("heading", { name: "Récemment vendus" }) });
  await expect(section.getByText("[Quartier]").locator("visible=true").first()).toBeVisible();
});

test.describe("grand écran", () => {
  test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== "desktop"));

  test("mini-moteur : « Louer » change les budgets et envoie les filtres à la recherche", async ({ page }) => {
    await page.goto("/");
    const moteur = page.getByRole("form", { name: "Rechercher un bien" });
    await moteur.getByRole("button", { name: "Louer" }).click();
    await expect(moteur.getByRole("button", { name: "Louer" })).toHaveAttribute("aria-pressed", "true");
    await moteur.getByLabel("Budget max.").selectOption("1200");
    await moteur.getByLabel("Quartier").selectOption("bacalan");
    await moteur.getByRole("button", { name: "Rechercher" }).click();
    await expect(page).toHaveURL(/\/biens\?transaction=location&type=&budget=1200&quartier=bacalan/);
  });

  test("cartes de bien : prix honoraires inclus et mention part acquéreur", async ({ page }) => {
    await page.goto("/");
    const carte = page.getByRole("link", { name: /Maison de ville bourgeoise/ });
    await expect(carte).toHaveAttribute("href", "/biens/maison-de-ville-bourgeoise-palais-gallien");
    await expect(carte).toContainText(/1\s099\s000\s€/);
    await expect(carte).toContainText("part acquéreur [à préciser]");
  });
});

test.describe("formulaire de rappel", () => {
  test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== "desktop"));

  test("champs manquants : erreurs affichées, rien n'est envoyé", async ({ page }) => {
    await page.goto("/#contact");
    const formulaire = page.getByRole("form", { name: "Un conseiller vous rappelle" });
    await formulaire.getByRole("button", { name: "Être rappelé" }).click();
    await expect(formulaire.getByRole("alert")).toHaveText("Vérifiez les champs signalés.");
    await expect(formulaire.getByText("Indiquez votre nom.")).toBeVisible();
    await expect(formulaire.getByText("Votre accord est nécessaire pour être recontacté.")).toBeVisible();
  });

  test("demande complète : confirmation (envoi simulé)", async ({ page }) => {
    await page.goto("/#contact");
    const formulaire = page.getByRole("form", { name: "Un conseiller vous rappelle" });
    await formulaire.getByLabel("Nom").fill("Jeanne Martin");
    await formulaire.getByLabel("Téléphone").fill("06 12 34 56 78");
    await formulaire.getByText("Faire gérer", { exact: true }).click();
    await formulaire.getByRole("checkbox").check();
    await formulaire.getByRole("button", { name: "Être rappelé" }).click();
    await expect(page.getByRole("status")).toContainText("un conseiller vous rappelle");
    await expect(page.getByRole("status")).toContainText("[Démonstration");
  });
});
