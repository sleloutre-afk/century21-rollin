import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarteBien } from "@/components/biens/CarteBien";
import { CarteVendu } from "@/components/biens/CarteVendu";
import { PriseRendezVous } from "@/components/formulaires/PriseRendezVous";
import { Badge } from "@/components/ui/Badge";
import { LienFleche } from "@/components/ui/Bouton";
import { PortraitMembre } from "@/components/equipe/PortraitMembre";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeCalendrier, IconeTelephone } from "@/components/ui/Icones";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { estVisibleEnRecherche } from "@/lib/biens/recherche";
import { toutesLesVentes } from "@/lib/biens/ventes";
import { CarteAvis } from "@/components/avis/CarteAvis";
import { getAgence, getAnnonces, getArticles, getMembre, getMembres, getPoles, getAvis } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { metaPage, NOM_SITE, sansEmplacement, URL_SITE, urlAbsolue } from "@/lib/seo";

/**
 * Fiche conseiller (brief prompt 7 ; maquette ConseillerDesktop, ConseillerMobile). Un gabarit pour les 21 membres.
 * Blocs vides masqués (décision de Simon, 19/11/2026) : présentation, spécialité, biens, ventes apparaissent
 * automatiquement quand les données arrivent (contenus/equipe.json, contenus/annonces.json).
 */

/**
 * Navigation « bloquante » assumée : chaque page de ce gabarit est préparée à l'avance (generateStaticParams),
 * le serveur la renvoie immédiatement. Évite l'avertissement de Next.js sur la lecture de l'adresse (params).
 */
export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getMembres().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const membre = getMembre((await params).slug);
  if (!membre) return { title: "Conseiller introuvable" };
  const role = sansEmplacement(membre.role);
  return metaPage({ titre: `${membre.nom}, ${role}`, description: `${membre.nom}, ${role} chez Cabinet Rollin – CENTURY 21 Les Chartrons, à Bordeaux.`, chemin: `${ROUTES.equipe}/${membre.slug}` });
}

// Pôles dont les membres sont cités dans les avis clients (emplacements d'avis affichés).
const POLES_AVIS = ["transaction", "location", "gestion-locative"];

