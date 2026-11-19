import type { Metadata } from "next";
import { FormulaireContact } from "@/components/formulaires/FormulaireContact";
import { PriseRendezVous } from "@/components/formulaires/PriseRendezVous";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { getAgence } from "@/lib/data";
import { metaPage } from "@/lib/seo";
import { JsonLdAgence } from "@/components/seo/JsonLdAgence";

/**
 * Contact (brief prompt 9 ; maquette ContactDesktop, ContactMobile) : formulaire par type de projet orienté
 * vers le bon pôle, coordonnées, horaires, prise de rendez-vous, plan d'accès.
 * Bloc « Venir à l'agence » (tram, bus, stationnement, accessibilité) masqué : informations à fournir.
 * À VALIDER : fournisseur de carte à choisir (spec §7).
 */

export const metadata: Metadata = metaPage({
  titre: "Contact et rendez-vous",
  description: "Appelez-nous, écrivez-nous ou prenez rendez-vous : Cabinet Rollin – CENTURY 21 Les Chartrons, 32 cours Evrard de Fayolle, Bordeaux.",
  chemin: "/contact",
});

export default function PageContact() {
  const agence = getAgence();

  return (
    <>
      <JsonLdAgence />
      <FilAriane etapes={[{ libelle: "Contact" }]} />

      <div className="conteneur flex flex-wrap items-end justify-between gap-6 pb-8 pt-10 md:pb-12 md:pt-14">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Contact</p>
          <h1 className="m-0 text-[40px] font-medium uppercase leading-none md:text-6xl">Parlons de votre projet</h1>
        </div>
        <p className="m-0 max-w-[460px] text-[17px] leading-normal">Dites-nous ce que vous cherchez : votre demande arrive directement au bon pôle.</p>
      </div>

      <section aria-label="Formulaire et coordonnées" className="conteneur flex flex-col gap-10 pb-14 md:flex-row md:items-start md:gap-12 md:pb-20">
        <div className="flex-[1.6_1_0]">
          <FormulaireContact />
        </div>
        <aside aria-label="Coordonnées de l'agence" className="flex flex-col gap-7 bg-grey-dark p-6 text-white md:flex-[1_1_0] md:p-10">
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">Par téléphone</span>
            <a href={`tel:${agence.telephoneE164}`} className="font-display text-[34px] font-medium text-white no-underline hover:text-gold">
              {agence.telephone}
            </a>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">À l&apos;agence</span>
            <address className="text-[17px] not-italic leading-normal text-grey-light">
              {agence.adresse.rue}
              <br />
              {agence.adresse.codePostal} {agence.adresse.ville}
            </address>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">Horaires</span>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[15px] text-grey-light">
              {agence.horaires.map((h) => (
                <div key={h.jours} className="contents">
                  <dt className="font-bold text-white">{h.jours}</dt>
                  <dd className="m-0">{h.plages}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a href="#acces" className="self-start border-b border-gold pb-0.5 text-[15px] text-white no-underline hover:text-gold">
            Plan d&apos;accès <span aria-hidden="true">→</span>
          </a>
        </aside>
      </section>

      <section id="rendez-vous" aria-labelledby="h-rdv" className="scroll-mt-24 bg-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Rendez-vous en ligne</p>
            <h2 id="h-rdv" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
              Choisissez votre créneau
            </h2>
            <p className="m-0 text-[17px] leading-normal">
              À l&apos;agence ou chez vous pour une estimation. Le rendez-vous est confié à un conseiller du pôle concerné.
            </p>
          </div>
          <div className="flex-[1.5_1_560px] border border-grey-light">
            <PriseRendezVous />
          </div>
        </div>
      </section>

      <section id="acces" aria-labelledby="h-acces" className="scroll-mt-24 py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <EmplacementPhoto
            libelle={`Plan d'accès · ${agence.adresse.rue} · carte interactive, fournisseur à choisir`}
            etiquette="haut-droite"
            className="h-[280px] flex-[1.4_1_480px] border border-grey-medium md:h-[400px]"
          />
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <h2 id="h-acces" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[44px]">
              Venir à l&apos;agence
            </h2>
            <address className="text-lg not-italic leading-normal">
              {agence.nomTexte}
              <br />
              {agence.adresse.rue}
              <br />
              {agence.adresse.codePostal} {agence.adresse.ville}
            </address>
          </div>
        </div>
      </section>
    </>
  );
}
