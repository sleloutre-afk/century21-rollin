"use client";

import { useActionState, useId, useState } from "react";
import { demanderRendezVous } from "@/lib/formulaires/rendez-vous";
import { HEURES_RDV, JOURS_RDV, type EtatFormulaire } from "@/lib/formulaires/schemas";
import { CaseConsentement, Champ, ChampPiege, MessageEnvoye, MessageErreur } from "./Champs";

/**
 * Prise de rendez-vous (maquette ConseillerDesktop, ContactDesktop) : jour, heure, nom, téléphone.
 * Créneaux d'exemple, signalés comme tels, en attendant l'outil d'agenda.
 */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

function Creneaux({
  legende,
  nom,
  options,
  valeur,
  onChange,
  erreur,
  colonnes,
}: {
  legende: string;
  nom: string;
  options: readonly string[];
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  colonnes: string;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
      <legend className="mb-2.5 p-0 text-sm font-bold">{legende}</legend>
      <div className={`grid gap-2 ${colonnes}`}>
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={nom} value={o} checked={valeur === o} onChange={() => onChange(o)} className="peer sr-only" />
            <span className="flex min-h-14 items-center justify-center border border-grey-dark bg-white font-display text-[17px] text-grey-dark peer-checked:bg-grey-dark peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark">
              {o}
            </span>
          </label>
        ))}
      </div>
      {erreur && <span className="text-sm font-bold">{erreur}</span>}
    </fieldset>
  );
}

export function PriseRendezVous({ conseiller = "" }: { conseiller?: string }) {
  const [etat, envoyer, enCours] = useActionState(demanderRendezVous, ETAT_INITIAL);
  const id = useId();
  const [jour, setJour] = useState<string>(etat.valeurs?.jour ?? "Mar.");
  const [heure, setHeure] = useState<string>(etat.valeurs?.heure ?? "");
  const e = etat.erreurs ?? {};
  const v = etat.valeurs ?? {};

  if (etat.statut === "envoye") return <MessageEnvoye message={etat.message} />;

  return (
    <form action={envoyer} noValidate aria-label="Prendre rendez-vous" className="flex flex-col gap-5 bg-white p-6 text-grey-dark md:p-8">
      <input type="hidden" name="conseiller" value={conseiller} />
      <MessageErreur message={etat.statut === "erreur" ? etat.message : undefined} />
      <Creneaux legende="Jour" nom="jour" options={JOURS_RDV} valeur={jour} onChange={setJour} erreur={e.jour} colonnes="grid-cols-5" />
      <Creneaux legende="Heure" nom="heure" options={HEURES_RDV} valeur={heure} onChange={setHeure} erreur={e.heure} colonnes="grid-cols-3 sm:grid-cols-4 lg:grid-cols-7" />
      <p className="m-0 text-[13px]">Créneaux affichés à titre d&apos;exemple : ils viendront de l&apos;agenda du conseiller. Nous vous rappelons pour confirmer.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Champ id={id} nom="nom" libelle="Nom" autoComplete="name" valeur={v.nom} erreur={e.nom} />
        <Champ id={id} nom="telephone" libelle="Téléphone" type="tel" autoComplete="tel" valeur={v.telephone} erreur={e.telephone} />
      </div>
      <ChampPiege />
      <CaseConsentement id={id} texte="J'accepte que mes données soient utilisées pour organiser ce rendez-vous." erreur={e.consentement} coche={v.consentement === "oui"} />
      <button
        type="submit"
        disabled={enCours}
        className="min-h-14 cursor-pointer bg-grey-dark px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white hover:text-gold disabled:opacity-60"
      >
        {enCours ? "Envoi…" : heure ? `Confirmer · ${jour} à ${heure}` : "Choisissez un créneau"}
      </button>
    </form>
  );
}
