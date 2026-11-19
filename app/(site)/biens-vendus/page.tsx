import type { Metadata } from "next";
import { Suspense } from "react";
import { ListeVendus, ListeVendusAvecParametres } from "@/components/biens/ListeVendus";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { FilAriane } from "@/components/ui/FilAriane";
import { emplacementsVentes, toutesLesVentes } from "@/lib/biens/ventes";
import { getAgence, getSecteurs } from "@/lib/data";

/**
 * Biens vendus (brief prompt 4 ; maquette VendusDesktop, VendusMobile) : page de preuve pour les vendeurs.
 * Délai moyen de vente : emplacement tant que l'agence ne l'a pas fourni.
 */

export const metadata: Metadata = {
  title: "Biens vendus par l'agence",
  description: "Les ventes menées par Cabinet Rollin – CENTURY 21 Les Chartrons, quartier par quartier, à Bordeaux.",
};

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

export default function PageBiensVendus() {
  const { chiffres, avis } = getAgence();
  const ventes = toutesLesVentes();
  const props = {
    ventes: ventes.length > 0 ? ventes : emplacementsVentes(12),
    // Les 6 secteurs, comme dans la maquette ; nom raccourci sur téléphone (maquette VendusMobile).
    quartiers: getSecteurs().map((s) => ({ id: s.slug, nom: s.nom, court: s.nom.split("–")[0] })),
  };
  const preuves = [
    { valeur: chiffres.ventes, unite: "", legende: `ventes ${chiffres.periode}` },
    { valeur: "[—]", unite: " j", legende: "délai moyen de vente" },
    { valeur: nombre(avis.qualitelis.transaction), unite: "/10", legende: `Qualitelis transaction · au ${dater(avis.qualitelis.date)}` },
  ];

  return (
    <>
      <FilAriane etapes={[{ libelle: "Biens vendus" }]} />
      <section aria-labelledby="h1-vendus" className="bg-grey-dark py-12 text-white md:py-[72px]">
        <div className="conteneur flex flex-wrap items-end justify-between gap-8 md:gap-12">
          <div className="flex flex-[1_1_520px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">La preuve par les ventes</p>
            <h1 id="h1-vendus" className="m-0 text-[36px] font-medium uppercase leading-none md:text-[clamp(40px,4.2vw,60px)]">
              Biens vendus par l&apos;agence
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] leading-normal text-grey-light">
              Quartier par quartier, les ventes que nous avons menées. Le vôtre est peut-être le prochain.
            </p>
          </div>
          <dl className="m-0 grid flex-[1_1_420px] grid-cols-3 gap-4 md:gap-6">
            {preuves.map((p) => (
              <div key={p.legende} className="flex flex-col-reverse justify-end gap-1 border-t border-gold/45 pt-4">
                <dt className="text-xs leading-snug text-grey-light md:text-sm">{p.legende}</dt>
                <dd className="m-0 font-display text-[32px] font-medium leading-none md:text-[44px]">
                  {p.valeur}
                  {p.unite && <span className="text-base md:text-xl">{p.unite}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Suspense fallback={<ListeVendus {...props} />}>
        <ListeVendusAvecParametres {...props} />
      </Suspense>

      <section aria-labelledby="h-cta-vendus" className="bg-gold py-14 md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8 md:gap-12">
          <div className="flex flex-[1_1_460px] flex-col gap-4">
            <h2 id="h-cta-vendus" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(36px,4vw,56px)]">
              Votre bien est le prochain ?
            </h2>
            <p className="m-0 text-[17px] leading-normal md:text-lg">Une première fourchette en 2 minutes, puis l&apos;avis d&apos;un expert de votre quartier.</p>
          </div>
          <FormulaireAdresse id="vendus-adresse" bouton="Estimer mon bien" className="flex-[1_1_520px]" />
        </div>
      </section>
    </>
  );
}
