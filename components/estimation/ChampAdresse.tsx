"use client";

import { useId } from "react";
import { SaisieAdresse } from "./SaisieAdresse";

/**
 * Champ adresse du module d'estimation : libellé, saisie avec suggestions (voir SaisieAdresse), erreur.
 */
export function ChampAdresse({
  valeur,
  onChange,
  erreur,
  libelle = "Adresse du bien",
  autoFocus = false,
}: {
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  libelle?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-champ`} className="text-sm md:text-[15px]">
        {libelle}
      </label>
      <SaisieAdresse
        id={`${id}-champ`}
        valeur={valeur}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder="Numéro et rue, Bordeaux"
        mentionSource={false}
        aria={{ invalide: !!erreur, decritPar: erreur ? `${id}-erreur` : undefined }}
        classeChamp="h-16 w-full border border-grey-dark bg-white px-4 text-lg text-grey-dark md:h-[68px] md:px-5 md:text-xl"
      />
      {erreur && (
        <span id={`${id}-erreur`} className="text-sm font-bold">
          {erreur}
        </span>
      )}
      <p className="m-0 text-xs">Suggestions : Base Adresse Nationale.</p>
    </div>
  );
}
