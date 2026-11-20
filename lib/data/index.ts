/**
 * Point d'entrée unique des données du site.
 * Les pages importent d'ici, jamais directement contenus/*.json : demain, ces fonctions
 * liront un back-office ou le logiciel de l'agence sans que les pages changent.
 */
export { getAgence } from "./agence";
export { getAnnonce, getAnnonces } from "./annonces";
export { getAvis } from "./avis";
export { getArticle, getArticles, type ArticleNumerote } from "./articles";
export { getMembre, getMembres, getPoles } from "./equipe";
export { getFaq, getPagesFaq } from "./faq";
export { getLocalisations, getSecteur, getSecteurs } from "./quartiers";
export { getVentesPubliees } from "./ventes";
export { verifierContenus } from "./verifier";
