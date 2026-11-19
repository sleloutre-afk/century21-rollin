/**
 * Limitation du nombre d'envois par visiteur (protection anti-spam, spec §6).
 * À VALIDER : compteur gardé en mémoire du serveur. Sur un hébergement à plusieurs instances
 * (Vercel), chaque instance a son propre compteur : suffisant pour la démonstration,
 * à remplacer par un stockage partagé (ou la protection de l'outil d'envoi) en production.
 */

const FENETRE_MS = 10 * 60 * 1000;
const MAX_ENVOIS = 5;

const envois = new Map<string, number[]>();

/** Renvoie `true` si l'envoi est autorisé, et l'enregistre. */
export function autoriserEnvoi(cle: string, maintenant: number): boolean {
  const recents = (envois.get(cle) ?? []).filter((t) => maintenant - t < FENETRE_MS);
  if (recents.length >= MAX_ENVOIS) {
    envois.set(cle, recents);
    return false;
  }
  recents.push(maintenant);
  envois.set(cle, recents);
  return true;
}
