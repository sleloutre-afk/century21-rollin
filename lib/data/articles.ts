import brut from "@/contenus/articles.json";
import { fichierArticlesSchema, type Article } from "@/lib/schemas/article";
import { valider } from "./valider";

export type ArticleNumerote = Article & {
  numero: number;
  /** Adresse de la page : champ `slug` s'il existe, sinon tirée du titre court (décision de Simon, 19/11/2026). */
  slug: string;
  /** Temps de lecture en minutes, calculé sur le texte de l'article. */
  tempsLecture: number;
};

/** Vitesse de lecture retenue pour le calcul du temps de lecture (mots par minute). */
const MOTS_PAR_MINUTE = 230;

/** « Estimer aux Chartrons » → « estimer-aux-chartrons ». */
export function versSlug(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tempsDeLecture(article: Article): number {
  const textes = [article.chapeau, ...article.bref, ...article.sections.flatMap((s) => [s.h2, ...s.p]), article.conseil];
  const mots = textes.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
}

let cache: ArticleNumerote[] | undefined;

/** Les articles, dans l'ordre de leur numéro. */
export function getArticles(): ArticleNumerote[] {
  cache ??= Object.entries(valider(fichierArticlesSchema, brut, "articles.json").articles)
    .map(([numero, article]) => ({
      ...article,
      numero: Number(numero),
      slug: article.slug ?? versSlug(article.court),
      tempsLecture: tempsDeLecture(article),
    }))
    .sort((a, b) => a.numero - b.numero);
  return cache;
}

export function getArticle(slug: string): ArticleNumerote | undefined {
  return getArticles().find((a) => a.slug === slug);
}
