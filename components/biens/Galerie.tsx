"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconeFermer, IconeFlecheDroite, IconeFlecheGauche } from "@/components/ui/Icones";

/**
 * Galerie de la fiche bien (maquette FicheDesktop, FicheMobile, FicheGalerie).
 * - Sur la page : mosaïque (grand écran) ou rangée à faire défiler au doigt (téléphone).
 * - Plein écran : flèches du clavier, glissement au doigt, Échap pour fermer, compteur,
 *   onglets Photos · Vidéo · Visite virtuelle · Plan (un onglet n'apparaît que si le média est fourni).
 * Sans photo fournie : emplacements gris étiquetés (aucune photo inventée).
 */

export type PhotoGalerie = { libelle: string; src?: string; alt?: string };
type Onglet = "photos" | "video" | "visite" | "plan";

type Props = {
  photos: PhotoGalerie[];
  /** Ligne affichée en haut de la galerie : « Maison de ville bourgeoise · Palais Gallien · 1 099 000 € ». */
  resume: string;
  medias: { video?: string | null; visite?: string | null; plan?: string | null };
};

const ONGLETS: { id: Onglet; libelle: string }[] = [
  { id: "photos", libelle: "Photos" },
  { id: "video", libelle: "Vidéo" },
  { id: "visite", libelle: "Visite virtuelle" },
  { id: "plan", libelle: "Plan" },
];

function Visuel({ photo, sombre = false, priorite = false, tailles }: { photo: PhotoGalerie; sombre?: boolean; priorite?: boolean; tailles: string }) {
  if (photo.src) {
    return <Image src={photo.src} alt={photo.alt ?? photo.libelle} fill sizes={tailles} priority={priorite} className="object-cover" />;
  }
  return (
    <div
      role="img"
      aria-label={`Emplacement photo : ${photo.libelle}`}
      className={`absolute inset-0 flex items-end p-4 transition-transform duration-800 group-hover:scale-[1.03] ${
        sombre ? "border border-grey-medium bg-grey-dark text-grey-light" : "bg-grey-light text-grey-dark"
      }`}
    >
      <span className="font-display text-xs uppercase tracking-[0.16em] md:text-[13px]">{photo.libelle}</span>
    </div>
  );
}

