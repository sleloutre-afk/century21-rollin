import Link from "next/link";
import { ROUTES } from "@/lib/navigation";

/** Contenu des pages 404 et 500, aux couleurs du site (dans l'en-tête et le pied de page habituels). */
export function PageErreur({
  code,
  titre,
  texte,
  action,
  telephone,
  telephoneE164,
}: {
  code: string;
  titre: string;
  texte: string;
  action?: React.ReactNode;
  telephone: string;
  telephoneE164: string;
}) {
  return (
    <section aria-labelledby="h1-erreur" className="bg-grey-dark py-20 text-white md:py-32">
      <div className="conteneur flex flex-col gap-6">
        <p className="m-0 font-display text-sm uppercase tracking-[0.28em] text-gold">{code}</p>
        <h1 id="h1-erreur" className="m-0 max-w-[820px] text-[40px] font-medium uppercase leading-none md:text-6xl">
          {titre}
        </h1>
        <p className="m-0 max-w-[560px] text-lg leading-normal text-grey-light">{texte}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          {action}
          <Link href={ROUTES.achat} className="inline-flex min-h-14 items-center bg-gold px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-grey-dark no-underline hover:bg-gold-dark">
            Voir nos biens
          </Link>
          <Link href="/" className="inline-flex min-h-14 items-center border border-white px-8 font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-white no-underline hover:border-gold hover:text-gold">
            Retour à l&apos;accueil
          </Link>
        </div>
        <p className="m-0 pt-4 text-[15px] text-grey-light">
          Besoin d&apos;aide ?{" "}
          <a href={`tel:${telephoneE164}`} className="font-bold text-gold">
            {telephone}
          </a>
        </p>
      </div>
    </section>
  );
}
