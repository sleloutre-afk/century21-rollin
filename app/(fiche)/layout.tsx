import { actionsFicheBien } from "@/components/layout/BarreActionsMobile";
import { GabaritSite } from "@/components/layout/GabaritSite";
import { getAgence } from "@/lib/data";

/**
 * Fiches bien : barre mobile propre à la fiche (Appeler · Demander une visite), maquette FicheMobile.
 * « Appeler » compose le numéro de l'agence tant que la ligne directe du conseiller n'est pas fournie.
 */
export default function GabaritFiche({ children }: { children: React.ReactNode }) {
  return <GabaritSite actions={actionsFicheBien(getAgence().telephoneE164, "#visite")}>{children}</GabaritSite>;
}
