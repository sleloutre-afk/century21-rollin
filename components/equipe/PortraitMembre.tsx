import Image from "next/image";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import type { Membre } from "@/lib/schemas/equipe";

/**
 * Portrait d'un membre : la photo si elle existe et que sa publication est autorisée,
 * sinon l'emplacement gris étiqueté. Le badge (enfants) se place par-dessus.
 * Photos reprises du site actuel de l'agence (décision de Simon, 20/11/2026) : petite taille (300 à 460 px de large).
 */
export function PortraitMembre({
  membre,
  libelle,
  tailles,
  className = "",
  children,
}: {
  membre: Membre;
  libelle: string;
  /** Attribut sizes de l'image (largeur affichée selon l'écran). */
  tailles: string;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!membre.photo || !membre.accordPublication) {
    return (
      <EmplacementPhoto libelle={libelle} className={className}>
        {children}
      </EmplacementPhoto>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-grey-light ${className}`}>
      <Image
        src={membre.photo}
        alt={`Portrait de ${membre.nom}`}
        fill
        sizes={tailles}
        className="object-cover object-top transition-transform duration-800 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045]"
      />
      {children}
    </div>
  );
}
