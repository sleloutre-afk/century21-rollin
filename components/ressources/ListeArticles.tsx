"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";

/**
 * Liste des articles avec filtres par catégorie (maquette RessourcesDesktop, RessourcesMobile).
 * Catégorie dans l'adresse de la page (?categorie=vendre). Sans filtre : article « à la une » puis la grille.
 */

export type ApercuArticle = {
  slug: string;
  cat: string;
  filtre: string[];
  titre: string;
  chapeau: string;
  auteur: string;
  date: string;
  minutes: number;
  photo: string;
};

const CATEGORIES = [
  { id: "vendre", libelle: "Vendre" },
  { id: "louer", libelle: "Louer" },
  { id: "faire-gerer", libelle: "Faire gérer" },
  { id: "quartiers", libelle: "Quartiers" },
];

export function ListeArticlesAvecParametres({ articles }: { articles: ApercuArticle[] }) {
  const parametres = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const categorie = parametres.get("categorie") ?? "";
  return (
    <ListeArticles
      articles={articles}
      categorie={CATEGORIES.some((c) => c.id === categorie) ? categorie : ""}
      onChange={(c) => router.replace(c ? `${chemin}?categorie=${c}` : chemin, { scroll: false })}
    />
  );
}

function Meta({ a }: { a: ApercuArticle }) {
  return (
    <span className="text-[13px] md:text-sm">
      {a.auteur} · {a.minutes} min · Mis à jour le {a.date}
    </span>
  );
}

export function ListeArticles({ articles, categorie = "", onChange }: { articles: ApercuArticle[]; categorie?: string; onChange?: (c: string) => void }) {
  const libelle = CATEGORIES.find((c) => c.id === categorie)?.libelle;
  const [une, ...autres] = articles;
  const grille = libelle ? articles.filter((a) => a.filtre.includes(libelle)) : autres;
  const total = libelle ? grille.length : articles.length;

  const puce = (id: string, texte: string) => (
    <button
      key={id || "tous"}
      type="button"
      aria-pressed={categorie === id}
      onClick={() => onChange?.(id)}
      className={`min-h-12 flex-none cursor-pointer border border-grey-dark px-[18px] text-[15px] ${categorie === id ? "bg-grey-dark text-white" : "bg-white text-grey-dark"}`}
    >
      {texte}
    </button>
  );

  return (
    <>
      {!libelle && une && (
        <Link href={`/ressources/${une.slug}`} className="group flex flex-col bg-grey-dark text-white no-underline md:flex-row">
          <EmplacementPhoto libelle={une.photo} surFondSombre className="h-[220px] md:h-auto md:min-h-[420px] md:flex-[1.3_1_0]" />
          <div className="flex flex-col justify-center gap-4 p-6 md:flex-1 md:p-12">
            <span className="font-display text-[13px] uppercase tracking-[0.2em] text-gold">À la une · {une.cat}</span>
            <h2 className="m-0 text-[28px] font-medium leading-[1.08] md:text-[40px]">{une.titre}</h2>
            <p className="m-0 hidden text-base leading-normal text-grey-light md:block">{une.chapeau}</p>
            <span className="text-sm text-grey-light">
              {une.auteur} · Mis à jour le {une.date}
            </span>
            <span className="self-start border-b border-gold pb-0.5 text-[15px] font-bold">
              Lire l&apos;article <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      )}

      <div className="sticky top-16 z-30 -mx-6 border-b border-grey-light bg-white px-6 md:mx-0 md:px-0">
        <div role="group" aria-label="Filtrer par catégorie" className="flex items-center gap-2.5 overflow-x-auto py-4">
          <span className="hidden text-[15px] md:inline">Catégorie :</span>
          {puce("", "Tous")}
          {CATEGORIES.map((c) => puce(c.id, c.libelle))}
          <span role="status" className="ml-auto hidden flex-none text-sm md:inline">
            {total} article{total > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 md:grid-cols-3 md:gap-y-12">
        {grille.map((a) => (
          <li key={a.slug}>
            <Link href={`/ressources/${a.slug}`} className="group flex gap-4 border-b border-grey-light pb-6 text-grey-dark no-underline md:flex-col md:gap-[18px] md:border-0 md:pb-0">
              <EmplacementPhoto libelle={a.photo} className="h-24 w-24 flex-none md:h-[250px] md:w-auto [&_span]:hidden md:[&_span]:inline" />
              <div className="flex flex-col gap-2 md:gap-3">
                <Badge variante="categorie" className="self-start">
                  {a.cat}
                </Badge>
                <h2 className="m-0 text-lg font-medium leading-[1.12] md:text-[26px]">{a.titre}</h2>
                <Meta a={a} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