export function Galerie({ photos, resume, medias }: Props) {
  const dialogue = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [onglet, setOnglet] = useState<Onglet>("photos");
  const debutToucher = useRef<number | null>(null);
  const total = photos.length;
  const disponibles = ONGLETS.filter((o) => o.id === "photos" || (o.id === "video" ? medias.video : o.id === "visite" ? medias.visite : medias.plan));

  const ouvrir = (i: number, o: Onglet = "photos") => {
    setIndex(i);
    setOnglet(o);
    dialogue.current?.showModal();
  };
  const precedente = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const suivante = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    const surTouche = (e: KeyboardEvent) => {
      if (onglet !== "photos") return;
      if (e.key === "ArrowLeft") precedente();
      if (e.key === "ArrowRight") suivante();
    };
    d.addEventListener("keydown", surTouche);
    return () => d.removeEventListener("keydown", surTouche);
  }, [onglet, precedente, suivante]);

  const [principale, ...vignettes] = photos;

  return (
    <section aria-label="Galerie photos" className="md:conteneur md:pt-6">
      {/* Grand écran : mosaïque */}
      <div className="hidden h-[572px] grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 md:grid">
        <button type="button" onClick={() => ouvrir(0)} className="group relative row-span-2 cursor-pointer overflow-hidden border-0 p-0">
          <Visuel photo={principale} priorite tailles="(min-width: 768px) 50vw, 100vw" />
          <span className="sr-only"> – ouvrir la galerie en plein écran</span>
        </button>
        {vignettes.slice(0, 4).map((p, i) => (
          <button key={p.libelle} type="button" onClick={() => ouvrir(i + 1)} className="group relative cursor-pointer overflow-hidden border-0 p-0">
            <Visuel photo={p} tailles="25vw" />
            <span className="sr-only"> – ouvrir en plein écran (photo {i + 2} sur {total})</span>
          </button>
        ))}
      </div>

      {/* Téléphone : rangée à faire défiler */}
      <ul className="m-0 flex list-none snap-x snap-mandatory gap-2 overflow-x-auto p-0 md:hidden">
        {photos.map((p, i) => (
          <li key={p.libelle} className="w-[88%] flex-none snap-start first:pl-0">
            <button type="button" onClick={() => ouvrir(i)} className="relative block h-[280px] w-full cursor-pointer overflow-hidden border-0 p-0">
              <Visuel photo={p} tailles="90vw" priorite={i === 0} />
              <span className="sr-only"> – ouvrir en plein écran (photo {i + 1} sur {total})</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2.5 overflow-x-auto px-6 pt-3 md:flex-wrap md:px-0">
        <button type="button" onClick={() => ouvrir(0)} className="min-h-11 flex-none cursor-pointer border border-grey-dark bg-white px-4 text-sm text-grey-dark">
          Toutes les photos ({total})
        </button>
        {disponibles
          .filter((o) => o.id !== "photos")
          .map((o) => (
            <button key={o.id} type="button" onClick={() => ouvrir(0, o.id)} className="min-h-11 flex-none cursor-pointer border border-grey-dark bg-white px-4 text-sm text-grey-dark">
              {o.libelle}
            </button>
          ))}
      </div>

      <dialog ref={dialogue} aria-label="Galerie photos du bien" className="m-0 h-dvh max-h-none w-full max-w-none bg-grey-dark p-0 text-white backdrop:bg-grey-dark">
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-grey-light/20 px-4 py-2 md:px-8">
            <div role="tablist" aria-label="Médias" className="flex gap-1">
              {disponibles.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="tab"
                  aria-selected={onglet === o.id}
                  onClick={() => setOnglet(o.id)}
                  className={`min-h-11 cursor-pointer border-0 px-4 font-display text-sm uppercase tracking-[0.12em] ${onglet === o.id ? "bg-gold text-grey-dark" : "bg-transparent text-white"}`}
                >
                  {o.libelle}
                </button>
              ))}
            </div>
            <span className="hidden text-sm text-grey-light md:block">{resume}</span>
            <div className="flex items-center gap-3">
              <a href="#visite" onClick={() => dialogue.current?.close()} className="hidden min-h-11 items-center bg-gold px-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline md:flex">
                Demander une visite
              </a>
              <button type="button" aria-label="Fermer la galerie" onClick={() => dialogue.current?.close()} className="flex size-12 cursor-pointer items-center justify-center border-0 bg-transparent text-white">
                <IconeFermer taille={26} />
              </button>
            </div>
          </div>

          {onglet === "photos" ? (
            <>
              <div
                className="relative flex flex-1 items-center gap-2 px-2 py-4 md:gap-6 md:px-8"
                onTouchStart={(e) => (debutToucher.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (debutToucher.current === null) return;
                  const ecart = e.changedTouches[0].clientX - debutToucher.current;
                  if (Math.abs(ecart) > 50) (ecart > 0 ? precedente : suivante)();
                  debutToucher.current = null;
                }}
              >
                <button type="button" aria-label="Photo précédente" onClick={precedente} className="hidden size-14 flex-none cursor-pointer items-center justify-center border border-grey-light/40 bg-transparent text-white md:flex">
                  <IconeFlecheGauche taille={24} />
                </button>
                <figure className="m-0 flex h-full flex-1 flex-col gap-3">
                  <div className="relative min-h-[50vh] flex-1">
                    <Visuel photo={photos[index]} sombre tailles="100vw" />
                  </div>
                  <figcaption aria-live="polite" className="flex justify-between gap-4 text-sm text-grey-light">
                    <span>{photos[index].libelle}</span>
                    <span>
                      {index + 1} / {total}
                    </span>
                  </figcaption>
                </figure>
                <button type="button" aria-label="Photo suivante" onClick={suivante} className="hidden size-14 flex-none cursor-pointer items-center justify-center border border-grey-light/40 bg-transparent text-white md:flex">
                  <IconeFlecheDroite taille={24} />
                </button>
              </div>
              <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5">
                {photos.map((p, i) => (
                  <button
                    key={p.libelle}
                    type="button"
                    aria-label={`Photo ${i + 1} : ${p.libelle}`}
                    aria-current={i === index || undefined}
                    onClick={() => setIndex(i)}
                    className={`h-14 w-20 flex-none cursor-pointer border bg-grey-dark p-0 ${i === index ? "border-2 border-gold" : "border-grey-medium"}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-grey-light">
              {/* Média fourni : lecteur à brancher selon le format reçu (vidéo, lien de visite virtuelle, image du plan). */}
              <span className="font-display uppercase tracking-[0.16em]">{ONGLETS.find((o) => o.id === onglet)?.libelle}</span>
            </div>
          )}
        </div>
      </dialog>
    </section>
  );
}
