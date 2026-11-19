import { CarteVendu } from "@/components/biens/CarteVendu";
import { dernieresVentes } from "@/lib/biens/ventes";
import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * « Récemment vendus » (brief §7.5) : la preuve pour les vendeurs.
 * Une annonce au statut « vendu » apparaît ici automatiquement (4 dernières).
 */
export function BiensVendus() {
  const { chiffres } = getAgence();
  const ventes = dernieresVentes(4);

  return (
    <section aria-labelledby="h-vendus" className="bg-grey-dark py-14 text-white md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-12">
        <TitreSection
          id="h-vendus"
          surtitre="La preuve par les ventes"
          titre="Récemment vendus"
          texte={`Plus de ${chiffres.ventes.replace("+", "")} ventes ${chiffres.periode}. Voici les dernières, quartier par quartier.`}
          surFondSombre
        />

        <div className="hidden grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 md:grid">
          {ventes.map((v) => (
            <CarteVendu key={v.cle} vente={v} />
          ))}
        </div>
        <div className="md:hidden">
          <RangeeDefilable libelle="Biens récemment vendus" largeurElement="w-[240px]" fleches={false}>
            {ventes.map((v) => (
              <CarteVendu key={v.cle} vente={v} compacte />
            ))}
          </RangeeDefilable>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-gold/45 pt-8">
          <p className="m-0 hidden font-display text-[28px] uppercase md:block">Votre bien est le prochain ?</p>
          <div className="flex w-full flex-col gap-6 md:w-auto md:flex-row md:items-center">
            <LienFleche href={ROUTES.biensVendus} surFondSombre className="hidden md:inline-block">
              Tous les biens vendus
            </LienFleche>
            <BoutonLien href={ROUTES.estimation} variante="or" taille="grand" pleineLargeur className="md:w-auto">
              <span className="md:hidden">Votre bien est le prochain ? Estimer</span>
              <span className="hidden md:inline">Estimer mon bien</span>
            </BoutonLien>
          </div>
        </div>
      </div>
    </section>
  );
}
