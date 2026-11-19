import type { Metadata } from "next";
import Link from "next/link";
import { CarteMembre } from "@/components/equipe/CarteMembre";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { Faq } from "@/components/ui/Faq";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence, getArticles, getFaq, getMembres, getPoles } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import type { Membre } from "@/lib/schemas/equipe";
import { donneesFaq, metaPage } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Page « Faire louer ou gérer » (brief prompt 5 ; maquette GererDesktop, GererMobile).
 * Action principale : « Estimer mon loyer », qui ouvre l'estimation avec le projet pré-sélectionné.
 * Contenu des offres repris de l'article « Ce que fait vraiment votre gestionnaire ». Aucun tarif : renvoi au barème.
 * Réserves entre crochets retirées à la demande de Simon (19/11/2026) : textes à relire avec l'agence.
 * À VALIDER : garantie des loyers impayés (assureur, conditions, coût) et périodicité du relevé de gérance.
 */

export const metadata: Metadata = metaPage({
  titre: "Faire louer ou gérer votre bien à Bordeaux",
  description: "Mise en location ou gestion locative complète, dans toute la métropole bordelaise. Plus de 600 biens gérés par notre équipe.",
  chemin: "/faire-louer-ou-gerer",
});

const ESTIMER_LOUER = `${ROUTES.estimation}?projet=faire-louer`;
const ESTIMER_GERER = `${ROUTES.estimation}?projet=confier-la-gestion`;

const MISE_EN_LOCATION = [
  "Estimation du loyer, plafonds applicables compris",
  "Vérification des diagnostics, DPE compris",
  "Photos, annonce et diffusion",
  "Organisation des visites",
  "Sélection et vérification du dossier du locataire",
  "Rédaction du bail",
  "État des lieux d'entrée",
];

const GESTION = [
  "Tout ce que comprend la mise en location",
  "Encaissement des loyers et suivi des impayés",
  "Régularisation annuelle des charges",
  "Gestion des travaux et des sinistres",
  "Veille réglementaire : DPE, décence du logement",
  "Aide à la déclaration des revenus fonciers",
  "État des lieux de sortie et dépôt de garantie",
  "Relevé de gérance",
];

const ETAPES = [
  { n: "01", titre: "Estimation du loyer", texte: "Un loyer juste, au regard du marché et des plafonds applicables." },
  { n: "02", titre: "Mise en location", texte: "Annonce, visites, sélection du locataire." },
  { n: "03", titre: "Bail et état des lieux", texte: "Signature du bail, remise des clés." },
  { n: "04", titre: "Gestion au quotidien", texte: "Loyers, charges, travaux, sinistres : notre équipe s'en occupe." },
  { n: "05", titre: "Relevé de gérance", texte: "Vous suivez vos loyers et vos dépenses." },
];

// Équipe location et gestion de la maquette.
const EQUIPE = [
  "myriam-rollin",
  "elodie-fournier",
  "claire-chevet",
  "lena-duporte",
  "gwenaelle-aubin",
  "georgia-cross",
  "cecile-boirie",
  "marie-brac-de-la-perriere",
];

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

