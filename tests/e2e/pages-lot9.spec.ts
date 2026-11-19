import { expect, test } from "@playwright/test";

test("Avis : notes datées, flux filtrable, encart sur l'origine des avis", async ({ page }) => {
  await page.goto("/avis");
  await expect(page.locator("h1")).toHaveText("Ce que nos clients disent de nous");
  await expect(page.getByText("au [date à fournir]").first()).toBeVisible();
  await expect(page.getByText("Mesure au [date à fournir]", { exact: false })).toHaveCount(2);
  await page.getByRole("group", { name: "Filtrer par service" }).getByRole("button", { name: "Location" }).click();
  await expect(page).toHaveURL(/service=location/);
  await expect(page.getByRole("heading", { name: "D'où viennent ces avis ?" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Laisser un avis Google/ })).toHaveCount(0);
});

test("L'agence : frise, chiffres datés, Centurion, mot des dirigeants masqué", async ({ page }) => {
  await page.goto("/agence");
  await expect(page.locator("h1")).toContainText("Une agence familiale aux Chartrons");
  await expect(page.getByText("Aujourd'hui", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Agence Centurion depuis 2016" })).toBeVisible();
  await expect(page.getByText("Le mot des dirigeants")).toHaveCount(0);
});

test("Contact : le pôle destinataire suit le projet, envoi simulé", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/contact");
  await page.waitForLoadState("networkidle");
  const formulaire = page.getByRole("form", { name: "Formulaire de contact" });
  await formulaire.getByText("Faire gérer", { exact: true }).click();
  await expect(formulaire.getByText("Votre demande sera transmise au pôle gestion locative.")).toBeVisible();
  await formulaire.getByLabel("Nom").fill("Jeanne Martin");
  await formulaire.getByLabel("Téléphone").fill("06 12 34 56 78");
  await formulaire.getByRole("checkbox").check();
  await formulaire.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Votre demande est enregistrée" })).toBeVisible();
});

test("pages légales : structure et emplacements, sans texte juridique inventé", async ({ page }) => {
  for (const [url, titre] of [
    ["/honoraires", "Barème d'honoraires"],
    ["/mentions-legales", "Mentions légales"],
    ["/confidentialite", "Politique de confidentialité"],
    ["/cookies", "Gestion des cookies"],
  ]) {
    await page.goto(url);
    await expect(page.locator("h1"), url).toHaveText(titre);
    await expect(page.locator("main").getByText(/à fournir/).first(), url).toBeVisible();
  }
});

test("aucun lien interne ne mène à une page introuvable", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  test.setTimeout(120_000);
  const pages = ["/", "/vendre", "/acheter", "/biens?transaction=vente", "/biens/maison-de-ville-bourgeoise-palais-gallien", "/biens-vendus", "/faire-louer-ou-gerer", "/quartiers", "/quartiers/chartrons", "/equipe", "/equipe/gregory-coutant", "/ressources", "/ressources/dpe-2026", "/avis", "/agence", "/contact"];
  const liens = new Set<string>();
  for (const url of pages) {
    await page.goto(url);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
      liens.add(href.split("#")[0] || "/");
    }
  }
  // Chaque lien est ouvert dans le navigateur : le titre « introuvable » peut n'apparaître qu'après chargement.
  const introuvables: string[] = [];
  for (const lien of liens) {
    const reponse = await page.goto(lien); // attend la fin du chargement, contenu différé compris
    const titre = await page.locator("h1").first().textContent();
    if ((reponse?.status() ?? 200) >= 400 || titre?.includes("Cette page est introuvable")) introuvables.push(lien);
  }
  expect(introuvables).toEqual([]);
});

// Contrôle du contrôle : une adresse de bien inexistante est bien repérée comme « introuvable ».
test("le contrôle des liens repère une fiche inexistante", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/biens/bien-inexistant");
  await expect(page.locator("h1").first()).toHaveText("Cette page est introuvable");
});
