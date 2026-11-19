import { ROUTES } from "@/lib/navigation";

/**
 * Champ « Adresse de votre bien » + bouton, qui ouvre le module d'estimation adresse pré-remplie
 * (pages Vendre, Biens vendus, fiche bien, Acheter). Fonctionne sans JavaScript.
 */
export function FormulaireAdresse({
  id,
  libelle = "Adresse de votre bien",
  bouton = "Estimer",
  variante = "sombre",
  projet,
  className = "",
}: {
  id: string;
  libelle?: string;
  bouton?: string;
  variante?: "sombre" | "or";
  /** Projet pré-sélectionné dans l'estimation (ex. « faire-louer »). */
  projet?: string;
  className?: string;
}) {
  const couleurs = variante === "or" ? "bg-gold text-grey-dark hover:bg-gold-dark" : "bg-grey-dark text-white hover:text-gold";
  return (
    <form action={ROUTES.estimation} method="get" className={`flex flex-col gap-2 bg-white p-2 md:flex-row md:flex-wrap ${className}`}>
      {projet && <input type="hidden" name="projet" value={projet} />}
      <label htmlFor={id} className="sr-only">
        {libelle}
      </label>
      <input
        id={id}
        name="adresse"
        type="text"
        placeholder={libelle}
        autoComplete="street-address"
        className="h-14 min-w-0 flex-[1_1_280px] border-0 px-4 text-lg text-grey-dark md:h-[60px]"
      />
      <button type="submit" className={`min-h-14 cursor-pointer px-9 font-display text-base font-semibold uppercase tracking-[0.14em] md:min-h-[60px] ${couleurs}`}>
        {bouton}
      </button>
    </form>
  );
}
