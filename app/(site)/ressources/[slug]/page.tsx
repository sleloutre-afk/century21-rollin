import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { BoutonLien } from "@/components/ui/Bouton";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { EnBref } from "@/components/ui/EnBref";
import { FilAriane } from "@/components/ui/FilAriane";
import { getArticle, getArticles, getMembres } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { donneesFaq, estRenseigne, metaPage, NOM_SITE, URL_SITE, urlAbsolue } from "@/lib/seo";

/**
 * Article (brief prompt 8 ; maquette ArticleDesktop, ArticleMobile) : un seul gabarit pour les 4 articles.
 * Titre, chapeau, auteur et date, visuel, sommaire fixe, En bref, intertitres, « Le conseil de l'agence »,
 * FAQ, appel à l'action adapté au sujet, articles liés. Balisage Article et FAQPage : lot 10.
 * Réserves retirées à la demande de Simon (19/11/2026) ; relecture de l'agence obligatoire avant mise en ligne.
 */

/** Navigation bloquante assumée : les 4 articles sont préparés à l'avance (generateStaticParams). */
export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return { title: "Article introuvable" };
  return metaPage({ titre: article.titre, description: article.chapeau, chemin: `${ROUTES.ressources}/${article.slug}` });
}

type EntreeSommaire = { n: number; id: string; h2: string };

function Sommaire({ entrees }: { entrees: EntreeSommaire[] }) {
  return (
    <ol className="m-0 flex list-none flex-col p-0">
      {entrees.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="flex min-h-11 items-center border-b border-grey-light py-2 text-[15px] text-grey-dark no-underline hover:underline">
            {t.n}. {t.h2}
          </a>
        </li>
      ))}
      <li>
        <a href="#faq" className="flex min-h-11 items-center py-2 text-[15px] text-grey-dark no-underline hover:underline">
          Questions fréquentes
        </a>
      </li>
    </ol>
  );
}

