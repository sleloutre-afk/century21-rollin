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

/**
 * Accueil : les 13 sections du brief (§7), dans l'ordre.
 * En-tête (1) et pied de page (13) : gabarit commun app/(site)/layout.tsx.
 */
export default function Accueil() {
  return (
    <>
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
