import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/lib/navigation";

/**
 * Page « introuvable » (version simple, en français). Version complète aux couleurs du site : lot 10.
 */
export default function Introuvable() {
  return (
    <main className="flex min-h-dvh flex-col bg-grey-dark text-white">
      <div className="conteneur flex h-20 items-center">
        <Logo taille="compact" surFondSombre />
      </div>
      <div className="conteneur flex flex-1 flex-col justify-center gap-6 py-16">
        <p className="m-0 font-display text-sm uppercase tracking-[0.28em] text-gold">Erreur 404</p>
        <h1 className="m-0 max-w-[820px] text-[40px] font-medium uppercase leading-none md:text-6xl">Cette page est introuvable</h1>
        <p className="m-0 max-w-[560px] text-lg leading-normal text-grey-light">
          Le bien a peut-être été vendu, ou la page a changé d&apos;adresse.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href={ROUTES.achat} className="inline-flex min-h-14 items-center bg-gold px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-gold-dark">
            Voir nos biens
          </Link>
          <Link href="/" className="inline-flex min-h-14 items-center border border-white px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white no-underline hover:border-gold hover:text-gold">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
