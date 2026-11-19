import type { Metadata } from "next";
import Link from "next/link";
import { CarteBien } from "@/components/biens/CarteBien";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { FormulaireAlerte } from "@/components/formulaires/FormulaireAlerte";
import { LienFleche } from "@/components/ui/Bouton";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { TitreSection } from "@/components/ui/TitreSection";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { BUDGETS, filtrer, FILTRES_PAR_DEFAUT, PIECES, trier } from "@/lib/biens/recherche";
import { getAgence, getAnnonces, getLocalisations } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * Page « Acheter » (brief prompt 3 ; maquette AcheterDesktop, AcheterMobile).
 * Plus courte que « Vendre » : action principale = la recherche, dès le haut de page.
 */

export const metadata: Metadata = {
  title: "Acheter aux Chartrons",
  description: "Votre projet d'achat à Bordeaux, compris et accompagné de bout en bout : recherche, visites, offre, compromis, acte.",
};

// Déroulé de la maquette (AcheterDesktop). À VALIDER : partenaires de financement (étape 5), rôle de l'agence dans l'avant-contrat (étape 6).
const ETAPES = [
  { n: "01", titre: "Votre besoin", texte: "Un premier rendez-vous pour cerner quartier, surface, budget et contraintes." },
  { n: "02", titre: "La sélection", texte: "Nous vous proposons les biens qui correspondent vraiment à votre recherche." },
  { n: "03", titre: "Les visites", texte: "Nous organisons les visites et répondons à vos questions, copropriété comprise." },
  { n: "04", titre: "L'offre", texte: "Nous vous aidons à formuler une offre juste et la présentons au vendeur." },
  { n: "05", titre: "Le financement", texte: "Nous vous aidons à anticiper votre plan de financement. [Partenaires à confirmer]" },
  { n: "06", titre: "Le compromis", texte: "Nous préparons la signature de l'avant-contrat, avec le notaire." },
  { n: "07", titre: "L'acte", texte: "Jusqu'à la signature de l'acte et la remise des clés." },
];

