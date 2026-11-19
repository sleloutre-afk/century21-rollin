import { getAgence, getSecteurs } from "@/lib/data";
import { NOM_SITE, URL_SITE } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * L'agence (RealEstateAgent) : accueil, L'agence, Contact.
 * Sans note Google (date non fournie, et étoiles auto-déclarées non retenues par Google) ni horaires (à confirmer).
 */
export function JsonLdAgence() {
  const agence = getAgence();
  return (
    <JsonLd
      donnees={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "@id": `${URL_SITE}/#agence`,
        name: NOM_SITE,
        url: URL_SITE,
        telephone: agence.telephoneE164,
        foundingDate: "1993",
        address: {
          "@type": "PostalAddress",
          streetAddress: agence.adresse.rue,
          postalCode: agence.adresse.codePostal,
          addressLocality: agence.adresse.ville,
          addressCountry: "FR",
        },
        areaServed: getSecteurs().map((s) => ({ "@type": "Place", name: `${s.nom}, Bordeaux` })),
      }}
    />
  );
}
