import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getMembres, getPoles } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import type { Membre, Pole } from "@/lib/schemas/equipe";

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

function CarteMembre({ membre, pole }: { membre: Membre; pole?: Pole }) {
  const role = membre.specialite ? `${membre.role} · ${membre.specialite}` : membre.role;
  return (
    <Link href={`${ROUTES.equipe}/${membre.slug}`} className="group flex flex-col gap-3.5 text-grey-dark no-underline">
      <EmplacementPhoto libelle="Portrait à fournir" className="aspect-[4/5]">
        {pole && (
          <Badge variante="pole" className="absolute left-3.5 top-3.5">
            {pole.nom}
          </Badge>
        )}
      </EmplacementPhoto>
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-xl font-medium md:text-2xl">{membre.nom}</h3>
        <span className="text-sm md:text-[15px]">{role}</span>
      </div>
    </Link>
  );
}

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
