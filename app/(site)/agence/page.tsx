import type { Metadata } from "next";
import { BoutonLien } from "@/components/ui/Bouton";
import { Compteur } from "@/components/ui/Compteur";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { metaPage } from "@/lib/seo";
import { JsonLdAgence } from "@/components/seo/JsonLdAgence";

/**
 * « L'agence » (brief prompt 9 ; maquette AgenceDesktop, AgenceMobile) : histoire depuis 1993, chiffres clés datés,
 * distinction Centurion, lien vers l'équipe. « Mot des dirigeants » masqué tant que le texte n'est pas fourni
 * (décision de Simon, 19/11/2026). Balisage RealEstateAgent : lot 10.
 */

export const metadata: Metadata = metaPage({
  titre: "L'agence",
  description: "Cabinet Rollin – CENTURY 21 Les Chartrons : une agence familiale aux Chartrons depuis 1993, dans le réseau CENTURY 21 depuis 2001.",
  chemin: "/agence",
});

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

export default function PageAgence() {
  const agence = getAgence();
  const { chiffres, avis } = agence;
  // Frise de contenus/agence.json, puis « Aujourd'hui » (maquette).
  const frise = [
    ...agence.histoire.map((h) => ({ an: String(h.annee), texte: `${h.evenement}.` })),
    { an: "Aujourd'hui", texte: "Trois pôles : transaction, location, gestion locative." },
  ];

  return (
    <>
      <JsonLdAgence />
      <FilAriane etapes={[{ libelle: "L'agence" }]} />

      <section aria-labelledby="h1-agence" className="py-10 md:py-16">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <div className="flex flex-[1_1_480px] flex-col gap-5 md:gap-6">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">L&apos;agence</p>
            <h1 id="h1-agence" className="m-0 text-[38px] font-medium uppercase leading-none md:text-[clamp(40px,4.2vw,60px)]">
              Une agence familiale aux Chartrons, <span className="bg-gold box-decoration-clone px-2">depuis 1993</span>
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] leading-normal md:text-lg">
              Créée en 1993. Dans le réseau CENTURY 21 depuis 2001, tout en restant indépendante. Dirigée depuis 2013 par Dominique et Myriam Rollin.
            </p>
            <p className="m-0 text-[15px]">
              {agence.adresse.rue}, {agence.adresse.codePostal} {agence.adresse.ville} ·{" "}
              <a href={`tel:${agence.telephoneE164}`} className="font-bold text-grey-dark">
                {agence.telephone}
              </a>
            </p>
          </div>
          <EmplacementPhoto libelle="Photo · façade de l'agence, cours Evrard de Fayolle" className="h-[260px] flex-[1_1_420px] md:h-[460px]" />
        </div>
      </section>

      <section aria-labelledby="h-histoire" className="border-t border-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-col gap-8 md:gap-12">
          <h2 id="h-histoire" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
            Notre histoire
          </h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-x-6 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {frise.map((f) => (
              <li key={f.an} className="flex flex-col gap-3 border-t-2 border-grey-dark py-6 pr-4">
                <span className="font-display text-[40px] font-medium leading-none">{f.an}</span>
                <span className="text-base leading-normal">{f.texte}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="h-chiffres" className="bg-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <h2 id="h-chiffres" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
            L&apos;agence en chiffres
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            <Compteur valeur={chiffres.ventes} legende={`ventes ${chiffres.periode}`} />
            <Compteur valeur={chiffres.locations} legende={`locations ${chiffres.periode}`} />
            <Compteur valeur={chiffres.biensGeres} legende={`biens en gestion ${chiffres.periode}`} />
            <div className="flex flex-col-reverse justify-end gap-2">
              <p className="m-0 text-base">
                sur Google, {avis.google.nombre} avis · au {dater(avis.google.date)}
              </p>
              <p className="m-0 font-display text-[64px] font-medium leading-[0.95] md:text-[96px]">
                {nombre(avis.google.note)}
                <span className="text-3xl md:text-4xl">/5</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-centurion" className="bg-gold py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          {/* Visuel officiel de la distinction : à fournir par le réseau (ne pas le redessiner). */}
          <div role="img" aria-label="Emplacement du visuel officiel de la distinction Centurion" className="flex h-[200px] flex-[0_1_320px] items-end border border-grey-dark p-4 md:h-[260px]">
            <span className="font-display text-xs uppercase tracking-[0.16em]">Visuel officiel de la distinction · fourni par le réseau</span>
          </div>
          <div className="flex flex-[1_1_420px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Distinction du réseau</p>
            {/* « depuis 2016 » sans réserve : décision de Simon (19/11/2026). */}
            <h2 id="h-centurion" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
              Agence Centurion depuis 2016
            </h2>
            <p className="m-0 max-w-[560px] text-[17px] leading-normal">Distinguée chaque année depuis 2016 par le réseau CENTURY 21.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-equipe-agence" className="py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <EmplacementPhoto libelle="Photo · l'équipe à l'agence" className="h-[240px] flex-[1.2_1_420px] md:h-[380px]" />
          <div className="flex flex-[1_1_360px] flex-col gap-4">
            <h2 id="h-equipe-agence" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[44px]">
              Un spécialiste pour chaque besoin
            </h2>
            <p className="m-0 text-[17px] leading-normal">
              Trois pôles, transaction, location et gestion locative, plus le suivi des ventes et l&apos;accueil. Chacun son rôle.
            </p>
            <BoutonLien href={ROUTES.equipe} variante="sombre" taille="grand" className="self-start">
              Rencontrer l&apos;équipe
            </BoutonLien>
          </div>
        </div>
      </section>
    </>
  );
}
