import { NextResponse, type NextRequest } from "next/server";

/**
 * Suggestions d'adresses pour le module d'estimation.
 * Source : Base Adresse Nationale, via le service public de géocodage de la Géoplateforme (IGN),
 * gratuit et sans clé. Accord de Simon le 19/11/2026.
 * Les recherches passent par le site : l'adresse IP du visiteur n'est pas transmise au service.
 * Résultats limités à la Gironde (vente sur Bordeaux, location et gestion sur la métropole).
 * À VALIDER : conditions d'utilisation de la Géoplateforme (limite de requêtes) avant la mise en production.
 */

const SERVICE = "https://data.geopf.fr/geocodage/search";

export type SuggestionAdresse = { libelle: string; codePostal: string; ville: string };

async function chercher(texte: string): Promise<SuggestionAdresse[]> {
  const url = new URL(SERVICE);
  url.searchParams.set("q", texte);
  url.searchParams.set("index", "address");
  url.searchParams.set("autocomplete", "1");
  url.searchParams.set("limit", "15");
  // Priorité aux adresses proches de l'agence (Chartrons).
  url.searchParams.set("lat", "44.8547");
  url.searchParams.set("lon", "-0.5744");
  const reponse = await fetch(url, { signal: AbortSignal.timeout(4000), headers: { Accept: "application/json" } });
  if (!reponse.ok) return [];
  const donnees = (await reponse.json()) as {
    features?: { properties?: { label?: string; postcode?: string; city?: string; depcode?: string } }[];
  };
  return (donnees.features ?? [])
    .map((f) => f.properties ?? {})
    .filter((p) => p.depcode === "33" && p.label)
    .map((p) => ({ libelle: p.label!, codePostal: p.postcode ?? "", ville: p.city ?? "" }));
}

export async function GET(requete: NextRequest) {
  const q = requete.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 200) return NextResponse.json({ suggestions: [] });

  // Deux recherches en parallèle : la saisie telle quelle, et la saisie suivie de « Bordeaux ».
  // Sans cela, une saisie partielle (« 12 rue notre ») ne renvoie que des adresses hors Gironde.
  const requetes = [q, ...(/bordeaux/i.test(q) ? [] : [`${q} Bordeaux`])];

  try {
    const resultats = await Promise.all(requetes.map(chercher));
    const vues = new Set<string>();
    const suggestions: SuggestionAdresse[] = resultats
      .flat()
      .filter((s) => (vues.has(s.libelle) ? false : (vues.add(s.libelle), true)))
      .slice(0, 5);
    return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "public, max-age=3600" } });
  } catch {
    // Service indisponible : la saisie libre reste possible.
    return NextResponse.json({ suggestions: [] });
  }
}
