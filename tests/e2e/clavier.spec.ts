import { expect, test, type Page } from "@playwright/test";

/** Avance avec Tab jusqu'au bouton portant ce texte (vérifie au passage qu'il est atteignable), puis l'active. */
async function tabulerJusquA(page: Page, texte: string) {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    if ((await page.evaluate(() => document.activeElement?.textContent?.trim())) === texte) {
      await page.keyboard.press("Enter");
      return;
    }
  }
  throw new Error(`« ${texte} » n'est pas atteignable au clavier`);
}

/** Navigation au clavier (spec §9) : lien d'évitement, focus visible, menu, parcours d'estimation, menu mobile. */

test.describe("clavier · grand écran", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop"));

  test("le premier Tab propose « Aller au contenu », qui mène au contenu", async ({ page }) => {
    await page.goto("/vendre");
    await page.keyboard.press("Tab");
    const lien = page.getByRole("link", { name: "Aller au contenu" });
    await expect(lien).toBeFocused();
    await expect(lien).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contenu$/);
  });

  test("focus visible : filet Dark Gold de 2 px", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const style = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement!);
      return { style: s.outlineStyle, largeur: s.outlineWidth, couleur: s.outlineColor };
    });
    expect(style).toEqual({ style: "solid", largeur: "2px", couleur: "rgb(161, 146, 118)" });
  });

  test("le menu principal est atteignable au clavier", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      if ((await page.evaluate(() => document.activeElement?.textContent)) === "Vendre") break;
    }
    await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Vendre" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/vendre$/);
  });

  test("parcours d'estimation complet sans souris", async ({ page }) => {
    await page.goto("/estimation?adresse=12%20rue%20Notre-Dame");
    await page.waitForLoadState("networkidle");
    const titre = page.locator("h1");
    await page.getByRole("combobox", { name: "Adresse du bien" }).focus();
    await page.keyboard.press("Enter");
    await expect(titre).toHaveText("Parlez-nous de votre bien");
    await expect(titre).toBeFocused(); // le focus suit l'étape (lecteurs d'écran)

    // Type de bien : flèches dans le groupe de choix.
    await page.getByRole("radio", { name: "Appartement" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Maison" })).toBeChecked();
    await page.keyboard.press("Tab");
    await page.keyboard.type("90");
    await page.keyboard.press("Tab");
    await page.keyboard.type("4");
    await page.keyboard.press("Enter");
    await expect(titre).toHaveText("Quelques précisions");
    await tabulerJusquA(page, "Continuer");
    await expect(titre).toHaveText("Quel est votre projet ?");
    await tabulerJusquA(page, "Continuer");
    await expect(titre).toHaveText("Où vous envoyer votre estimation ?");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Jeanne Martin");
    await page.keyboard.press("Tab");
    await page.keyboard.type("jeanne@example.org");
    await page.keyboard.press("Tab");
    await page.keyboard.type("0612345678");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    await expect(page.getByRole("checkbox")).toBeChecked();
    await tabulerJusquA(page, "Voir mon estimation");
    await expect(titre).toHaveText("Votre première fourchette");
  });
});

test.describe("clavier · téléphone", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile"));

  test("menu : ouverture au clavier, Échap ferme et rend le focus au bouton", async ({ page }) => {
    await page.goto("/");
    const bouton = page.getByRole("button", { name: "Ouvrir le menu" });
    await bouton.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect(menu.locator(":focus")).toHaveCount(1); // le focus est dans le menu
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(bouton).toBeFocused();
  });
});
