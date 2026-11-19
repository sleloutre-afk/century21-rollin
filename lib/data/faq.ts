import brut from "@/contenus/faq.json";
import { fichierFaqSchema, type QuestionFaq } from "@/lib/schemas/faq";
import { valider } from "./valider";

let cache: Record<string, QuestionFaq[]> | undefined;

function charger(): Record<string, QuestionFaq[]> {
  if (!cache) {
    const { _source, ...pages } = valider(fichierFaqSchema, brut, "faq.json");
    void _source;
    cache = pages as Record<string, QuestionFaq[]>;
  }
  return cache;
}

/** Questions de la FAQ d'une page (tableau vide si la page n'en a pas). */
export function getFaq(page: string): QuestionFaq[] {
  return charger()[page] ?? [];
}

export function getPagesFaq(): string[] {
  return Object.keys(charger());
}
