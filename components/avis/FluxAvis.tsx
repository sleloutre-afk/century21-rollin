"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CarteAvis } from "@/components/avis/CarteAvis";
import type { Avis } from "@/lib/schemas/avis";

/**
 * Flux des derniers avis, filtrable par service (maquette AvisDesktop ; annotation « Dynamique · avis »).
 * Avis : sélection recopiée du site actuel (contenus/avis.json), en attendant le branchement dynamique
 * des avis Google (décision du client).
 * Service filtré dans l'adresse de la page (?service=vente).
 */

const SERVICES = [
  { id: "vente", libelle: "Vente" },
  { id: "location", libelle: "Location" },
  { id: "gestion", libelle: "Gestion" },
];

const PAR_PAGE = 6;

export function FluxAvisAvecParametres({ avis }: { avis: Avis[] }) {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const service = parametres.get("service") ?? "";
  return (
    <FluxAvis
      avis={avis}
      service={SERVICES.some((s) => s.id === service) ? service : ""}
      onChange={(s) => router.replace(s ? `${chemin}?service=${s}` : chemin, { scroll: false })}
    />
  );
}

export function FluxAvis({ avis, service = "", onChange }: { avis: Avis[]; service?: string; onChange?: (s: string) => void }) {
  const [affiches, setAffiches] = useState(PAR_PAGE);
  const liste = service ? avis.filter((a) => a.service === service) : avis;

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
          <CarteAvis key={a.id} avis={a} bordure />
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
