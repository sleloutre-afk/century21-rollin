import Link from "next/link";
import { BoutonLien } from "@/components/ui/Bouton";
import { ROUTES } from "@/lib/navigation";

/**
 * Bloc estimation (brief §7.7 ; maquette Main et Accueil-mobile-1).
 * Desktop : étapes + première question du parcours (adresse), qui ouvre /estimation?adresse=….
 * Mobile : étapes + bouton « Commencer l'estimation ».
 */

const ETAPES = [
  { n: "01", titre: "L'adresse.", texte: "Pour situer votre bien à la rue près." },
  { n: "02", titre: "Votre bien.", texte: "Type, surface, pièces, état, extérieurs." },
  { n: "03", titre: "Votre projet.", texte: "Vendre, faire louer, confier la gestion." },
  { n: "04", titre: "Votre fourchette.", texte: "Puis, si vous le souhaitez, l'appel d'un expert du secteur." },
];

export function BlocEstimation() {
  return (
    <section id="estimation" aria-labelledby="h-estim" className="bg-gold py-14 text-grey-dark md:py-24">
      <div className="conteneur flex flex-wrap items-center gap-6 md:gap-16">
        <div className="flex flex-[1_1_520px] flex-col gap-6 md:gap-8">
          <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Estimation en ligne</p>
          <h2 id="h-estim" className="m-0 text-[32px] font-medium uppercase leading-[1.02] md:text-[clamp(34px,3.4vw,50px)]">
            Une première fourchette en 2 minutes. Puis l&apos;avis d&apos;un expert de votre quartier.
          </h2>
          <ol className="m-0 flex list-none flex-col p-0">
            {ETAPES.map((e, i) => (
              <li
                key={e.n}
                className={`flex items-baseline gap-4 border-t border-grey-dark py-3.5 md:gap-6 md:py-4 ${i === ETAPES.length - 1 ? "border-b" : ""}`}
              >
                <span className="w-9 flex-none font-display text-2xl font-semibold md:w-12 md:text-[30px]">{e.n}</span>
                <span className="text-[15px] md:text-[17px]">
                  <strong>{e.titre}</strong> {e.texte}
                </span>
              </li>
            ))}
          </ol>
          <BoutonLien href={ROUTES.estimation} variante="sombre" taille="grand" pleineLargeur className="md:hidden">
            Commencer l&apos;estimation
          </BoutonLien>
        </div>

        <form
          action={ROUTES.estimation}
          method="get"
          aria-labelledby="h-estim-etape1"
          className="hidden flex-[1_1_420px] flex-col gap-6 bg-white p-10 shadow-[0_30px_60px_rgba(37,37,38,0.18)] md:flex"
        >
          <div className="flex justify-between font-display text-sm uppercase tracking-[0.16em]">
            <span>Étape 1 sur 5</span>
            <span>Adresse</span>
          </div>
          <div aria-hidden="true" className="h-1 bg-grey-light">
            <div className="h-1 w-1/5 bg-grey-dark" />
          </div>
          <h3 id="h-estim-etape1" className="m-0 text-3xl font-medium leading-[1.1]">
            Où se situe votre bien ?
          </h3>
          <label className="flex flex-col gap-2 text-sm">
            Adresse complète
            <input
              name="adresse"
              type="text"
              placeholder="Numéro, rue, Bordeaux"
              autoComplete="street-address"
              className="h-14 border border-grey-medium px-4 text-[17px] text-grey-dark"
            />
          </label>
          <button
            type="submit"
            className="min-h-14 cursor-pointer bg-grey-dark font-display text-base font-semibold uppercase tracking-[0.12em] text-white hover:text-gold"
          >
            Continuer
          </button>
          <p className="m-0 text-[13px] leading-normal">
            {/* À VALIDER : mention RGPD du module d'estimation, à rédiger par l'agence. */}
            Vos informations servent à établir votre estimation. [Mention RGPD à rédiger] ·{" "}
            <Link href={ROUTES.confidentialite} className="underline">
              Politique de confidentialité
            </Link>
          </p>
          <div className="flex items-center gap-4 border-t border-grey-light pt-5">
            <div aria-hidden="true" className="size-14 flex-none rounded-full bg-grey-light" />
            <p className="m-0 text-sm leading-[1.45]">À la fin, la photo et le contact direct du conseiller référent de votre secteur.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
