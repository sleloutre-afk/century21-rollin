import { FilAriane } from "@/components/ui/FilAriane";

/**
 * Gabarit des pages légales (honoraires, mentions légales, confidentialité, cookies).
 * Structure et emplacements uniquement : aucun texte juridique n'est rédigé ici (CLAUDE.md, règles 1 et 4).
 * À VALIDER : contenus à fournir par l'agence ou son juriste avant la mise en ligne.
 */

export type RubriqueLegale = { titre: string; contenu: React.ReactNode };

export function PageLegale({ titre, chapeau, rubriques }: { titre: string; chapeau: React.ReactNode; rubriques: RubriqueLegale[] }) {
  return (
    <>
      <FilAriane etapes={[{ libelle: titre }]} />
      <div className="conteneur flex max-w-[960px]! flex-col gap-10 py-10 md:gap-12 md:py-16">
        <div className="flex flex-col gap-5">
          <h1 className="m-0 text-[38px] font-medium uppercase leading-none md:text-[56px]">{titre}</h1>
          <div className="m-0 max-w-[720px] text-[17px] leading-relaxed">{chapeau}</div>
        </div>
        {rubriques.map((r, i) => (
          <section key={r.titre} aria-labelledby={`rubrique-${i}`} className="flex flex-col gap-4 border-t border-grey-light pt-8">
            <h2 id={`rubrique-${i}`} className="m-0 text-2xl font-medium uppercase leading-tight md:text-[28px]">
              {r.titre}
            </h2>
            <div className="flex flex-col gap-3 text-base leading-relaxed">{r.contenu}</div>
          </section>
        ))}
      </div>
    </>
  );
}

/** Liste « libellé : valeur » des pages légales. */
export function ListeLegale({ lignes }: { lignes: [string, string][] }) {
  return (
    <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[minmax(200px,auto)_1fr]">
      {lignes.map(([cle, valeur]) => (
        <div key={cle} className="contents">
          <dt className="font-bold">{cle}</dt>
          <dd className="m-0">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}
