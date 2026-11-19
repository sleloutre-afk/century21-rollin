import { Badge } from "@/components/ui/Badge";
import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence, getAnnonces } from "@/lib/data";
import { formaterSurface } from "@/lib/format/nombres";
import { ROUTES } from "@/lib/navigation";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * « Récemment vendus » (brief §7.5) : la preuve pour les vendeurs.
 * Une annonce au statut « vendu » apparaît ici automatiquement (4 dernières).
 * Aucune vente fournie pour l'instant : cartes vides étiquetées (proposition acceptée par Simon le 19/11/2026).
 * Prix de vente jamais affiché ici (accord du vendeur requis, spec §5).
 */

type Vente = { cle: string; quartier: string; type: string; delai: string };

const TYPES: Record<Annonce["type"], string> = { maison: "Maison", appartement: "Appartement" };

function versVente(a: Annonce): Vente {
  return {
    cle: a.slug,
    quartier: a.quartierLibelle,
    type: `${TYPES[a.type]} · ${formaterSurface(a.surfaceHabitable)}`,
    delai: a.delaiDeVenteJours === null ? "[—]" : String(a.delaiDeVenteJours),
  };
}

const EMPLACEMENTS: Vente[] = [1, 2, 3, 4].map((n) => ({ cle: `vide-${n}`, quartier: "[Quartier]", type: "[Type · surface]", delai: "[—]" }));

function CarteVendu({ vente }: { vente: Vente }) {
  return (
    <article className="group flex flex-col gap-3 md:gap-4">
      <EmplacementPhoto libelle="Photo du bien vendu" surFondSombre className="h-[200px] md:h-[300px]">
        <Badge variante="vendu" className="absolute left-3 top-3 md:left-[18px] md:top-[18px]" />
      </EmplacementPhoto>
      <div className="flex flex-col gap-1.5">
        <span className="font-display text-[13px] uppercase tracking-[0.16em] text-gold md:text-sm md:tracking-[0.18em]">{vente.quartier}</span>
        <span className="text-[17px]">{vente.type}</span>
        <span className="text-[15px] text-grey-light">Vendu en {vente.delai} jours</span>
      </div>
    </article>
  );
}

export function BiensVendus() {
  const { chiffres } = getAgence();
  const vendus = getAnnonces()
    .filter((a) => a.statut === "vendu")
    .slice(0, 4)
    .map(versVente);
  const ventes = vendus.length > 0 ? vendus : EMPLACEMENTS;

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
              <CarteVendu key={v.cle} vente={v} />
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
