import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { ROUTES } from "@/lib/navigation";
import type { Membre, Pole } from "@/lib/schemas/equipe";

/**
 * Carte d'un membre de l'équipe (accueil, Vendre, Faire louer ou gérer, Équipe).
 * Noms publiés (décision de Simon, 19/11/2026) ; portrait : emplacement tant que la photo n'est pas fournie.
 */
export function CarteMembre({ membre, pole, role }: { membre: Membre; pole?: Pole; role?: string }) {
  const texteRole = role ?? (membre.specialite ? `${membre.role} · ${membre.specialite}` : membre.role);
  return (
    <Link href={`${ROUTES.equipe}/${membre.slug}`} className="group flex flex-col gap-3.5 text-grey-dark no-underline">
      <EmplacementPhoto libelle="Portrait à fournir" className="aspect-[4/5]">
        {pole && (
          <Badge variante="pole" className="absolute left-3.5 top-3.5">
            {pole.nom}
          </Badge>
        )}
      </EmplacementPhoto>
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-xl font-medium md:text-2xl">{membre.nom}</h3>
        <span className="text-sm md:text-[15px]">{texteRole}</span>
      </div>
    </Link>
  );
}
