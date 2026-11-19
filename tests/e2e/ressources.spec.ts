import { expect, test } from "@playwright/test";

test("Ressources : à la une, 4 articles, filtre par catégorie dans l'adresse", async ({ page }) => {
  await page.goto("/ressources");
  await expect(page.locator("h1")).toHaveText("Les guides du propriétaire");
  await expect(page.getByText("À la une · Louer · Faire gérer")).toBeVisible();
  await page.getByRole("group", { name: "Filtrer par catégorie" }).getByRole("button", { name: "Faire gérer" }).click();
  await expect(page).toHaveURL(/categorie=faire-gerer/);
  await expect(page.locator("main li h2")).toHaveText([
    "DPE 2026 : ce qui change pour les propriétaires bordelais",
    "Gestion locative : ce que fait vraiment votre gestionnaire",
  ]);
});

test("article : sommaire, En bref, conseil, FAQ, appel à l'action vers une vraie page", async ({ page }) => {
  await page.goto("/ressources/estimer-aux-chartrons");
  await expect(page.locator("h1")).toHaveText("Estimer son bien aux Chartrons : les critères qui font vraiment le prix");
  await expect(page.getByRole("link", { name: "Grégory Coutant" })).toHaveAttribute("href", "/equipe/gregory-coutant");
  await expect(page.getByRole("heading", { name: "En bref" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Le conseil de l'agence" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Questions fréquentes" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Passer à l'action" }).getByRole("link")).toHaveAttribute("href", "/estimation");
  await expect(page.locator("main")).not.toContainText("Relu par l'agence");
});

test("réserves retirées et éléments sans contenu masqués", async ({ page }) => {
  await page.goto("/ressources/vivre-aux-chartrons");
  await expect(page.getByText("Ce que recherchent les acheteurs aux Chartrons")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("à compléter");
  await page.goto("/ressources/gestion-locative");
  await expect(page.getByText("Puis-je confier la gestion d'un bien déjà loué ?")).toHaveCount(0);
});

test("lettre des propriétaires : consentement obligatoire puis confirmation", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/ressources");
  await page.waitForLoadState("networkidle");
  const formulaire = page.getByRole("form", { name: "S'inscrire à la lettre d'information" });
  await formulaire.getByPlaceholder("Votre e-mail").fill("jeanne@example.org");
  await formulaire.getByRole("button", { name: "Je m'inscris" }).click();
  await expect(formulaire.getByText("Votre accord est nécessaire pour recevoir la lettre.")).toBeVisible();
  await formulaire.getByRole("checkbox").check();
  await formulaire.getByRole("button", { name: "Je m'inscris" }).click();
  await expect(page.getByRole("status").filter({ hasText: "inscription est enregistrée" })).toBeVisible();
});
