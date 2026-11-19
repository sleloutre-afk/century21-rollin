"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Logo } from "@/components/layout/Logo";
import { IconeFermer, IconeTelephone } from "@/components/ui/Icones";
import { envoyerEstimation, preciserSuite } from "@/lib/estimation/actions";
import { EPOQUES, erreursEtape, ETAPES, ETATS, PROJETS, STATIONNEMENTS, TYPES, type ValeursParcours } from "@/lib/estimation/schema";
import { CHAMP_PIEGE } from "@/lib/formulaires/schemas";
import { ROUTES } from "@/lib/navigation";
import { ChampAdresse } from "./ChampAdresse";

/**
 * Parcours d'estimation en 5 étapes + résultat (maquette EstimDesktop, EstimMobile).
 * - Contrôle de chaque étape avant de continuer ; contrôle complet côté serveur à l'envoi.
 * - Aucune fourchette chiffrée tant que la source des prix n'est pas choisie (spec §6).
 * - Le focus passe au titre de chaque nouvelle étape (lecteurs d'écran, clavier).
 */

type Props = {
  telephone: string;
  telephoneE164: string;
  adresseInitiale?: string;
  projetInitial?: string;
};

const RESULTAT = 6;

const champ = "h-14 border border-grey-medium bg-white px-4 text-[17px] text-grey-dark";

