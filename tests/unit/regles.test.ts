import { describe, expect, it } from "vitest";
import annonces from "@/contenus/annonces.json";
import articles from "@/contenus/articles.json";
import faq from "@/contenus/faq.json";
import quartiers from "@/contenus/quartiers.json";

/**
 * Règle absolue (CLAUDE.md, n° 2) : une note s'affiche toujours avec sa date.
 * Toute mention d'une note (« 9,3/10 », « 4,8/5 ») dans les textes doit être suivie d'une date ou de « [date à fournir] ».
 */
describe("une note est toujours accompagnée de sa date", () => {
  const textes = JSON.stringify([annonces, articles, faq, quartiers]);
  const mentions = [...textes.matchAll(/\d,\d\/(?:10|5)[^"]{0,60}/g)].map((m) => m[0]);

  it.each(mentions.length ? mentions : ["(aucune mention)"])("%s", (mention) => {
    if (mention === "(aucune mention)") return;
    expect(mention).toMatch(/\[date à fournir\]|au \d{1,2}\/\d{1,2}\/\d{4}|\d{4}/);
  });
});
