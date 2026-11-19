import Link from "next/link";
import { CHAMP_PIEGE } from "@/lib/formulaires/schemas";
import { ROUTES } from "@/lib/navigation";

/** Briques de formulaire partagées : libellé, message d'erreur relié au champ, consentement, champ piège. */

const classeChamp = "border border-grey-medium bg-white px-3.5 text-base text-grey-dark";

export function Champ({
  id,
  nom,
  libelle,
  type = "text",
  autoComplete,
  valeur,
  erreur,
  multiligne = false,
  className = "",
}: {
  id: string;
  nom: string;
  libelle: string;
  type?: string;
  autoComplete?: string;
  valeur?: string;
  erreur?: string;
  multiligne?: boolean;
  className?: string;
}) {
  const idErreur = `${id}-${nom}-erreur`;
  const communs = {
    name: nom,
    defaultValue: valeur,
    "aria-invalid": !!erreur,
    "aria-describedby": erreur ? idErreur : undefined,
  };
  return (
    <label className={`flex flex-col gap-2 text-sm ${className}`}>
      {libelle}
      {multiligne ? (
        <textarea rows={3} {...communs} className={`${classeChamp} resize-y py-3`} />
      ) : (
        <input type={type} autoComplete={autoComplete} {...communs} className={`${classeChamp} h-[54px]`} />
      )}
      {erreur && (
        <span id={idErreur} className="text-sm font-bold">
          {erreur}
        </span>
      )}
    </label>
  );
}

export function CaseConsentement({ id, texte, erreur }: { id: string; texte: string; erreur?: string }) {
  const idErreur = `${id}-consentement-erreur`;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-3 text-[13px] leading-normal">
        <input
          type="checkbox"
          name="consentement"
          value="oui"
          aria-invalid={!!erreur}
          aria-describedby={erreur ? idErreur : undefined}
          className="m-0 size-5 flex-none accent-grey-dark"
        />
        <span>
          {/* À VALIDER : mention RGPD à rédiger par l'agence (finalité, durée de conservation, droits). */}
          {texte} [Mention RGPD à rédiger] ·{" "}
          <Link href={ROUTES.confidentialite} className="underline">
            Politique de confidentialité
          </Link>
        </span>
      </label>
      {erreur && (
        <span id={idErreur} className="text-sm font-bold">
          {erreur}
        </span>
      )}
    </div>
  );
}

/** Champ invisible et ignoré par les visiteurs, rempli par les robots. */
export function ChampPiege() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Ne pas remplir
        <input type="text" name={CHAMP_PIEGE} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function MessageErreur({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="m-0 border-l-4 border-grey-dark bg-grey-light px-4 py-3 text-[15px] font-bold text-grey-dark">
      {message}
    </p>
  );
}

export function MessageEnvoye({ message, surFondSombre = false }: { message?: string; surFondSombre?: boolean }) {
  return (
    <p role="status" className={`m-0 border-l-4 border-gold px-4 py-3 text-base ${surFondSombre ? "text-white" : "bg-grey-light text-grey-dark"}`}>
      {message}
    </p>
  );
}
