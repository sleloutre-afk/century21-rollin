import type { Annonce } from "@/lib/schemas/annonce";

/**
 * Étiquettes DPE et GES (maquette FicheDesktop) : échelle A à G aux couleurs réglementaires,
 * la classe du bien est signalée par un repère. Classe non fournie : « [à fournir] », aucune ligne signalée.
 */

type Classe = NonNullable<Annonce["dpe"]["classe"]>;
const CLASSES: Classe[] = ["A", "B", "C", "D", "E", "F", "G"];

// Classes complètes (et non construites) pour que Tailwind les génère.
const FONDS = {
  dpe: ["bg-dpe-a", "bg-dpe-b", "bg-dpe-c", "bg-dpe-d", "bg-dpe-e", "bg-dpe-f", "bg-dpe-g"],
  ges: ["bg-ges-a", "bg-ges-b", "bg-ges-c", "bg-ges-d", "bg-ges-e", "bg-ges-f", "bg-ges-g"],
};
// Texte lisible sur chaque fond (repris de la maquette).
const TEXTES = {
  dpe: (i: number) => (i === 6 ? "text-white" : "text-grey-dark"),
  ges: (i: number) => (i < 2 ? "text-grey-dark" : "text-white"),
};

export function EtiquetteEnergie({ type, classe, valeur }: { type: "dpe" | "ges"; classe: Classe | null; valeur: number | null }) {
  const titre = type === "dpe" ? "DPE · consommation énergétique" : "GES · émissions de gaz à effet de serre";
  const unite = type === "dpe" ? "kWh/m²/an" : "kg CO₂/m²/an";
  return (
    <figure className="m-0 flex flex-[1_1_280px] flex-col gap-1.5">
      <figcaption className="mb-2 text-sm">
        {titre} · classe <strong>{classe ?? "[à fournir]"}</strong>
        {valeur !== null && ` (${new Intl.NumberFormat("fr-FR").format(valeur)} ${unite})`}
      </figcaption>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0" aria-hidden="true">
        {CLASSES.map((c, i) => {
          const actif = c === classe;
          return (
            <li key={c} className="flex items-center gap-3">
              <span
                className={`flex h-[30px] items-center px-3 font-display text-xl font-bold ${FONDS[type][i]} ${TEXTES[type](i)} ${actif ? "outline-2 outline-offset-2 outline-grey-dark" : ""}`}
                style={{ width: `${34 + i * 11}%` }}
              >
                {c}
              </span>
              {actif && <span className="font-display text-base font-semibold">◀ Ce bien</span>}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
