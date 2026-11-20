import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence } from "@/lib/data";
import { ROUTES } from "@/lib/navigation";

/** Aiguillage par profil (brief §7.3 ; maquette Main et Accueil-mobile-1). Textes de la maquette. */
export function Aiguillage() {
  const { chiffres } = getAgence();
  const profils: {
    n: string;
    cible: string;
    titre: string;
    texte: string;
    action: string;
    href: string;
    photo: string;
    image?: { src: string; alt: string };
    largeur: string;
  }[] = [
    {
      n: "01",
      cible: "Propriétaires vendeurs",
      titre: "Je vends",
      texte: "Une estimation par un expert de votre rue, une mise en valeur soignée, un suivi jusqu'à l'acte.",
      action: "Estimer mon bien",
      href: ROUTES.estimation,
      photo: "Photo · façade en pierre blonde",
      // Photo fournie par Simon le 20/11/2026.
      image: {
        src: "/images/accueil/facade-pierre-blonde.jpg",
        alt: "Façade bordelaise en pierre blonde, balcons en fer forgé et volets verts",
      },
      largeur: "md:flex-[1.5_1_440px]",
    },
    {
      n: "02",
      cible: "Propriétaires bailleurs",
      titre: "Je fais louer ou gérer",
      // « 600 biens gérés » et non « 600 propriétaires » : décision de Simon (19/11/2026).
      texte: `Mise en location ou gestion complète. Plus de ${chiffres.biensGeres.replace("+", "")} biens gérés par notre équipe.`,
      action: "Découvrir nos offres",
      href: ROUTES.gerer,
      photo: "Photo · intérieur, parquet et moulures",
      image: {
        src: "/images/accueil/proprietaires-bailleurs.jpg",
        alt: "Séjour lumineux avec mur en pierre, parquet et moulures",
      },
      largeur: "md:flex-[1_1_320px]",
    },
    {
      n: "03",
      cible: "Acheteurs et locataires",
      titre: "Je cherche un bien",
      texte: "Achat ou location : consultez nos biens et recevez les nouveautés par e-mail.",
      action: "Voir les biens",
      href: ROUTES.biens,
      photo: "Photo · rue Notre-Dame",
      image: {
        src: "/images/accueil/acheteurs-locataires.jpg",
        alt: "Rue commerçante bordée de façades en pierre blonde",
      },
      largeur: "md:flex-[1_1_320px]",
    },
  ];

  return (
    <section aria-labelledby="h-profil" className="py-14 md:py-24">
      <div className="conteneur flex flex-col gap-7 md:gap-14">
        <TitreSection
          id="h-profil"
          surtitre="Votre projet"
          titre="Par où commencer ?"
          texte="Trois pôles, trois équipes dédiées. Choisissez votre point de départ."
        />
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6">
          {profils.map((p) => (
            <Link
              key={p.n}
              href={p.href}
              className={`group flex gap-4 border-b border-grey-light pb-4 text-grey-dark no-underline md:flex-col md:gap-6 md:border-0 md:pb-0 ${p.largeur}`}
            >
              {p.image ? (
                <>
                  {/* Mobile : vignette sans badge (maquette Accueil-mobile-1). Desktop : photo avec badge du pôle. */}
                  <div className="relative h-[150px] w-28 flex-none overflow-hidden md:hidden">
                    <Image src={p.image.src} alt={p.image.alt} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="relative hidden h-[400px] overflow-hidden md:block">
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(min-width: 768px) 45vw, 112px"
                      className="object-cover transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045]"
                    />
                    <div className="absolute left-[18px] top-[18px]">
                      <Badge variante="pole" className="text-[13px]">
                        {p.cible}
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile : vignette « Photo » sans badge (maquette Accueil-mobile-1). */}
                  <EmplacementPhoto libelle="Photo" className="h-[150px] w-28 flex-none md:hidden" />
                  <EmplacementPhoto libelle={p.photo} className="hidden h-[400px] md:block">
                    <div className="absolute left-[18px] top-[18px]">
                      <Badge variante="pole" className="text-[13px]">
                        {p.cible}
                      </Badge>
                    </div>
                  </EmplacementPhoto>
                </>
              )}
              <div className="flex flex-col justify-center gap-1.5 md:gap-2.5">
                <span className="font-display text-xl text-grey-dark md:text-[28px]">{p.n}</span>
                <h3 className="m-0 text-[23px] font-medium uppercase leading-[1.05] md:text-[34px]">{p.titre}</h3>
                <p className="m-0 max-w-[460px] text-sm leading-[1.45] md:text-base md:leading-normal">{p.texte}</p>
                <span className="mt-1.5 self-start border-b border-grey-dark pb-0.5 text-sm font-bold md:text-[15px]">
                  {p.action} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
