import { expect, test } from "@playwright/test";


test.describe("recherche de biens", () => {
  test("liste : 8 biens à vendre, un seul titre principal", async ({ page }) => {
    await page.goto("/biens?transaction=vente");
    await expect(page.locator("h1")).toHaveText("Biens à vendre à Bordeaux");
    await expect(page.locator("main li h2")).toHaveCount(8);
  });

  test("les filtres de l'adresse sont appliqués (partage d'un lien)", async ({ page }) => {
    await page.goto("/biens?transaction=vente&quartier=chartrons&type=appartement");
    await expect(page.locator("main li h2")).toHaveCount(3);
  });

  test("locations : état « aucune location » avec l'alerte", async ({ page }) => {
    await page.goto("/biens?transaction=location");
    await expect(page.getByRole("heading", { name: "Aucune location disponible pour le moment" })).toBeVisible();
    await expect(page.getByRole("form", { name: "Créer une alerte e-mail" })).toBeVisible();
  });

  test.describe("grand écran", () => {
    test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop"));

    test("un filtre met à jour la liste et l'adresse, sans recharger la page", async ({ page }) => {
      await page.goto("/biens?transaction=vente");
      await page.getByRole("form", { name: "Filtres" }).getByLabel("Quartier").selectOption("saint-seurin");
      await expect(page).toHaveURL(/quartier=saint-seurin/);
      await expect(page.locator("main li h2")).toHaveText(["T3 traversant"]);
    });

    test("tri par prix croissant et vue carte", async ({ page }) => {
      await page.goto("/biens?transaction=vente");
      await page.getByLabel("Trier par").last().selectOption("prix-asc");
      await expect(page.locator("main li h2").first()).toHaveText("T3 avec terrasse");
      await page.getByRole("group", { name: "Affichage" }).getByRole("button", { name: "Carte" }).click();
      await expect(page).toHaveURL(/vue=carte/);
      await expect(page.getByRole("img", { name: /Carte interactive/ }).last()).toBeVisible();
    });

    test("alerte e-mail : critères de la recherche, consentement obligatoire", async ({ page }) => {
      await page.goto("/biens?transaction=vente&quartier=chartrons");
      const alerte = page.getByRole("form", { name: "Créer une alerte e-mail" });
      await expect(alerte).toContainText("Chartrons");
      await alerte.getByPlaceholder("Votre e-mail").fill("jeanne@example.org");
      await alerte.getByRole("button", { name: "Créer mon alerte" }).click();
      await expect(alerte.getByText("Votre accord est nécessaire pour recevoir les nouveaux biens.")).toBeVisible();
      await alerte.getByRole("checkbox").check();
      await alerte.getByRole("button", { name: "Créer mon alerte" }).click();
      await expect(page.getByRole("status").filter({ hasText: "vous serez prévenu" })).toBeVisible();
    });
  });

  test.describe("téléphone", () => {
    test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile"));

    test("panneau de filtres", async ({ page }) => {
      await page.goto("/biens?transaction=vente");
      await page.getByRole("button", { name: /^Filtres/ }).click();
      const panneau = page.getByRole("dialog", { name: "Filtres" });
      await panneau.getByLabel("Type").selectOption("maison");
      await panneau.getByRole("button", { name: /Voir 3 biens/ }).click();
      await expect(panneau).toBeHidden();
      await expect(page.getByRole("button", { name: "Filtres (1)" })).toBeVisible();
    });
  });
});

test.describe("fiche bien", () => {
  const url = "/biens/maison-de-ville-bourgeoise-palais-gallien";

  test("mentions obligatoires : prix, honoraires, DPE/GES, copropriété, Géorisques", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator("h1")).toContainText("Maison de ville bourgeoise");
    await expect(page.getByText(/Prix honoraires inclus : 1\s099\s000\s€, dont \[—\] % TTC à la charge de l'acquéreur/)).toBeVisible();
    await expect(page.getByText("DPE · consommation énergétique · classe [à fournir]")).toBeVisible();
    await expect(page.getByText("GES · émissions de gaz à effet de serre · classe [à fournir]")).toBeVisible();
    await expect(page.getByRole("link", { name: "www.georisques.gouv.fr" })).toHaveAttribute("href", "https://www.georisques.gouv.fr");
    await expect(page.getByText("Bien en copropriété")).toBeVisible();
  });

  // Préparation partielle des pages : le code reste 200, mais la page « introuvable » s'affiche,
  // marquée « noindex » pour les moteurs de recherche (documentation Next.js, notFound).
  test("un bien inconnu affiche la page « introuvable », non indexée", async ({ page }) => {
    await page.goto("/biens/bien-qui-n-existe-pas");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cette page est introuvable");
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
  });

  test("galerie plein écran : clavier, compteur, Échap", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto(url);
    await page.getByRole("button", { name: "Ouvrir la galerie en plein écran" }).click();
    const galerie = page.getByRole("dialog", { name: "Galerie photos du bien" });
    await expect(galerie).toContainText("1 / 5");
    await page.keyboard.press("ArrowRight");
    await expect(galerie).toContainText("2 / 5");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(galerie).toContainText("5 / 5");
    await page.keyboard.press("Escape");
    await expect(galerie).toBeHidden();
  });

  test("demande de visite (envoi simulé)", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto(`${url}#visite`);
    const formulaire = page.getByRole("form", { name: "Demander une visite" });
    await formulaire.getByLabel("Nom").fill("Jeanne Martin");
    await formulaire.getByLabel("Téléphone").fill("06 12 34 56 78");
    await formulaire.getByRole("checkbox").check();
    await formulaire.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.getByRole("status").filter({ hasText: "demande de visite" })).toBeVisible();
  });

  test("barre mobile propre à la fiche : Appeler · Demander une visite", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile");
    await page.goto(url);
    await expect(page.getByRole("navigation", { name: "Actions rapides" }).getByRole("link")).toHaveText(["Appeler", "Demander une visite"]);
  });
});

test.describe("biens vendus et Acheter", () => {
  test("biens vendus : emplacements et filtre par quartier dans l'adresse", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto("/biens-vendus");
    await expect(page.locator("h1")).toHaveText("Biens vendus par l'agence");
    await expect(page.locator("main article")).toHaveCount(12);
    await page.getByRole("group", { name: "Filtrer par quartier" }).getByRole("button", { name: "Bassins à flot" }).click();
    await expect(page).toHaveURL(/quartier=bassins-a-flot/);
  });

  test("Acheter : le formulaire ouvre la recherche filtrée", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.goto("/acheter");
    const formulaire = page.getByRole("form", { name: "Rechercher un bien" });
    await formulaire.getByLabel("Type").selectOption("maison");
    await formulaire.getByRole("button", { name: "Voir les biens" }).click();
    await expect(page).toHaveURL(/\/biens\?transaction=vente&type=maison/);
    await expect(page.locator("main li h2")).toHaveCount(3);
  });
});
