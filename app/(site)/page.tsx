import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

// Page provisoire : remplacée par l'accueil complet au lot 2.
export default function Accueil() {
  const agence = getAgence();

  return (
    <section className="bg-grey-dark py-24 text-white md:py-32">
      <div className="conteneur flex flex-col gap-6">
        <p className="m-0 font-display text-sm uppercase tracking-[0.28em] text-gold">Site en construction</p>
        <h1 className="m-0 max-w-[980px] text-[40px] font-medium uppercase leading-[0.98] md:text-[clamp(44px,5.3vw,78px)]">
          {agence.nomTexte}
        </h1>
        <p className="m-0 max-w-[620px] text-lg text-grey-light">
          {agence.adresse.rue}, {agence.adresse.codePostal} {agence.adresse.ville}
        </p>
        <div className="flex flex-wrap items-center gap-6 pt-4">
          <BoutonLien href={ROUTES.estimation} variante="or" taille="grand">
            Estimer mon bien
          </BoutonLien>
          <LienFleche href="/styleguide" surFondSombre>
            Voir les composants du site
          </LienFleche>
        </div>
      </div>
    </section>
  );
}
