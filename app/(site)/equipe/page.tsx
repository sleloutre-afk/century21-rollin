import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ListeEquipe, ListeEquipeAvecParametres } from "@/components/equipe/ListeEquipe";
import { BoutonLien } from "@/components/ui/Bouton";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeTelephone } from "@/components/ui/Icones";
import { getAgence, getMembres, getPoles } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";
import { metaPage } from "@/lib/seo";

/**
 * « L'équipe » (brief prompt 7 ; maquette EquipeDesktop, EquipeMobile).
 * Noms publiés (décision de Simon, 19/11/2026) ; portraits et photo d’équipe repris de l’agence (20/11/2026).
 */

export const metadata: Metadata = metaPage({
  titre: "L'équipe",
  description: "Direction, transaction, suivi des ventes, location, gestion locative, accueil : un spécialiste pour chaque besoin, aux Chartrons.",
  chemin: "/equipe",
});

export default function PageEquipe() {
  const agence = getAgence();
  const props = { poles: getPoles(), membres: getMembres() };

  return (
    <>
      <FilAriane etapes={[{ libelle: "L'équipe" }]} />

      <section aria-labelledby="h1-equipe" className="bg-grey-dark py-12 text-white md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center gap-8 md:gap-16">
          <div className="flex flex-[1_1_480px] flex-col gap-4 md:gap-5">
            <p className="m-0 font-display text-[13px] uppercase tracking-[0.26em] text-gold md:text-sm md:tracking-[0.28em]">L&apos;équipe</p>
            <h1 id="h1-equipe" className="m-0 text-[38px] font-medium uppercase leading-none md:text-[clamp(44px,4.6vw,64px)]">
              Un spécialiste pour <span className="text-gold">chaque besoin</span>
            </h1>
            <p className="m-0 max-w-[560px] text-[17px] leading-normal text-grey-light md:text-lg">
              Six pôles, un rôle précis pour chacun. Vous savez toujours à qui parler.
            </p>
          </div>
          {/* Photo de l'équipe fournie par Simon le 20/11/2026 (1000 × 666 px). */}
          <div className="relative aspect-[3/2] flex-[1_1_420px] overflow-hidden bg-grey-medium">
            <Image
              src="/images/equipe/equipe-cabinet-rollin.jpg"
              alt="L'équipe du Cabinet Rollin réunie sur un grand escalier en pierre"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Suspense fallback={<ListeEquipe {...props} />}>
        <ListeEquipeAvecParametres {...props} />
      </Suspense>

      <section aria-labelledby="h-cta-equipe" className="bg-gold py-14 md:py-[72px]">
        <div className="conteneur flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-[1_1_420px] flex-col gap-3">
            <h2 id="h-cta-equipe" className="m-0 text-[32px] font-medium uppercase leading-none md:text-[48px]">
              Un projet ? Parlons-en
            </h2>
            <p className="m-0 text-[17px] leading-normal">Nous vous orientons vers la bonne personne, dès le premier appel.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <BoutonLien href={ROUTES.estimation} variante="sombre" taille="grand">
              Estimer mon bien
            </BoutonLien>
            <a
              href={`tel:${agence.telephoneE164}`}
              className="inline-flex min-h-14 items-center gap-2.5 border border-grey-dark px-7 font-display text-lg font-medium text-grey-dark no-underline hover:bg-white"
            >
              <IconeTelephone taille={18} />
              {agence.telephone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
