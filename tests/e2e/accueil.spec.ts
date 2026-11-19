import { expect, test, type Page } from "@playwright/test";

/** Renvoie les textes or (Relentless Gold ou Dark Gold) posés sur un fond blanc ou Light Grey. */
async function texteOrSurFondClair(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const ors = ["rgb(190, 175, 135)", "rgb(161, 146, 118)"];
    const estTransparent = (c: string) => c === "transparent" || c === "rgba(0, 0, 0, 0)" || / 0\)$/.test(c);
    const estClair = (c: string) =>
      c.startsWith("rgb(255, 255, 255") ||
      c.startsWith("rgba(255, 255, 255") ||
      c.startsWith("color(srgb 1 1 1") ||
      c.startsWith("rgb(230, 231, 232");
    const fond = (el: Element | null): string => {
      for (let e = el; e; e = e.parentElement) {
        const c = getComputedStyle(e).backgroundColor;
        if (!estTransparent(c)) return c;
      }
      return "rgb(255, 255, 255)";
    };
    const fautifs: string[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const aDuTexte = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
      if (!aDuTexte || !ors.includes(style.color)) continue;
      if (estClair(fond(el))) fautifs.push(el.textContent!.trim().slice(0, 50));
    }
    return fautifs;
  });
}

test("l'accueil s'affiche en français, avec un seul titre principal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Les Chartrons, on les connaît par cœur. Depuis 1993.");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(37, 37, 38)");
});

test("jamais de texte or sur fond clair", async ({ page }) => {
  for (const url of ["/", "/styleguide"]) {
    await page.goto(url);
    expect(await texteOrSurFondClair(page), url).toEqual([]);
  }
});

test("pied de page : quartiers, barème et emplacements des mentions professionnelles", async ({ page }) => {
  await page.goto("/");
  const pied = page.locator("footer");
  await expect(pied.getByText("Carte professionnelle n° [à fournir]")).toBeVisible();
  await expect(pied.getByText("Garant financier : [à fournir]", { exact: false })).toBeVisible();
  await expect(pied.locator('a[href="/honoraires"]:visible')).toHaveCount(1);
  await expect(pied.locator('a[href^="/quartiers/"]')).toHaveCount(12); // 6 en colonnes + 6 en groupes repliables
});

test.describe("grand écran", () => {
  test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== "desktop"));

  test("en-tête complet, puis compacté au défilement", async ({ page }) => {
    await page.goto("/");
    const entete = page.locator("header");
    await expect(entete.getByRole("navigation", { name: "Navigation principale" }).getByRole("link")).toHaveCount(7);
    await expect(entete.getByRole("link", { name: "Barème d'honoraires" })).toBeVisible();
    await expect(entete.getByRole("link", { name: "05 57 87 79 79" })).toHaveAttribute("href", "tel:+33557877979");
    await expect(entete.getByRole("link", { name: "Estimer mon bien" })).toHaveAttribute("href", "/estimation");

    await page.mouse.wheel(0, 800);
    await expect(entete).toHaveAttribute("data-compact", "true");
    await expect(entete.getByRole("link", { name: "Barème d'honoraires" })).toBeHidden();
    await expect(entete.getByRole("link", { name: "Estimer mon bien" })).toBeVisible();
  });

  test("pas de barre d'actions mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Actions rapides" })).toBeHidden();
  });
});

test.describe("mobile", () => {
  test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== "mobile"));

  test("menu plein écran : ouverture, liens, fermeture par Échap", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("navigation", { name: "Navigation principale" }).getByRole("link")).toHaveCount(7);
    await expect(menu.getByRole("link", { name: "Barème d'honoraires" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("barre d'actions fixe : Appeler · Estimer · Nos biens", async ({ page }) => {
    await page.goto("/");
    const barre = page.getByRole("navigation", { name: "Actions rapides" });
    await expect(barre).toBeVisible();
    await expect(barre.getByRole("link")).toHaveText(["Appeler", "Estimer", "Nos biens"]);
    await expect(barre.getByRole("link", { name: "Appeler" })).toHaveAttribute("href", "tel:+33557877979");
  });
});

test("page des composants : compteurs avec leur période, jamais à zéro", async ({ page }) => {
  await page.goto("/styleguide");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByText("ventes [à confirmer : année 2025 ou 12 derniers mois]", { exact: true })).toBeVisible();
  // Sans défilement, les compteurs hors écran affichent leur valeur réelle.
  await expect(page.locator("p", { hasText: "80+" }).locator('span[aria-hidden="true"]')).toHaveText("80+");
});
