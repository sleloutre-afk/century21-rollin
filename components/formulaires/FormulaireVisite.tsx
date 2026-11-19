"use client";

import { useActionState, useId } from "react";
import { demanderVisite } from "@/lib/formulaires/visite";
import type { EtatFormulaire } from "@/lib/formulaires/schemas";
import { CaseConsentement, Champ, ChampPiege, MessageEnvoye, MessageErreur } from "./Champs";

/** « Demander une visite » (fiche bien) : formulaire court (maquette FicheDesktop, annotation « Conseiller du bien »). */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

export function FormulaireVisite({ annonce }: { annonce: string }) {
  const [etat, envoyer, enCours] = useActionState(demanderVisite, ETAT_INITIAL);
  const id = useId();
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  if (etat.statut === "envoye") return <MessageEnvoye message={etat.message} />;

  return (
    <form action={envoyer} noValidate aria-label="Demander une visite" className="flex flex-col gap-4">
      <input type="hidden" name="annonce" value={annonce} />
      <MessageErreur message={etat.statut === "erreur" ? etat.message : undefined} />
      <Champ id={id} nom="nom" libelle="Nom" autoComplete="name" valeur={v.nom} erreur={e.nom} />
      <Champ id={id} nom="telephone" libelle="Téléphone" type="tel" autoComplete="tel" valeur={v.telephone} erreur={e.telephone} />
      <Champ id={id} nom="email" libelle="E-mail (facultatif)" type="email" autoComplete="email" valeur={v.email} erreur={e.email} />
      <Champ id={id} nom="message" libelle="Vos disponibilités ou questions (facultatif)" multiligne valeur={v.message} erreur={e.message} />
      <ChampPiege />
      <CaseConsentement id={id} texte="J'accepte que mes données soient utilisées pour organiser la visite et être recontacté." erreur={e.consentement} coche={v.consentement === "oui"} />
      <button
        type="submit"
        disabled={enCours}
        className="min-h-14 cursor-pointer bg-gold px-6 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-gold-dark disabled:opacity-60"
      >
        {enCours ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
