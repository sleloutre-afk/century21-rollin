import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/lib/navigation";
import type { Membre, Pole } from "@/lib/schemas/equipe";
import { PortraitMembre } from "./PortraitMembre";

/**
 * Carte d'un membre de l'équipe (accueil, Vendre, Faire louer ou gérer, Équipe).
 * Noms publiés (décision de Simon, 19/11/2026) ; portrait : photo si fournie et autorisée, sinon emplacement.
 */
export function CarteMembre({
  membre,
  pole,
  role,
  details = false,
}: {
  membre: Membre;
  pole?: Pole;
  role?: string;
  /** Page Équipe : spécialité et quartiers, affichés seulement s'ils sont connus. */
  details?: boolean;
}) {
  const texteRole = role ?? (membre.specialite ? `${membre.role} · ${membre.specialite}` : membre.role);
  return (
    <Link href={`${ROUTES.equipe}/${membre.slug}`} className="group flex flex-col gap-3.5 text-grey-dark no-underline">
      <PortraitMembre membre={membre} libelle="Portrait à fournir" tailles="(min-width: 768px) 300px, 200px" className="aspect-[4/5]">
        {pole && (
          <Badge variante="pole" className="absolute left-3.5 top-3.5">
            {pole.nom}
          </Badge>
        )}
      </PortraitMembre>
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-xl font-medium md:text-2xl">{membre.nom}</h3>
        <span className="text-sm md:text-[15px]">{details ? membre.role : texteRole}</span>
        {details && membre.specialite && <span className="text-[13px]">Spécialité : {membre.specialite}</span>}
        {details && membre.secteurs && <span className="text-[13px]">Quartiers : {membre.secteurs}</span>}
      </div>
    </Link>
  );
}
