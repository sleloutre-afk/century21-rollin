import Link from "next/link";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { TitreSection } from "@/components/ui/TitreSection";
import { getSecteurs } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import type { Secteur } from "@/lib/schemas/quartier";

/**
 * « Six secteurs, connus rue par rue » (brief §7.6 ; maquette Main et Accueil-mobile-1).
 * Prix moyen au m² : affiché seulement avec sa source datée, sinon « [donnée à venir] ».
 * Le cartouche blanc garantit la lisibilité du texte sur les futures photos.
 */

// Libellés des emplacements photo, repris de la maquette.
const PHOTOS: Record<Secteur["slug"], string> = {
  chartrons: "Photo · quai des Chartrons",
  "jardin-public": "Photo · Jardin Public",
  "fondaudege-david-johnston": "Photo · échoppes",
  "parc-riviere": "Photo · Parc Rivière",
  "allee-haussmann": "Photo · allée Haussmann",
  "bassins-a-flot": "Photo · Bassins à flot",
};

function prix(s: Secteur, court = false): string {
  if (s.prixMoyenM2 === null || s.sourcePrix === null) return court ? "Prix au m² : [à venir]" : "Prix moyen au m² : [donnée à venir]";
  const montant = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(s.prixMoyenM2);
  return `Prix moyen au m² : ${montant} (${s.sourcePrix})`;
}

export function Quartiers() {
  const secteurs = getSecteurs();
  const [premier, ...autres] = secteurs;

  return (
    <section id="quartiers" aria-labelledby="h-quartiers" className="py-14 md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-12">
        <TitreSection
          id="h-quartiers"
          surtitre="Nos quartiers"
          titre="Six secteurs, connus rue par rue"
          texte="Vente sur nos six secteurs. Location et gestion sur toute la métropole bordelaise."
        />

        {/* Desktop : mosaïque, Chartrons en grand */}
        <ul className="m-0 hidden list-none grid-cols-3 auto-rows-[260px] gap-6 p-0 md:grid">
          <li className="col-span-2 row-span-2">
            <Link href={`${ROUTES.quartiers}/${premier.slug}`} className="group relative block h-full text-grey-dark no-underline">
              <EmplacementPhoto libelle={PHOTOS[premier.slug]} etiquette="haut-droite" className="absolute inset-0" />
              <div className="absolute bottom-6 left-6 flex min-w-[340px] flex-col gap-2 bg-white px-7 py-6">
                <h3 className="m-0 text-[40px] font-medium uppercase leading-none">{premier.nom}</h3>
                <span className="text-sm">{prix(premier)}</span>
                <span className="text-[15px] font-bold">
                  Découvrir le quartier <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </li>
          {autres.map((s) => (
            <li key={s.slug}>
              <Link href={`${ROUTES.quartiers}/${s.slug}`} className="group relative block h-full text-grey-dark no-underline">
                <EmplacementPhoto libelle={PHOTOS[s.slug]} etiquette="haut-droite" className="absolute inset-0" />
                <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5 bg-white px-[18px] py-4">
                  <h3 className="m-0 text-2xl font-medium uppercase leading-none">{s.nom}</h3>
                  <span className="text-[13px]">{prix(s)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile : grille de 2 colonnes */}
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:hidden">
          {secteurs.map((s) => (
            <li key={s.slug}>
              <Link href={`${ROUTES.quartiers}/${s.slug}`} className="group relative flex h-[150px] items-end p-2 text-grey-dark no-underline">
                <EmplacementPhoto libelle="Photo" etiquette="haut-droite" className="absolute inset-0" />
                <div className="relative flex w-full flex-col gap-0.5 bg-white px-2.5 py-2">
                  <span className="font-display text-base font-medium uppercase leading-[1.05]">{s.nom}</span>
                  <span className="text-[11px]">{prix(s, true)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
