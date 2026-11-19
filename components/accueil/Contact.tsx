import { FormulaireRappel } from "@/components/formulaires/FormulaireRappel";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { getAgence } from "@/lib/data";

/**
 * « Parlons de votre projet » (brief §7.12 ; maquette Accueil-desktop-2 et Accueil-mobile-2).
 * Coordonnées et horaires de contenus/agence.json, emplacement de carte (fournisseur à choisir),
 * formulaire de rappel (envoi simulé tant que l'outil d'e-mail n'est pas branché).
 */
export function Contact() {
  const agence = getAgence();

  return (
    <section id="contact" aria-labelledby="h-contact" className="flex flex-wrap">
      <div className="flex flex-[1_1_480px] flex-col gap-6 bg-grey-dark px-6 py-14 text-white md:gap-7 md:px-[clamp(32px,6vw,96px)] md:py-[72px]">
        <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">Contact</p>
        <h2 id="h-contact" className="m-0 text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
          Parlons de votre projet
        </h2>
        <a
          href={`tel:${agence.telephoneE164}`}
          className="font-display text-[34px] font-medium tracking-[0.02em] text-gold no-underline hover:text-white md:text-[40px]"
        >
          {agence.telephone}
        </a>
        <address className="text-[17px] not-italic leading-normal text-grey-light">
          {agence.adresse.rue}
          <br />
          {agence.adresse.codePostal} {agence.adresse.ville}
        </address>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px] text-grey-light">
          {agence.horaires.map((h) => (
            <div key={h.jours} className="contents">
              <dt className="font-bold text-white">{h.jours}</dt>
              <dd className="m-0">{h.plages}</dd>
            </div>
          ))}
        </dl>
        {/* À VALIDER : fournisseur de carte à choisir (spec §7). */}
        <EmplacementPhoto libelle="Plan d'accès · carte interactive" surFondSombre className="hidden min-h-[180px] flex-1 md:block" />
      </div>
      <div className="flex flex-[1.2_1_520px] flex-col justify-center px-6 py-14 md:px-[clamp(32px,6vw,96px)] md:py-[72px]">
        <FormulaireRappel />
      </div>
    </section>
  );
}
