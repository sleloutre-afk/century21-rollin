import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarteBien } from "@/components/biens/CarteBien";
import { CarteVendu } from "@/components/biens/CarteVendu";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { FormulaireAlerte } from "@/components/formulaires/FormulaireAlerte";
import { LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { EnBref } from "@/components/ui/EnBref";
import { Faq } from "@/components/ui/Faq";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { estVisibleEnRecherche } from "@/lib/biens/recherche";
import { emplacementsVentes, toutesLesVentes } from "@/lib/biens/ventes";
import { getAgence, getAnnonces, getMembre, getSecteur, getSecteurs } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { dansLeQuartier } from "@/lib/quartiers";
import { JsonLd } from "@/components/seo/JsonLd";
import { donneesFaq, metaPage } from "@/lib/seo";

/**
 * Page quartier : un seul gabarit pour les 6 secteurs (brief prompt 6 ; maquette QuartierDesktop, QuartierMobile).
 * - Contenus dans contenus/quartiers.json ; bloc sans contenu → masqué (spec §5).
 * - Marché immobilier : aucun chiffre inventé, emplacements jusqu'au choix d'une source datée.
 * - Aucun bien en vente dans le secteur → état « aucun bien » avec la création d'alerte.
 */

/**
 * Navigation « bloquante » assumée : chaque page de ce gabarit est préparée à l'avance (generateStaticParams),
 * le serveur la renvoie immédiatement. Évite l'avertissement de Next.js sur la lecture de l'adresse (params).
 */
export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSecteurs().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const secteur = getSecteur((await params).slug);
  if (!secteur) return { title: "Quartier introuvable" };
  return metaPage({
    titre: `Quartier ${secteur.nom}, Bordeaux`,
    description: secteur.accroche ?? `Vendre, louer ou acheter ${dansLeQuartier(secteur)}, à Bordeaux, avec Cabinet Rollin – CENTURY 21 Les Chartrons.`,
    chemin: `${ROUTES.quartiers}/${secteur.slug}`,
  });
}

