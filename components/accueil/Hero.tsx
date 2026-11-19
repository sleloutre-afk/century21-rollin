import Link from "next/link";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * Haut de page (brief §7.2 ; maquette Main et Accueil-mobile-1).
 * Desktop : emplacement vidéo (fichier à fournir) ; mobile : image fixe (spec §2).
 * Voile Obsessed Grey à 55 % pour la lisibilité. Le champ adresse ouvre /estimation?adresse=….
 */

const formatNote = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function Hero() {
  const { avis, chiffres } = getAgence();
  const dateGoogle = avis.google.date
    ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${avis.google.date}T00:00:00`))
    : "[date à fournir]";

  return (
    <section
      aria-labelledby="h1-accueil"
      className="relative flex min-h-[720px] flex-col justify-end overflow-hidden bg-grey-dark text-white md:min-h-[820px] md:justify-center"
    >
      {/* Emplacement vidéo / image (fichiers à fournir) */}
      <div aria-hidden="true" className="absolute inset-0 flex items-start justify-end p-4 md:p-8">
        <span className="flex items-center gap-2.5 border border-grey-light/50 px-2.5 py-1.5 font-display text-[11px] uppercase tracking-[0.16em] text-grey-light md:px-3.5 md:py-2 md:text-[13px]">
          <span className="hidden md:inline">Vidéo · quais et façades des Chartrons · fichier à fournir</span>
          <span className="md:hidden">Image fixe · remplace la vidéo</span>
        </span>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-grey-dark opacity-55" />

      <div className="conteneur relative flex flex-col gap-[18px] pb-8 pt-20 md:gap-7 md:pb-[150px] md:pt-24">
        <p className="animate-montee m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">
          <span className="hidden md:inline">Agence immobilière · </span>Bordeaux Chartrons
        </p>
        <h1
          id="h1-accueil"
          className="animate-montee m-0 max-w-[980px] text-[40px] font-medium uppercase leading-[0.98] tracking-[0.01em] [animation-delay:150ms] md:text-[clamp(44px,5.3vw,78px)]"
        >
          Les Chartrons, on les connaît par cœur. <span className="text-gold">Depuis 1993.</span>
        </h1>
        <p className="animate-montee m-0 max-w-[620px] text-[17px] leading-[1.45] text-grey-light [animation-delay:300ms] md:text-xl">
          Vendre, louer, faire gérer : une équipe de spécialistes qui connaît chaque rue du quartier.
        </p>

        <form
          action={ROUTES.estimation}
          method="get"
          className="animate-montee flex max-w-[760px] flex-col gap-2 bg-white p-2 [animation-delay:300ms] md:flex-row md:flex-wrap"
        >
          <label htmlFor="hero-adresse" className="sr-only">
            Adresse de votre bien
          </label>
          <div className="flex min-h-14 items-center gap-3 px-3 md:min-h-[60px] md:flex-[1_1_360px] md:px-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#252526" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="hidden md:block">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              id="hero-adresse"
              name="adresse"
              type="text"
              placeholder="Adresse de votre bien"
              autoComplete="street-address"
              className="h-14 min-w-0 flex-1 border-0 bg-transparent text-[17px] text-grey-dark md:text-lg"
            />
          </div>
          <button
            type="submit"
            className="min-h-14 flex-none cursor-pointer bg-gold px-9 font-display text-[17px] font-semibold uppercase tracking-[0.14em] text-grey-dark hover:bg-gold-dark md:min-h-[60px]"
          >
            <span className="md:hidden">Estimer mon bien</span>
            <span className="hidden md:inline">Estimer</span>
          </button>
        </form>

        <div className="animate-montee flex flex-wrap items-center gap-8 text-[15px] [animation-delay:300ms]">
          <span className="hidden text-grey-light md:inline">Une première fourchette en 2 minutes, puis l&apos;avis d&apos;un expert.</span>
          <Link href={ROUTES.biens} className="border-b border-gold pb-0.5 text-white no-underline hover:text-gold">
            Je cherche un bien <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Bandeau de réassurance : mobile (dans le flux) */}
        <ul className="m-0 mt-2 grid list-none grid-cols-2 gap-x-4 gap-y-2.5 border-t border-gold/45 p-0 pt-4 font-display text-base tracking-[0.04em] md:hidden">
          <li>
            <span aria-hidden="true" className="text-gold">★</span> {formatNote(avis.google.note)}/5 · {avis.google.nombre} avis
            <span className="block text-sm text-grey-light">au {dateGoogle}</span>
          </li>
          <li>Depuis 1993</li>
          <li>{chiffres.biensGeres} biens gérés</li>
          <li>Agence Centurion depuis 2016</li>
        </ul>
      </div>

      {/* Bandeau de réassurance : desktop (en bas du haut de page) */}
      <div className="absolute inset-x-0 bottom-0 hidden border-t border-gold/45 md:block">
        <ul className="conteneur m-0 flex min-h-[76px] list-none flex-wrap items-center gap-x-11 gap-y-3 font-display text-[17px] tracking-[0.06em]">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-gold">★</span> {formatNote(avis.google.note)}/5 sur Google
          </li>
          <li>
            {avis.google.nombre} avis <span className="text-sm text-grey-light">· au {dateGoogle}</span>
          </li>
          <li aria-hidden="true" className="text-gold">·</li>
          <li>Depuis 1993</li>
          <li aria-hidden="true" className="text-gold">·</li>
          <li>{chiffres.biensGeres} biens gérés</li>
          <li aria-hidden="true" className="text-gold">·</li>
          {/* « depuis 2016 » sans réserve : décision de Simon (19/11/2026). */}
          <li>Agence Centurion depuis 2016</li>
        </ul>
      </div>
    </section>
  );
}
