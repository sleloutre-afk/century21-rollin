import { SECTEURS_AVEC_PAGE } from "@/lib/schemas/communs";
import { getAgence } from "./agence";
import { getAnnonces } from "./annonces";
import { getArticles } from "./articles";
import { getMembres, getPoles } from "./equipe";
import { getPagesFaq } from "./faq";
import { getSecteurs } from "./quartiers";

function doublons(valeurs: string[]): string[] {
  return [...new Set(valeurs.filter((v, i) => valeurs.indexOf(v) !== i))];
}

/**
 * Valide les 5 fichiers de contenus/ (chacun avec son schéma), puis les liens entre eux.
 * Appelée par le gabarit racine : si un fichier est invalide, le build échoue.
 */
export function verifierContenus() {
  const agence = getAgence();
  const annonces = getAnnonces();
  const articles = getArticles();
  const poles = getPoles();
  const membres = getMembres();
  const secteurs = getSecteurs();
  const pagesFaq = getPagesFaq();

  const problemes: string[] = [];
  const slugsMembres = new Set(membres.map((m) => m.slug));

  for (const slug of doublons(annonces.map((a) => a.slug))) problemes.push(`annonces.json : slug en double « ${slug} »`);
  for (const slug of doublons(membres.map((m) => m.slug))) problemes.push(`equipe.json : slug en double « ${slug} »`);
  for (const id of doublons(poles.map((p) => p.id))) problemes.push(`equipe.json : pôle en double « ${id} »`);
  for (const slug of doublons(secteurs.map((s) => s.slug))) problemes.push(`quartiers.json : secteur en double « ${slug} »`);
  for (const slug of doublons(articles.map((a) => a.slug))) problemes.push(`articles.json : adresse d'article en double « ${slug} »`);

  const polesDeclares = new Set(poles.map((p) => p.id));
  for (const m of membres) {
    if (!polesDeclares.has(m.pole)) problemes.push(`equipe.json : « ${m.slug} » appartient au pôle inconnu « ${m.pole} »`);
  }

  for (const a of annonces) {
    if (a.conseiller && !slugsMembres.has(a.conseiller)) {
      problemes.push(`annonces.json : « ${a.slug} » cite un conseiller inconnu « ${a.conseiller} »`);
    }
  }

  for (const s of secteurs) {
    if (s.auteur && !slugsMembres.has(s.auteur)) problemes.push(`quartiers.json : « ${s.slug} » cite un auteur inconnu « ${s.auteur} »`);
    if (s.conseillerReferent && !slugsMembres.has(s.conseillerReferent)) {
      problemes.push(`quartiers.json : « ${s.slug} » cite un conseiller inconnu « ${s.conseillerReferent} »`);
    }
  }

  const manquants = SECTEURS_AVEC_PAGE.filter((slug) => !secteurs.some((s) => s.slug === slug));
  if (manquants.length > 0) problemes.push(`quartiers.json : secteurs manquants (${manquants.join(", ")})`);

  if (problemes.length > 0) {
    throw new Error(`Contenus incohérents :\n${problemes.map((p) => `  - ${p}`).join("\n")}`);
  }

  return {
    agence: agence.nomTexte,
    annonces: annonces.length,
    articles: articles.length,
    membres: membres.length,
    poles: poles.length,
    secteurs: secteurs.length,
    pagesFaq: pagesFaq.length,
  };
}
