"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CarteMembre } from "@/components/equipe/CarteMembre";
import type { Membre, Pole } from "@/lib/schemas/equipe";

/**
 * Équipe regroupée par pôle, filtrable (maquette EquipeDesktop, EquipeMobile ; annotation « Filtres par pôle »).
 * Le pôle choisi reste dans l'adresse de la page (?pole=transaction) ; barre de filtres fixe au défilement.
 */

type Props = { poles: Pole[]; membres: Membre[] };

export function ListeEquipeAvecParametres(props: Props) {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const pole = parametres.get("pole") ?? "";
  return (
    <ListeEquipe
      {...props}
      pole={props.poles.some((p) => p.id === pole) ? pole : ""}
      onChange={(p) => router.replace(p ? `${chemin}?pole=${p}` : chemin, { scroll: false })}
    />
  );
}

export function ListeEquipe({ poles, membres, pole = "", onChange }: Props & { pole?: string; onChange?: (p: string) => void }) {
  const groupes = poles.filter((p) => !pole || p.id === pole).map((p) => ({ pole: p, membres: membres.filter((m) => m.pole === p.id) }));

  const puce = (id: string, libelle: string) => (
    <button
      key={id || "tous"}
      type="button"
      aria-pressed={pole === id}
      onClick={() => onChange?.(id)}
      className={`min-h-12 flex-none cursor-pointer border border-grey-dark px-[18px] font-display text-sm uppercase tracking-[0.12em] ${
        pole === id ? "bg-grey-dark text-white" : "bg-white text-grey-dark"
      }`}
    >
      {libelle}
    </button>
  );

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-grey-light bg-white">
        <div role="group" aria-label="Filtrer par pôle" className="conteneur flex items-center gap-2.5 overflow-x-auto py-4 md:flex-wrap md:py-5">
          {puce("", "Tous")}
          {poles.map((p) => puce(p.id, p.nom))}
        </div>
      </div>

      <div className="conteneur flex flex-col gap-14 py-10 md:gap-20 md:py-16">
        {groupes.map((g) => (
          <section key={g.pole.id} aria-labelledby={`pole-${g.pole.id}`} className="flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-grey-dark pt-5">
              <h2 id={`pole-${g.pole.id}`} className="m-0 text-[30px] font-medium uppercase leading-none md:text-[40px]">
                {g.pole.nom}
              </h2>
              <span className="text-[15px]">{g.pole.desc}</span>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-8 p-0 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-x-6 md:gap-y-10">
              {g.membres.map((m) => (
                <li key={m.slug}>
                  <CarteMembre membre={m} details />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
