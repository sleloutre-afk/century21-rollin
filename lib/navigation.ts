/**
 * Plan du site : liens du menu, de la barre utilitaire et du pied de page.
 * Routes : docs/02-specification-technique.md §3. Libellés : maquette (Main, Accueil-desktop-2).
 */

export type Lien = { libelle: string; href: string };

export const ROUTES = {
  accueil: "/",
  vendre: "/vendre",
  estimation: "/estimation",
  acheter: "/acheter",
  biens: "/biens",
  achat: "/biens?transaction=vente",
  location: "/biens?transaction=location",
  biensVendus: "/biens-vendus",
  gerer: "/faire-louer-ou-gerer",
  quartiers: "/quartiers",
  equipe: "/equipe",
  ressources: "/ressources",
  avis: "/avis",
  agence: "/agence",
  contact: "/contact",
  honoraires: "/honoraires",
  mentionsLegales: "/mentions-legales",
  confidentialite: "/confidentialite",
  cookies: "/cookies",
} as const;

/** Menu principal (brief §7.1) : « Acheter » et « Trouver une location » ouvrent la recherche filtrée. */
export const MENU_PRINCIPAL: Lien[] = [
  { libelle: "Vendre", href: ROUTES.vendre },
  { libelle: "Faire louer ou gérer", href: ROUTES.gerer },
  { libelle: "Acheter", href: ROUTES.achat },
  { libelle: "Trouver une location", href: ROUTES.location },
  { libelle: "Nos quartiers", href: ROUTES.quartiers },
  { libelle: "L'équipe", href: ROUTES.equipe },
  { libelle: "Ressources", href: ROUTES.ressources },
];

/** Barre utilitaire : le barème d'honoraires doit être accessible depuis toutes les pages (brief §10). */
export const MENU_UTILITAIRE: Lien[] = [
  { libelle: "Barème d'honoraires", href: ROUTES.honoraires },
  { libelle: "Avis clients", href: ROUTES.avis },
  { libelle: "L'agence", href: ROUTES.agence },
  { libelle: "Contact", href: ROUTES.contact },
];

export const PIED_SERVICES: Lien[] = [
  { libelle: "Vendre", href: ROUTES.vendre },
  { libelle: "Estimer mon bien", href: ROUTES.estimation },
  { libelle: "Faire louer ou gérer", href: ROUTES.gerer },
  { libelle: "Acheter", href: ROUTES.achat },
  { libelle: "Trouver une location", href: ROUTES.location },
  { libelle: "Biens vendus", href: ROUTES.biensVendus },
];

export const PIED_AGENCE: Lien[] = [
  { libelle: "Notre histoire", href: ROUTES.agence },
  { libelle: "L'équipe", href: ROUTES.equipe },
  { libelle: "Avis clients", href: ROUTES.avis },
  { libelle: "Ressources", href: ROUTES.ressources },
  { libelle: "Contact", href: ROUTES.contact },
];

export const PIED_INFORMATIONS: Lien[] = [
  { libelle: "Barème d'honoraires", href: ROUTES.honoraires },
  { libelle: "Mentions légales", href: ROUTES.mentionsLegales },
  { libelle: "Politique de confidentialité", href: ROUTES.confidentialite },
  { libelle: "Gestion des cookies", href: ROUTES.cookies },
];

/**
 * Un lien est « actif » si la page en cours est sa page ou une de ses sous-pages.
 * Les liens filtrés (« Acheter », « Trouver une location ») mènent tous deux à /biens :
 * ils ne sont jamais marqués actifs, pour ne pas allumer les deux à la fois.
 */
export function estActif(href: string, cheminActuel: string | null): boolean {
  if (!cheminActuel || href.includes("?")) return false;
  const chemin = href;
  if (chemin === "/") return cheminActuel === "/";
  return cheminActuel === chemin || cheminActuel.startsWith(`${chemin}/`);
}
