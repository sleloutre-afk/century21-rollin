import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { LienFleche } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { TitreSection } from "@/components/ui/TitreSection";
import { getArticles } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * « Les guides du propriétaire » (brief §7.11) : les 3 premiers articles.
 * Auteur, temps de lecture (calculé) et date de mise à jour (« [date à fournir] » tant qu'elle manque).
 */

const dater = (d: string | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${d}T00:00:00`)) : "[date à fournir]";

export function Ressources() {
  const articles = getArticles().slice(0, 3);

  return (
    <section id="ressources" aria-labelledby="h-ressources" className="py-14 md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-12">
        <TitreSection
          id="h-ressources"
          surtitre="Ressources"
          titre="Les guides du propriétaire"
          aside={
            <LienFleche href={ROUTES.ressources} className="hidden md:inline-block">
              Toutes les ressources
            </LienFleche>
          }
        />
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`${ROUTES.ressources}/${a.slug}`}
                className="group flex gap-4 border-b border-grey-light pb-5 text-grey-dark no-underline md:flex-col md:gap-[18px] md:border-0 md:pb-0"
              >
                <EmplacementPhoto libelle={a.photo} className="h-24 w-24 flex-none md:h-[250px] md:w-auto [&_span]:hidden md:[&_span]:inline" />
                <div className="flex flex-col gap-2 md:gap-[18px]">
                  <Badge variante="categorie" className="self-start">
                    {a.cat}
                  </Badge>
                  <h3 className="m-0 text-lg font-medium leading-[1.12] md:text-[26px]">{a.titre}</h3>
                  <span className="text-[13px] md:text-sm">
                    Par {a.auteur} · {a.tempsLecture} min · Mis à jour le {dater(a.dateMiseAJour)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <LienFleche href={ROUTES.ressources} className="md:hidden">
          Toutes les ressources
        </LienFleche>
      </div>
    </section>
  );
}
