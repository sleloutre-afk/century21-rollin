import brut from "@/contenus/articles.json";
import { fichierArticlesSchema, type Article } from "@/lib/schemas/article";
import { valider } from "./valider";

export type ArticleNumerote = Article & { numero: number };

let cache: ArticleNumerote[] | undefined;

/** Les articles, dans l'ordre de leur numéro. */
export function getArticles(): ArticleNumerote[] {
  cache ??= Object.entries(valider(fichierArticlesSchema, brut, "articles.json").articles)
    .map(([numero, article]) => ({ ...article, numero: Number(numero) }))
    .sort((a, b) => a.numero - b.numero);
  return cache;
}
