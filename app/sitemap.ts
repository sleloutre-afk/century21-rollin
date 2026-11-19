import type { MetadataRoute } from "next";
import { estVisibleEnRecherche } from "@/lib/biens/recherche";
import { getAnnonces, getArticles, getMembres, getSecteurs } from "@/lib/data";
import { urlAbsolue } from "@/lib/seo";

/**
 * Plan du site pour les moteurs de recherche (spec §8). Pages publiques uniquement :
 * ni la page des composants (/styleguide), ni les adresses filtrées, ni les biens vendus ou loués.
 */
const PAGES_FIXES = [
  "/",
  "/vendre",
  "/estimation",
  "/acheter",
  "/biens",
  "/biens-vendus",
  "/faire-louer-ou-gerer",
  "/quartiers",
  "/equipe",
  "/ressources",
  "/avis",
  "/agence",
  "/contact",
  "/honoraires",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [
    ...PAGES_FIXES,
    ...getAnnonces().filter(estVisibleEnRecherche).map((a) => `/biens/${a.slug}`),
    ...getSecteurs().map((s) => `/quartiers/${s.slug}`),
    ...getMembres().map((m) => `/equipe/${m.slug}`),
    ...getArticles().map((a) => `/ressources/${a.slug}`),
  ];
  return chemins.map((chemin) => ({ url: urlAbsolue(chemin) }));
}
