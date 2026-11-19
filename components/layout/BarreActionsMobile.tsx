import Link from "next/link";
import { IconeCalendrier, IconeLoupe, IconeMaison, IconeTelephone, IconeVisite } from "@/components/ui/Icones";
import { ROUTES } from "@/lib/navigation";

/**
 * Barre d'actions fixe en bas d'écran, petits écrans uniquement (spec §9) :
 * - par défaut : Appeler · Estimer · Nos biens ;
 * - fiche bien : Appeler · Demander une visite ;
 * - fiche conseiller : Appeler · Prendre rendez-vous.
 */

type Icone = "telephone" | "maison" | "loupe" | "visite" | "calendrier";

export type ActionMobile = {
  libelle: string;
  href: string;
  icone: Icone;
  /** Action mise en avant (fond or). */
  principale?: boolean;
};

const ICONES: Record<Icone, React.ComponentType<{ taille?: number }>> = {
  telephone: IconeTelephone,
  maison: IconeMaison,
  loupe: IconeLoupe,
  visite: IconeVisite,
  calendrier: IconeCalendrier,
};

export function actionsParDefaut(telephoneE164: string): ActionMobile[] {
  return [
    { libelle: "Appeler", href: `tel:${telephoneE164}`, icone: "telephone" },
    { libelle: "Estimer", href: ROUTES.estimation, icone: "maison", principale: true },
    { libelle: "Nos biens", href: ROUTES.biens, icone: "loupe" },
  ];
}

export function actionsFicheBien(telephoneE164: string, ancreVisite = "#visite"): ActionMobile[] {
  return [
    { libelle: "Appeler", href: `tel:${telephoneE164}`, icone: "telephone" },
    { libelle: "Demander une visite", href: ancreVisite, icone: "visite", principale: true },
  ];
}

export function actionsFicheConseiller(telephoneE164: string, ancreRendezVous = "#rendez-vous"): ActionMobile[] {
  return [
    { libelle: "Appeler", href: `tel:${telephoneE164}`, icone: "telephone" },
    { libelle: "Prendre rendez-vous", href: ancreRendezVous, icone: "calendrier", principale: true },
  ];
}

export function BarreActionsMobile({ actions, fixe = true }: { actions: ActionMobile[]; fixe?: boolean }) {
  const position = fixe ? "fixed inset-x-0 bottom-0 z-[60] md:hidden" : "relative";
  return (
    <nav
      aria-label="Actions rapides"
      className={`${position} grid border-t border-gold bg-grey-dark pb-[env(safe-area-inset-bottom)]`}
      style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}
    >
      {actions.map((action) => {
        const Icone = ICONES[action.icone];
        const couleurs = action.principale ? "bg-gold text-grey-dark font-semibold" : "text-white";
        const classes = `flex h-[72px] flex-col items-center justify-center gap-1 font-display text-[13px] uppercase tracking-[0.12em] no-underline ${couleurs}`;
        const contenu = (
          <>
            <Icone taille={22} />
            {action.libelle}
          </>
        );
        return action.href.startsWith("tel:") || action.href.startsWith("#") ? (
          <a key={action.libelle} href={action.href} className={classes}>
            {contenu}
          </a>
        ) : (
          <Link key={action.libelle} href={action.href} className={classes}>
            {contenu}
          </Link>
        );
      })}
    </nav>
  );
}
