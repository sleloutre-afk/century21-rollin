"use client";

import { useActionState, useId } from "react";
import { inscrireLettre } from "@/lib/formulaires/lettre";
import type { EtatFormulaire } from "@/lib/formulaires/schemas";
import { CaseConsentement, ChampPiege, MessageEnvoye, MessageErreur } from "./Champs";

/** Inscription à « La lettre des propriétaires » (maquette RessourcesDesktop). */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

export function FormulaireLettre() {
  const [etat, envoyer, enCours] = useActionState(inscrireLettre, ETAT_INITIAL);
  const id = useId();
  const e = etat.erreurs ?? {};

  if (etat.statut === "envoye") return <MessageEnvoye message={etat.message} />;

  return (
    <form action={envoyer} noValidate aria-label="S'inscrire à la lettre d'information" className="flex flex-col gap-4">
      <MessageErreur message={etat.statut === "erreur" ? etat.message : undefined} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 border border-grey-medium bg-white p-2 md:flex-row">
          <label htmlFor={`${id}-email`} className="sr-only">
            Votre e-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Votre e-mail"
            defaultValue={etat.valeurs?.email}
            aria-invalid={!!e.email}
            aria-describedby={e.email ? `${id}-email-erreur` : undefined}
            className="h-14 min-w-0 flex-1 border border-grey-medium px-4 text-[17px] text-grey-dark md:border-0"
          />
          <button type="submit" disabled={enCours} className="min-h-14 cursor-pointer bg-grey-dark px-7 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white hover:text-gold disabled:opacity-60">
            {enCours ? "Envoi…" : "Je m'inscris"}
          </button>
        </div>
        {e.email && (
          <span id={`${id}-email-erreur`} className="text-sm font-bold">
            {e.email}
          </span>
        )}
      </div>
      <ChampPiege />
      <CaseConsentement id={id} texte="J'accepte de recevoir la lettre d'information de l'agence." erreur={e.consentement} coche={etat.valeurs?.consentement === "oui"} />
    </form>
  );
}
