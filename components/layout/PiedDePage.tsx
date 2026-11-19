import Link from "next/link";
import { getAgence, getSecteurs } from "@/lib/data";
import { PIED_AGENCE, PIED_INFORMATIONS, PIED_SERVICES, ROUTES, type Lien } from "@/lib/navigation";
import { Logo } from "./Logo";

/**
 * Pied de page (maquette : Accueil-desktop-2, Accueil-mobile-2).
 * Grand écran : 5 colonnes. Petit écran : groupes repliables.
 * Mentions professionnelles obligatoires : emplacements « [à fournir] » tant que l'agence ne les a pas transmises.
 * À VALIDER : mentions professionnelles et formulation de la mention d'indépendance (docs/questions-ouvertes.md).
 */

type Groupe = { titre: string; liens: Lien[] };

const aFournir = (valeur: string | null) => valeur ?? "[à fournir]";

function LienPied({ lien }: { lien: Lien }) {
  const fort = lien.href === ROUTES.honoraires;
  return (
    <Link href={lien.href} className={`no-underline hover:text-gold ${fort ? "font-bold text-white" : "text-grey-light"}`}>
      {lien.libelle}
    </Link>
  );
}

export function PiedDePage() {
  const agence = getAgence();
  const m = agence.mentionsProfessionnelles;

  const groupes: Groupe[] = [
    { titre: "Services", liens: PIED_SERVICES },
    { titre: "Quartiers", liens: getSecteurs().map((s) => ({ libelle: s.nom, href: `${ROUTES.quartiers}/${s.slug}` })) },
    { titre: "L'agence", liens: PIED_AGENCE },
    { titre: "Informations", liens: PIED_INFORMATIONS },
  ];

  return (
    <footer className="border-t-4 border-gold bg-grey-dark pb-10 pt-12 text-grey-light md:pt-16">
      <div className="conteneur flex flex-col gap-6 md:gap-12">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex flex-[1_1_260px] flex-col gap-3.5 text-[15px] leading-relaxed">
            <Logo taille="pied" surFondSombre lien={false} />
            <address className="not-italic">
              {agence.adresse.rue}
              <br />
              {agence.adresse.codePostal} {agence.adresse.ville}
            </address>
            <a href={`tel:${agence.telephoneE164}`} className="font-display text-[22px] text-gold no-underline hover:text-white">
              {agence.telephone}
            </a>
          </div>

          {/* Grand écran : colonnes */}
          {groupes.map((g) => (
            <nav key={g.titre} aria-label={g.titre} className="hidden flex-[1_1_160px] flex-col gap-2.5 text-[15px] md:flex">
              <span className="mb-1 font-display text-[13px] uppercase tracking-[0.2em] text-gold">{g.titre}</span>
              {g.liens.map((lien) => (
                <LienPied key={lien.href} lien={lien} />
              ))}
              {g.titre === "L'agence" && <ReseauCentury21 />}
            </nav>
          ))}
        </div>

        {/* Petit écran : groupes repliables */}
        <div className="flex flex-col md:hidden">
          {groupes.map((g) => (
            <details key={g.titre} className="group border-t border-grey-light/25">
              <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between font-display text-sm uppercase tracking-[0.2em] text-gold [&::-webkit-details-marker]:hidden">
                {g.titre}
                <span aria-hidden="true" className="text-grey-light transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <nav aria-label={g.titre} className="flex flex-col gap-1 pb-4 text-[15px]">
                {g.liens.map((lien) => (
                  <span key={lien.href} className="flex min-h-10 items-center">
                    <LienPied lien={lien} />
                  </span>
                ))}
                {g.titre === "L'agence" && (
                  <span className="flex min-h-10 items-center">
                    <ReseauCentury21 />
                  </span>
                )}
              </nav>
            </details>
          ))}
          {/* Barème toujours visible, hors des groupes repliés (maquette Accueil-mobile-2, brief §10). */}
          <Link
            href={ROUTES.honoraires}
            className="flex min-h-12 items-center border-t border-grey-light/25 text-[15px] font-bold text-white no-underline hover:text-gold"
          >
            Barème d&apos;honoraires
          </Link>
        </div>

        <div className="flex flex-col gap-2 border-t border-grey-light/25 pt-6 font-display text-[13px] leading-relaxed tracking-[0.02em] md:text-sm">
          <p className="m-0">
            Carte professionnelle n° {aFournir(m.carteProfessionnelle)} délivrée par la CCI {aFournir(m.cci)} · Garant
            financier : {aFournir(m.garantFinancier)} · Assurance RCP : {aFournir(m.assuranceRCP)} · Médiateur de la
            consommation : {aFournir(m.mediateur)}
          </p>
          <p className="m-0">Agence indépendante membre du réseau CENTURY 21. {m.mentionIndependance}</p>
        </div>
      </div>
    </footer>
  );
}

/** À VALIDER : adresse du site du réseau CENTURY 21 à confirmer (non fournie dans le dossier). */
function ReseauCentury21() {
  return <span className="text-grey-light">Réseau CENTURY 21 [lien à fournir]</span>;
}