export function Parcours({ telephone, telephoneE164, adresseInitiale = "", projetInitial }: Props) {
  const projetValide = PROJETS.some((p) => p.id === projetInitial) ? projetInitial! : "vendre";
  const [etape, setEtape] = useState(1);
  const [valeurs, setValeurs] = useState<ValeursParcours>({
    adresse: adresseInitiale,
    type: "appartement",
    surface: "",
    pieces: "",
    chambres: "",
    terrain: "",
    epoque: "avant-1949",
    etat: "bon-etat",
    stationnement: "aucun",
    projet: projetValide,
    nom: "",
    email: "",
    telephone: "",
    consentement: "",
    [CHAMP_PIEGE]: "",
  });
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [suite, setSuite] = useState<"rappel" | "estimation-seule" | null>(null);
  const [enCours, demarrer] = useTransition();
  const titre = useRef<HTMLHeadingElement>(null);
  const premierAffichage = useRef(true);

  useEffect(() => {
    if (premierAffichage.current) {
      premierAffichage.current = false;
      return;
    }
    titre.current?.focus();
    window.scrollTo({ top: 0 });
  }, [etape]);

  const changer = (nom: string, valeur: string) => {
    setValeurs((v) => ({ ...v, [nom]: valeur }));
    setErreurs((e) => {
      if (!e[nom]) return e;
      const copie = { ...e };
      delete copie[nom];
      return copie;
    });
  };

  const projet = PROJETS.find((p) => p.id === valeurs.projet) ?? PROJETS[0];
  const maison = valeurs.type === "maison";

  const continuer = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const valeursEtape = maison ? valeurs : { ...valeurs, terrain: "" };
    const problemes = erreursEtape(etape, valeursEtape);
    if (Object.keys(problemes).length > 0) {
      setErreurs(problemes);
      setMessage("Vérifiez les champs signalés.");
      return;
    }
    if (etape < 5) {
      setEtape(etape + 1);
      return;
    }
    demarrer(async () => {
      const reponse = await envoyerEstimation(valeursEtape);
      if (reponse.ok) {
        setEtape(RESULTAT);
        return;
      }
      setMessage(reponse.message);
      if (reponse.erreurs) {
        setErreurs(reponse.erreurs);
        const premiere = ETAPES.find((et) => Object.keys(reponse.erreurs!).some((c) => c in et.schema.shape));
        if (premiere && premiere.numero !== etape) setEtape(premiere.numero);
      }
    });
  };

  const choisirSuite = (choix: "rappel" | "estimation-seule") => {
    setMessage(null);
    demarrer(async () => {
      const reponse = await preciserSuite({
        choix,
        nom: valeurs.nom,
        email: valeurs.email,
        telephone: valeurs.telephone,
        projet: valeurs.projet,
      });
      if (reponse.ok) setSuite(choix);
      else setMessage(reponse.message);
    });
  };

  const libelleEtape = etape === RESULTAT ? "Résultat" : `Étape ${etape} sur 5`;
  const surtitre = etape === RESULTAT ? "Votre résultat" : `Étape ${etape} sur 5 · ${ETAPES[etape - 1].libelle}`;

  const erreurChamp = (nom: string) =>
    erreurs[nom] ? (
      <span id={`err-${nom}`} className="text-sm font-bold">
        {erreurs[nom]}
      </span>
    ) : null;
  const aria = (nom: string) => ({ "aria-invalid": !!erreurs[nom], "aria-describedby": erreurs[nom] ? `err-${nom}` : undefined });

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* En-tête du module : pas de menu, pour rester concentré sur le parcours */}
      {/* La barre de progression fait partie de l'en-tête (repère de page pour les lecteurs d'écran). */}
      <header>
        <div className="flex h-16 items-center justify-between gap-6 border-b border-grey-light px-4 md:h-[72px] md:px-[clamp(24px,4vw,56px)]">
          <Link href="/" aria-label="Quitter l'estimation" className="flex size-12 items-center justify-center text-grey-dark md:hidden">
            <IconeFermer taille={22} />
          </Link>
          <span className="hidden md:block">
            <Logo taille="compact" />
          </span>
          <span className="font-display text-sm uppercase tracking-[0.16em] md:tracking-[0.2em]">
            <span className="hidden md:inline">Estimation en ligne · </span>
            {libelleEtape}
          </span>
          <a
            href={`tel:${telephoneE164}`}
            aria-label={`Appeler l'agence au ${telephone}`}
            className="flex size-12 items-center justify-center text-grey-dark md:hidden"
          >
            <IconeTelephone taille={22} />
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <a href={`tel:${telephoneE164}`} className="font-display text-lg font-medium text-grey-dark no-underline">
              {telephone}
            </a>
            <Link href="/" className="text-sm text-grey-dark underline">
              Quitter
            </Link>
          </div>
        </div>
        <div
          role="progressbar"
          aria-label="Progression de l'estimation"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={Math.min(etape, 5)}
          className="h-1 bg-grey-light"
        >
          <div className="h-1 bg-grey-dark transition-[width] duration-500" style={{ width: `${Math.min(etape, 5) * 20}%` }} />
        </div>
      </header>

      <div className="flex flex-1 flex-wrap">
        <main className="flex flex-[1.7_1_560px] flex-col px-6 pt-8 md:px-[clamp(24px,6vw,104px)] md:pb-14 md:pt-14">
          <form onSubmit={continuer} noValidate className="flex flex-1 flex-col gap-7 md:gap-8">
            <div className="flex flex-col gap-3">
              <p className="m-0 font-display text-[13px] uppercase tracking-[0.24em] md:text-sm">{surtitre}</p>
              <h1 ref={titre} tabIndex={-1} className="m-0 text-[34px] font-medium uppercase leading-[1.02] outline-none md:text-5xl">
                {TITRES[etape]}
              </h1>
              {etape === 1 && (
                <p className="m-0 text-base md:text-lg">L&apos;adresse exacte change le prix : on l&apos;estime à la rue près.</p>
              )}
            </div>

            {message && (
              <p role="alert" className="m-0 border-l-4 border-grey-dark bg-grey-light px-4 py-3 text-[15px] font-bold">
                {message}
              </p>
            )}

            {etape === 1 && (
              <>
                <ChampAdresse valeur={valeurs.adresse} onChange={(v) => changer("adresse", v)} erreur={erreurs.adresse} />
                <p className="m-0 text-sm">
                  Saisie depuis l&apos;accueil ? Elle est déjà pré-remplie. Location et gestion : toute la métropole bordelaise.
                </p>
              </>
            )}

            {etape === 2 && (
              <>
                <GroupeChoix legende="Type de bien" nom="type" options={TYPES} valeur={valeurs.type} onChange={changer} grand />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                  <label className="col-span-2 flex flex-col gap-2 text-sm md:col-span-1">
                    Surface habitable (m²)
                    <input
                      name="surface"
                      inputMode="decimal"
                      placeholder="Ex. 75"
                      value={valeurs.surface}
                      onChange={(e) => changer("surface", e.target.value)}
                      className={champ}
                      {...aria("surface")}
                    />
                    {erreurChamp("surface")}
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    Pièces
                    <input
                      name="pieces"
                      inputMode="numeric"
                      placeholder="Ex. 3"
                      value={valeurs.pieces}
                      onChange={(e) => changer("pieces", e.target.value)}
                      className={champ}
                      {...aria("pieces")}
                    />
                    {erreurChamp("pieces")}
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    Chambres
                    <input
                      name="chambres"
                      inputMode="numeric"
                      placeholder="Ex. 2"
                      value={valeurs.chambres}
                      onChange={(e) => changer("chambres", e.target.value)}
                      className={champ}
                      {...aria("chambres")}
                    />
                    {erreurChamp("chambres")}
                  </label>
                  {maison && (
                    <label className="col-span-2 flex flex-col gap-2 text-sm md:col-span-1">
                      Terrain (m²)
                      <input
                        name="terrain"
                        inputMode="decimal"
                        placeholder="Ex. 120"
                        value={valeurs.terrain}
                        onChange={(e) => changer("terrain", e.target.value)}
                        className={champ}
                        {...aria("terrain")}
                      />
                      {erreurChamp("terrain")}
                    </label>
                  )}
                </div>
              </>
            )}

            {etape === 3 && (
              <>
                <GroupeChoix legende="Époque de construction" nom="epoque" options={EPOQUES} valeur={valeurs.epoque} onChange={changer} />
                <GroupeChoix legende="État général" nom="etat" options={ETATS} valeur={valeurs.etat} onChange={changer} />
                <GroupeChoix
                  legende="Stationnement"
                  nom="stationnement"
                  options={STATIONNEMENTS}
                  valeur={valeurs.stationnement}
                  onChange={changer}
                />
              </>
            )}

            {etape === 4 && (
              <fieldset className="m-0 border-0 p-0">
                <legend className="sr-only">Votre projet</legend>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {PROJETS.map((p) => (
                    <label key={p.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="projet"
                        value={p.id}
                        checked={valeurs.projet === p.id}
                        onChange={() => changer("projet", p.id)}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-[88px] flex-col justify-center gap-1 border border-grey-dark px-5 py-4 text-grey-dark peer-checked:bg-grey-dark peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark">
                        <span className="font-display text-[22px] font-medium uppercase">{p.libelle}</span>
                        <span className="text-[15px]">{p.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {etape === 5 && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm md:col-span-2">
                    Prénom et nom
                    <input
                      name="nom"
                      autoComplete="name"
                      value={valeurs.nom}
                      onChange={(e) => changer("nom", e.target.value)}
                      className={champ}
                      {...aria("nom")}
                    />
                    {erreurChamp("nom")}
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    E-mail
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={valeurs.email}
                      onChange={(e) => changer("email", e.target.value)}
                      className={champ}
                      {...aria("email")}
                    />
                    {erreurChamp("email")}
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    Téléphone
                    <input
                      name="telephone"
                      type="tel"
                      autoComplete="tel"
                      value={valeurs.telephone}
                      onChange={(e) => changer("telephone", e.target.value)}
                      className={champ}
                      {...aria("telephone")}
                    />
                    {erreurChamp("telephone")}
                  </label>
                </div>
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Ne pas remplir
                    <input
                      type="text"
                      name={CHAMP_PIEGE}
                      tabIndex={-1}
                      autoComplete="off"
                      value={valeurs[CHAMP_PIEGE]}
                      onChange={(e) => changer(CHAMP_PIEGE, e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-start gap-3 text-sm leading-normal">
                    <input
                      type="checkbox"
                      name="consentement"
                      checked={valeurs.consentement === "oui"}
                      onChange={(e) => changer("consentement", e.target.checked ? "oui" : "")}
                      className="m-0 mt-0.5 size-5 flex-none accent-grey-dark"
                      {...aria("consentement")}
                    />
                    <span>
                      {/* À VALIDER : mention RGPD complète à rédiger par l'agence. */}
                      J&apos;accepte que mes données soient utilisées pour établir mon estimation et être recontacté par l&apos;agence.
                      [Mention RGPD à rédiger] ·{" "}
                      <Link href={ROUTES.confidentialite} className="underline" target="_blank">
                        Politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  {erreurChamp("consentement")}
                </div>
              </>
            )}

            {etape === RESULTAT && (
              <Resultat
                loyer={projet.loyer}
                suite={suite}
                enCours={enCours}
                onChoisir={choisirSuite}
                onModifier={() => {
                  setSuite(null);
                  setEtape(1);
                }}
              />
            )}

            {etape < RESULTAT && (
              <div className="sticky bottom-0 -mx-6 mt-auto flex gap-3 border-t border-grey-light bg-white px-6 py-4 md:static md:mx-0 md:mt-0 md:border-0 md:p-0">
                {etape > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessage(null);
                      setErreurs({});
                      setEtape(etape - 1);
                    }}
                    className="min-h-14 cursor-pointer border border-grey-dark bg-white px-6 text-base text-grey-dark md:min-h-[60px]"
                  >
                    Retour
                  </button>
                )}
                <button
                  type="submit"
                  disabled={enCours}
                  className="min-h-14 flex-1 cursor-pointer bg-gold px-10 font-display text-base font-semibold uppercase tracking-[0.14em] text-grey-dark hover:bg-gold-dark disabled:opacity-60 md:min-h-[60px] md:flex-none"
                >
                  {etape === 5 ? (enCours ? "Envoi…" : "Voir mon estimation") : "Continuer"}
                </button>
              </div>
            )}
          </form>

          {etape === RESULTAT && (
            <div className="mb-10 mt-10 md:hidden">
              <Conseiller telephone={telephone} telephoneE164={telephoneE164} surFondSombre={false} />
            </div>
          )}
        </main>

        <aside
          aria-label="Votre estimation en cours"
          className="hidden flex-[1_1_360px] flex-col gap-7 bg-grey-dark px-[clamp(24px,4vw,56px)] py-14 text-white md:flex"
        >
          {etape < RESULTAT ? (
            <>
              <p className="m-0 font-display text-sm uppercase tracking-[0.24em] text-gold">Votre parcours</p>
              <ol className="m-0 list-none p-0">
                {ETAPES.map((et) => {
                  const fait = et.numero < etape;
                  const courant = et.numero === etape;
                  return (
                    <li
                      key={et.numero}
                      aria-current={courant ? "step" : undefined}
                      className="flex min-h-14 items-center gap-4 border-b border-grey-light/20"
                    >
                      <span
                        className={`flex size-7 flex-none items-center justify-center rounded-full font-display text-sm ${
                          fait
                            ? "bg-gold text-grey-dark"
                            : courant
                              ? "border-2 border-gold text-gold"
                              : "border border-grey-medium text-grey-light"
                        }`}
                      >
                        {fait ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          et.numero
                        )}
                      </span>
                      <span className={courant ? "font-bold" : "text-grey-light"}>
                        {et.libelle}
                        {fait && <span className="sr-only"> (terminé)</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="m-0 text-sm leading-normal text-grey-light">
                2 minutes environ. Vos réponses restent modifiables jusqu&apos;au résultat.
              </p>
            </>
          ) : (
            <Conseiller telephone={telephone} telephoneE164={telephoneE164} surFondSombre />
          )}
        </aside>
      </div>
    </div>
  );
}

const TITRES: Record<number, string> = {
  1: "Où se situe votre bien ?",
  2: "Parlez-nous de votre bien",
  3: "Quelques précisions",
  4: "Quel est votre projet ?",
  5: "Où vous envoyer votre estimation ?",
  6: "Votre première fourchette",
};

function GroupeChoix({
  legende,
  nom,
  options,
  valeur,
  onChange,
  grand = false,
}: {
  legende: string;
  nom: string;
  options: readonly { id: string; libelle: string }[];
  valeur: string;
  onChange: (nom: string, valeur: string) => void;
  grand?: boolean;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
      <legend className="mb-3 p-0 text-[15px] font-bold">{legende}</legend>
      <div className={grand ? "grid grid-cols-2 gap-2.5 md:flex md:flex-wrap" : "grid grid-cols-2 gap-2.5 md:flex md:flex-wrap"}>
        {options.map((o) => (
          <label key={o.id} className="cursor-pointer">
            <input
              type="radio"
              name={nom}
              value={o.id}
              checked={valeur === o.id}
              onChange={() => onChange(nom, o.id)}
              className="peer sr-only"
            />
            <span
              className={`flex items-center justify-center border border-grey-dark bg-white text-center text-grey-dark peer-checked:bg-grey-dark peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark ${
                grand ? "min-h-14 px-7 text-[17px]" : "min-h-[52px] px-[22px] text-base"
              }`}
            >
              {o.libelle}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Resultat({
  loyer,
  suite,
  enCours,
  onChoisir,
  onModifier,
}: {
  loyer: boolean;
  suite: "rappel" | "estimation-seule" | null;
  enCours: boolean;
  onChoisir: (choix: "rappel" | "estimation-seule") => void;
  onModifier: () => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3 bg-grey-light p-6 md:p-10">
        <span className="font-display text-sm uppercase tracking-[0.2em]">
          {loyer ? "Loyer mensuel estimé, hors charges" : "Prix de vente estimé"}
        </span>
        {/* Aucun chiffre tant que la méthode et la source des prix ne sont pas validées (spec §6). */}
        <span className="font-display text-[28px] font-semibold leading-tight md:text-[40px]">
          [Fourchette disponible dès que la source des prix sera choisie]
        </span>
        <span className="text-[15px]">
          {loyer
            ? // À VALIDER : encadrement des loyers à Bordeaux (fin d'expérimentation prévue le 24/11/2026).
              "Encadrement des loyers à Bordeaux : [vérification à prévoir]"
            : "Prix au m² : [à venir] · valeur médiane du secteur : [à venir]"}
        </span>
      </div>
      <p className="m-0 text-sm leading-normal">
        Fourchette indicative, calculée à partir de [source des données à définir]. Seule la visite d&apos;un expert du quartier permet
        d&apos;établir un prix précis.
      </p>

      {suite ? (
        <p role="status" className="m-0 border-l-4 border-gold bg-grey-light px-4 py-3 text-base">
          {suite === "rappel"
            ? "C'est noté : un expert du quartier vous rappelle."
            : "C'est noté : vous recevrez votre estimation, sans être rappelé."}{" "}
          [Démonstration : aucun message n&apos;est encore transmis à l&apos;agence.]
        </p>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <button
            type="button"
            disabled={enCours}
            onClick={() => onChoisir("rappel")}
            className="min-h-14 cursor-pointer bg-gold px-8 font-display text-base font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-gold-dark disabled:opacity-60 md:min-h-[60px]"
          >
            Être rappelé par un expert du quartier
          </button>
          <button
            type="button"
            disabled={enCours}
            onClick={() => onChoisir("estimation-seule")}
            className="min-h-14 cursor-pointer border border-grey-dark bg-white px-8 font-display text-base font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-grey-light disabled:opacity-60 md:min-h-[60px]"
          >
            Recevoir seulement mon estimation
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onModifier}
        className="self-start cursor-pointer border-0 bg-transparent p-0 text-[15px] text-grey-dark underline"
      >
        Modifier mes réponses
      </button>
    </div>
  );
}

/** Conseiller référent du secteur de l'adresse : table secteur → conseiller à fournir par l'agence. */
function Conseiller({ telephone, telephoneE164, surFondSombre }: { telephone: string; telephoneE164: string; surFondSombre: boolean }) {
  return (
    <div className={`flex flex-col gap-5 ${surFondSombre ? "" : "border-t border-grey-light pt-8"}`}>
      <p className={`m-0 font-display text-sm uppercase tracking-[0.24em] ${surFondSombre ? "text-gold" : ""}`}>
        Votre conseiller référent
      </p>
      <div className={`flex aspect-[4/5] max-w-[280px] items-end p-4 ${surFondSombre ? "border border-grey-medium" : "bg-grey-light"}`}>
        <span className={`font-display text-xs uppercase tracking-[0.16em] ${surFondSombre ? "text-grey-light" : ""}`}>
          Portrait du conseiller du secteur
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-medium">[Prénom Nom]</span>
        <span className={`text-[15px] ${surFondSombre ? "text-grey-light" : ""}`}>
          Conseiller transaction · secteur [selon l&apos;adresse]
        </span>
      </div>
      <span className="text-[15px]">
        Ligne directe : [à fournir] · Agence :{" "}
        <a href={`tel:${telephoneE164}`} className={surFondSombre ? "text-gold" : "text-grey-dark underline"}>
          {telephone}
        </a>
      </span>
    </div>
  );
}
