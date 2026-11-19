"use client";

import { useEffect, useRef, useState } from "react";
import { decouperCompteur } from "@/lib/format/compteur";

/**
 * Chiffre clé qui défile de 0 à sa valeur quand il apparaît à l'écran.
 * - La valeur finale est rendue côté serveur (référencement, affichage sans JavaScript).
 * - Aucune animation si l'utilisateur a demandé moins d'animations (prefers-reduced-motion).
 * - Les lecteurs d'écran lisent directement la valeur finale.
 * Un chiffre d'activité s'affiche toujours avec sa période : c'est le rôle de `legende`.
 */

const DUREE_MS = 1400;

export function Compteur({
  valeur,
  legende,
  surFondSombre = false,
  accent = false,
}: {
  valeur: string;
  legende: string;
  surFondSombre?: boolean;
  /** Chiffre en or (uniquement sur fond sombre). */
  accent?: boolean;
}) {
  const { prefixe, nombre, suffixe } = decouperCompteur(valeur);
  const [affiche, setAffiche] = useState<number | null>(nombre);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (nombre === null || !element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let animation = 0;
    // Uniquement les compteurs encore hors de l'écran : ceux déjà visibles gardent leur valeur.
    const dejaVisible = element.getBoundingClientRect().top < window.innerHeight;
    if (dejaVisible) return;

    // La valeur réelle reste affichée tant que le compteur n'approche pas de l'écran
    // (jamais de « 0 » trompeur). La remise à zéro se fait juste avant son apparition.
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        observateur.disconnect();
        setAffiche(0);
        const debut = performance.now();
        const avancer = (maintenant: number) => {
          const t = Math.min(1, (maintenant - debut) / DUREE_MS);
          const adouci = 1 - Math.pow(1 - t, 3);
          setAffiche(Math.round(nombre * adouci));
          if (t < 1) animation = requestAnimationFrame(avancer);
        };
        animation = requestAnimationFrame(avancer);
      },
      // Déclenché quand le compteur arrive à 15 % sous le bas de l'écran.
      { rootMargin: "0px 0px 15% 0px" },
    );
    observateur.observe(element);
    return () => {
      observateur.disconnect();
      cancelAnimationFrame(animation);
    };
  }, [nombre]);

  const couleurChiffre = accent && surFondSombre ? "text-gold" : "";

  return (
    <div ref={ref} className="flex flex-col-reverse gap-2">
      <p className={`m-0 text-base ${surFondSombre ? "text-grey-light" : ""}`}>{legende}</p>
      <p className={`m-0 font-display text-[64px] font-medium leading-[0.95] tabular-nums md:text-[96px] ${couleurChiffre}`}>
        <span className="sr-only">{valeur}</span>
        <span aria-hidden="true">
          {prefixe}
          {affiche ?? ""}
          {suffixe}
        </span>
      </p>
    </div>
  );
}
