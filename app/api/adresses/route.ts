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

export async function GET(requete: NextRequest) {
  const q = requete.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 200) return NextResponse.json({ suggestions: [] });

  const url = new URL(SERVICE);
  url.searchParams.set("q", q);
  url.searchParams.set("index", "address");
  url.searchParams.set("autocomplete", "1");
  url.searchParams.set("limit", "8");
  // Priorité aux adresses proches de l'agence (Chartrons).
  url.searchParams.set("lat", "44.8547");
  url.searchParams.set("lon", "-0.5744");

  try {
    const reponse = await fetch(url, { signal: AbortSignal.timeout(4000), headers: { Accept: "application/json" } });
    if (!reponse.ok) return NextResponse.json({ suggestions: [] });
    const donnees = (await reponse.json()) as {
      features?: { properties?: { label?: string; postcode?: string; city?: string; depcode?: string } }[];
    };
    const suggestions: SuggestionAdresse[] = (donnees.features ?? [])
      .map((f) => f.properties ?? {})
      .filter((p) => p.depcode === "33" && p.label)
      .slice(0, 5)
      .map((p) => ({ libelle: p.label!, codePostal: p.postcode ?? "", ville: p.city ?? "" }));
    return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "public, max-age=3600" } });
  } catch {
    // Service indisponible : la saisie libre reste possible.
    return NextResponse.json({ suggestions: [] });
  }
}
