import { CarteMembre } from "@/components/equipe/CarteMembre";
import { LienFleche } from "@/components/ui/Bouton";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getMembres, getPoles } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import type { Membre } from "@/lib/schemas/equipe";

/**
 * « Un spécialiste pour chaque besoin » (brief §7.8 ; maquette Accueil-desktop-2 et Accueil-mobile-2).
 * Sélection de la maquette : 8 personnes (4 sur mobile). Noms publiés (décision de Simon, 19/11/2026).
 * Portraits : emplacements tant que les photos ne sont pas fournies.
 */

const SELECTION = [
  "dominique-rollin",
  "myriam-rollin",
  "gregory-coutant",
  "gwendoline-delaire",
  "mely-potet",
  "elodie-fournier",
  "gwenaelle-aubin",
  "cecile-boirie",
];

export function Equipe() {
  const poles = getPoles();
  const parSlug = new Map(getMembres().map((m) => [m.slug, m]));
  const membres = SELECTION.map((slug) => parSlug.get(slug)).filter((m): m is Membre => !!m);
  const pole = (m: Membre) => poles.find((p) => p.id === m.pole);

  return (
    <section id="equipe" aria-labelledby="h-equipe" className="py-14 md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-10">
        <TitreSection
          id="h-equipe"
          surtitre="L'équipe"
          titre="Un spécialiste pour chaque besoin"
          texte="Transaction, location, gestion, suivi des ventes : chacun son rôle, tous au service de votre projet."
        />
        <ul aria-label="Nos pôles" className="m-0 hidden list-none flex-wrap gap-2.5 p-0 md:flex">
          {poles.map((p) => (
            <li key={p.id} className="border border-grey-dark px-4 py-2.5 font-display text-sm uppercase tracking-[0.14em]">
              {p.nom}
            </li>
          ))}
        </ul>

        <ul className="m-0 hidden list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-8 p-0 md:grid">
          {membres.map((m) => (
            <li key={m.slug}>
              <CarteMembre membre={m} pole={pole(m)} />
            </li>
          ))}
        </ul>
        <div className="md:hidden">
          <RangeeDefilable libelle="Membres de l'équipe" largeurElement="w-[200px]" fleches={false}>
            {membres.slice(0, 4).map((m) => (
              <CarteMembre key={m.slug} membre={m} pole={pole(m)} />
            ))}
          </RangeeDefilable>
        </div>

        <LienFleche href={ROUTES.equipe}>Rencontrer toute l&apos;équipe</LienFleche>
      </div>
    </section>
  );
}
