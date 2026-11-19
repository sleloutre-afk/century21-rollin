import { LienFleche } from "@/components/ui/Bouton";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * Avis clients (brief §7.9 ; maquette Accueil-desktop-2 et Accueil-mobile-2).
 * Notes globales toujours datées. Flux Google à brancher (outil à choisir) : en attendant,
 * emplacements. Défilement manuel uniquement.
 * Étoiles des emplacements : décision de Simon (19/11/2026). Elles seront remplacées par la note
 * réelle de chaque avis à la connexion du flux.
 * À VALIDER : mention sur le contrôle des avis (Code de la consommation) et attribution Google.
 */

const nombre = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const dater = (d: string | null) => (d ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${d}T00:00:00`)) : "[date à fournir]");

// Services des emplacements, repris de la maquette.
const EMPLACEMENTS = ["Vente", "Gestion", "Location", "Vente", "Location", "Gestion"].map((service, i) => ({ n: i + 1, service }));

function CarteNote({ titre, note, sur, date }: { titre: string; note: number; sur: number; date: string | null }) {
  return (
    <div className="flex flex-[1_1_240px] flex-col justify-between gap-2.5 bg-white p-5 md:p-8">
      <span className="font-display text-xs uppercase tracking-[0.2em] md:text-sm">{titre}</span>
      <span className="font-display text-[44px] font-medium leading-none md:text-[64px]">
        {nombre(note)}
        <span className="text-xl md:text-[26px]">/{sur}</span>
      </span>
      <span className="text-xs md:text-[13px]">Mesure au {dater(date)}</span>
    </div>
  );
}

export function Avis() {
  const { avis } = getAgence();

  return (
    <section aria-labelledby="h-avis" className="bg-grey-light py-14 md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-10">
        <TitreSection id="h-avis" surtitre="Avis clients" titre="Ils nous ont confié leur projet" />

        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="flex flex-[1_1_100%] flex-col gap-2.5 bg-grey-dark p-6 text-white md:flex-[1.2_1_320px] md:p-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[72px] font-medium leading-[0.9] text-gold md:text-[96px]">{nombre(avis.google.note)}</span>
              <span className="font-display text-[26px] md:text-[32px]">/5</span>
            </div>
            <span role="img" aria-label={`Note moyenne ${nombre(avis.google.note)} sur 5`} className="text-[22px] tracking-[4px] text-gold">
              ★★★★★
            </span>
            <span className="text-[15px] text-grey-light">
              {avis.google.nombre} avis Google · au {dater(avis.google.date)}
            </span>
          </div>
          <CarteNote titre="Qualitelis · Transaction" note={avis.qualitelis.transaction} sur={10} date={avis.qualitelis.date} />
          <CarteNote titre="Qualitelis · Gestion" note={avis.qualitelis.gestion} sur={10} date={avis.qualitelis.date} />
        </div>

        <RangeeDefilable libelle="Avis Google" largeurElement="w-[85%] md:w-[calc((100%-48px)/3)]">
          {EMPLACEMENTS.map((r) => (
            <figure key={r.n} className="m-0 flex h-full min-h-60 flex-col gap-[18px] bg-white p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span role="img" aria-label="Note 5 sur 5" className="text-lg tracking-[3px] text-grey-dark">
                  ★★★★★
                </span>
                <span className="font-display text-[13px] uppercase tracking-[0.14em]">Google · {r.service}</span>
              </div>
              <blockquote className="m-0 flex-1 text-base leading-normal md:text-lg">
                [Extrait de l&apos;avis Google n° {r.n}, importé automatiquement depuis le flux]
              </blockquote>
              <figcaption className="flex justify-between border-t border-grey-light pt-3.5 text-sm">
                <strong>[Prénom]</strong>
                <span>[date]</span>
              </figcaption>
            </figure>
          ))}
        </RangeeDefilable>

        <div className="flex flex-wrap justify-between gap-6 text-[13px]">
          <span>Avis issus de Google, du plus récent au plus ancien. [Mention sur le contrôle des avis à valider]</span>
          <LienFleche href={ROUTES.avis}>Lire tous les avis</LienFleche>
        </div>
      </div>
    </section>
  );
}
