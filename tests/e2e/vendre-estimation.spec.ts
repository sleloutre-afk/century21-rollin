import { expect, test, type Page } from "@playwright/test";

test.describe("page Vendre", () => {
  test("titre, fil d'Ariane, méthode, conseillers et FAQ", async ({ page }) => {
    await page.goto("/vendre");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Vendre aux Chartrons");
    await expect(page.getByRole("navigation", { name: "Fil d'Ariane" })).toContainText("Accueil");
    await expect(page.getByRole("heading", { name: "Un suivi jusqu'à l'acte" })).toBeVisible();
    await expect(page.getByText("Gwendoline Delaire").first()).toBeVisible();
    await expect(page.getByText("Qualitelis transaction · au [date à fournir]")).toBeVisible();
    // Les réserves entre crochets de la FAQ ont été retirées (décision de Simon).
    await expect(page.getByText("[À confirmer par l'agence", { exact: false })).toHaveCount(0);
  });

  test("le champ adresse final ouvre l'estimation", async ({ page }) => {
    await page.goto("/vendre");
    await page.locator("#vendre-adresse").fill("5 rue Notre-Dame");
    await page.locator("#vendre-adresse").press("Enter");
    await expect(page).toHaveURL(/\/estimation\?adresse=5\+rue\+Notre-Dame/);
  });
});

async function continuer(page: Page) {
  await page.getByRole("button", { name: /^(Continuer|Voir mon estimation)$/ }).click();
}

test.describe("module d'estimation", () => {
  test("adresse pré-remplie depuis l'adresse de la page", async ({ page }) => {
    await page.goto("/estimation?adresse=12%20rue%20Notre-Dame");
    await expect(page.getByRole("combobox", { name: "Adresse du bien" })).toHaveValue("12 rue Notre-Dame");
  });

  test("projet pré-sélectionné depuis « Faire louer ou gérer »", async ({ page }) => {
    await page.goto("/estimation?projet=faire-louer&adresse=12%20rue%20Notre-Dame");
    await continuer(page);
    await page.getByText("Maison", { exact: true }).click();
    await page.getByLabel("Surface habitable (m²)").fill("90");
    await page.getByLabel("Pièces").fill("4");
    await continuer(page);
    await continuer(page);
    await expect(page.getByRole("radio", { name: /Faire louer/ })).toBeChecked();
  });

  test("une étape incomplète bloque le passage à la suivante", async ({ page }) => {
    await page.goto("/estimation");
    await continuer(page);
    await expect(page.locator("main").getByRole("alert")).toHaveText("Vérifiez les champs signalés.");
    await expect(page.getByText("Indiquez l'adresse du bien (numéro et rue).")).toBeVisible();
    await expect(page.locator("h1")).toHaveText("Où se situe votre bien ?");
  });

  test("parcours complet jusqu'au résultat, sans aucun chiffre inventé", async ({ page }) => {
    await page.goto("/estimation?adresse=12%20rue%20Notre-Dame");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    await continuer(page);

    await expect(page.locator("h1")).toHaveText("Parlez-nous de votre bien");
    await expect(page.getByLabel("Terrain (m²)")).toHaveCount(0);
    await page.getByText("Maison", { exact: true }).click();
    await expect(page.getByLabel("Terrain (m²)")).toBeVisible();
    await page.getByLabel("Surface habitable (m²)").fill("120,5");
    await page.getByLabel("Pièces").fill("5");
    await page.getByLabel("Chambres").fill("3");
    await continuer(page);

    await expect(page.locator("h1")).toHaveText("Quelques précisions");
    await page.getByText("Refait à neuf", { exact: true }).click();
    await continuer(page);

    await expect(page.locator("h1")).toHaveText("Quel est votre projet ?");
    await continuer(page);

    await expect(page.locator("h1")).toHaveText("Où vous envoyer votre estimation ?");
    await page.getByLabel("Prénom et nom").fill("Jeanne Martin");
    await page.getByLabel("E-mail").fill("jeanne@example.org");
    await page.getByLabel("Téléphone").fill("06 12 34 56 78");
    await continuer(page);
    await expect(page.getByText("Votre accord est nécessaire pour recevoir votre estimation.")).toBeVisible();
    await page.getByRole("checkbox").check();
    await continuer(page);

    await expect(page.locator("h1")).toHaveText("Votre première fourchette");
    await expect(page.getByText("[Fourchette disponible dès que la source des prix sera choisie]")).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/\d{3}\s?000\s?€/);

    await page.getByRole("button", { name: "Être rappelé par un expert du quartier" }).click();
    await expect(page.getByRole("status")).toContainText("un expert du quartier vous rappelle");
  });
});
