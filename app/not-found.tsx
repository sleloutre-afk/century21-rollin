import { actionsParDefaut } from "@/components/layout/BarreActionsMobile";
import { GabaritSite } from "@/components/layout/GabaritSite";
import { PageErreur } from "@/components/layout/PageErreur";
import { getAgence } from "@/lib/data";

/** Page 404, avec l'en-tête et le pied de page du site. */
export default function Introuvable() {
  const { telephone, telephoneE164 } = getAgence();
  return (
    <GabaritSite actions={actionsParDefaut(telephoneE164)}>
      <PageErreur
        code="Erreur 404"
        titre="Cette page est introuvable"
        texte="Le bien a peut-être été vendu, ou la page a changé d'adresse."
        telephone={telephone}
        telephoneE164={telephoneE164}
      />
    </GabaritSite>
  );
}