function Coche({ claire = false }: { claire?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`mt-0.5 flex-none ${claire ? "text-gold" : ""}`}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PageGerer() {
  const agence = getAgence();
  const { chiffres, avis } = agence;
  const poles = getPoles();
  const parSlug = new Map(getMembres().map((m) => [m.slug, m]));
  const equipe = EQUIPE.map((s) => parSlug.get(s)).filter((m): m is Membre => !!m);
  const pole = (m: Membre) => poles.find((p) => p.id === m.pole);
  const articleDpe = getArticles().find((a) => a.slug === "dpe-2026");
  const faq = getFaq("gerer");

  const preuves = [
    { valeur: chiffres.biensGeres, unite: "", legende: `biens en gestion ${chiffres.periode}` },
    { valeur: chiffres.locations, unite: "", legende: `locations ${chiffres.periode}` },
    { valeur: nombre(avis.qualitelis.gestion), unite: "/10", legende: `Qualitelis gestion · au ${dater(avis.qualitelis.date)}` },
  ];

  return (
    <>
      <JsonLd donnees={donneesFaq(faq)} />
      <FilAriane etapes={[{ libelle: "Faire louer ou gérer" }]} />

      {/* HAUT DE PAGE */}
      <section aria-labelledby="h1-gerer" className="pb-14 md:py-16">
        <div className="flex flex-col gap-8 md:conteneur md:flex-row md:flex-wrap md:items-center md:gap-16">
          <div className="group order-first h-[260px] md:order-last md:h-[560px] md:flex-[1_1_480px]">
            <EmplacementPhoto libelle="Photo · appartement loué, séjour lumineux" className="h-full" />
          </div>
          <div className="flex flex-col gap-6 px-6 md:flex-[1_1_520px] md:gap-7 md:px-0">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Propriétaires bailleurs</p>
            <h1 id="h1-gerer" className="m-0 text-[38px] font-medium uppercase leading-none md:text-[clamp(40px,4.2vw,60px)]">
              Votre bien loué et géré par <span className="bg-gold box-decoration-clone px-2">des spécialistes</span>.
            </h1>
            <p className="m-0 max-w-[520px] text-[17px] leading-normal md:text-[19px]">Mise en location ou gestion complète, dans toute la métropole bordelaise.</p>
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
              <BoutonLien href={ESTIMER_LOUER} variante="or" taille="grand" className="min-h-[60px] text-base">
                Estimer mon loyer
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
              {preuves.map((p) => (
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

      {/* DEUX OFFRES */}
      <section aria-labelledby="h-offres" className="bg-grey-light py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-12">
          <TitreSection id="h-offres" surtitre="Nos deux offres" titre="Louer une fois, ou tout nous confier" />
          <div className="flex flex-col gap-6 md:flex-row md:flex-wrap">
            <article aria-labelledby="h-offre-location" className="flex flex-[1_1_520px] flex-col gap-5 bg-white p-6 md:gap-[22px] md:p-12">
              <span className="font-display text-sm uppercase tracking-[0.2em]">Offre 1</span>
              <h3 id="h-offre-location" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[40px]">
                Mise en location
              </h3>
              <p className="m-0 text-[17px] leading-normal">Nous trouvons le bon locataire. Vous gérez ensuite le bail vous-même.</p>
              <ul className="m-0 flex list-none flex-col p-0">
                {MISE_EN_LOCATION.map((i) => (
                  <li key={i} className="flex gap-3 border-t border-grey-light py-3 text-base">
                    <Coche />
                    {i}
                  </li>
                ))}
              </ul>
              <BoutonLien href={ESTIMER_LOUER} variante="contour" taille="grand" className="mt-auto self-start">
                Faire louer mon bien
              </BoutonLien>
            </article>

            <article aria-labelledby="h-offre-gestion" className="relative flex flex-[1_1_520px] flex-col gap-5 bg-grey-dark p-6 pt-14 text-white md:gap-[22px] md:p-12">
              <span className="absolute right-6 top-0 bg-gold px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-grey-dark md:right-12">
                {chiffres.biensGeres} biens confiés
              </span>
              <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">Offre 2</span>
              <h3 id="h-offre-gestion" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[40px]">
                Gestion locative
              </h3>
              <p className="m-0 text-[17px] leading-normal text-grey-light">La mise en location, puis tout le reste, du premier loyer à la sortie du locataire.</p>
              <ul className="m-0 flex list-none flex-col p-0">
                {GESTION.map((i) => (
                  <li key={i} className="flex gap-3 border-t border-grey-light/20 py-3 text-base">
                    <Coche claire />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="m-0 border-l-2 border-gold pl-4 text-[15px] leading-normal text-grey-light">
                <strong className="text-white">Garanties</strong> · Garantie des loyers impayés en option
              </p>
              <BoutonLien href={ESTIMER_GERER} variante="or" taille="grand" className="mt-auto self-start">
                Confier la gestion
              </BoutonLien>
            </article>
          </div>
          <p className="m-0 text-[15px]">
            Nos honoraires de location et de gestion figurent dans notre{" "}
            <Link href={ROUTES.honoraires} className="font-bold text-grey-dark">
              barème d&apos;honoraires
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ENCART DPE */}
      <section aria-labelledby="h-dpe" className="py-12 md:py-14">
        <div className="conteneur flex flex-wrap items-center justify-between gap-6 border-y border-grey-light py-8">
          <div className="flex flex-[1_1_560px] items-start gap-5">
            <span aria-hidden="true" className="flex size-16 flex-none items-center justify-center bg-dpe-g font-display text-[38px] font-bold text-white">
              G
            </span>
            <div className="flex flex-col gap-2">
              <h2 id="h-dpe" className="m-0 text-2xl font-medium uppercase leading-tight md:text-[32px]">
                DPE : votre logement peut-il encore être loué ?
              </h2>
              <p className="m-0 max-w-[720px] text-base leading-normal">
                Classe G : plus de nouveau bail, de renouvellement ni de reconduction depuis le 1er janvier 2025. Classe F : à partir de 2028. Classe E : à partir de 2034.
              </p>
            </div>
          </div>
          {articleDpe && <LienFleche href={`${ROUTES.ressources}/${articleDpe.slug}`}>Lire : DPE 2026, ce qui change</LienFleche>}
        </div>
      </section>

      {/* DÉROULÉ */}
      <section aria-labelledby="h-deroule" className="bg-grey-dark py-14 text-white md:py-[88px]">
        <div className="conteneur flex flex-col gap-8 md:gap-12">
          <TitreSection id="h-deroule" surtitre="Comment ça se passe" titre="De l'estimation au relevé de gérance" surFondSombre />
          <ol className="m-0 grid list-none grid-cols-1 gap-x-6 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {ETAPES.map((e) => (
              <li key={e.n} className="flex flex-col gap-3 border-t-2 border-gold py-6 pr-4">
                <span className="font-display text-[40px] font-medium leading-none text-gold">{e.n}</span>
                <h3 className="m-0 text-[22px] font-medium uppercase leading-tight">{e.titre}</h3>
                <p className="m-0 text-base leading-normal text-grey-light">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PREUVES */}
      <section aria-labelledby="h-preuves" className="py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <TitreSection
            id="h-preuves"
            surtitre="Ils nous confient leur bien"
            titre="Les preuves"
            aside={<LienFleche href={ROUTES.avis}>Tous les avis</LienFleche>}
          />
          <dl className="m-0 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {[
              { valeur: chiffres.biensGeres, legende: `biens en gestion locative ${chiffres.periode}` },
              { valeur: chiffres.locations, legende: `locations ${chiffres.periode}` },
              { valeur: `${nombre(avis.qualitelis.gestion)}/10`, legende: `Qualitelis, gestion · au ${dater(avis.qualitelis.date)}` },
            ].map((p) => (
              <div key={p.legende} className="flex flex-col-reverse justify-end gap-2 bg-grey-light p-6 md:p-8">
                <dt className="text-[15px]">{p.legende}</dt>
                <dd className="m-0 font-display text-[56px] font-medium leading-none md:text-7xl">{p.valeur}</dd>
              </div>
            ))}
          </dl>
          {/* Emplacements d'avis Google de bailleurs (flux à brancher). Étoiles : décision de Simon (19/11/2026). */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {["propriétaire en gestion", "propriétaire bailleur"].map((qui, i) => (
              <figure key={qui} className={`m-0 flex-col gap-4 border border-grey-light p-6 md:p-8 ${i === 1 ? "hidden md:flex" : "flex"}`}>
                <span role="img" aria-label="Note 5 sur 5" className="text-lg tracking-[3px]">
                  ★★★★★
                </span>
                <blockquote className="m-0 flex-1 text-base leading-normal md:text-lg">[Extrait d&apos;un avis Google de propriétaire bailleur, importé automatiquement]</blockquote>
                <figcaption className="flex justify-between border-t border-grey-light pt-3.5 text-sm">
                  <strong>[Prénom] · {qui}</strong>
                  <span>[date]</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      {/* Fond blanc (et non Light Grey comme la maquette) : les emplacements de portraits, gris clair, restent visibles. */}
      <section aria-labelledby="h-equipe" className="border-t border-grey-light py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <TitreSection id="h-equipe" surtitre="Pôles location et gestion" titre="Qui s'occupe de votre bien" texte="Location, gestion, comptabilité : chacun son rôle." />
          <ul className="m-0 hidden list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-8 p-0 md:grid">
            {equipe.map((m) => (
              <li key={m.slug}>
                <CarteMembre membre={m} pole={pole(m)} />
              </li>
            ))}
          </ul>
          <div className="md:hidden">
            <RangeeDefilable libelle="Équipe location et gestion" largeurElement="w-[200px]" fleches={false}>
              {equipe.map((m) => (
                <CarteMembre key={m.slug} membre={m} pole={pole(m)} />
              ))}
            </RangeeDefilable>
          </div>
        </div>
      </section>

      {/* FAQ BAILLEURS */}
      <section aria-labelledby="h-faq" className="py-14 md:py-24">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Questions de bailleurs</p>
            <h2 id="h-faq" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
              Vos questions, nos réponses
            </h2>
            <p className="m-0 text-[17px] leading-normal">
              Une autre question ?{" "}
              <a href={`tel:${agence.telephoneE164}`} className="font-bold text-grey-dark">
                {agence.telephone}
              </a>
            </p>
          </div>
          {/* À VALIDER : réponse sur l'encadrement des loyers à mettre à jour selon le vote de la prolongation (fin prévue le 24/11/2026). */}
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
              Combien louer votre bien ?
            </h2>
            <p className="m-0 text-[17px] leading-normal md:text-lg">Une estimation de loyer en 2 minutes, puis l&apos;avis de notre équipe location.</p>
          </div>
          <FormulaireAdresse id="gerer-adresse" libelle="Adresse du bien à louer" bouton="Estimer mon loyer" projet="faire-louer" className="flex-[1_1_520px]" />
        </div>
      </section>
    </>
  );
}
