import type { Metadata } from "next";
import Link from "next/link";
import { CarteVendu } from "@/components/biens/CarteVendu";
import { dernieresVentes } from "@/lib/biens/ventes";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { CarteMembre } from "@/components/equipe/CarteMembre";
import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { Faq } from "@/components/ui/Faq";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence, getFaq, getMembre, getMembres } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import type { Membre } from "@/lib/schemas/equipe";

/**
 * Page « Vendre » (brief prompt 2 ; maquette VendreDesktop, VendreMobile).
 * Action principale « Estimer mon bien », répétée en tête, en milieu et en fin de page.
 */

export const metadata: Metadata = {
  title: "Vendre votre bien aux Chartrons",
  description:
    "Vendre aux Chartrons avec ceux qui connaissent votre rue : estimation par un expert du quartier, mise en valeur, suivi jusqu'à l'acte. Depuis 1993.",
};

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

// Textes de la maquette (VendreDesktop). Photos : emplacements.
const METHODE = [
  {
    n: "01",
    titre: "Une estimation par un expert du quartier",
    texte: "Le conseiller référent de votre secteur visite le bien et vous remet un prix argumenté.",
    photo: "Photo · conseiller en visite, carnet de mesures",
  },
  {
    n: "02",
    titre: "Une mise en valeur soignée",
    texte: "Photos, vidéo, visite virtuelle : votre bien se présente sous son meilleur jour.",
    photo: "Photo · séance photo dans un séjour lumineux",
  },
  {
    n: "03",
    titre: "Diffusion et sélection des acquéreurs",
    texte: "Votre bien est présenté à nos acquéreurs et diffusé sur les portails. Nous sélectionnons les candidats avant chaque visite.",
    photo: "Photo · visite d'un appartement",
  },
  {
    n: "04",
    titre: "Un suivi jusqu'à l'acte",
    texte: "Du mandat à la signature chez le notaire, une seule personne suit votre dossier : compromis, conditions suspensives, acte.",
    photo: "Photo · bureau de l'agence, dossier de vente",
    suivi: true,
  },
];

/** Rôle affiché : secteur « [à préciser] » tant que l'agence ne l'a pas fourni (il sert aussi à l'estimation). */
function roleConseiller(m: Membre): string {
  if (m.pole !== "transaction" || m.role !== "Transaction") return m.role;
  return `${m.role} · secteur ${m.secteurs ?? "[à préciser]"}`;
}

