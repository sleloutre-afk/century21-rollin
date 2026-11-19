import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutonPartager } from "@/components/biens/BoutonPartager";
import { CarteBien } from "@/components/biens/CarteBien";
import { EtiquetteEnergie } from "@/components/biens/EtiquetteEnergie";
import { Galerie, type PhotoGalerie } from "@/components/biens/Galerie";
import { FormulaireAdresse } from "@/components/estimation/FormulaireAdresse";
import { FormulaireVisite } from "@/components/formulaires/FormulaireVisite";
import { Badge } from "@/components/ui/Badge";
import { LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { mentionPrix, prixAffiche } from "@/lib/biens/affichage";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { estVisibleEnRecherche, similaires } from "@/lib/biens/recherche";
import { getAgence, getAnnonce, getAnnonces, getLocalisations, getMembre, getSecteur } from "@/lib/data";
import { formaterPrix, formaterSurface } from "@/lib/format/nombres";
import { ROUTES } from "@/lib/navigation";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Fiche bien (maquette FicheDesktop, FicheMobile ; annotations « Gabarit alimenté par données »,
 * « Mentions obligatoires », « Conseiller du bien »). Un seul gabarit pour toutes les annonces.
 * - Un champ vide masque son bloc, sauf les mentions obligatoires, qui affichent « [à fournir] » (spec §5).
 * - À VALIDER : liste des mentions obligatoires à faire valider par l'agence ou son juriste avant mise en ligne.
 */

/**
 * Navigation « bloquante » assumée : chaque page de ce gabarit est préparée à l'avance (generateStaticParams),
 * le serveur la renvoie immédiatement. Évite l'avertissement de Next.js sur la lecture de l'adresse (params).
 */
export const instant = false;

type Props = { params: Promise<{ slug: string }> };

/** Pages préparées à l'avance : annonces en vente, sous compromis ou en location (pas les biens vendus ou loués). */
export function generateStaticParams() {
  return getAnnonces()
    .filter(estVisibleEnRecherche)
    .map((a) => ({ slug: a.slug }));
}

function annonceVisible(slug: string): Annonce | undefined {
  const annonce = getAnnonce(slug);
  return annonce && estVisibleEnRecherche(annonce) ? annonce : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const annonce = annonceVisible((await params).slug);
  if (!annonce) return { title: "Bien introuvable" };
  return {
    title: `${annonce.titre}, ${formaterSurface(annonce.surfaceHabitable)} · ${annonce.quartierLibelle}`,
    description: `${annonce.titre} de ${formaterSurface(annonce.surfaceHabitable)}, ${annonce.pieces} pièces, ${annonce.quartierLibelle}, Bordeaux. ${prixAffiche(annonce)}.`,
  };
}

const TYPES: Record<Annonce["type"], string> = { maison: "Maison", appartement: "Appartement" };
const aFournir = (v: string | number | null | undefined) => (v === null || v === undefined || v === "" ? "[à fournir]" : String(v));
const montant = (v: number | null | undefined) => (v === null || v === undefined ? "[à fournir]" : formaterPrix(v));
const ouiNon = (v: boolean | null | undefined) => (v === null || v === undefined ? "[à fournir]" : v ? "Oui" : "Non");
const dater = (d: string | null | undefined) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[à fournir]");

/** Photos fournies, ou 5 emplacements étiquetés. */
function photosDe(a: Annonce): PhotoGalerie[] {
  if (a.photos.length > 0) return a.photos.map((p, i) => ({ libelle: p.legende ?? `Photo ${i + 1}`, src: p.src, alt: p.alt }));
  return [`Photo 1 · ${a.titre}`, "Photo 2 · séjour", "Photo 3 · pièce de vie", "Photo 4 · chambre", "Photo 5 · extérieur"].map((libelle) => ({ libelle }));
}

function Caracteristiques({ annonce }: { annonce: Annonce }) {
  // Seules les caractéristiques connues s'affichent (un champ vide masque sa ligne).
  const lignes: [string, string][] = [
    ["Type", TYPES[annonce.type]],
    ["Surface habitable", formaterSurface(annonce.surfaceHabitable)],
    ["Pièces", String(annonce.pieces)],
    ...(annonce.chambres !== null ? ([["Chambres", String(annonce.chambres)]] as [string, string][]) : []),
    ...(annonce.niveaux ? ([["Niveaux", String(annonce.niveaux)]] as [string, string][]) : []),
    ...(annonce.exterieur ? ([["Extérieur", annonce.exterieur]] as [string, string][]) : []),
    ...(annonce.stationnement ? ([["Stationnement", annonce.stationnement]] as [string, string][]) : []),
  ];
  return (
    <dl className="m-0 grid grid-cols-1 border-t border-grey-dark sm:grid-cols-2 sm:gap-x-10">
      {lignes.map(([cle, valeur]) => (
        <div key={cle} className="flex justify-between gap-4 border-b border-grey-light py-3.5 text-base">
          <dt>{cle}</dt>
          <dd className="m-0 text-right font-bold">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

function TableauMentions({ lignes }: { lignes: [string, string][] }) {
  return (
    <dl className="m-0 grid grid-cols-1 border-t border-grey-dark sm:grid-cols-2 sm:gap-x-10">
      {lignes.map(([cle, valeur]) => (
        <div key={cle} className="flex justify-between gap-4 border-b border-grey-light py-3.5 text-base">
          <dt>{cle}</dt>
          <dd className="m-0 text-right font-bold">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <h2 id={id} className="m-0 text-[26px] font-medium uppercase leading-none md:text-[32px]">
        {titre}
      </h2>
      {children}
    </section>
  );
}

export default async function FicheBien({ params }: Props) {
  const annonce = annonceVisible((await params).slug);
  if (!annonce) notFound();

  const agence = getAgence();
  const nouveaux = await slugsNouveaux();
  const conseiller = annonce.conseiller ? getMembre(annonce.conseiller) : undefined;
  const secteur = annonce.secteur ? getSecteur(annonce.secteur) : undefined;
  const nomQuartier = getLocalisations().find((l) => l.id === annonce.secteur)?.nom ?? annonce.quartierLibelle;
  const autres = similaires(getAnnonces(), annonce);
  const vente = annonce.transaction === "vente";
  const titre = `${annonce.titre}, ${formaterSurface(annonce.surfaceHabitable)}`;
  const classeExcessive = annonce.dpe.classe === "F" || annonce.dpe.classe === "G";

  const chiffresCles: { fort: string; texte: string }[] = [
    { fort: new Intl.NumberFormat("fr-FR").format(annonce.surfaceHabitable), texte: "m²" },
    { fort: String(annonce.pieces), texte: annonce.pieces > 1 ? "pièces" : "pièce" },
    ...(annonce.chambres !== null ? [{ fort: String(annonce.chambres), texte: annonce.chambres > 1 ? "chambres" : "chambre" }] : []),
    ...(annonce.niveaux ? [{ fort: String(annonce.niveaux), texte: "niveaux" }] : []),
  ];
  const equipements = [annonce.exterieur?.split(" · ")[0], annonce.stationnement].filter(Boolean) as string[];

  const blocPrix = (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-[34px] font-semibold leading-none md:text-[44px]">{prixAffiche(annonce)}</span>
      <span className="text-[13px]">{mentionPrix(annonce)}</span>
    </div>
  );

  return (
    <>
      <FilAriane
        etapes={[
          vente ? { libelle: "Biens à vendre", href: ROUTES.achat } : { libelle: "Biens à louer", href: ROUTES.location },
          secteur ? { libelle: secteur.nom, href: `${ROUTES.quartiers}/${secteur.slug}` } : { libelle: nomQuartier },
          { libelle: titre },
        ]}
      />

      <Galerie
        photos={photosDe(annonce)}
        resume={`${annonce.titre} · ${annonce.quartierLibelle} · ${prixAffiche(annonce)}`}
        medias={{ video: annonce.video, visite: annonce.visiteVirtuelle, plan: annonce.plan }}
      />

      <div className="conteneur flex flex-col gap-12 py-8 md:flex-row md:items-start md:gap-16 md:py-14">
        <div className="flex min-w-0 flex-[1.8_1_600px] flex-col gap-12 md:gap-14">
          {/* EN-TÊTE DE FICHE */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {annonce.exclusivite && <Badge variante="exclusivite" />}
              {nouveaux.includes(annonce.slug) && <Badge variante="nouveau" className="border border-grey-light" />}
              {annonce.statut === "sous_compromis" && <Badge variante="compromis" className="border border-grey-light" />}
              <span className="font-display text-sm uppercase tracking-[0.18em]">Bordeaux · {annonce.quartierLibelle}</span>
              <span className="text-sm">Réf. {annonce.reference ?? "[—]"}</span>
            </div>
            <h1 className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(36px,3.6vw,52px)]">
              {annonce.titre}, {new Intl.NumberFormat("fr-FR").format(annonce.surfaceHabitable)}
              <span className="normal-case">{"\u00a0"}m²</span>
            </h1>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 font-display text-lg">
              {chiffresCles.map((c) => (
                <li key={c.texte}>
                  <strong className="text-2xl font-semibold">{c.fort}</strong> {c.texte}
                </li>
              ))}
              {equipements.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <div className="md:hidden">{blocPrix}</div>
          </div>

          {annonce.atouts.length > 0 && (
            <Section id="h-atouts" titre="Points forts">
              <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
                {annonce.atouts.map((atout) => (
                  <li key={atout} className="flex min-h-24 flex-col justify-between gap-3 bg-grey-light p-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="font-display text-lg font-medium leading-tight">{atout}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section id="h-desc" titre="Le bien">
            <p className="m-0 max-w-[680px] text-[17px] leading-relaxed">
              {/* Description de démonstration (contenus/annonces.json) : à remplacer par celle du conseiller. */}
              {annonce.description ?? "[Description à rédiger par le conseiller : distribution des pièces, état, exposition, prestations.]"}
            </p>
          </Section>

          <Section id="h-carac" titre="Caractéristiques">
            <Caracteristiques annonce={annonce} />
          </Section>

          <Section id="h-energie" titre="Performance énergétique">
            <div className="flex flex-wrap gap-8">
              <EtiquetteEnergie type="dpe" classe={annonce.dpe.classe} valeur={annonce.dpe.valeur} />
              <EtiquetteEnergie type="ges" classe={annonce.ges.classe} valeur={annonce.ges.valeur} />
            </div>
            {classeExcessive && <p className="m-0 border-l-4 border-dpe-g bg-grey-light px-4 py-3 text-base font-bold">Logement à consommation énergétique excessive</p>}
            <p className="m-0 text-[15px] leading-relaxed">
              Montant estimé des dépenses annuelles d&apos;énergie pour un usage standard : entre {montant(annonce.depensesEnergie.min)} et{" "}
              {montant(annonce.depensesEnergie.max)} par an, prix moyens des énergies indexés au {aFournir(annonce.depensesEnergie.anneeReferencePrix)}. Date du
              DPE : {dater(annonce.dpe.date)}.
            </p>
          </Section>

          <Section id="h-legal" titre={vente ? "Copropriété et informations légales" : "Conditions de location"}>
            {vente ? (
              <>
                <TableauMentions
                  lignes={[
                    ["Bien en copropriété", ouiNon(annonce.copropriete.estEnCopropriete)],
                    ...(annonce.copropriete.estEnCopropriete === false
                      ? []
                      : ([
                          ["Nombre de lots", aFournir(annonce.copropriete.nombreLots)],
                          ["Charges annuelles moyennes", montant(annonce.copropriete.chargesAnnuelles)],
                          ["Procédure en cours", aFournir(annonce.copropriete.procedureEnCours)],
                        ] as [string, string][])),
                  ]}
                />
                <p className="m-0 text-[15px] leading-relaxed">
                  Prix honoraires inclus : {formaterPrix(annonce.prixHonorairesInclus)}, dont{" "}
                  {annonce.partHonorairesAcquereurPct === null ? "[—]" : new Intl.NumberFormat("fr-FR").format(annonce.partHonorairesAcquereurPct)} % TTC à la charge de
                  l&apos;acquéreur, soit {annonce.prixHorsHonoraires === null ? "[—] €" : formaterPrix(annonce.prixHorsHonoraires)} hors honoraires.{" "}
                  <Link href={ROUTES.honoraires} className="font-bold text-grey-dark">
                    Barème d&apos;honoraires
                  </Link>
                  .
                </p>
              </>
            ) : (
              // À VALIDER : encadrement des loyers à Bordeaux (fin d'expérimentation prévue le 24/11/2026).
              <TableauMentions
                lignes={[
                  ["Loyer charges comprises", montant(annonce.location?.loyerChargesComprises)],
                  ["Charges", montant(annonce.location?.charges)],
                  ["Règlement des charges", aFournir(annonce.location?.modeReglementCharges)],
                  ["Dépôt de garantie", montant(annonce.location?.depotDeGarantie)],
                  ["Honoraires de location", montant(annonce.location?.honorairesLocation)],
                  ["Dont état des lieux", montant(annonce.location?.honorairesEtatDesLieux)],
                  ["Meublé", ouiNon(annonce.location?.meuble)],
                  ...(annonce.location?.loyerReferenceMajore != null ? ([["Loyer de référence majoré", montant(annonce.location.loyerReferenceMajore)]] as [string, string][]) : []),
                  ...(annonce.location?.complementDeLoyer != null ? ([["Complément de loyer", montant(annonce.location.complementDeLoyer)]] as [string, string][]) : []),
                ]}
              />
            )}
            <p className="m-0 text-[15px] leading-relaxed">
              Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques :{" "}
              <a href="https://www.georisques.gouv.fr" className="font-bold text-grey-dark" rel="noopener">
                www.georisques.gouv.fr
              </a>
            </p>
          </Section>

          <section id="visite" aria-labelledby="h-visite" className="scroll-mt-24 flex flex-col gap-5 border-t-4 border-gold pt-8">
            <h2 id="h-visite" className="m-0 text-[26px] font-medium uppercase leading-none md:text-[32px]">
              Demander une visite
            </h2>
            <p className="m-0 text-base">Le conseiller en charge du bien vous rappelle pour convenir d&apos;un rendez-vous.</p>
            <div className="max-w-[560px]">
              <FormulaireVisite annonce={annonce.slug} />
            </div>
          </section>
        </div>

        {/* ENCART PRIX ET CONTACT */}
        <aside aria-label="Prix et contact" className="flex flex-col gap-4 md:sticky md:top-24 md:flex-[1_1_360px]">
          <div className="hidden border border-grey-light p-7 md:block">{blocPrix}</div>
          <div className="flex flex-col gap-5 bg-grey-dark p-6 text-white md:p-7">
            <div className="flex items-center gap-4">
              <div aria-hidden="true" className="flex size-20 flex-none items-end border border-grey-medium p-1.5">
                <span className="font-display text-[10px] uppercase tracking-[0.12em] text-grey-light">Portrait</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-xs uppercase tracking-[0.2em] text-gold">Votre conseiller</span>
                <span className="font-display text-[22px] font-medium">{conseiller?.nom ?? "[Prénom Nom]"}</span>
                <span className="text-sm text-grey-light">{conseiller?.role ?? "Transaction · secteur [—]"}</span>
              </div>
            </div>
            <a href="#visite" className="flex min-h-14 items-center justify-center bg-gold font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-gold-dark">
              Demander une visite
            </a>
            <a
              href={`tel:${agence.telephoneE164}`}
              className="flex min-h-14 items-center justify-center gap-2.5 border border-white font-display text-lg font-medium text-white no-underline hover:border-gold hover:text-gold"
            >
              <IconeTelephone taille={18} />
              {conseiller?.telephoneDirect ?? agence.telephone}
            </a>
            <span className="text-[13px] text-grey-light">
              {conseiller?.telephoneDirect ? "Ligne directe" : "Standard de l'agence · ligne directe du conseiller [à fournir]"}
            </span>
            <Link href={ROUTES.contact} className="self-start border-b border-gold pb-0.5 text-[15px] text-white no-underline hover:text-gold">
              Être rappelé <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="flex gap-3">
            <BoutonPartager titre={titre} />
          </div>
        </aside>
      </div>

      {/* QUARTIER */}
      <section aria-labelledby="h-quartier" className="bg-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <div className="flex flex-[1_1_380px] flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Le quartier</p>
            <h2 id="h-quartier" className="m-0 text-[34px] font-medium uppercase leading-none md:text-5xl">
              {nomQuartier}
            </h2>
            <p className="m-0 max-w-[520px] text-[17px] leading-normal">{secteur?.accroche ?? "[Présentation du quartier à fournir.]"}</p>
            {secteur && <LienFleche href={`${ROUTES.quartiers}/${secteur.slug}`}>Découvrir le quartier</LienFleche>}
          </div>
          {/* À VALIDER : fournisseur de carte à choisir ; coordonnées du bien non fournies. */}
          <EmplacementPhoto libelle="Carte · emplacement approximatif" etiquette="haut-droite" className="h-[260px] flex-[1.3_1_420px] border border-grey-medium md:h-[340px]" />
        </div>
      </section>

      {/* BIENS SIMILAIRES */}
      {autres.length > 0 && (
        <section aria-labelledby="h-similaires" className="py-14 md:py-20">
          <div className="conteneur flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="h-similaires" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
                Biens similaires
              </h2>
              <LienFleche href={vente ? ROUTES.achat : ROUTES.location}>Tous nos biens</LienFleche>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 md:grid-cols-3">
              {autres.map((a) => (
                <li key={a.slug}>
                  <CarteBien annonce={a} nouveau={nouveaux.includes(a.slug)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* PROPRIÉTAIRE ? */}
      <section aria-labelledby="h-proprio" className="bg-gold py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_420px] flex-col gap-3">
            <h2 id="h-proprio" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
              Vous êtes propriétaire dans le quartier ?
            </h2>
            <p className="m-0 text-[17px] leading-normal">Estimez votre bien en 2 minutes, puis échangez avec l&apos;expert du secteur.</p>
          </div>
          <FormulaireAdresse id="proprio-adresse" bouton="Estimer mon bien" className="flex-[1_1_480px]" />
        </div>
      </section>
    </>
  );
}