const euros = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} €`;
const champ = "flex flex-col gap-2 text-sm text-white";
const select = "h-14 border-0 bg-white px-3.5 text-base text-grey-dark";

export default async function PageAcheter() {
  const agence = getAgence();
  const nouveaux = await slugsNouveaux();
  const derniers = trier(filtrer(getAnnonces(), FILTRES_PAR_DEFAUT), "recents").slice(0, 3);
  const nbEnVente = filtrer(getAnnonces(), FILTRES_PAR_DEFAUT).length;
  const localisations = getLocalisations();

  return (
    <>
      <FilAriane etapes={[{ libelle: "Acheter" }]} />

      {/* HAUT DE PAGE + RECHERCHE */}
      <section aria-labelledby="h1-acheter" className="py-10 md:py-16">
        <div className="conteneur flex flex-wrap items-center gap-10 md:gap-16">
          <div className="flex flex-[1_1_480px] flex-col gap-6">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Acheter un bien</p>
            <h1 id="h1-acheter" className="m-0 text-[36px] font-medium uppercase leading-none md:text-[clamp(40px,4.2vw,60px)]">
              Votre projet d&apos;achat, compris et <span className="bg-gold box-decoration-clone px-2">accompagné</span> de bout en bout.
            </h1>
            <p className="m-0 max-w-[540px] text-[17px] leading-normal md:text-[19px]">
              Nous prenons le temps de comprendre précisément votre besoin. Puis nous vous suivons jusqu&apos;à la signature chez le notaire.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={`tel:${agence.telephoneE164}`}
                className="inline-flex min-h-14 items-center gap-2.5 border border-grey-dark px-6 font-display text-base font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-grey-light"
              >
                <IconeTelephone taille={18} />
                Parler à un conseiller
              </a>
              <a href="#alerte" className="border-b border-grey-dark pb-0.5 text-base font-bold text-grey-dark no-underline">
                Créer une alerte e-mail <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <form action={ROUTES.biens} method="get" aria-labelledby="h-recherche" className="order-first flex flex-[1_1_440px] flex-col gap-5 bg-grey-dark p-6 md:order-none md:p-10">
            <h2 id="h-recherche" className="m-0 text-[26px] font-medium uppercase leading-none text-white md:text-3xl">
              Rechercher un bien
            </h2>
            <input type="hidden" name="transaction" value="vente" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={champ}>
                Type
                <select name="type" className={select} defaultValue="">
                  <option value="">Appartement ou maison</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                </select>
              </label>
              <label className={champ}>
                Budget max.
                <select name="budget" className={select} defaultValue="">
                  <option value="">Indifférent</option>
                  {BUDGETS.vente.map((b) => (
                    <option key={b} value={b}>
                      {euros(b)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={champ}>
                Quartier
                <select name="quartier" className={select} defaultValue="">
                  <option value="">Tous les quartiers</option>
                  {localisations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nom}
                    </option>
                  ))}
                </select>
              </label>
              <label className={champ}>
                Surface min. (m²)
                <input name="surface" type="number" inputMode="numeric" min={1} placeholder="Ex. 60" className={select} />
              </label>
            </div>
            <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
              <legend className="mb-2.5 p-0 text-sm text-white">Pièces</legend>
              <div className="flex flex-wrap gap-2">
                {[{ v: "", l: "Toutes" }, ...PIECES.map((p) => ({ v: String(p), l: p === 5 ? "5+" : String(p) }))].map((p) => (
                  <label key={p.l} className="cursor-pointer">
                    <input type="radio" name="pieces" value={p.v} defaultChecked={p.v === ""} className="peer sr-only" />
                    <span className="flex min-h-12 min-w-12 items-center justify-center border border-white px-4 text-base text-white peer-checked:bg-white peer-checked:text-grey-dark peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                      {p.l}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="min-h-14 cursor-pointer bg-gold font-display text-base font-semibold uppercase tracking-[0.14em] text-grey-dark hover:bg-gold-dark">
              Voir les biens
            </button>
            <Link href={`${ROUTES.biens}?transaction=vente&vue=carte`} className="self-center border-b border-gold pb-0.5 text-[15px] text-white no-underline hover:text-gold">
              Voir sur la carte
            </Link>
          </form>
        </div>
      </section>

      {/* DERNIERS BIENS */}
      <section aria-labelledby="h-biens" className="border-t border-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <TitreSection
            id="h-biens"
            surtitre="À vendre"
            titre="Les derniers biens"
            aside={<LienFleche href={ROUTES.achat}>Voir les {nbEnVente} biens en vente</LienFleche>}
          />
          <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 md:grid-cols-3">
            {derniers.map((a) => (
              <li key={a.slug}>
                <CarteBien annonce={a} nouveau={nouveaux.includes(a.slug)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DÉROULÉ */}
      <section aria-labelledby="h-deroule" className="bg-grey-light py-14 md:py-24">
        <div className="conteneur flex flex-col gap-8 md:gap-12">
          <TitreSection id="h-deroule" surtitre="Notre accompagnement" titre="Sept étapes, un seul interlocuteur" />
          <ol className="m-0 grid list-none grid-cols-1 gap-x-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((e) => (
              <li key={e.n} className="flex flex-col gap-3 border-t-2 border-grey-dark py-6 pr-5">
                <span className="font-display text-[40px] font-medium leading-none">{e.n}</span>
                <h3 className="m-0 text-2xl font-medium uppercase leading-tight">{e.titre}</h3>
                <p className="m-0 text-base leading-normal">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ALERTE E-MAIL */}
      <section id="alerte" aria-labelledby="h-alerte" className="scroll-mt-24 bg-gold py-14 md:py-20">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_360px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Alerte e-mail</p>
            <h2 id="h-alerte" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
              Soyez prévenu dès qu&apos;un bien correspond
            </h2>
            <p className="m-0 text-[17px] leading-normal">Un e-mail à chaque nouveau bien qui répond à vos critères. Désinscription en un clic.</p>
          </div>
          <div className="flex-[1.3_1_420px]">
            <FormulaireAlerte
              criteres={["Achat", "Appartement ou maison", "Tous les quartiers"]}
              lienModifier={
                <Link href={`${ROUTES.biens}?transaction=vente#alerte`} className="text-sm font-bold text-grey-dark">
                  Choisir mes critères
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* VOUS VENDEZ AUSSI ? */}
      <section aria-labelledby="h-vendeur" className="bg-grey-dark py-14 text-white md:py-20">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_420px] flex-col gap-3">
            <h2 id="h-vendeur" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
              Vous vendez aussi ? <span className="text-gold">Estimez votre bien.</span>
            </h2>
            <p className="m-0 text-[17px] leading-normal text-grey-light">Acheter et vendre en même temps, c&apos;est plus simple avec un seul interlocuteur.</p>
          </div>
          <FormulaireAdresse id="vendeur-adresse" libelle="Adresse du bien à vendre" variante="or" className="flex-[1_1_480px]" />
        </div>
      </section>
    </>
  );
}