export default function PageVendre() {
  const agence = getAgence();
  const { avis, chiffres } = agence;
  const gwendoline = getMembre("gwendoline-delaire");
  const conseillers = getMembres().filter((m) => m.slug === "dominique-rollin" || m.pole === "transaction");
  const ventes = dernieresVentes(3);
  const faq = getFaq("vendre");

  const preuvesChiffrees = [
    { valeur: chiffres.ventes, unite: "", legende: `ventes ${chiffres.periode}` },
    { valeur: nombre(avis.qualitelis.transaction), unite: "/10", legende: `Qualitelis transaction · au ${dater(avis.qualitelis.date)}` },
    { valeur: nombre(avis.google.note), unite: "/5", legende: `${avis.google.nombre} avis Google · au ${dater(avis.google.date)}` },
  ];

  return (
    <>
      <FilAriane etapes={[{ libelle: "Vendre" }]} />

      {/* HAUT DE PAGE */}
      <section aria-labelledby="h1-vendre" className="pb-14 md:py-16">
        <div className="flex flex-col gap-8 md:conteneur md:flex-row md:flex-wrap md:items-center md:gap-16">
          <div className="group order-first h-[280px] md:order-last md:h-[620px] md:flex-[1_1_480px]">
            <EmplacementPhoto libelle="Photo · façade en pierre blonde, Chartrons" className="h-full">
              <div className="absolute right-6 top-6 hidden w-[220px] flex-col gap-1.5 bg-grey-dark p-5 text-white md:flex">
                <span className="font-display text-[13px] uppercase tracking-[0.18em] text-gold">Vendu</span>
                <span className="text-[15px]">[Type, quartier] · vendu en [—] jours</span>
              </div>
            </EmplacementPhoto>
          </div>
          <div className="flex flex-col gap-6 px-6 md:flex-[1_1_520px] md:gap-7 md:px-0">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Vendre votre bien</p>
            <h1 id="h1-vendre" className="m-0 text-[38px] font-medium uppercase leading-none md:text-[clamp(40px,4.2vw,60px)]">
              Vendre aux Chartrons, avec ceux qui connaissent <span className="bg-gold box-decoration-clone px-2">votre rue</span>.
            </h1>
            <p className="m-0 max-w-[520px] text-[17px] leading-normal md:text-[19px]">
              Un prix juste, un bien mis en valeur, un suivi jusqu&apos;à l&apos;acte. Depuis 1993.
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
              <BoutonLien href={ROUTES.estimation} variante="or" taille="grand" className="min-h-[60px] text-base">
                Estimer mon bien
              </BoutonLien>
              <a
                href={`tel:${agence.telephoneE164}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-2.5 border border-grey-dark px-7 font-display text-lg font-medium text-grey-dark no-underline hover:bg-grey-light"
              >
                <IconeTelephone taille={18} />
                {agence.telephone}
              </a>
            </div>
            <dl className="m-0 mt-2 grid grid-cols-3 gap-4 border-t border-grey-light pt-6 md:gap-6">
              {preuvesChiffrees.map((p) => (
                <div key={p.legende} className="flex flex-col-reverse justify-end gap-1">
                  <dt className="text-xs leading-snug md:text-sm">{p.legende}</dt>
                  <dd className="m-0 font-display text-[32px] font-medium leading-none md:text-[44px]">
                    {p.valeur}
                    {p.unite && <span className="text-base md:text-xl">{p.unite}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* MÉTHODE */}
      <section aria-labelledby="h-methode" className="bg-grey-light py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-14">
          <TitreSection id="h-methode" surtitre="Notre méthode" titre="Quatre étapes, un interlocuteur à chaque moment" />
          <ol className="m-0 flex list-none flex-col gap-6 p-0 md:gap-12">
            {METHODE.map((etape, i) => (
              <li key={etape.n} className="group flex flex-col bg-white md:flex-row md:flex-wrap md:items-center md:gap-12">
                <EmplacementPhoto
                  libelle={etape.photo}
                  // Filet Medium Grey : l'emplacement se distingue du fond Light Grey (la maquette utilisait un gris hors charte).
                  className={`h-[200px] border border-grey-medium md:h-[300px] md:flex-[1_1_520px] ${i % 2 === 1 ? "md:order-last" : ""}`}
                />
                <div className="flex flex-col gap-3 p-6 md:flex-[1_1_440px] md:gap-3.5 md:px-12 md:py-10">
                  <span className="font-display text-[44px] font-medium leading-none md:text-[56px]">{etape.n}</span>
                  <h3 className="m-0 text-2xl font-medium uppercase leading-[1.05] md:text-[32px]">{etape.titre}</h3>
                  <p className="m-0 max-w-[460px] text-base leading-normal md:text-[17px]">{etape.texte}</p>
                  {etape.suivi && gwendoline && (
                    <Link href={`${ROUTES.equipe}/${gwendoline.slug}`} className="mt-1.5 flex items-center gap-3.5 text-grey-dark no-underline">
                      <span aria-hidden="true" className="size-14 flex-none rounded-full bg-grey-light" />
                      <span className="flex flex-col gap-0.5 text-sm">
                        <strong>{gwendoline.nom}</strong>
                        <span>
                          {gwendoline.role}
                          {gwendoline.specialite ? `, ${gwendoline.specialite.charAt(0).toLowerCase()}${gwendoline.specialite.slice(1)}` : ""}
                        </span>
                      </span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PREUVES */}
      <section aria-labelledby="h-preuves" className="bg-grey-dark py-14 text-white md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-12">
          <TitreSection
            id="h-preuves"
            surtitre="Les preuves"
            titre="Ils ont vendu avec nous"
            aside={
              <LienFleche href={ROUTES.biensVendus} surFondSombre className="hidden md:inline-block">
                Tous les biens vendus
              </LienFleche>
            }
            surFondSombre
          />
          <div className="hidden grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:grid">
            {ventes.map((v) => (
              <CarteVendu key={v.cle} vente={v} hauteur="h-[240px]" compacte />
            ))}
          </div>
          <div className="md:hidden">
            <RangeeDefilable libelle="Biens vendus" largeurElement="w-[240px]" fleches={false}>
              {ventes.map((v) => (
                <CarteVendu key={v.cle} vente={v} hauteur="h-[180px]" compacte />
              ))}
            </RangeeDefilable>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="flex flex-[1_1_260px] flex-col justify-between gap-3 border border-gold p-6 md:p-8">
              <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">Satisfaction vendeurs</span>
              <span className="font-display text-[56px] font-medium leading-none md:text-7xl">
                {nombre(avis.qualitelis.transaction)}
                <span className="text-2xl md:text-[28px]">/10</span>
              </span>
              <span className="text-sm text-grey-light">Qualitelis, transaction · au {dater(avis.qualitelis.date)}</span>
            </div>
            {/* Emplacements d'avis Google de vendeurs (flux à brancher). Étoiles : décision de Simon (19/11/2026). */}
            {[1, 2].map((n) => (
              <figure key={n} className={`m-0 flex-[1.4_1_360px] flex-col gap-4 bg-white p-6 text-grey-dark md:p-8 ${n === 2 ? "hidden md:flex" : "flex"}`}>
                <span role="img" aria-label="Note 5 sur 5" className="text-lg tracking-[3px]">
                  ★★★★★
                </span>
                <blockquote className="m-0 flex-1 text-base leading-normal md:text-lg">[Extrait d&apos;un avis Google de vendeur, importé automatiquement]</blockquote>
                <figcaption className="flex justify-between border-t border-grey-light pt-3.5 text-sm">
                  <strong>[Prénom] · vendeur</strong>
                  <span>[date]</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <LienFleche href={ROUTES.biensVendus} surFondSombre className="md:hidden">
            Tous les biens vendus
          </LienFleche>
        </div>
      </section>

      {/* CONSEILLERS */}
      <section aria-labelledby="h-conseillers" className="py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <TitreSection
            id="h-conseillers"
            surtitre="Pôle transaction"
            titre="Vos conseillers transaction"
            texte="Chaque secteur a son conseiller référent. Il connaît les ventes récentes de votre rue."
          />
          <ul className="m-0 hidden list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-6 gap-y-8 p-0 md:grid">
            {conseillers.map((m) => (
              <li key={m.slug}>
                <CarteMembre membre={m} role={roleConseiller(m)} />
              </li>
            ))}
          </ul>
          <div className="md:hidden">
            <RangeeDefilable libelle="Conseillers transaction" largeurElement="w-[180px]" fleches={false}>
              {conseillers.map((m) => (
                <CarteMembre key={m.slug} membre={m} role={roleConseiller(m)} />
              ))}
            </RangeeDefilable>
          </div>
          <BoutonLien href={ROUTES.estimation} variante="or" taille="grand" className="self-start">
            Estimer mon bien
          </BoutonLien>
        </div>
      </section>

      {/* FAQ VENDEURS */}
      <section aria-labelledby="h-faq" className="border-t border-grey-light py-14 md:py-24">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Questions de vendeurs</p>
            <h2 id="h-faq" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
              Vos questions, nos réponses
            </h2>
            <p className="m-0 text-[17px] leading-normal">
              Une autre question ? Appelez-nous au{" "}
              <a href={`tel:${agence.telephoneE164}`} className="font-bold text-grey-dark">
                {agence.telephone}
              </a>
              .
            </p>
          </div>
          {/* Desktop : première question ouverte ; mobile : FAQ repliée (annotation de la maquette). */}
          <div className="hidden flex-[1.6_1_560px] md:block">
            <Faq questions={faq} premiereOuverte />
          </div>
          <div className="w-full md:hidden">
            <Faq questions={faq} />
          </div>
        </div>
      </section>

      {/* APPEL FINAL */}
      <section aria-labelledby="h-cta" className="bg-gold py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8 md:gap-12">
          <div className="flex flex-[1_1_460px] flex-col gap-4">
            <h2 id="h-cta" className="m-0 text-[36px] font-medium uppercase leading-none md:text-[clamp(36px,4vw,60px)]">
              Combien vaut votre bien ?
            </h2>
            <p className="m-0 text-[17px] leading-normal md:text-lg">Une première fourchette en 2 minutes, puis l&apos;avis d&apos;un expert de votre quartier.</p>
          </div>
          <FormulaireAdresse id="vendre-adresse" className="flex-[1_1_520px]" />
        </div>
      </section>
    </>
  );
}