const dater = (d: string | null | undefined) =>
  d ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${d}T00:00:00`)) : "[date à fournir]";

export default async function PageArticle({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const auteur = getMembres().find((m) => m.nom === article.auteur);
  const autres = getArticles().filter((a) => a.slug !== article.slug);
  const sommaire = article.sections.map((s, i) => ({ n: i + 1, id: `s-${s.id}`, h2: s.h2 }));

  // Article (schema.org) : auteur et date seulement s'ils sont renseignés (pas d'emplacement « [à confirmer] »).
  const donneesArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    description: article.chapeau,
    inLanguage: "fr-FR",
    mainEntityOfPage: urlAbsolue(`${ROUTES.ressources}/${article.slug}`),
    ...(estRenseigne(article.auteur) ? { author: { "@type": "Person", name: article.auteur, ...(auteur ? { url: urlAbsolue(`${ROUTES.equipe}/${auteur.slug}`) } : {}) } } : {}),
    ...(article.dateMiseAJour ? { dateModified: article.dateMiseAJour } : {}),
    publisher: { "@type": "RealEstateAgent", name: NOM_SITE, url: URL_SITE },
  };

  return (
    <>
      <JsonLd donnees={donneesArticle} />
      <JsonLd donnees={donneesFaq(article.faq)} />
      <FilAriane etapes={[{ libelle: "Ressources", href: ROUTES.ressources }, { libelle: article.court }]} />

      <article aria-labelledby="h1-article">
        {/* EN-TÊTE */}
        <header className="conteneur flex max-w-[1000px]! flex-col gap-5 pb-8 pt-10 md:gap-6 md:pb-12 md:pt-16">
          <Badge variante="categorie" className="self-start">
            {article.cat}
          </Badge>
          <h1 id="h1-article" className="m-0 text-[34px] font-medium leading-[1.05] md:text-[clamp(40px,4.4vw,60px)]">
            {article.titre}
          </h1>
          <p className="m-0 text-lg leading-normal md:text-xl">{article.chapeau}</p>
          <div className="flex items-center gap-4 border-t border-grey-light pt-5">
            <span aria-hidden="true" className="size-12 flex-none rounded-full bg-grey-light" />
            <div className="flex flex-col gap-0.5 text-sm">
              <span>
                Par{" "}
                {auteur ? (
                  <Link href={`${ROUTES.equipe}/${auteur.slug}`} className="font-bold text-grey-dark">
                    {article.auteur}
                  </Link>
                ) : (
                  <strong>{article.auteur}</strong>
                )}{" "}
                · {article.role}
              </span>
              <span>
                Mis à jour le {dater(article.dateMiseAJour)} · {article.tempsLecture} min de lecture
              </span>
            </div>
          </div>
        </header>

        <div className="conteneur">
          <EmplacementPhoto libelle={article.photo} className="h-[220px] md:h-[460px]" />
        </div>

        <div className="conteneur flex flex-col gap-10 py-10 md:flex-row md:items-start md:gap-16 md:py-16">
          {/* SOMMAIRE : fixe sur grand écran, replié en tête sur téléphone */}
          <nav aria-label="Sommaire" className="hidden flex-none flex-col gap-5 md:sticky md:top-24 md:flex md:w-[300px]">
            <span className="font-display text-sm uppercase tracking-[0.2em]">Sommaire</span>
            <Sommaire entrees={sommaire} />
            <BoutonLien href={article.lienCta} variante="or" className="mt-2">
              {article.cta.btn}
            </BoutonLien>
          </nav>
          <details className="group border-y border-grey-dark md:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-sm uppercase tracking-[0.2em] [&::-webkit-details-marker]:hidden">
              Sommaire
              <span aria-hidden="true" className="text-2xl font-normal transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <nav aria-label="Sommaire" className="pb-4">
              <Sommaire entrees={sommaire} />
            </nav>
          </details>

          <div className="flex min-w-0 max-w-[760px] flex-1 flex-col gap-10 md:gap-12">
            <EnBref points={article.bref} id="bref" />

            {article.sections.map((s, i) => (
              <div key={s.id} className="flex flex-col gap-10 md:gap-12">
                <section aria-labelledby={`s-${s.id}`} className="flex flex-col gap-4">
                  <h2 id={`s-${s.id}`} className="m-0 scroll-mt-24 text-[26px] font-medium leading-tight md:text-[32px]">
                    {s.h2}
                  </h2>
                  {s.p.map((p) => (
                    <p key={p.slice(0, 40)} className="m-0 text-[17px] leading-relaxed md:text-lg">
                      {p}
                    </p>
                  ))}
                </section>
                {i + 1 === article.conseilApres && (
                  <aside aria-label="Le conseil de l'agence" className="flex flex-col gap-3 bg-grey-dark p-6 text-white md:p-8">
                    <span className="font-display text-sm uppercase tracking-[0.2em] text-gold">Le conseil de l&apos;agence</span>
                    <p className="m-0 text-lg leading-normal md:text-xl">{article.conseil}</p>
                  </aside>
                )}
              </div>
            ))}

            <section id="faq" aria-labelledby="h-faq" className="flex scroll-mt-24 flex-col gap-5 border-t-2 border-grey-dark pt-8">
              <h2 id="h-faq" className="m-0 text-[26px] font-medium leading-tight md:text-[32px]">
                Questions fréquentes
              </h2>
              {article.faq.map((f) => (
                <div key={f.q} className="flex flex-col gap-2 border-b border-grey-light pb-5">
                  <h3 className="m-0 text-xl font-medium md:text-[22px]">{f.q}</h3>
                  <p className="m-0 text-base leading-relaxed">{f.a}</p>
                </div>
              ))}
            </section>

            <aside aria-label="Passer à l'action" className="flex flex-col gap-4 bg-gold p-6 md:p-10">
              <span className="font-display text-[26px] font-medium uppercase leading-tight md:text-[32px]">{article.cta.titre}</span>
              <span className="text-[17px] leading-normal">{article.cta.texte}</span>
              <BoutonLien href={article.lienCta} variante="sombre" taille="grand" className="self-start">
                {article.cta.btn}
              </BoutonLien>
            </aside>
          </div>
        </div>
      </article>

      {/* À LIRE AUSSI */}
      <section aria-labelledby="h-lies" className="border-t border-grey-light py-14 md:py-20">
        <div className="conteneur flex flex-col gap-8">
          <h2 id="h-lies" className="m-0 text-[30px] font-medium uppercase leading-none md:text-[40px]">
            À lire aussi
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 md:gap-6">
            {autres.map((a) => (
              <li key={a.slug}>
                <Link href={`${ROUTES.ressources}/${a.slug}`} className="group flex h-full gap-4 border border-grey-light bg-white p-3 text-grey-dark no-underline md:flex-col md:p-0">
                  <EmplacementPhoto libelle={a.photo} className="h-20 w-24 flex-none md:h-[180px] md:w-auto [&_span]:hidden md:[&_span]:inline" />
                  <div className="flex flex-col gap-2 md:px-6 md:pb-6">
                    <span className="font-display text-xs uppercase tracking-[0.16em]">{a.cat}</span>
                    <span className="font-display text-lg font-medium leading-tight md:text-[22px]">{a.titre}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
