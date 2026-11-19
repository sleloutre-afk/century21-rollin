import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Audit d'accessibilité automatique (axe-core) : critères WCAG 2.1 niveaux A et AA (spec §9, RGAA).
 * Ne remplace pas la vérification au clavier et au lecteur d'écran, mais repère les erreurs mesurables.
 */
const PAGES = [
  "/",
  "/vendre",
  "/estimation",
  "/acheter",
  "/biens?transaction=vente",
  "/biens?transaction=location",
  "/biens/maison-de-ville-bourgeoise-palais-gallien",
  "/biens-vendus",
  "/faire-louer-ou-gerer",
  "/quartiers",
  "/quartiers/chartrons",
  "/equipe",
  "/equipe/gregory-coutant",
  "/ressources",
  "/ressources/dpe-2026",
  "/avis",
  "/agence",
  "/contact",
  "/mentions-legales",
  "/page-inexistante",
];

for (const url of PAGES) {
  test(`accessibilité : ${url}`, async ({ page }) => {
    // Animations coupées (comme pour les visiteurs qui les désactivent) : le contraste est mesuré à l'état final.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url);
    const resultat = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const problemes = resultat.violations.map(
      (v) => `${v.id} (${v.impact}) : ${v.help} → ${v.nodes.length} élément(s), ex. ${v.nodes[0]?.target.join(" ")}`,
    );
    expect(problemes, problemes.join("\n")).toEqual([]);
  });
}