export default async function FicheConseiller({ params }: Props) {
  const membre = getMembre((await params).slug);
  if (!membre) notFound();

  const agence = getAgence();
  const pole = getPoles().find((p) => p.id === membre.pole);
  const prenom = membre.nom.split(" ")[0];
  const nouveaux = await slugsNouveaux();
  const sesBiens = getAnnonces().filter((a) => a.conseiller === membre.slug && estVisibleEnRecherche(a));
  const vendusSlugs = new Set(getAnnonces().filter((a) => a.conseiller === membre.slug && a.statut === "vendu").map((a) => a.slug));
  const sesVentes = toutesLesVentes().filter((v) => vendusSlugs.has(v.cle)).slice(0, 4);
  const sesAvis = getAvis().filter((a) => a.conseiller === membre.slug);
  const sesArticles = getArticles().filter((a) => a.auteur === membre.nom);
  const telephone = membre.telephoneDirect ?? agence.telephone;
  const lieuRdv =
    membre.pole === "transaction"
      ? `À l'agence, ${agence.adresse.rue}, ou chez vous pour une estimation.`
      : `À l'agence, ${agence.adresse.rue}.`;

  return (
    <>
      {/* Person (schema.org) : nom, fonction affichée, agence. */}
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: membre.nom,
          jobTitle: sansEmplacement(membre.role),
          url: urlAbsolue(`${ROUTES.equipe}/${membre.slug}`),
          worksFor: { "@type": "RealEstateAgent", name: NOM_SITE, url: URL_SITE },
        }}
      />
      <FilAriane etapes={[{ libelle: "L'équipe", href: ROUTES.equipe }, { libelle: membre.nom }]} />

      {/* PRÉSENTATION */}
      <section aria-labelledby="h1-conseiller" className="py-10 md:py-16">
        <div className="conteneur flex flex-wrap items-start gap-8 md:gap-16">
          <PortraitMembre
            membre={membre}
            libelle={`Portrait de ${membre.nom} · à fournir`}
            tailles="(min-width: 768px) 420px, 100vw"
            className="aspect-[4/5] w-full max-w-[420px] md:flex-[1_1_360px]"
          >
            {pole && (
              <Badge variante="pole" className="absolute left-[18px] top-[18px] text-[13px]">
                Pôle {pole.nom.toLowerCase()}
              </Badge>
            )}
          </PortraitMembre>
          <div className="flex flex-[1.3_1_480px] flex-col gap-6">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">{membre.role}</p>
            <h1 id="h1-conseiller" className="m-0 text-[44px] font-medium uppercase leading-none md:text-[clamp(48px,5vw,76px)]">
              {membre.nom}
            </h1>
            {membre.presentation && (
              <blockquote className="m-0 max-w-[620px] border-t-2 border-gold pt-5 text-xl leading-normal md:text-[22px]">« {membre.presentation} »</blockquote>
            )}
            {membre.secteurs && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">Secteurs :</span>
                <span className="border border-grey-dark px-3 py-2 text-sm">{membre.secteurs}</span>
              </div>
            )}
            <div className="flex flex-col gap-3 pt-2 md:flex-row md:flex-wrap">
              <a
                href="#rendez-vous"
                className="inline-flex min-h-[60px] items-center justify-center gap-2.5 bg-gold px-8 font-display text-base font-semibold uppercase tracking-[0.14em] text-grey-dark no-underline hover:bg-gold-dark"
              >
                <IconeCalendrier taille={18} />
                Prendre rendez-vous
              </a>
              <a
                href={`tel:${membre.telephoneDirect ? membre.telephoneDirect.replace(/\s/g, "") : agence.telephoneE164}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-2.5 border border-grey-dark px-7 font-display text-lg font-medium text-grey-dark no-underline hover:bg-grey-light"
              >
                <IconeTelephone taille={18} />
                {telephone}
              </a>
              {membre.email && (
                <a href={`mailto:${membre.email}`} className="inline-flex min-h-[60px] items-center justify-center px-2 text-base text-grey-dark underline">
                  {membre.email}
                </a>
              )}
            </div>
            {!membre.telephoneDirect && <p className="m-0 text-[13px]">Standard de l&apos;agence · ligne directe [à fournir]</p>}
          </div>
        </div>
      </section>

      {/* SPÉCIALITÉ */}
      {membre.specialite && (
        <section aria-labelledby="h-spec" className="bg-grey-dark py-14 text-white md:py-20">
          <div className="conteneur flex flex-col gap-8">
            <h2 id="h-spec" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
              Son rôle, à votre service
            </h2>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div className="flex flex-col gap-2.5 border-t-2 border-gold py-6">
                <h3 className="m-0 text-2xl font-medium uppercase">Sa spécialité</h3>
                <p className="m-0 text-base leading-normal text-grey-light">{membre.specialite}</p>
              </div>
              {pole && (
                <div className="flex flex-col gap-2.5 border-t-2 border-gold py-6">
                  <h3 className="m-0 text-2xl font-medium uppercase">Son pôle</h3>
                  <p className="m-0 text-base leading-normal text-grey-light">
                    {pole.nom} · {pole.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SES BIENS EN VENTE */}
      {sesBiens.length > 0 && (
        <section aria-labelledby="h-encours" className="py-14 md:py-[88px]">
          <div className="conteneur flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="h-encours" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
                Ses biens en vente
              </h2>
              <LienFleche href={ROUTES.achat}>Tous nos biens</LienFleche>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 md:grid-cols-3">
              {sesBiens.slice(0, 3).map((a) => (
                <li key={a.slug}>
                  <CarteBien annonce={a} nouveau={nouveaux.includes(a.slug)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* SES DERNIÈRES VENTES */}
      {sesVentes.length > 0 && (
        <section aria-labelledby="h-vendus-conseiller" className="bg-grey-dark py-14 text-white md:py-20">
          <div className="conteneur flex flex-col gap-8">
            <h2 id="h-vendus-conseiller" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
              Ses dernières ventes
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
              {sesVentes.map((v) => (
                <CarteVendu key={v.cle} vente={v} hauteur="h-[150px] md:h-[200px]" compacte />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AVIS citant le conseiller (contenus/avis.json) ; section masquée s'il n'y en a aucun. */}
      {POLES_AVIS.includes(membre.pole) && sesAvis.length > 0 && (
        <section aria-labelledby="h-avis-conseiller" className="border-t border-grey-light py-14 md:py-[88px]">
          <div className="conteneur flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="h-avis-conseiller" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
                Ils parlent de {prenom}
              </h2>
              {/* À VALIDER : mention sur le contrôle des avis (Code de la consommation). */}
              <span className="text-[13px]">Avis clients mentionnant le conseiller, recopiés mot pour mot. [Mention sur le contrôle des avis à valider]</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {sesAvis.slice(0, 3).map((a, i) => (
                <CarteAvis key={a.id} avis={a} bordure masqueMobile={i > 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SES CONSEILS */}
      {sesArticles.length > 0 && (
        <section aria-labelledby="h-article-conseiller" className="border-t border-grey-light py-12 md:py-16">
          <div className="conteneur flex flex-col gap-6">
            <h2 id="h-article-conseiller" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
              Ses conseils
            </h2>
            {sesArticles.map((a) => (
              <Link key={a.slug} href={`${ROUTES.ressources}/${a.slug}`} className="group flex flex-col gap-5 text-grey-dark no-underline md:flex-row md:items-center">
                <EmplacementPhoto libelle={a.photo} className="h-[180px] md:h-[200px] md:w-[360px] md:flex-none" />
                <div className="flex flex-col gap-3">
                  <Badge variante="categorie" className="self-start">
                    {a.cat}
                  </Badge>
                  <h3 className="m-0 text-2xl font-medium leading-tight md:text-[30px]">{a.titre}</h3>
                  <span className="text-sm">
                    {a.tempsLecture} min · Mis à jour le{" "}
                    {a.dateMiseAJour ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${a.dateMiseAJour}T00:00:00`)) : "[date à fournir]"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RENDEZ-VOUS */}
      <section id="rendez-vous" aria-labelledby="h-rdv" className="scroll-mt-24 border-t border-grey-medium bg-grey-dark py-14 text-white md:py-20">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">Rendez-vous en ligne</p>
            <h2 id="h-rdv" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[48px]">
              Rencontrer {prenom}
            </h2>
            <p className="m-0 text-[17px] leading-normal text-grey-light">{lieuRdv}</p>
          </div>
          <div className="flex-[1.5_1_560px]">
            <PriseRendezVous conseiller={membre.slug} />
          </div>
        </div>
      </section>
    </>
  );
}
