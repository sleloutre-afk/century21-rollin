"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SuggestionAdresse } from "@/app/api/adresses/route";

/**
 * Saisie d'adresse avec suggestions (Base Adresse Nationale, via /api/adresses).
 * Liste déroulante accessible (motif « combobox ») : flèches, Entrée, Échap.
 * Utilisée par le haut de page d'accueil, les formulaires « Adresse de votre bien » et le module d'estimation.
 * Valeur contrôlée (valeur + onChange) ou libre (le formulaire parent lit le champ « adresse »).
 * La saisie libre reste toujours possible si le service ne répond pas.
 */

const DELAI_MS = 250;

type Props = {
  id?: string;
  valeur?: string;
  onChange?: (v: string) => void;
  placeholder: string;
  /** Classes du champ lui-même. */
  classeChamp: string;
  /** Classes du conteneur (positionné en relative). */
  className?: string;
  autoFocus?: boolean;
  /** Mention de la source dans la liste (sinon affichée par le parent). */
  mentionSource?: boolean;
  aria?: { invalide?: boolean; decritPar?: string };
};

export function SaisieAdresse({ id, valeur, onChange, placeholder, classeChamp, className = "", autoFocus = false, mentionSource = true, aria }: Props) {
  const auto = useId();
  const idChamp = id ?? `${auto}-champ`;
  const [interne, setInterne] = useState("");
  const texte = valeur ?? interne;
  const changer = (v: string) => (onChange ? onChange(v) : setInterne(v));

  const [suggestions, setSuggestions] = useState<SuggestionAdresse[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const choisie = useRef<string | null>(null);

  useEffect(() => {
    const q = texte.trim();
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
  }, [texte]);

  const choisir = (s: SuggestionAdresse) => {
    choisie.current = s.libelle;
    changer(s.libelle);
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
    <div className={`relative ${className}`}>
      <input
        id={idChamp}
        name="adresse"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={listeVisible}
        aria-controls={`${idChamp}-liste`}
        aria-activedescendant={listeVisible && actif >= 0 ? `${idChamp}-option-${actif}` : undefined}
        aria-invalid={aria?.invalide || undefined}
        aria-describedby={aria?.decritPar}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={texte}
        onChange={(e) => {
          choisie.current = null;
          changer(e.target.value);
        }}
        onKeyDown={surTouche}
        onBlur={() => setTimeout(() => setOuvert(false), 150)}
        className={classeChamp}
      />
      <div
        hidden={!listeVisible}
        className="absolute inset-x-0 top-full z-30 mt-1 border border-grey-dark bg-white text-grey-dark shadow-[0_12px_30px_rgba(37,37,38,0.15)]"
      >
        <ul id={`${idChamp}-liste`} role="listbox" aria-label="Adresses suggérées" className="m-0 list-none p-0">
          {suggestions.map((s, i) => (
            <li
              key={s.libelle}
              id={`${idChamp}-option-${i}`}
              role="option"
              aria-selected={i === actif}
              onMouseDown={(e) => {
                e.preventDefault();
                choisir(s);
              }}
              className={`flex min-h-12 cursor-pointer items-center gap-3 border-b border-grey-light px-4 text-left text-base last:border-b-0 ${
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
        {mentionSource && <p className="m-0 border-t border-grey-light px-4 py-2 text-left text-xs">Suggestions : Base Adresse Nationale.</p>}
      </div>
    </div>
  );
}