const dater = (d: string | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${d}T00:00:00`)) : "[date]";

export default async function PageQuartier({ params }: Props) {
  const secteur = getSecteur((await params).slug);
  if (!secteur) notFound();

  const agence = getAgence();
  const nouveaux = await slugsNouveaux();
  const enVente = getAnnonces().filter((a) => a.secteur === secteur.slug && estVisibleEnRecherche(a) && a.transaction === "vente");
  const vendus = toutesLesVentes().filter((v) => v.secteur === secteur.slug).slice(0, 4);
  const ventes = vendus.length > 0 ? vendus : emplacementsVentes(4);
  const referent = secteur.conseillerReferent ? getMembre(secteur.conseillerReferent) : undefined;
  const auteur = secteur.auteur ? getMembre(secteur.auteur) : undefined;
  const ou = dansLeQuartier(secteur);
  const lienRecherche = `${ROUTES.biens}?transaction=vente&quartier=${secteur.slug}`;

  // Marché : 4 indicateurs de la maquette, en emplacements. À VALIDER : source des prix (DVF, base notariale, agence) et sa date.
  const marche = [
    { cle: "Prix moyen au m², appartements", valeur: "[—] €" },
    { cle: "Prix moyen au m², maisons", valeur: "[—] €" },
    { cle: "Évolution sur 12 mois", valeur: "[—] %" },
    { cle: "Délai moyen de vente (agence)", valeur: "[—] j" },
  ];

  return (
    <>
      {secteur.faq && <JsonLd donnees={donneesFaq(secteur.faq)} />}
      <FilAriane etapes={[{ libelle: "Nos quartiers", href: ROUTES.quartiers }, { libelle: secteur.nom }]} />

      {/* GRANDE PHOTO */}
      <section aria-labelledby="h1-quartier" className="relative flex min-h-[480px] flex-col justify-end overflow-hidden bg-grey-dark text-white md:min-h-[640px]">
        <span aria-hidden="true" className="absolute right-4 top-4 border border-grey-light/50 px-2.5 py-1.5 font-display text-[11px] uppercase tracking-[0.16em] text-grey-light md:right-8 md:top-8 md:text-[13px]">
          {secteur.photo ?? `Grande photo · ${secteur.nom}`}
        </span>
        <div className="conteneur relative flex flex-col gap-4 pb-10 md:gap-5 md:pb-16">
          <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">Quartier · Bordeaux</p>
          <h1 id="h1-quartier" className="m-0 text-[48px] font-medium uppercase leading-[0.95] md:text-[clamp(56px,7vw,104px)]">
            {secteur.nom}
          </h1>
          <p className="m-0 max-w-[640px] text-[17px] leading-normal text-grey-light md:text-xl">{secteur.accroche ?? "[Présentation du quartier à rédiger]"}</p>
          <p className="m-0 text-sm text-grey-light">
            Par {auteur?.nom ?? "[membre de l'équipe]"} · Mis à jour le {dater(secteur.dateMiseAJour)}
          </p>
        </div>
      </section>

      {/* EN BREF + AMBIANCE */}
      {(secteur.bref || secteur.ambiance) && (
        <section aria-label="Le quartier en bref" className="py-14 md:py-[88px]">
          <div className="conteneur flex flex-wrap gap-10 md:gap-16">
            {secteur.bref && (
              <div className="flex-[1_1_420px]">
                <EnBref points={secteur.bref} id="h-bref" />
              </div>
            )}
            {secteur.ambiance && (
              <div className="flex flex-[1.3_1_520px] flex-col gap-5">
                <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">L&apos;ambiance</p>
                <h2 className="m-0 text-[34px] font-medium uppercase leading-none md:text-[44px]">{secteur.ambianceTitre ?? "L'ambiance"}</h2>
                <p className="m-0 max-w-[620px] text-[17px] leading-relaxed md:text-lg">{secteur.ambiance}</p>
                <div className="mt-2 flex gap-3">
                  {[secteur.photo2, secteur.photo3].filter(Boolean).map((p) => (
                    <EmplacementPhoto key={p} libelle={p!} className="h-[160px] flex-1 md:h-[200px]" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MARCHÉ IMMOBILIER */}
      <section aria-labelledby="h-marche" className="bg-grey-dark py-14 text-white md:py-[88px]">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-4">
              <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">Marché immobilier</p>
              <h2 id="h-marche" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
                Les prix, rue par rue
              </h2>
            </div>
            <span className="text-sm text-grey-light">Source : {secteur.sourcePrix ?? "[à définir]"} · données au [date]</span>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {marche.map((m) => (
              <div key={m.cle} className="flex flex-col-reverse justify-end gap-2 border-t border-gold/45 pt-4">
                <dt className="text-sm text-grey-light">{m.cle}</dt>
                <dd className="m-0 font-display text-[36px] font-medium leading-none md:text-[52px]">{m.valeur}</dd>
              </div>
            ))}
          </dl>
          <EmplacementPhoto libelle="Graphique · évolution du prix au m² sur 5 ans · données à brancher" surFondSombre className="h-[200px] md:h-[260px]" />
        </div>
      </section>

      {/* VIVRE AU QUOTIDIEN */}
      {secteur.vivre && secteur.vivre.length > 0 && (
        <section aria-labelledby="h-vivre" className="py-14 md:py-[88px]">
          <div className="conteneur flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4">
              <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Vivre au quotidien</p>
              <h2 id="h-vivre" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
                Transports, commerces, écoles
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {secteur.vivre.map((v) => (
                <div key={v.titre} className="flex flex-col gap-2.5 border-t-2 border-grey-dark py-6">
                  <h3 className="m-0 text-2xl font-medium uppercase leading-tight">{v.titre}</h3>
                  <p className="m-0 text-base leading-normal">{v.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BIENS EN VENTE ET VENDUS */}
      <section aria-labelledby="h-biens" className="bg-grey-light py-14 md:py-[88px]">
        <div className="conteneur flex flex-col gap-8 md:gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="h-biens" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
              Nos biens dans le quartier
            </h2>
            <LienFleche href={ROUTES.achat}>Voir tous les biens</LienFleche>
          </div>

          {enVente.length > 0 ? (
            <>
              <ul className="m-0 hidden list-none grid-cols-3 gap-6 p-0 md:grid">
                {enVente.slice(0, 3).map((a) => (
                  <li key={a.slug} className="bg-white p-4">
                    <CarteBien annonce={a} nouveau={nouveaux.includes(a.slug)} />
                  </li>
                ))}
              </ul>
              <div className="md:hidden">
                <RangeeDefilable libelle={`Biens en vente ${ou}`} largeurElement="w-[280px]" fleches={false}>
                  {enVente.map((a) => (
                    <div key={a.slug} className="bg-white p-3">
                      <CarteBien annonce={a} nouveau={nouveaux.includes(a.slug)} />
                    </div>
                  ))}
                </RangeeDefilable>
              </div>
              {enVente.length > 3 && <LienFleche href={lienRecherche}>{`Voir les ${enVente.length} biens en vente ${ou}`}</LienFleche>}
            </>
          ) : (
            <div className="flex flex-wrap gap-8 bg-white p-6 md:p-10">
              <div className="flex flex-[1_1_320px] flex-col gap-3">
                <h3 className="m-0 text-[26px] font-medium uppercase leading-tight">Aucun bien en vente en ce moment</h3>
                <p className="m-0 text-base">Soyez prévenu dès qu&apos;un bien est proposé dans le quartier.</p>
              </div>
              <div className="flex-[1.4_1_420px]">
                <FormulaireAlerte criteres={["Achat", "Appartement ou maison", secteur.nom]} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 bg-grey-dark p-6 text-white md:p-10">
            <h3 className="m-0 text-[26px] font-medium uppercase leading-tight">Récemment vendus dans le quartier</h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
              {ventes.map((v) => (
                <CarteVendu key={v.cle} vente={v} hauteur="h-[140px] md:h-[180px]" compacte />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONSEILLER RÉFÉRENT */}
      <section aria-labelledby="h-referent" className="py-14 md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-12">
          <EmplacementPhoto libelle="Portrait à fournir" className="aspect-[4/5] w-[160px] flex-none md:w-[220px]" />
          <div className="flex flex-[1_1_380px] flex-col gap-3">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm">Votre conseiller référent · {secteur.nom}</p>
            <h2 id="h-referent" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[44px]">
              {referent?.nom ?? "[Prénom Nom]"}
            </h2>
            <p className="m-0 max-w-[560px] text-[17px] leading-normal">
              {referent?.presentation ?? "[Deux lignes à la première personne : ce que le conseiller connaît du quartier.]"}
            </p>
          </div>
          <div className="flex flex-[0_1_280px] flex-col gap-3">
            <Link
              href={referent ? `${ROUTES.equipe}/${referent.slug}#rendez-vous` : `${ROUTES.contact}#rendez-vous`}
              className="flex min-h-14 items-center justify-center bg-grey-dark px-6 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white no-underline hover:text-gold"
            >
              Prendre rendez-vous
            </Link>
            <a
              href={`tel:${agence.telephoneE164}`}
              className="flex min-h-14 items-center justify-center gap-2.5 border border-grey-dark font-display text-lg font-medium text-grey-dark no-underline hover:bg-grey-light"
            >
              <IconeTelephone taille={18} />
              {referent?.telephoneDirect ?? agence.telephone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {secteur.faq && secteur.faq.length > 0 && (
        <section aria-labelledby="h-faq" className="border-t border-grey-light py-14 md:py-[88px]">
          <div className="conteneur flex flex-wrap gap-8 md:gap-16">
            <div className="flex flex-[1_1_320px] flex-col gap-4">
              <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Questions de propriétaires</p>
              <h2 id="h-faq" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
                Vendre ou louer {ou}
              </h2>
            </div>
            {/* À VALIDER : réponse sur l'encadrement des loyers à mettre à jour selon le vote de la prolongation. */}
            <div className="hidden flex-[1.6_1_560px] md:block">
              <Faq questions={secteur.faq} premiereOuverte />
            </div>
            <div className="w-full md:hidden">
              <Faq questions={secteur.faq} />
            </div>
          </div>
        </section>
      )}

      {/* APPEL FINAL */}
      <section aria-labelledby="h-cta-quartier" className="bg-gold py-14 md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_420px] flex-col gap-3">
            <h2 id="h-cta-quartier" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[48px]">
              Propriétaire {ou} ?
            </h2>
            <p className="m-0 text-[17px] leading-normal">Une première fourchette en 2 minutes, puis l&apos;avis de l&apos;expert du quartier.</p>
          </div>
          <FormulaireAdresse id="quartier-adresse" bouton="Estimer mon bien" className="flex-[1_1_480px]" />
        </div>
      </section>
    </>
  );
}
