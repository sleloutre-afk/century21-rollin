"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { BoutonLien } from "@/components/ui/Bouton";
import { IconeFermer, IconeMenu, IconeTelephone } from "@/components/ui/Icones";
import { MENU_PRINCIPAL, MENU_UTILITAIRE, ROUTES, type Lien } from "@/lib/navigation";
import { LiensNavigation, LiensNavigationActifs } from "./LiensNavigation";
import { Logo } from "./Logo";

/**
 * En-tête fixe (maquette : Main, Accueil-desktop-2, Accueil-mobile-1).
 * - Grand écran (≥ 1280 px) : barre utilitaire, logo, menu, téléphone, « Estimer mon bien ».
 *   Au défilement, il se compacte : 64 px, sans barre utilitaire, logo réduit.
 * - Petit écran : logo, bouton d'appel et bouton menu (menu plein écran).
 */

type Props = {
  telephone: string;
  telephoneE164: string;
  /** Texte de la barre utilitaire (adresse, jours d'ouverture). */
  ligneUtilitaire: string;
};

// Seuils différents pour compacter et déplier : évite le clignotement autour d'une seule valeur.
const SEUIL_COMPACT = 120;
const SEUIL_DEPLIE = 40;

function LiensMenu(props: React.ComponentProps<typeof LiensNavigation>) {
  return (
    <Suspense fallback={<LiensNavigation {...props} />}>
      <LiensNavigationActifs {...props} />
    </Suspense>
  );
}

export function EnTete({ telephone, telephoneE164, ligneUtilitaire }: Props) {
  const [compact, setCompact] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const dialogue = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const surDefilement = () => {
      const y = window.scrollY;
      setCompact((c) => (c ? y > SEUIL_DEPLIE : y > SEUIL_COMPACT));
    };
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    if (menuOuvert && !d.open) d.showModal();
    if (!menuOuvert && d.open) d.close();
    document.documentElement.style.overflow = menuOuvert ? "hidden" : "";
  }, [menuOuvert]);

  const fermerMenu = () => setMenuOuvert(false);

  return (
    <header
      data-compact={compact}
      className={`group/entete sticky top-0 z-50 border-b border-grey-light bg-white/97 transition-shadow duration-300 ${
        compact ? "xl:shadow-[0_6px_24px_rgba(37,37,38,0.08)]" : ""
      }`}
    >
      {/* Barre utilitaire (grand écran, masquée en état compact) */}
      <div
        className={`hidden overflow-hidden bg-grey-dark text-grey-light transition-[height] duration-300 xl:block ${compact ? "h-0" : "h-10"}`}
        aria-hidden={compact || undefined}
        inert={compact || undefined}
      >
        <div className="mx-auto flex h-10 max-w-[1392px] items-center justify-between gap-6 px-8 text-[13px]">
          <span>{ligneUtilitaire}</span>
          <nav aria-label="Liens utiles" className="flex flex-wrap gap-6">
            <LiensMenu liens={MENU_UTILITAIRE} classeLien="text-grey-light no-underline hover:text-gold" classeActif="text-gold" />
          </nav>
        </div>
      </div>

      <div
        className={`mx-auto flex max-w-[1392px] items-center justify-between gap-8 pl-5 pr-4 transition-[height] duration-300 xl:px-8 ${
          compact ? "h-16" : "h-16 xl:h-20"
        }`}
      >
        <span className="xl:hidden">
          <Logo taille="compact" />
        </span>
        <span className="hidden xl:block">
          <Logo taille={compact ? "compact" : "normal"} />
        </span>

        <nav aria-label="Navigation principale" className="hidden flex-wrap justify-center gap-[22px] text-sm xl:flex">
          <LiensMenu
            liens={MENU_PRINCIPAL}
            classeLien="border-b border-transparent py-1.5 text-grey-dark no-underline hover:border-gold-dark"
            classeActif="border-grey-dark!"
          />
        </nav>

        <div className="hidden flex-none items-center gap-5 xl:flex">
          <a
            href={`tel:${telephoneE164}`}
            className={`flex items-center gap-2 font-display font-medium tracking-[0.02em] text-grey-dark no-underline ${compact ? "text-lg" : "text-[19px]"}`}
          >
            <IconeTelephone taille={compact ? 16 : 18} />
            {telephone}
          </a>
          <BoutonLien href={ROUTES.estimation} variante="or" className={compact ? "min-h-11! px-[18px]! text-sm!" : ""}>
            Estimer mon bien
          </BoutonLien>
        </div>

        {/* Petit écran : appel + menu */}
        <div className="flex gap-1 xl:hidden">
          <a
            href={`tel:${telephoneE164}`}
            aria-label={`Appeler l'agence au ${telephone}`}
            className="flex size-12 items-center justify-center text-grey-dark"
          >
            <IconeTelephone taille={22} />
          </a>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-haspopup="dialog"
            aria-expanded={menuOuvert}
            onClick={() => setMenuOuvert(true)}
            className="flex size-12 cursor-pointer items-center justify-center border-0 bg-transparent text-grey-dark"
          >
            <IconeMenu taille={24} />
          </button>
        </div>
      </div>

      <MenuMobile
        refDialogue={dialogue}
        onFermer={fermerMenu}
        telephone={telephone}
        telephoneE164={telephoneE164}
        liensPrincipaux={MENU_PRINCIPAL}
        liensUtiles={MENU_UTILITAIRE}
      />
    </header>
  );
}

