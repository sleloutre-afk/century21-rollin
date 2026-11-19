/**
 * Découpe un chiffre clé en nombre animable + reste : « 600+ » → { nombre: 600, suffixe: "+" }.
 * Si la valeur ne commence pas par un nombre (ex. « [20 ou 21 : à confirmer] »), rien n'est animé.
 */
export function decouperCompteur(valeur: string): { prefixe: string; nombre: number | null; suffixe: string } {
  // Un emplacement entre crochets n'est pas une donnée confirmée : il ne s'anime jamais.
  if (valeur.includes("[")) return { prefixe: "", nombre: null, suffixe: valeur };
  const correspondance = valeur.match(/^(\D*?)(\d[\d\s  ]*)(.*)$/);
  if (!correspondance) return { prefixe: "", nombre: null, suffixe: valeur };
  const [, prefixe, chiffres, suffixe] = correspondance;
  return { prefixe, nombre: Number(chiffres.replace(/\D/g, "")), suffixe };
}
