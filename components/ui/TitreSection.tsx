/**
 * En-tête de section de la maquette : surtitre (capitales espacées), grand titre en capitales,
 * et à droite un court texte ou un lien. Le surtitre est or uniquement sur fond sombre.
 */

type Props = {
  surtitre: string;
  titre: string;
  id?: string;
  /** Niveau du titre : h2 par défaut (un seul h1 par page). */
  niveau?: 1 | 2;
  texte?: string;
  /** Élément affiché à droite (lien fléché, boutons…). */
  aside?: React.ReactNode;
  surFondSombre?: boolean;
};

export function TitreSection({ surtitre, titre, id, niveau = 2, texte, aside, surFondSombre = false }: Props) {
  const Balise = niveau === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="flex flex-col gap-3 md:gap-4">
        <p
          className={`m-0 font-display text-[13px] uppercase tracking-[0.26em] md:text-sm md:tracking-[0.28em] ${surFondSombre ? "text-gold" : ""}`}
        >
          {surtitre}
        </p>
        <Balise id={id} className="m-0 max-w-[760px] text-[34px] font-medium uppercase leading-none md:text-[clamp(34px,3.6vw,54px)]">
          {titre}
        </Balise>
      </div>
      {texte && (
        <p className={`m-0 max-w-[440px] text-[17px] leading-normal ${surFondSombre ? "text-grey-light" : ""}`}>{texte}</p>
      )}
      {aside}
    </div>
  );
}
