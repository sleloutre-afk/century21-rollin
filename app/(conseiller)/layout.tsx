import { actionsFicheConseiller } from "@/components/layout/BarreActionsMobile";
import { GabaritSite } from "@/components/layout/GabaritSite";
import { getAgence } from "@/lib/data";

/**
 * Fiches conseiller : barre mobile propre à la fiche (Appeler · Prendre rendez-vous), maquette ConseillerMobile.
 * « Appeler » compose le standard de l'agence tant que les lignes directes ne sont pas fournies.
 */
export default function GabaritConseiller({ children }: { children: React.ReactNode }) {
  return <GabaritSite actions={actionsFicheConseiller(getAgence().telephoneE164, "#rendez-vous")}>{children}</GabaritSite>;
}
