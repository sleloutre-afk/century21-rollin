"use client";

import { useState } from "react";
import { BoutonLien } from "@/components/ui/Bouton";
import { ROUTES } from "@/lib/navigation";

/**
 * Mini-moteur de recherche de l'accueil (maquette : Main, Accueil-mobile-1).
 * Envoie ses filtres à la page de recherche dans l'adresse (?transaction=…&type=…&budget=…&quartier=…).
 * Tranches de budget : celles de la maquette (proposition acceptée par Simon le 19/11/2026).
 */

const BUDGETS = {
  vente: [300_000, 500_000, 800_000, 1_200_000],
  location: [800, 1_200, 1_800],
} as const;

type Transaction = keyof typeof BUDGETS;

const euros = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " €";

const champ =
  "flex flex-col justify-center gap-0.5 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] md:px-4 md:text-xs";
const select = "border-0 bg-transparent py-0.5 text-base normal-case tracking-normal text-grey-dark";
const bascule = "min-h-11 md:min-h-12 px-[22px] font-display text-[15px] font-semibold uppercase tracking-[0.12em] cursor-pointer";

export function MiniMoteur({ localisations }: { localisations: { id: string; nom: string }[] }) {
  const [transaction, setTransaction] = useState<Transaction>("vente");

  return (
    <form action={ROUTES.biens} method="get" aria-label="Rechercher un bien" className="flex flex-col gap-2 bg-grey-light p-2 md:flex-row md:flex-wrap md:items-stretch md:gap-3 md:p-3">
      <input type="hidden" name="transaction" value={transaction} />
      <div role="group" aria-label="Type de recherche" className="grid grid-cols-2 gap-1 bg-white p-1 md:flex">
        {(["vente", "location"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={transaction === t}
            onClick={() => setTransaction(t)}
            className={`${bascule} ${transaction === t ? "bg-grey-dark text-white" : "bg-white text-grey-dark"}`}
          >
            {t === "vente" ? "Acheter" : "Louer"}
          </button>
        ))}
      </div>

      <label className={`${champ} hidden md:flex md:flex-[1_1_160px]`}>
        Type
        <select name="type" className={select} defaultValue="">
          <option value="">Appartement ou maison</option>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>
      </label>

      <label className={`${champ} hidden md:flex md:flex-[1_1_160px]`}>
        Budget max.
        <select name="budget" className={select} defaultValue="" key={transaction}>
          <option value="">Indifférent</option>
          {BUDGETS[transaction].map((b) => (
            <option key={b} value={b}>
              {transaction === "vente" ? euros(b) : `${euros(b)} / mois`}
            </option>
          ))}
        </select>
      </label>

      <label className={`${champ} md:flex-[1_1_200px]`}>
        Quartier
        <select name="quartier" className={select} defaultValue="">
          <option value="">Tous les quartiers</option>
          {localisations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nom}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2 md:contents">
        <BoutonLien href={ROUTES.biens} variante="contour" className="min-h-[52px] bg-white text-sm md:hidden">
          Plus de filtres
        </BoutonLien>
        <button
          type="submit"
          className="min-h-[52px] cursor-pointer bg-grey-dark px-7 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white hover:text-gold md:min-h-[60px] md:flex-none md:text-[15px]"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
