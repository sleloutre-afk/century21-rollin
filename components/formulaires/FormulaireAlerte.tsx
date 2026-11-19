"use client";

import { useActionState, useId } from "react";
import { creerAlerte } from "@/lib/formulaires/alerte";
import type { EtatFormulaire } from "@/lib/formulaires/schemas";
import { CaseConsentement, ChampPiege, MessageEnvoye, MessageErreur } from "./Champs";

/**
 * Alerte e-mail (maquette AcheterDesktop, RechercheDesktop) : critères de la recherche en cours + e-mail.
 * La désinscription en un clic sera fournie par l'outil d'envoi.
 */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

export function FormulaireAlerte({ criteres, lienModifier }: { criteres: string[]; lienModifier?: React.ReactNode }) {
  const [etat, envoyer, enCours] = useActionState(creerAlerte, ETAT_INITIAL);
  const id = useId();
  const e = etat.erreurs ?? {};

  if (etat.statut === "envoye") return <MessageEnvoye message={etat.message} />;

  return (
    <form action={envoyer} noValidate aria-label="Créer une alerte e-mail" className="flex flex-col gap-4">
      <input type="hidden" name="criteres" value={criteres.join(" · ")} />
      <div className="flex flex-wrap items-center gap-2">
        {criteres.map((c) => (
          <span key={c} className="border border-grey-dark bg-white px-3.5 py-2 text-sm">
            {c}
          </span>
        ))}
        {lienModifier}
      </div>
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
          <button
            type="submit"
            disabled={enCours}
            className="min-h-14 cursor-pointer bg-grey-dark px-7 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white hover:text-gold disabled:opacity-60"
          >
            {enCours ? "Envoi…" : "Créer mon alerte"}
          </button>
        </div>
        {e.email && (
          <span id={`${id}-email-erreur`} className="text-sm font-bold">
            {e.email}
          </span>
        )}
      </div>
      <ChampPiege />
      <CaseConsentement id={id} texte="J'accepte de recevoir les nouveaux biens correspondant à ma recherche. Désinscription en un clic." erreur={e.consentement} />
    </form>
  );
}
