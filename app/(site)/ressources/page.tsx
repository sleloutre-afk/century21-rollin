import type { Metadata } from "next";
import { Suspense } from "react";
import { FormulaireLettre } from "@/components/formulaires/FormulaireLettre";
import { ListeArticles, ListeArticlesAvecParametres, type ApercuArticle } from "@/components/ressources/ListeArticles";
import { FilAriane } from "@/components/ui/FilAriane";
import { getArticles } from "@/lib/data";

/**
 * « Ressources » (brief prompt 8 ; maquette RessourcesDesktop, RessourcesMobile) : guides du propriétaire,
 * filtres par catégorie, lettre d'information. Articles publiés depuis contenus/articles.json (back-office plus tard).
 */

export const metadata: Metadata = {
  title: "Les guides du propriétaire",
  description: "Vendre, louer, faire gérer, comprendre le quartier : des réponses courtes, écrites par l'équipe de Cabinet Rollin – CENTURY 21 Les Chartrons.",
};

const dater = (d: string | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${d}T00:00:00`)) : "[date à fournir]";

export default function PageRessources() {
  const articles: ApercuArticle[] = getArticles().map((a) => ({
    slug: a.slug,
    cat: a.cat,
    filtre: a.filtre,
    titre: a.titre,
    chapeau: a.chapeau,
    auteur: a.auteur,
    date: dater(a.dateMiseAJour),
    minutes: a.tempsLecture,
    photo: a.photo,
  }));

  return (
    <>
      <FilAriane etapes={[{ libelle: "Ressources" }]} />
      <div className="conteneur flex flex-col gap-8 py-10 md:gap-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em]">Ressources</p>
            <h1 className="m-0 text-[40px] font-medium uppercase leading-none md:text-6xl">Les guides du propriétaire</h1>
          </div>
          <p className="m-0 max-w-[480px] text-[17px] leading-normal">
            Vendre, louer, faire gérer, comprendre le quartier : des réponses courtes, écrites par notre équipe.
          </p>
        </div>
        <Suspense fallback={<ListeArticles articles={articles} />}>
          <ListeArticlesAvecParametres articles={articles} />
        </Suspense>
      </div>

      <section aria-labelledby="h-lettre" className="bg-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <div className="flex flex-[1_1_380px] flex-col gap-3">
            <h2 id="h-lettre" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[44px]">
              La lettre des propriétaires
            </h2>
            <p className="m-0 text-[17px] leading-normal">Nos nouveaux guides et les changements de réglementation, par e-mail. Désinscription en un clic.</p>
          </div>
          <div className="flex-[1.2_1_460px]">
            <FormulaireLettre />
          </div>
        </div>
      </section>
    </>
  );
}
