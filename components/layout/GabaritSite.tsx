import { BarreActionsMobile, type ActionMobile } from "./BarreActionsMobile";
import { EnTete } from "./EnTete";
import { PiedDePage } from "./PiedDePage";
import { getAgence } from "@/lib/data";

/**
 * Gabarit commun des pages : lien d'évitement, en-tête, contenu, pied de page, barre d'actions mobile.
 * Chaque groupe de pages choisit sa barre mobile (par défaut, fiche bien, fiche conseiller — spec §9).
 */
export function GabaritSite({ actions, children }: { actions: ActionMobile[]; children: React.ReactNode }) {
  const agence = getAgence();
  // Résumé des horaires de contenus/agence.json (lundi – jeudi, vendredi), comme dans la maquette.
  const ligneUtilitaire = `${agence.adresse.rue}, ${agence.adresse.ville} · Du lundi au vendredi`;

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#contenu"
        className="sr-only z-[70] bg-grey-dark px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <EnTete telephone={agence.telephone} telephoneE164={agence.telephoneE164} ligneUtilitaire={ligneUtilitaire} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
      <BarreActionsMobile actions={actions} />
    </div>
  );
}
