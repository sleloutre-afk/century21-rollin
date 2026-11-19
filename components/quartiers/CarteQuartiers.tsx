"use client";

import Link from "next/link";
import { useState } from "react";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";

/**
 * Carte stylisée des 6 secteurs (maquette QuartiersDesktop ; annotation « Carte stylisée · à valider »).
 * Plan simplifié, pas une carte géographique : positions approximatives, à valider par l'agence.
 * Grand écran : cliquer un secteur met à jour la fiche à gauche. Téléphone : plan réduit, non cliquable,
 * la navigation se fait par la liste des secteurs (maquette QuartiersMobile).
 */

export type SecteurCarte = {
  slug: string;
  nom: string;
  court: string;
  accroche: string;
  photo: string;
  prix: string;
  carte: { gauche: number; haut: number; largeur: number; hauteur: number };
};

// Point de l'agence sur le plan (maquette).
const AGENCE = { gauche: 60, haut: 43 };

function Fond() {
  return (
    <>
      <div aria-hidden="true" className="absolute -bottom-[10%] -top-[10%] left-[84%] w-[22%] rounded-l-[50%] bg-grey-dark" />
      <span aria-hidden="true" className="absolute left-[88%] top-[48%] origin-top-left rotate-90 font-display text-xs uppercase tracking-[0.4em] text-gold md:text-[15px]">
        Garonne
      </span>
      <span aria-hidden="true" className="absolute bottom-3 left-1/2 -translate-x-1/2 font-display text-[11px] uppercase tracking-[0.2em] md:bottom-[18px] md:text-[13px]">
        ↓ Centre historique
      </span>
      <span aria-hidden="true" className="absolute left-3 top-3 font-display text-[10px] uppercase tracking-[0.16em] md:left-[18px] md:top-[18px] md:text-xs">
        N ↑ · plan schématique
      </span>
    </>
  );
}

function PointAgence() {
  return (
    <>
      <span aria-hidden="true" className="absolute size-3 rounded-full border-2 border-white bg-grey-dark md:size-4 md:border-[3px]" style={{ left: `${AGENCE.gauche}%`, top: `${AGENCE.haut}%` }} />
      <span className="absolute bg-white px-1.5 py-0.5 text-[10px] font-bold md:px-2 md:py-1 md:text-xs" style={{ left: `calc(${AGENCE.gauche}% + 20px)`, top: `calc(${AGENCE.haut}% - 2px)` }}>
        L&apos;agence
      </span>
    </>
  );
}

const position = (c: SecteurCarte["carte"]) => ({ left: `${c.gauche}%`, top: `${c.haut}%`, width: `${c.largeur}%`, height: `${c.hauteur}%` });

/** Plan réduit du téléphone : image décorative, sans interaction. */
export function PlanReduit({ secteurs }: { secteurs: SecteurCarte[] }) {
  return (
    <div role="img" aria-label="Plan schématique des six secteurs" className="relative h-[340px] overflow-hidden bg-grey-light">
      <Fond />
      {secteurs.map((s) => (
        <span key={s.slug} aria-hidden="true" className="absolute flex items-end border border-grey-medium bg-white p-1.5 font-display text-[11px] font-medium uppercase leading-none" style={position(s.carte)}>
          {s.court}
        </span>
      ))}
      <PointAgence />
    </div>
  );
}

/** Carte cliquable + fiche du secteur choisi (grand écran). */
export function CarteInteractive({ secteurs, initial = "chartrons" }: { secteurs: SecteurCarte[]; initial?: string }) {
  const [choisi, setChoisi] = useState(initial);
  const s = secteurs.find((x) => x.slug === choisi) ?? secteurs[0];

  return (
    <div className="flex flex-wrap items-stretch gap-12">
      <article aria-live="polite" aria-labelledby="fiche-secteur" className="flex flex-[1_1_380px] flex-col border border-grey-light bg-white">
        <EmplacementPhoto libelle={s.photo} className="h-[260px]" />
        <div className="flex flex-1 flex-col gap-4 p-8">
          <h2 id="fiche-secteur" className="m-0 text-[40px] font-medium uppercase leading-none">
            {s.nom}
          </h2>
          <p className="m-0 text-[17px] leading-normal">{s.accroche}</p>
          <span className="text-sm">{s.prix}</span>
          <div className="mt-auto flex flex-wrap items-center gap-6 pt-2">
            <Link href={`/quartiers/${s.slug}`} className="border-b border-grey-dark pb-0.5 text-base font-bold text-grey-dark no-underline">
              Découvrir le quartier <span aria-hidden="true">→</span>
            </Link>
            <Link href={`/biens?transaction=vente&quartier=${s.slug}`} className="text-[15px] text-grey-dark underline">
              Biens en vente
            </Link>
          </div>
        </div>
      </article>

      <div role="group" aria-label="Carte stylisée des secteurs" className="relative min-h-[640px] flex-[1.5_1_620px] overflow-hidden bg-grey-light">
        <Fond />
        {secteurs.map((x) => {
          const actif = x.slug === choisi;
          return (
            <button
              key={x.slug}
              type="button"
              aria-pressed={actif}
              onClick={() => setChoisi(x.slug)}
              className={`absolute flex cursor-pointer items-end p-3.5 text-left font-display uppercase leading-[1.05] text-grey-dark transition-colors ${
                actif
                  ? "z-10 border-2 border-grey-dark bg-gold text-xl font-semibold shadow-[0_16px_30px_rgba(37,37,38,0.2)]"
                  : "border border-grey-medium bg-white text-lg font-medium hover:border-2 hover:border-grey-dark"
              }`}
              style={position(x.carte)}
            >
              {x.nom}
            </button>
          );
        })}
        <PointAgence />
      </div>
    </div>
  );
}
