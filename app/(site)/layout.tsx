import { actionsParDefaut } from "@/components/layout/BarreActionsMobile";
import { GabaritSite } from "@/components/layout/GabaritSite";
import { getAgence } from "@/lib/data";

/** Pages du site : barre mobile par défaut (Appeler · Estimer · Nos biens). */
export default function GabaritPages({ children }: { children: React.ReactNode }) {
  return <GabaritSite actions={actionsParDefaut(getAgence().telephoneE164)}>{children}</GabaritSite>;
}
