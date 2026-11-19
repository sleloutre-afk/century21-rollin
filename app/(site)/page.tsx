import { Aiguillage } from "@/components/accueil/Aiguillage";
import { Avis } from "@/components/accueil/Avis";
import { BiensVendus } from "@/components/accueil/BiensVendus";
import { BlocEstimation } from "@/components/accueil/BlocEstimation";
import { Contact } from "@/components/accueil/Contact";
import { Equipe } from "@/components/accueil/Equipe";
import { Hero } from "@/components/accueil/Hero";
import { Histoire } from "@/components/accueil/Histoire";
import { NosBiens } from "@/components/accueil/NosBiens";
import { Quartiers } from "@/components/accueil/Quartiers";
import { Ressources } from "@/components/accueil/Ressources";
import { JsonLdAgence } from "@/components/seo/JsonLdAgence";
import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";

export const metadata: Metadata = {
  ...metaPage({
    titre: "Cabinet Rollin – CENTURY 21 Les Chartrons, agence immobilière à Bordeaux",
    description: "Vendre, louer, faire gérer aux Chartrons, à Bordeaux. Une équipe de spécialistes qui connaît chaque rue du quartier, depuis 1993.",
    chemin: "/",
  }),
  // Titre complet sur l'accueil (sans le suffixe ajouté aux autres pages).
  title: { absolute: "Cabinet Rollin – CENTURY 21 Les Chartrons, agence immobilière à Bordeaux" },
};

/**
 * Accueil : les 13 sections du brief (§7), dans l'ordre.
 * En-tête (1) et pied de page (13) : gabarit commun app/(site)/layout.tsx.
 */
export default function Accueil() {
  return (
    <>
      <JsonLdAgence />
      <Hero />
      <Aiguillage />
      <NosBiens />
      <BiensVendus />
      <Quartiers />
      <BlocEstimation />
      <Equipe />
      <Avis />
      <Histoire />
      <Ressources />
      <Contact />
    </>
  );
}
