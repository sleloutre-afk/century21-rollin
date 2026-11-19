import { CarteBien } from "@/components/biens/CarteBien";
import { MiniMoteur } from "@/components/biens/MiniMoteur";
import { BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { TitreSection } from "@/components/ui/TitreSection";
import { slugsNouveaux } from "@/lib/biens/nouveaux";
import { getAnnonces, getLocalisations } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/**
 * « Nos coups de cœur » (brief §7.4 ; maquette Main et Accueil-mobile-1).
 * Sélection : annonces cochées « coup de cœur » et encore en vente (5 sur desktop, 2 sur mobile).
 */
export async function NosBiens() {
  const nouveaux = await slugsNouveaux();
  const annonces = getAnnonces();
  const enVente = annonces.filter((a) => a.transaction === "vente" && a.statut === "en_vente");
  const selection = enVente.filter((a) => a.coupDeCoeur).slice(0, 5);
  const localisations = getLocalisations().map(({ id, nom }) => ({ id, nom }));

  return (
    <section id="biens" aria-labelledby="h-biens" className="border-t border-grey-light py-14 md:py-24">
      <div className="conteneur flex flex-col gap-6 md:gap-10">
        <TitreSection
          id="h-biens"
          surtitre="Nos biens"
          titre="Nos coups de cœur"
          aside={
            <LienFleche href={ROUTES.biens} className="hidden md:inline-block">
              Voir tous nos biens
            </LienFleche>
          }
        />
        <MiniMoteur localisations={localisations} />

        <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-8">
          {selection.map((annonce, i) => (
            <div
              key={annonce.slug}
              className={[
                i === 0 ? "md:flex-[2_1_640px]" : "md:flex-[1_1_340px]",
                i >= 2 ? "hidden md:block" : "",
              ].join(" ")}
            >
              <CarteBien annonce={annonce} format={i < 2 ? "grande" : "standard"} nouveau={nouveaux.includes(annonce.slug)} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
          <BoutonLien href={ROUTES.achat} variante="sombre" taille="grand" pleineLargeur className="md:w-auto">
            Voir les {enVente.length} biens en vente
          </BoutonLien>
          <BoutonLien href={`${ROUTES.biens}#alerte`} variante="contour" taille="grand" className="border-0 underline md:border md:no-underline">
            Créer une alerte e-mail
          </BoutonLien>
        </div>
      </div>
    </section>
  );
}
