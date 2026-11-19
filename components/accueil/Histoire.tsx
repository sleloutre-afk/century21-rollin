import { cacheLife } from "next/cache";
import { LienFleche } from "@/components/ui/Bouton";
import { Compteur } from "@/components/ui/Compteur";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * « Depuis 1993 » (brief §7.10 ; maquette Accueil-desktop-2 et Accueil-mobile-2) :
 * frise (contenus/agence.json) et chiffres clés animés, chacun avec sa période.
 */

const ANNEE_CREATION = 1993;

/** Années aux Chartrons : dépend de l'année en cours, recalculé chaque jour (Cache Components). */
async function AnneesAuxChartrons() {
  "use cache";
  cacheLife("days");
  const annees = new Date().getFullYear() - ANNEE_CREATION;
  return <Compteur valeur={String(annees)} legende="ans aux Chartrons" surFondSombre accent />;
}

export function Histoire() {
  const { histoire, chiffres } = getAgence();

  return (
    <section aria-labelledby="h-histoire" className="bg-grey-dark py-14 text-white md:py-24">
      <div className="conteneur flex flex-col gap-10 md:gap-16">
        <TitreSection
          id="h-histoire"
          surtitre="Depuis 1993"
          titre="Une agence familiale, au cœur des Chartrons"
          aside={
            <LienFleche href={ROUTES.agence} surFondSombre>
              Notre histoire
            </LienFleche>
          }
          surFondSombre
        />
        <ol className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-6 p-0 sm:grid-cols-2 md:gap-y-8 lg:grid-cols-4">
          {histoire.map((etape) => (
            <li key={etape.annee} className="flex flex-col gap-3.5 border-t-2 border-gold pt-6">
              <span className="font-display text-[44px] font-medium leading-none text-gold">{etape.annee}</span>
              <span className="text-base leading-normal text-grey-light">{etape.evenement}.</span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          <Compteur valeur={chiffres.ventes} legende={`ventes ${chiffres.periode}`} surFondSombre />
          <Compteur valeur={chiffres.locations} legende={`locations ${chiffres.periode}`} surFondSombre />
          <Compteur valeur={chiffres.biensGeres} legende={`biens en gestion ${chiffres.periode}`} surFondSombre />
          <AnneesAuxChartrons />
        </div>
      </div>
    </section>
  );
}
