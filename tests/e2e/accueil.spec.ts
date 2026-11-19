import { expect, test } from "@playwright/test";

test("la page d'accueil s'affiche en français, aux couleurs de la charte", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cabinet Rollin – CENTURY 21 Les Chartrons");
  await expect(page.locator("h1")).toHaveCount(1);

  // Fond blanc, texte Obsessed Grey.
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(37, 37, 38)");

  // Téléphone cliquable.
  await expect(page.getByRole("link", { name: "05 57 87 79 79" })).toHaveAttribute("href", "tel:+33557877979");
});
