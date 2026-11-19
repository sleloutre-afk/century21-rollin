"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CarteVendu } from "@/components/biens/CarteVendu";
import type { Vente } from "@/lib/biens/ventes";

/**
 * Biens vendus filtrés par quartier (maquette VendusDesktop, VendusMobile) : ?quartier= dans l'adresse de la page.
 * Les emplacements (aucune vente fournie) s'affichent quel que soit le filtre, toujours étiquetés « [Quartier] ».
 */

const PAR_PAGE = 12;

type Props = { ventes: Vente[]; quartiers: { id: string; nom: string; court: string }[] };

export function ListeVendusAvecParametres(props: Props) {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const quartier = parametres.get("quartier") ?? "";
  return (
    <ListeVendus
      {...props}
      quartier={props.quartiers.some((q) => q.id === quartier) ? quartier : ""}
      onChange={(q) => router.replace(q ? `${chemin}?quartier=${q}` : chemin, { scroll: false })}
    />
  );
}

export function ListeVendus({ ventes, quartiers, quartier = "", onChange }: Props & { quartier?: string; onChange?: (q: string) => void }) {
  const [affiches, setAffiches] = useState(PAR_PAGE);
  const emplacements = ventes.every((v) => v.emplacement);
  const filtrees = emplacements || !quartier ? ventes : ventes.filter((v) => v.secteur === quartier);
  const nom = quartiers.find((q) => q.id === quartier)?.nom;
  const compte = emplacements ? "[—] biens vendus" : `${filtrees.length} bien${filtrees.length > 1 ? "s" : ""} vendu${filtrees.length > 1 ? "s" : ""}`;

  const puce = (id: string, libelle: string, court = libelle) => (
    <button
      key={id || "tous"}
      type="button"
      aria-pressed={quartier === id}
      onClick={() => {
        setAffiches(PAR_PAGE);
        onChange?.(id);
      }}
      className={`min-h-12 flex-none cursor-pointer border border-grey-dark px-[18px] text-[15px] ${quartier === id ? "bg-grey-dark text-white" : "bg-white text-grey-dark"}`}
    >
      <span className="md:hidden">{court}</span>
      <span className="hidden md:inline">{libelle}</span>
    </button>
  );

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-grey-light bg-white">
        <div role="group" aria-label="Filtrer par quartier" className="conteneur flex items-center gap-2.5 overflow-x-auto py-4 md:flex-wrap md:py-6">
          <span className="hidden text-[15px] md:inline">Quartier :</span>
          {puce("", "Tous")}
          {quartiers.map((q) => puce(q.id, q.nom, q.court))}
          <span role="status" className="ml-auto hidden flex-none text-sm md:inline">
            {compte}
            {nom ? ` · ${nom}` : ""}
          </span>
        </div>
      </div>

      <section aria-label="Liste des biens vendus" className="conteneur pb-16 pt-8 md:pt-14">
        {filtrees.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-8 p-0 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-x-6 md:gap-y-10">
            {filtrees.slice(0, affiches).map((v) => (
              <li key={v.cle}>
                <CarteVendu vente={v} surFondSombre={false} hauteur="h-[150px] md:h-[240px]" niveauTitre={2} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 bg-grey-light p-6 text-base md:p-10">Aucune vente à afficher pour {nom} pour le moment.</p>
        )}
        {filtrees.length > affiches && (
          <div className="flex justify-center pt-10">
            <button type="button" onClick={() => setAffiches((n) => n + PAR_PAGE)} className="min-h-14 cursor-pointer border border-grey-dark bg-white px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-grey-light">
              Afficher plus de ventes
            </button>
          </div>
        )}
      </section>
    </>
  );
}