/**
 * Menu plein écran des petits écrans. Non dessiné dans la maquette : même style que l'en-tête.
 * Fenêtre native <dialog> : focus gardé dans le menu, fermeture par Échap.
 */
function MenuMobile({
  refDialogue,
  onFermer,
  telephone,
  telephoneE164,
  liensPrincipaux,
  liensUtiles,
}: {
  refDialogue: React.RefObject<HTMLDialogElement | null>;
  onFermer: () => void;
  telephone: string;
  telephoneE164: string;
  liensPrincipaux: Lien[];
  liensUtiles: Lien[];
}) {
  return (
    <dialog
      ref={refDialogue}
      aria-label="Menu"
      onClose={onFermer}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-grey-dark backdrop:bg-grey-dark/60 xl:hidden"
    >
      <div className="flex min-h-full flex-col">
        <div className="flex h-16 flex-none items-center justify-between border-b border-grey-light pl-5 pr-4">
          <Logo taille="compact" />
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={onFermer}
            className="flex size-12 cursor-pointer items-center justify-center border-0 bg-transparent text-grey-dark"
          >
            <IconeFermer taille={24} />
          </button>
        </div>

        <nav aria-label="Navigation principale" className="flex flex-col px-6 pt-4">
          <LiensMenu
            liens={liensPrincipaux}
            onNaviguer={onFermer}
            classeLien="flex min-h-14 items-center border-b border-grey-light font-display text-2xl font-medium uppercase text-grey-dark no-underline"
            classeActif="border-b-2 border-b-gold-dark!"
          />
        </nav>

        <nav aria-label="Liens utiles" className="flex flex-col px-6 pt-6">
          <LiensMenu
            liens={liensUtiles}
            onNaviguer={onFermer}
            classeLien="flex min-h-12 items-center text-base text-grey-dark no-underline"
            classeActif="font-bold"
          />
        </nav>

        <div className="mt-auto flex flex-col gap-3 px-6 pb-8 pt-8">
          <a
            href={`tel:${telephoneE164}`}
            className="flex items-center gap-2.5 font-display text-[28px] font-medium tracking-[0.02em] text-grey-dark no-underline"
          >
            <IconeTelephone taille={22} />
            {telephone}
          </a>
          <Link
            href={ROUTES.estimation}
            onClick={onFermer}
            className="flex min-h-14 items-center justify-center bg-gold font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-gold-dark"
          >
            Estimer mon bien
          </Link>
        </div>
      </div>
    </dialog>
  );
}
