"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { Bouton, BoutonLien } from "@/components/ui/Bouton";
import { IconeCalendrier } from "@/components/ui/Icones";
import { demanderRappel } from "@/lib/formulaires/rappel";
import { CHAMP_PIEGE, PROJETS, type EtatFormulaire } from "@/lib/formulaires/schemas";
import { ROUTES } from "@/lib/navigation";

/**
 * « Un conseiller vous rappelle » (maquette : Accueil-desktop-2, Accueil-mobile-2).
 * Fonctionne aussi sans JavaScript (envoi classique du formulaire).
 * Le projet est un groupe de boutons radio présentés comme des boutons.
 */

const ETAT_INITIAL: EtatFormulaire = { statut: "initial" };

const champ = "h-[54px] border border-grey-medium bg-white px-3.5 text-base text-grey-dark";

export function FormulaireRappel({ titre = "Un conseiller vous rappelle" }: { titre?: string }) {
  const [etat, envoyer, enCours] = useActionState(demanderRappel, ETAT_INITIAL);
  const id = useId();
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  if (etat.statut === "envoye") {
    return (
      <div role="status" className="flex flex-col gap-4">
        <h3 className="m-0 text-[28px] font-medium md:text-[32px]">Demande envoyée</h3>
        <p className="m-0 max-w-[520px] text-base leading-normal">{etat.message}</p>
      </div>
    );
  }

  const aide = (nom: keyof NonNullable<EtatFormulaire["erreurs"]>) =>
    e[nom] ? (
      <span id={`${id}-${nom}-erreur`} className="text-sm font-bold">
        {e[nom]}
      </span>
    ) : null;
  const decrit = (nom: keyof NonNullable<EtatFormulaire["erreurs"]>) => (e[nom] ? `${id}-${nom}-erreur` : undefined);

  return (
    <form action={envoyer} aria-labelledby={`${id}-titre`} noValidate className="flex flex-col gap-[22px]">
      <h3 id={`${id}-titre`} className="m-0 text-[26px] font-medium md:text-[32px]">
        {titre}
      </h3>

      {etat.statut === "erreur" && etat.message && (
        <p role="alert" className="m-0 border-l-4 border-grey-dark bg-grey-light px-4 py-3 text-[15px] font-bold">
          {etat.message}
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-[1_1_220px] flex-col gap-2 text-sm">
          Nom
          <input
            name="nom"
            type="text"
            autoComplete="name"
            required
            defaultValue={v.nom}
            aria-invalid={!!e.nom}
            aria-describedby={decrit("nom")}
            className={champ}
          />
          {aide("nom")}
        </label>
        <label className="flex flex-[1_1_220px] flex-col gap-2 text-sm">
          Téléphone
          <input
            name="telephone"
            type="tel"
            autoComplete="tel"
            required
            defaultValue={v.telephone}
            aria-invalid={!!e.telephone}
            aria-describedby={decrit("telephone")}
            className={champ}
          />
          {aide("telephone")}
        </label>
      </div>

      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0" aria-describedby={decrit("projet")}>
        <legend className="mb-2.5 p-0 text-sm">Votre projet</legend>
        <div className="flex flex-wrap gap-2.5">
          {PROJETS.map((projet) => (
            <label key={projet.id} className="cursor-pointer">
              <input
                type="radio"
                name="projet"
                value={projet.id}
                defaultChecked={(v.projet ?? "vendre") === projet.id}
                className="peer sr-only"
              />
              <span className="flex min-h-12 items-center border border-grey-dark bg-white px-5 text-[15px] text-grey-dark peer-checked:bg-grey-dark peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark">
                {projet.libelle}
              </span>
            </label>
          ))}
        </div>
        {aide("projet")}
      </fieldset>

      <label className="flex flex-col gap-2 text-sm">
        Message (facultatif)
        <textarea
          name="message"
          rows={3}
          defaultValue={v.message}
          aria-invalid={!!e.message}
          aria-describedby={decrit("message")}
          className="resize-y border border-grey-medium bg-white px-3.5 py-3 text-base text-grey-dark"
        />
        {aide("message")}
      </label>

      {/* Champ piège : invisible et ignoré par les visiteurs, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name={CHAMP_PIEGE} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-[13px] leading-normal">
          <input
            type="checkbox"
            name="consentement"
            value="oui"
            required
            aria-invalid={!!e.consentement}
            aria-describedby={decrit("consentement")}
            className="m-0 size-5 flex-none accent-grey-dark"
          />
          <span>
            {/* À VALIDER : mention RGPD à rédiger par l'agence (finalité, durée de conservation, droits). */}
            J&apos;accepte que mes données soient utilisées pour être recontacté. [Mention RGPD à rédiger] ·{" "}
            <Link href={ROUTES.confidentialite} className="underline">
              Politique de confidentialité
            </Link>
          </span>
        </label>
        {aide("consentement")}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Bouton type="submit" variante="sombre" taille="grand" disabled={enCours}>
          {enCours ? "Envoi…" : "Être rappelé"}
        </Bouton>
        <BoutonLien href={`${ROUTES.contact}#rendez-vous`} variante="contour" taille="grand" className="px-6">
          <IconeCalendrier taille={18} />
          Prendre rendez-vous
        </BoutonLien>
      </div>
    </form>
  );
}
