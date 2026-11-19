"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SuggestionAdresse } from "@/app/api/adresses/route";

/**
 * Champ adresse avec suggestions (Base Adresse Nationale, via /api/adresses).
 * Liste déroulante accessible (motif « combobox ») : flèches, Entrée, Échap.
 * La saisie libre reste toujours possible si le service ne répond pas.
 */

const DELAI_MS = 250;

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
  const [suggestions, setSuggestions] = useState<SuggestionAdresse[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const choisie = useRef<string | null>(null);

  useEffect(() => {
    const q = valeur.trim();
    if (q.length < 3 || q === choisie.current) return;
    const controleur = new AbortController();
    const minuterie = setTimeout(async () => {
      try {
        const reponse = await fetch(`/api/adresses?q=${encodeURIComponent(q)}`, { signal: controleur.signal });
        const { suggestions: s } = (await reponse.json()) as { suggestions: SuggestionAdresse[] };
        setSuggestions(s);
        setOuvert(s.length > 0);
        setActif(-1);
      } catch {
        /* service indisponible ou requête annulée : pas de suggestions */
      }
    }, DELAI_MS);
    return () => {
      clearTimeout(minuterie);
      controleur.abort();
    };
  }, [valeur]);

  const choisir = (s: SuggestionAdresse) => {
    choisie.current = s.libelle;
    onChange(s.libelle);
    setOuvert(false);
    setSuggestions([]);
  };

  const surTouche = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ouvert || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === "Enter" && actif >= 0) {
      e.preventDefault();
      choisir(suggestions[actif]);
    } else if (e.key === "Escape") {
      setOuvert(false);
    }
  };

  const listeVisible = ouvert && suggestions.length > 0;

  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={`${id}-champ`} className="text-sm md:text-[15px]">
        {libelle}
      </label>
      <input
        id={`${id}-champ`}
        name="adresse"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={listeVisible}
        aria-controls={`${id}-liste`}
        aria-activedescendant={listeVisible && actif >= 0 ? `${id}-option-${actif}` : undefined}
        aria-invalid={!!erreur}
        aria-describedby={erreur ? `${id}-erreur` : undefined}
        autoComplete="street-address"
        autoFocus={autoFocus}
        placeholder="Numéro et rue, Bordeaux"
        value={valeur}
        onChange={(e) => {
          choisie.current = null;
          onChange(e.target.value);
        }}
        onKeyDown={surTouche}
        onBlur={() => setTimeout(() => setOuvert(false), 150)}
        className="h-16 border border-grey-dark bg-white px-4 text-lg text-grey-dark md:h-[68px] md:px-5 md:text-xl"
      />
      {erreur && (
        <span id={`${id}-erreur`} className="text-sm font-bold">
          {erreur}
        </span>
      )}
      <ul
        id={`${id}-liste`}
        role="listbox"
        aria-label="Adresses suggérées"
        hidden={!listeVisible}
        className="absolute inset-x-0 top-full z-10 m-0 mt-1 list-none border border-grey-dark bg-white p-0 shadow-[0_12px_30px_rgba(37,37,38,0.15)]"
      >
        {suggestions.map((s, i) => (
          <li
            key={s.libelle}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={i === actif}
            onMouseDown={(e) => {
              e.preventDefault();
              choisir(s);
            }}
            className={`flex min-h-12 cursor-pointer items-center gap-3 border-b border-grey-light px-4 text-base last:border-b-0 ${
              i === actif ? "bg-grey-light" : ""
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {s.libelle}
          </li>
        ))}
      </ul>
      <p className="m-0 text-xs">Suggestions : Base Adresse Nationale.</p>
    </div>
  );
}
