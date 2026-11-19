"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { CarteBien } from "@/components/biens/CarteBien";
import { FormulaireAlerte } from "@/components/formulaires/FormulaireAlerte";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeFermer, IconeTelephone } from "@/components/ui/Icones";
import {
  BUDGETS,
  decrireCriteres,
  ecrireFiltres,
  filtrer,
  FILTRES_PAR_DEFAUT,
  lireFiltres,
  PIECES,
  SURFACES,
  trier,
  TRIS,
  type Filtres,
} from "@/lib/biens/recherche";
import { ROUTES } from "@/lib/navigation";
import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Recherche de biens (maquette RechercheDesktop, RechercheMobile ; annotations « Dynamique · recherche », « Vue carte »).
 * Les filtres et le tri s'appliquent sans recharger la page ; l'adresse de la page garde les filtres.
 * Sans JavaScript, le formulaire s'envoie normalement (méthode GET) et la page affiche le résultat.
 */

type Props = {
  annonces: Annonce[];
  localisations: { id: string; nom: string }[];
  nouveaux: string[];
  telephone: string;
  telephoneE164: string;
};

const euros = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} €`;
const libelleChamp = "flex flex-col justify-center gap-0.5 bg-white px-4 py-1.5 text-xs uppercase tracking-[0.08em]";
const select = "border-0 bg-transparent py-0.5 text-base normal-case tracking-normal text-grey-dark";

/** Lit les filtres dans l'adresse de la page ; à placer dans un <Suspense>. */
export function RechercheAvecParametres(props: Props) {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const filtres = lireFiltres(parametres);
  const appliquer = (f: Filtres) => router.replace(`${chemin}?${ecrireFiltres(f)}`, { scroll: false });
  return <Recherche {...props} filtres={filtres} onChange={appliquer} />;
}

export function Recherche({
  annonces,
  localisations,
  nouveaux,
  telephone,
  telephoneE164,
  filtres = FILTRES_PAR_DEFAUT,
  onChange,
}: Props & { filtres?: Filtres; onChange?: (f: Filtres) => void }) {
  const panneau = useRef<HTMLDialogElement>(null);
  const resultats = trier(filtrer(annonces, filtres), filtres.tri);
  const location = filtres.transaction === "location";
  const changer = (modif: Partial<Filtres>) => onChange?.({ ...filtres, ...modif });
  const changerTransaction = (t: Filtres["transaction"]) => changer({ transaction: t, budget: null });
  const effacer = () => onChange?.({ ...FILTRES_PAR_DEFAUT, transaction: filtres.transaction, vue: filtres.vue });
  const filtresActifs = [filtres.type, filtres.budget, filtres.surface, filtres.pieces, filtres.quartier].filter(Boolean).length;

  const nbVisibles = annonces.filter((a) => a.transaction === filtres.transaction).length;
  const titre = location ? "Biens à louer à Bordeaux" : "Biens à vendre à Bordeaux";
  const compte = `${resultats.length} bien${resultats.length > 1 ? "s" : ""} ${location ? "à louer" : "à vendre"}`;

  /** Les filtres, partagés par la barre (grand écran) et le panneau (téléphone). */
  const champs = (prefixe: string) => (
    <>
      <label className={libelleChamp} htmlFor={`${prefixe}-type`}>
        Type
        <select id={`${prefixe}-type`} name="type" className={select} value={filtres.type} onChange={(e) => changer({ type: e.target.value as Filtres["type"] })}>
          <option value="">Appartement ou maison</option>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>
      </label>
      <label className={libelleChamp} htmlFor={`${prefixe}-budget`}>
        Budget max.
        <select id={`${prefixe}-budget`} name="budget" className={select} value={filtres.budget ?? ""} onChange={(e) => changer({ budget: e.target.value ? Number(e.target.value) : null })}>
          <option value="">Indifférent</option>
          {BUDGETS[filtres.transaction].map((b) => (
            <option key={b} value={b}>
              {location ? `${euros(b)} / mois` : euros(b)}
            </option>
          ))}
        </select>
      </label>
      <label className={libelleChamp} htmlFor={`${prefixe}-surface`}>
        Surface min.
        <select id={`${prefixe}-surface`} name="surface" className={select} value={filtres.surface ?? ""} onChange={(e) => changer({ surface: e.target.value ? Number(e.target.value) : null })}>
          <option value="">Indifférente</option>
          {/* Surface libre saisie sur la page Acheter (ex. 60 m²) : ajoutée à la liste. */}
          {filtres.surface !== null && !(SURFACES as readonly number[]).includes(filtres.surface) && (
            <option value={filtres.surface}>{filtres.surface} m² et +</option>
          )}
          {SURFACES.map((s) => (
            <option key={s} value={s}>
              {s} m² et +
            </option>
          ))}
        </select>
      </label>
      <label className={libelleChamp} htmlFor={`${prefixe}-pieces`}>
        Pièces
        <select id={`${prefixe}-pieces`} name="pieces" className={select} value={filtres.pieces ?? ""} onChange={(e) => changer({ pieces: e.target.value ? Number(e.target.value) : null })}>
          <option value="">Toutes</option>
          {PIECES.map((p) => (
            <option key={p} value={p}>
              {p === 1 ? "1 pièce et +" : `${p} pièces et +`}
            </option>
          ))}
        </select>
      </label>
      <label className={libelleChamp} htmlFor={`${prefixe}-quartier`}>
        Quartier
        <select id={`${prefixe}-quartier`} name="quartier" className={select} value={filtres.quartier} onChange={(e) => changer({ quartier: e.target.value })}>
          <option value="">Tous les quartiers</option>
          {localisations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nom}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  const bascule = (
    <div role="group" aria-label="Achat ou location" className="grid grid-cols-2 gap-1 bg-white p-1 md:flex">
      {(["vente", "location"] as const).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={filtres.transaction === t}
          onClick={() => changerTransaction(t)}
          className={`min-h-12 cursor-pointer px-[22px] font-display text-[15px] font-semibold uppercase tracking-[0.12em] ${
            filtres.transaction === t ? "bg-grey-dark text-white" : "bg-white text-grey-dark"
          }`}
        >
          {t === "vente" ? "Acheter" : "Louer"}
        </button>
      ))}
    </div>
  );

  const selecteurTri = (id: string, classe: string) => (
    <label htmlFor={id} className={classe}>
      <span>Trier par</span>
      <select id={id} name="tri" value={filtres.tri} onChange={(e) => changer({ tri: e.target.value as Filtres["tri"] })} className="cursor-pointer border-0 bg-transparent text-[15px] font-bold text-grey-dark">
        {TRIS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.libelle}
          </option>
        ))}
      </select>
    </label>
  );

  const carte = (
    // À VALIDER : fournisseur de carte à choisir (spec §7) ; coordonnées des biens non fournies.
    <EmplacementPhoto libelle="Carte interactive · fond de carte sobre · fournisseur à choisir" etiquette="haut-droite" className="h-[320px] md:sticky md:top-[132px] md:h-[calc(100dvh-160px)]" />
  );

  return (
    <>
      <FilAriane
        etapes={location ? [{ libelle: "Biens à louer" }] : [{ libelle: "Acheter", href: ROUTES.acheter }, { libelle: "Biens à vendre" }]}
      />

      <div className="conteneur flex flex-col gap-1.5 pb-5 pt-8 md:flex-row md:items-baseline md:justify-between md:pb-6 md:pt-10">
        <h1 className="m-0 text-[32px] font-medium uppercase leading-none md:text-5xl">{titre}</h1>
        <span className="text-[15px]">Chartrons et quartiers voisins</span>
      </div>

      {/* Grand écran : barre de filtres fixe au défilement */}
      <div className="sticky top-16 z-30 hidden bg-white py-3 md:block">
        <form
          action={ROUTES.biens}
          method="get"
          aria-label="Filtres"
          onSubmit={(e) => e.preventDefault()}
          className="conteneur flex flex-wrap items-stretch gap-3"
        >
          <input type="hidden" name="transaction" value={filtres.transaction} />
          <div className="flex w-full flex-wrap gap-3 bg-grey-light p-3">
            {bascule}
            <div className="grid flex-1 grid-cols-3 gap-3 lg:grid-cols-[1.45fr_1fr_1fr_1fr_1.35fr]">{champs("filtre")}</div>
            <noscript>
              <button type="submit" className="min-h-14 bg-grey-dark px-6 font-display font-semibold uppercase text-white">
                Filtrer
              </button>
            </noscript>
          </div>
        </form>
      </div>

      {/* Téléphone : barre Filtres · Trier · Carte, fixe en haut */}
      <div className="sticky top-16 z-30 grid grid-cols-3 border-y border-grey-light bg-white md:hidden">
        <button type="button" onClick={() => panneau.current?.showModal()} className="min-h-12 cursor-pointer border-0 border-r border-grey-light bg-white font-display text-sm font-semibold uppercase tracking-[0.12em] text-grey-dark">
          Filtres{filtresActifs > 0 ? ` (${filtresActifs})` : ""}
        </button>
        {selecteurTri("tri-mobile", "flex min-h-12 items-center justify-center gap-1 border-r border-grey-light text-xs [&>span]:sr-only")}
        <button
          type="button"
          aria-pressed={filtres.vue === "carte"}
          onClick={() => changer({ vue: filtres.vue === "carte" ? "liste" : "carte" })}
          className="min-h-12 cursor-pointer border-0 bg-white font-display text-sm font-semibold uppercase tracking-[0.12em] text-grey-dark aria-pressed:bg-grey-dark aria-pressed:text-white"
        >
          {filtres.vue === "carte" ? "Liste" : "Carte"}
        </button>
      </div>

      <dialog ref={panneau} aria-label="Filtres" className="m-0 ml-auto h-dvh max-h-none w-full max-w-[420px] bg-white p-0 text-grey-dark backdrop:bg-grey-dark/60">
        <div className="flex min-h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-grey-light pl-6 pr-3">
            <span className="font-display text-lg font-semibold uppercase tracking-[0.12em]">Filtres</span>
            <button type="button" aria-label="Fermer les filtres" onClick={() => panneau.current?.close()} className="flex size-12 cursor-pointer items-center justify-center border-0 bg-transparent text-grey-dark">
              <IconeFermer taille={24} />
            </button>
          </div>
          <div className="flex flex-col gap-3 bg-grey-light p-4">
            {bascule}
            {champs("panneau")}
          </div>
          <div className="mt-auto flex flex-col gap-3 p-4">
            <button type="button" onClick={() => panneau.current?.close()} className="min-h-14 cursor-pointer bg-grey-dark font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white">
              Voir {compte}
            </button>
            {filtresActifs > 0 && (
              <button type="button" onClick={effacer} className="min-h-12 cursor-pointer border-0 bg-transparent text-[15px] text-grey-dark underline">
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      </dialog>

      <div className="conteneur flex flex-wrap items-center justify-between gap-4 py-5">
        <p role="status" className="m-0 text-base">
          <span className="font-display text-[22px] font-semibold">{resultats.length}</span> {compte.replace(/^\d+ /, "")}
        </p>
        <div className="flex flex-wrap items-center gap-5">
          {selecteurTri("tri", "hidden items-center gap-2 text-sm md:flex")}
          <div role="group" aria-label="Affichage" className="hidden border border-grey-dark md:flex">
            {(["liste", "carte"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={filtres.vue === v}
                onClick={() => changer({ vue: v })}
                className={`min-h-11 cursor-pointer px-5 font-display text-sm font-semibold uppercase tracking-[0.12em] ${filtres.vue === v ? "bg-grey-dark text-white" : "bg-white text-grey-dark"}`}
              >
                {v === "liste" ? "Liste" : "Carte"}
              </button>
            ))}
          </div>
          <a href="#alerte" className="text-[15px] font-bold text-grey-dark">
            Créer une alerte
          </a>
        </div>
      </div>

      <div className="conteneur pb-14 md:pb-20">
        {filtres.vue === "carte" && <div className="mb-6 md:hidden">{carte}</div>}
        <div className={filtres.vue === "carte" ? "flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start" : ""}>
          {resultats.length > 0 ? (
            <ul
              className={`m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 ${
                filtres.vue === "carte" ? "md:grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {resultats.map((a) => (
                <li key={a.slug}>
                  <CarteBien annonce={a} niveauTitre={2} nouveau={nouveaux.includes(a.slug)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 bg-grey-light p-6 md:p-10">
              <h2 className="m-0 text-2xl font-medium uppercase md:text-3xl">
                {nbVisibles === 0 && location ? "Aucune location disponible pour le moment" : "Aucun bien ne correspond à ces critères"}
              </h2>
              <p className="m-0 text-base leading-normal">
                {nbVisibles === 0 && location
                  ? "Créez une alerte : vous serez prévenu dès qu'un bien est proposé à la location."
                  : "Élargissez votre recherche, ou créez une alerte pour être prévenu des nouveaux biens."}
              </p>
              {filtresActifs > 0 && (
                <button type="button" onClick={effacer} className="min-h-12 cursor-pointer border border-grey-dark bg-white px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-grey-dark">
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
          {filtres.vue === "carte" && <div className="hidden md:block">{carte}</div>}
        </div>
      </div>

      {/* Alerte e-mail et contact (maquette : « Rien ne correspond encore ? ») */}
      <section id="alerte" aria-labelledby="h-alerte" className="scroll-mt-32 bg-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-wrap gap-8 md:gap-16">
          <div className="flex flex-[1_1_360px] flex-col gap-4">
            <h2 id="h-alerte" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[44px]">
              Rien ne correspond encore ?
            </h2>
            <p className="m-0 text-[17px] leading-normal">Recevez les nouveaux biens par e-mail, ou parlez de votre projet à un conseiller.</p>
            <a href={`tel:${telephoneE164}`} className="flex items-center gap-2.5 self-start font-display text-[26px] font-medium text-grey-dark no-underline">
              <IconeTelephone taille={20} />
              {telephone}
            </a>
            {!location && (
              <Link href={ROUTES.acheter} className="self-start border-b border-grey-dark pb-0.5 text-[15px] font-bold text-grey-dark no-underline">
                Notre accompagnement acheteur <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          <div className="flex-[1.3_1_420px]">
            <FormulaireAlerte key={ecrireFiltres(filtres)} criteres={decrireCriteres(filtres, localisations)} />
          </div>
        </div>
      </section>
    </>
  );
}
