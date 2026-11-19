import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Recherche de biens : filtres lus dans l'adresse de la page (partage, retour arrière, référencement — spec §2),
 * puis appliqués aux annonces. Fonctions pures, partagées par la page et les tests.
 *
 * ?transaction=vente|location &type=maison|appartement &budget=<max €> &surface=<min m²>
 * &pieces=<min> &quartier=<localisation> &tri=recents|prix-asc|prix-desc|surface &vue=liste|carte
 */

export type Tri = "recents" | "prix-asc" | "prix-desc" | "surface";
export type Vue = "liste" | "carte";

export type Filtres = {
  transaction: "vente" | "location";
  type: "" | "maison" | "appartement";
  budget: number | null;
  surface: number | null;
  pieces: number | null;
  quartier: string;
  tri: Tri;
  vue: Vue;
};

export const FILTRES_PAR_DEFAUT: Filtres = {
  transaction: "vente",
  type: "",
  budget: null,
  surface: null,
  pieces: null,
  quartier: "",
  tri: "recents",
  vue: "liste",
};

/** Tranches de la maquette (Main, RechercheDesktop) — proposition acceptée par Simon le 19/11/2026. */
export const BUDGETS = {
  vente: [300_000, 500_000, 800_000, 1_200_000],
  location: [800, 1_200, 1_800],
} as const;

/** À VALIDER : seuils de surface minimale (la maquette n'en précise pas). */
export const SURFACES = [30, 50, 75, 100, 150] as const;

/** « 5 » signifie « 5 pièces et plus » (maquette Acheter : « 3 pièces et + »). */
export const PIECES = [1, 2, 3, 4, 5] as const;

export const TRIS: { id: Tri; libelle: string }[] = [
  { id: "recents", libelle: "Plus récents" },
  { id: "prix-asc", libelle: "Prix croissant" },
  { id: "prix-desc", libelle: "Prix décroissant" },
  { id: "surface", libelle: "Surface" },
];

type Lecteur = { get(nom: string): string | null };

const entierPositif = (v: string | null) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

export function lireFiltres(parametres: Lecteur): Filtres {
  const transaction = parametres.get("transaction") === "location" ? "location" : "vente";
  const type = parametres.get("type");
  const tri = parametres.get("tri");
  return {
    transaction,
    type: type === "maison" || type === "appartement" ? type : "",
    budget: entierPositif(parametres.get("budget")),
    surface: entierPositif(parametres.get("surface")),
    pieces: entierPositif(parametres.get("pieces")),
    quartier: (parametres.get("quartier") ?? "").slice(0, 60),
    tri: TRIS.some((t) => t.id === tri) ? (tri as Tri) : "recents",
    vue: parametres.get("vue") === "carte" ? "carte" : "liste",
  };
}

/** Adresse de la page pour ces filtres : seules les valeurs différentes du défaut y figurent (sauf la transaction). */
export function ecrireFiltres(f: Filtres): string {
  const p = new URLSearchParams();
  p.set("transaction", f.transaction);
  if (f.type) p.set("type", f.type);
  if (f.budget) p.set("budget", String(f.budget));
  if (f.surface) p.set("surface", String(f.surface));
  if (f.pieces) p.set("pieces", String(f.pieces));
  if (f.quartier) p.set("quartier", f.quartier);
  if (f.tri !== "recents") p.set("tri", f.tri);
  if (f.vue !== "liste") p.set("vue", f.vue);
  return p.toString();
}

/** Prix comparé au budget : prix honoraires inclus (vente) ou loyer charges comprises (location). */
export function prixDe(a: Annonce): number | null {
  return a.transaction === "location" ? (a.location?.loyerChargesComprises ?? null) : a.prixHonorairesInclus;
}

/** Annonces visibles dans la recherche : en vente ou sous compromis (vente), en location (location). */
export function estVisibleEnRecherche(a: Annonce): boolean {
  return a.transaction === "vente" ? a.statut === "en_vente" || a.statut === "sous_compromis" : a.statut === "en_location";
}

export function filtrer(annonces: Annonce[], f: Filtres): Annonce[] {
  return annonces.filter((a) => {
    if (a.transaction !== f.transaction || !estVisibleEnRecherche(a)) return false;
    if (f.type && a.type !== f.type) return false;
    if (f.budget !== null) {
      const prix = prixDe(a);
      if (prix === null || prix > f.budget) return false;
    }
    if (f.surface !== null && a.surfaceHabitable < f.surface) return false;
    if (f.pieces !== null && a.pieces < f.pieces) return false;
    if (f.quartier && a.secteur !== f.quartier) return false;
    return true;
  });
}

export function trier(annonces: Annonce[], tri: Tri): Annonce[] {
  const copie = [...annonces];
  const prix = (a: Annonce) => prixDe(a) ?? Number.POSITIVE_INFINITY;
  switch (tri) {
    case "prix-asc":
      return copie.sort((a, b) => prix(a) - prix(b));
    case "prix-desc":
      return copie.sort((a, b) => (prixDe(b) ?? -1) - (prixDe(a) ?? -1));
    case "surface":
      return copie.sort((a, b) => b.surfaceHabitable - a.surfaceHabitable);
    default:
      // Sans date de mise en ligne : ordre du fichier, après les annonces datées.
      return copie.sort((a, b) => (b.dateMiseEnLigne ?? "").localeCompare(a.dateMiseEnLigne ?? ""));
  }
}

/** Biens similaires : même transaction, hors annonce en cours, prix le plus proche. */
export function similaires(annonces: Annonce[], courante: Annonce, nombre = 3): Annonce[] {
  const prixCourant = prixDe(courante) ?? 0;
  return annonces
    .filter((a) => a.slug !== courante.slug && a.transaction === courante.transaction && estVisibleEnRecherche(a))
    .sort((a, b) => Math.abs((prixDe(a) ?? 0) - prixCourant) - Math.abs((prixDe(b) ?? 0) - prixCourant))
    .slice(0, nombre);
}

const euros = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} €`;

/** Critères en clair, pour l'alerte e-mail : « Achat · Appartement · Chartrons · 3 pièces et + · Jusqu'à 500 000 € ». */
export function decrireCriteres(f: Filtres, localisations: { id: string; nom: string }[]): string[] {
  const criteres: string[] = [f.transaction === "location" ? "Location" : "Achat"];
  criteres.push(f.type === "maison" ? "Maison" : f.type === "appartement" ? "Appartement" : "Appartement ou maison");
  criteres.push(localisations.find((l) => l.id === f.quartier)?.nom ?? "Tous les quartiers");
  if (f.pieces) criteres.push(f.pieces === 1 ? "1 pièce et +" : `${f.pieces} pièces et +`);
  if (f.surface) criteres.push(`${f.surface} m² et +`);
  if (f.budget) criteres.push(`Jusqu'à ${euros(f.budget)}${f.transaction === "location" ? " / mois" : ""}`);
  return criteres;
}
