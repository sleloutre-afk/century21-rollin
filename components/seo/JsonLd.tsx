/**
 * Données structurées (JSON-LD) lues par les moteurs de recherche et les moteurs IA.
 * Règle de la spec (§8) : uniquement des informations affichées sur la page.
 */
export function JsonLd({ donnees }: { donnees: object | null }) {
  if (!donnees) return null;
  // « < » échappé : le contenu ne peut pas refermer la balise <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, "\\u003c") }} />;
}
