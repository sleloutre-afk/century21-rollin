import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { CarteInteractive, PlanReduit, type SecteurCarte } from "@/components/quartiers/CarteQuartiers";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { getSecteurs } from "@/lib/data";
import { prixAuM2 } from "@/lib/quartiers";
import { ROUTES } from "@/lib/navigation";
import { metaPage } from "@/lib/seo";

/**
 * « Nos quartiers » (brief prompt 6 ; maquette QuartiersDesktop, QuartiersMobile) :
 * carte stylisée cliquable des 6 secteurs, fiche du secteur choisi, vignettes, appel à l'estimation.
 */

export const metadata: Metadata = metaPage({
  titre: "Nos quartiers à Bordeaux",
  description: "Chartrons, Jardin Public, Fondaudège–David Johnston, Parc Rivière, allée Haussmann, Bassins à flot : nos six secteurs de vente, connus rue par rue.",
  chemin: "/quartiers",
});

export default function PageQuartiers() {
  const secteurs = getSecteurs();
  const carte: SecteurCarte[] = secteurs.map((s) => ({
    slug: s.slug,
    nom: s.nom,
    court: s.court,
    accroche: s.accroche ?? "[Présentation en une phrase à rédiger]",
    photo: s.photoVignette,
    prix: prixAuM2(s),
    carte: s.carte,
  }));
  // Ordre des vignettes de la maquette : Chartrons d'abord.
  const vignettes = [...secteurs].sort((a, b) => (a.slug === "chartrons" ? -1 : b.slug === "chartrons" ? 1 : 0));

  return (
    <>
      <FilAriane etapes={[{ libelle: "Nos quartiers" }]} />

      <section aria-labelledby="h1-quartiers" className="py-10 md:py-14">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Nos secteurs</p>
            <h1 id="h1-quartiers" className="m-0 text-[40px] font-medium uppercase leading-none md:text-6xl">
              Nos quartiers
            </h1>
            <p className="m-0 max-w-[620px] text-[17px] leading-normal md:text-lg">
              Six secteurs de vente, connus rue par rue. Location et gestion : toute la métropole bordelaise.
            </p>
          </div>
          <div className="hidden md:block">
            <CarteInteractive secteurs={carte} />
          </div>
          <div className="md:hidden">
            <PlanReduit secteurs={carte} />
          </div>
        </div>
      </section>

      <section aria-labelledby="h-vignettes" className="bg-grey-light py-12 md:py-[88px]">
        <div className="conteneur flex flex-col gap-6 md:gap-10">
          <h2 id="h-vignettes" className="m-0 text-[30px] font-medium uppercase leading-none md:text-5xl">
            Les six secteurs
          </h2>
          {/* Grand écran : vignettes ; téléphone : liste compacte avec vignette (maquette QuartiersMobile). */}
          <ul className="m-0 hidden list-none grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-6 p-0 md:grid">
            {vignettes.map((s) => (
              <li key={s.slug}>
                <Link href={`${ROUTES.quartiers}/${s.slug}`} className="group flex h-full flex-col bg-white text-grey-dark no-underline">
                  <EmplacementPhoto libelle={s.photoVignette} className="h-[240px]" />
                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="m-0 text-[28px] font-medium uppercase leading-none">{s.nom}</h3>
                    <span className="text-sm">{prixAuM2(s)}</span>
                    <span className="pt-2 text-[15px] font-bold">
                      Découvrir le quartier <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 md:hidden">
            {vignettes.map((s) => (
              <li key={s.slug}>
                <Link href={`${ROUTES.quartiers}/${s.slug}`} className="flex items-center gap-4 bg-white p-2 pr-4 text-grey-dark no-underline">
                  <EmplacementPhoto libelle="Photo" className="h-[72px] w-24 flex-none [&_span]:text-[10px]" />
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="m-0 text-lg font-medium uppercase leading-tight">{s.nom}</h3>
                    <span className="text-xs">{prixAuM2(s, true)}</span>
                  </div>
                  <span aria-hidden="true" className="text-xl">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="h-cta-quartiers" className="bg-gold py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_440px] flex-col gap-3">
            <h2 id="h-cta-quartiers" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
              Votre bien mérite un expert de son quartier
            </h2>
            <p className="m-0 text-[17px] leading-normal">Une première fourchette en 2 minutes, puis l&apos;avis du conseiller référent de votre secteur.</p>
          </div>
          <FormulaireAdresse id="quartiers-adresse" bouton="Estimer mon bien" className="flex-[1_1_480px]" />
        </div>
      </section>
    </>
  );
}
