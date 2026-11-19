import { expect, test } from "@playwright/test";

const URL = "/faire-louer-ou-gerer";

test("page Faire louer ou gérer : titre, offres, encart DPE, équipe, FAQ", async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Votre bien loué et géré");
  await expect(page.locator("article h3", { hasText: "Mise en location" })).toBeVisible();
  await expect(page.locator("article h3", { hasText: "Gestion locative" })).toBeVisible();
  await expect(page.getByText("Qualitelis gestion · au [date à fournir]")).toBeVisible();
  await expect(page.getByRole("link", { name: /DPE 2026, ce qui change/ })).toHaveAttribute("href", "/ressources/dpe-2026");
  // Réserves retirées (décision de Simon) et questions sans réponse masquées.
  await expect(page.locator("main")).not.toContainText("[À confirmer par l");
  await expect(page.getByText("Puis-je confier un bien déjà loué ?")).toHaveCount(0);
});

test("« Estimer mon loyer » ouvre l'estimation, projet « Faire louer » pré-sélectionné", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("link", { name: "Estimer mon loyer" }).first().click();
  await expect(page).toHaveURL(/\/estimation\?projet=faire-louer/);
});

test("« Confier la gestion » ouvre l'estimation, projet « Confier la gestion »", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("link", { name: "Confier la gestion" }).click();
  await expect(page).toHaveURL(/\/estimation\?projet=confier-la-gestion/);
});

test("le champ adresse final transmet l'adresse et le projet", async ({ page }) => {
  await page.goto(URL);
  await page.locator("#gerer-adresse").fill("8 rue Notre-Dame");
  await page.locator("#gerer-adresse").press("Enter");
  await expect(page).toHaveURL(/\/estimation\?projet=faire-louer&adresse=8\+rue\+Notre-Dame/);
});
