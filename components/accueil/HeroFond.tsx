"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO = "/videos/hero-chartrons.mp4";
const IMAGE = "/images/accueil/hero-chartrons.jpg";

/**
 * Fond du haut de page d'accueil (spec §2 : vidéo légère en desktop, image seule sur mobile).
 * - Image fixe affichée d'abord (chargement rapide), et seule sur mobile.
 * - Vidéo (quais, marché, façade de l'agence ; 13 s en boucle, sans son) chargée uniquement
 *   sur écran large et si le visiteur n'a pas demandé à réduire les animations.
 * - Bouton pause : obligatoire pour un contenu qui bouge plus de 5 s (accessibilité, RGAA / WCAG 2.2.2).
 */
export function HeroFond() {
  const [video, setVideo] = useState(false);
  const [enPause, setEnPause] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 768px)");
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setVideo(large.matches && !calme.matches);
    maj();
    large.addEventListener("change", maj);
    calme.addEventListener("change", maj);
    return () => {
      large.removeEventListener("change", maj);
      calme.removeEventListener("change", maj);
    };
  }, []);

  const basculer = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setEnPause(false);
    } else {
      v.pause();
      setEnPause(true);
    }
  };

  return (
    <>
      <Image src={IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-[30%_center] md:object-center" />
      {video && (
        <video
          ref={ref}
          src={VIDEO}
          poster={IMAGE}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-grey-dark opacity-62" />
      {video && (
        <button
          type="button"
          onClick={basculer}
          aria-label={enPause ? "Lire la vidéo de fond" : "Mettre en pause la vidéo de fond"}
          className="absolute right-8 top-8 z-10 flex h-10 w-10 cursor-pointer items-center justify-center border border-grey-light/60 bg-transparent text-white hover:border-gold hover:text-gold"
        >
          {enPause ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 1.5v11l9-5.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
