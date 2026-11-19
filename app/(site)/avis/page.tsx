import type { Metadata } from "next";
import { Suspense } from "react";
import { FluxAvis, FluxAvisAvecParametres } from "@/components/avis/FluxAvis";
import { BoutonLien } from "@/components/ui/Bouton";
import { FilAriane } from "@/components/ui/FilAriane";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { metaPage } from "@/lib/seo";

/**
 * « Avis clients » (brief prompt 9 ; maquette AvisDesktop, AvisMobile).
 * Notes globales toujours datées. Avis mis en avant : uniquement avec l'accord du client (emplacements).
 * À VALIDER : encart d'information sur les avis (Code de la consommation) — texte à fournir par l'agence,
 * emplacements conservés (règle n° 4 : signaler, ne pas trancher). Bouton « Laisser un avis Google » masqué (lien à fournir).
 */

export const metadata: Metadata = metaPage({
  titre: "Avis clients",
  description: "Les avis Google et les notes Qualitelis de Cabinet Rollin – CENTURY 21 Les Chartrons, en vente, location et gestion locative.",
  chemin: "/avis",
});

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

export default function PageAvis() {
  const { avis } = getAgence();
  const q = avis.qualitelis;
  const reponses = q.nombreReponses === null ? "[nombre de réponses à fournir]" : `${nombre(q.nombreReponses)} réponses`;

  return (
    <>
      <FilAriane etapes={[{ libelle: "Avis clients" }]} />

      <section aria-labelledby="h1-avis" className="bg-grey-dark py-12 text-white md:py-[72px]">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">Avis clients</p>
            <h1 id="h1-avis" className="m-0 text-[38px] font-medium uppercase leading-none md:text-[clamp(44px,4.6vw,64px)]">
              Ce que nos clients disent de nous
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr_1fr] md:gap-6">
            <div className="flex items-center gap-6 border border-gold p-6 md:p-8">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[72px] font-medium leading-[0.9] text-gold md:text-[96px]">{nombre(avis.google.note)}</span>
                <span className="font-display text-[28px]">/5</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span role="img" aria-label={`Note moyenne ${nombre(avis.google.note)} sur 5`} className="text-xl tracking-[4px] text-gold">
                  ★★★★★
                </span>
                <span className="text-[15px]">{avis.google.nombre} avis Google</span>
                <span className="text-sm text-grey-light">au {dater(avis.google.date)}</span>
              </div>
            </div>
            {[
              { titre: "Qualitelis · Transaction", note: q.transaction },
              { titre: "Qualitelis · Gestion", note: q.gestion },
            ].map((n) => (
              <div key={n.titre} className="flex flex-col justify-between gap-3 border border-grey-medium p-6 md:p-8">
                <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">{n.titre}</span>
                <span className="font-display text-[56px] font-medium leading-none md:text-[64px]">
                  {nombre(n.note)}
                  <span className="text-2xl">/10</span>
                </span>
                <span className="text-[13px] text-grey-light">
                  Mesure au {dater(q.date)} · {reponses}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="h-une" className="py-14 md:py-20">
        <div className="conteneur flex flex-col gap-8">
          <h2 id="h-une" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
            Ils racontent leur projet
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["Vente", "Gestion locative"].map((service) => (
              <figure key={service} className="m-0 flex flex-col gap-5 bg-grey-light p-6 sm:flex-row md:p-8">
                <div aria-hidden="true" className="size-20 flex-none rounded-full bg-white" />
                <div className="flex flex-col gap-3">
                  <span className="font-display text-sm uppercase tracking-[0.2em]">{service}</span>
                  <blockquote className="m-0 text-lg leading-normal md:text-xl">« [Extrait d&apos;un avis réel, choisi avec l&apos;accord du client] »</blockquote>
                  <figcaption className="text-sm">
                    <strong>[Prénom]</strong> · [Quartier] · [date]
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="h-flux" className="border-t border-grey-light py-14 md:py-20">
        <div className="conteneur">
          <Suspense fallback={<FluxAvis />}>
            <FluxAvisAvecParametres />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="h-controle" className="bg-grey-light py-14 md:py-16">
        <div className="conteneur flex flex-wrap gap-6 md:gap-16">
          <h2 id="h-controle" className="m-0 flex-[1_1_300px] text-[30px] font-medium uppercase leading-none md:text-[40px]">
            D&apos;où viennent ces avis ?
          </h2>
          <div className="flex flex-[1.6_1_480px] flex-col gap-4 text-base leading-relaxed">
            <p className="m-0">
              Les avis affichés proviennent de Google et sont classés du plus récent au plus ancien. Les notes Qualitelis sont issues d&apos;enquêtes de
              satisfaction menées par un organisme indépendant [à confirmer].
            </p>
            <p className="m-0">[Mention à valider par l&apos;agence : les avis font-ils l&apos;objet d&apos;un contrôle ? Si oui, lequel. Si non, l&apos;indiquer.]</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-cta-avis" className="bg-gold py-14 md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_420px] flex-col gap-3">
            <h2 id="h-cta-avis" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[48px]">
              À votre tour ?
            </h2>
            <p className="m-0 text-[17px] leading-normal">Estimez votre bien, ou parlez de votre projet avec notre équipe.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <BoutonLien href={ROUTES.estimation} variante="sombre" taille="grand">
              Estimer mon bien
            </BoutonLien>
            <BoutonLien href={ROUTES.contact} variante="contour" taille="grand" className="hover:bg-white">
              Nous contacter
            </BoutonLien>
          </div>
        </div>
      </section>
    </>
  );
}
