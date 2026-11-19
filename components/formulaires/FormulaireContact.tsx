"use client";

import { useActionState, useId, useState } from "react";
import { envoyerContact } from "@/lib/formulaires/contact";
import { PROJETS_CONTACT, type EtatFormulaire } from "@/lib/formulaires/schemas";
import { CaseConsentement, Champ, ChampPiege, MessageEnvoye, MessageErreur } from "./Champs";

/** Formulaire de contact par type de projet (maquette ContactDesktop) : le pôle destinataire s'affiche selon le choix. */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

export function FormulaireContact() {
  const [etat, envoyer, enCours] = useActionState(envoyerContact, ETAT_INITIAL);
  const id = useId();
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};
  const [projet, setProjet] = useState(v.projet || "vendre");
  const choisi = PROJETS_CONTACT.find((p) => p.id === projet) ?? PROJETS_CONTACT[0];

  if (etat.statut === "envoye") return <MessageEnvoye message={etat.message} />;

  return (
    <form action={envoyer} noValidate aria-label="Formulaire de contact" className="flex flex-col gap-6">
      <MessageErreur message={etat.statut === "erreur" ? etat.message : undefined} />
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-3 p-0 text-[15px] font-bold">Votre projet</legend>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {PROJETS_CONTACT.map((p) => (
            <label key={p.id} className="cursor-pointer">
              <input type="radio" name="projet" value={p.id} checked={projet === p.id} onChange={() => setProjet(p.id)} className="peer sr-only" />
              <span className="flex min-h-14 items-center justify-center border border-grey-dark bg-white px-3 text-center text-base text-grey-dark peer-checked:bg-grey-dark peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark">
                {p.libelle}
              </span>
            </label>
          ))}
        </div>
        <p aria-live="polite" className="m-0 flex items-center gap-2.5 text-[15px]">
          <span aria-hidden="true" className="size-2 flex-none bg-gold" />
          {choisi.texte}
        </p>
      </fieldset>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Champ id={id} nom="nom" libelle="Nom" autoComplete="name" valeur={v.nom} erreur={e.nom} />
        <Champ id={id} nom="telephone" libelle="Téléphone" type="tel" autoComplete="tel" valeur={v.telephone} erreur={e.telephone} />
        <Champ id={id} nom="email" libelle="E-mail (facultatif)" type="email" autoComplete="email" valeur={v.email} erreur={e.email} />
      </div>
      <Champ id={id} nom="message" libelle="Message (facultatif)" multiligne valeur={v.message} erreur={e.message} />
      <ChampPiege />
      <CaseConsentement id={id} texte="J'accepte que mes données soient utilisées pour être recontacté au sujet de mon projet." erreur={e.consentement} coche={v.consentement === "oui"} />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={enCours} className="min-h-14 cursor-pointer bg-gold px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark hover:bg-gold-dark disabled:opacity-60">
          {enCours ? "Envoi…" : "Envoyer ma demande"}
        </button>
        <a href="#rendez-vous" className="inline-flex min-h-14 items-center border border-grey-dark px-6 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-grey-light">
          Prendre rendez-vous
        </a>
      </div>
    </form>
  );
}
