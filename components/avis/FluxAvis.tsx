"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Flux des derniers avis, filtrable par service (maquette AvisDesktop ; annotation « Dynamique · avis »).
 * Flux Google à brancher (outil à choisir) : en attendant, emplacements. Étoiles : décision de Simon (19/11/2026).
 * Service filtré dans l'adresse de la page (?service=vente).
 */

const SERVICES = [
  { id: "vente", libelle: "Vente" },
  { id: "location", libelle: "Location" },
  { id: "gestion", libelle: "Gestion" },
];

// Services des emplacements, repris de la maquette.
const EMPLACEMENTS = ["vente", "location", "gestion", "vente", "gestion", "location", "vente", "gestion", "vente"].map((service, i) => ({ n: i + 1, service }));
const PAR_PAGE = 6;

export function FluxAvisAvecParametres() {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const service = parametres.get("service") ?? "";
  return (
    <FluxAvis
      service={SERVICES.some((s) => s.id === service) ? service : ""}
      onChange={(s) => router.replace(s ? `${chemin}?service=${s}` : chemin, { scroll: false })}
    />
  );
}

export function FluxAvis({ service = "", onChange }: { service?: string; onChange?: (s: string) => void }) {
  const [affiches, setAffiches] = useState(PAR_PAGE);
  const liste = service ? EMPLACEMENTS.filter((a) => a.service === service) : EMPLACEMENTS;
  const libelle = (id: string) => SERVICES.find((s) => s.id === id)?.libelle ?? "";

  const puce = (id: string, texte: string) => (
    <button
      key={id || "tous"}
      type="button"
      aria-pressed={service === id}
      onClick={() => {
        setAffiches(PAR_PAGE);
        onChange?.(id);
      }}
      className={`min-h-12 flex-none cursor-pointer border border-grey-dark px-[18px] text-[15px] ${service === id ? "bg-grey-dark text-white" : "bg-white text-grey-dark"}`}
    >
      {texte}
    </button>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="h-flux" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
          Les derniers avis
        </h2>
        <div role="group" aria-label="Filtrer par service" className="flex gap-2.5 overflow-x-auto">
          {puce("", "Tous")}
          {SERVICES.map((s) => puce(s.id, s.libelle))}
        </div>
      </div>
      <div aria-live="polite" className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {liste.slice(0, affiches).map((a) => (
          <figure key={a.n} className="m-0 flex min-h-[220px] flex-col gap-4 border border-grey-light p-6 md:p-8">
            <div className="flex items-center justify-between">
              <span role="img" aria-label="Note 5 sur 5" className="text-lg tracking-[3px]">
                ★★★★★
              </span>
              <span className="font-display text-[13px] uppercase tracking-[0.14em]">{libelle(a.service)}</span>
            </div>
            <blockquote className="m-0 flex-1 text-base leading-normal md:text-lg">[Extrait de l&apos;avis Google n° {a.n}, importé automatiquement]</blockquote>
            <figcaption className="flex justify-between border-t border-grey-light pt-3.5 text-sm">
              <strong>[Prénom]</strong>
              <span>Google · [date]</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {liste.length > affiches && (
        <button
          type="button"
          onClick={() => setAffiches((n) => n + PAR_PAGE)}
          className="min-h-14 cursor-pointer self-center border border-grey-dark bg-white px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-grey-light"
        >
          Afficher plus d&apos;avis
        </button>
      )}
    </div>
  );
}
