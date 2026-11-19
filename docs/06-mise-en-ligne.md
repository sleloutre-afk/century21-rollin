# Mise en ligne du site

Guide pas à pas. Version du 19/11/2026.

## 1. Démonstration (lot 11)

Objectif : une adresse à montrer à l'agence, **non référencée par Google**. Les formulaires fonctionnent mais n'envoient rien (envoi simulé, signalé à l'écran).

### Une seule fois

1. **Dépôt GitHub en privé** : page du dépôt → *Settings* → tout en bas, *Danger Zone* → *Change visibility* → *Make private*.
2. **Créer le projet Vercel** : sur [vercel.com](https://vercel.com), se connecter avec GitHub → *Add New…* → *Project* → choisir `century21-rollin`.
   Si le dépôt n'apparaît pas : *Adjust GitHub App Permissions* et autoriser l'accès au dépôt.
3. **Réglages** : ne rien changer (Vercel reconnaît Next.js). **N'ajouter aucune variable d'environnement.**
4. Cliquer sur **Deploy**, attendre 1 à 2 minutes. L'adresse s'affiche (du type `century21-rollin.vercel.app`).

### Ensuite, automatiquement

Chaque sauvegarde envoyée sur GitHub (branche `main`) remet le site en ligne à jour, en 1 à 2 minutes.
Si une construction échoue, Vercel garde la version précédente en ligne et envoie un e-mail.

### Vérifier le site en ligne

Dans le terminal du projet :

```
BASE_URL=https://century21-rollin.vercel.app npm run test:en-ligne
```

Les mêmes tests que sur le Mac s'exécutent sur le site en ligne (pages, liens, formulaires, accessibilité, clavier).
Les formulaires sont limités à 5 envois en 10 minutes par visiteur : attendre 10 minutes avant de relancer les tests.

### Ce qui protège la démonstration

- Les pages portent la consigne « ne pas référencer » et le fichier `robots.txt` interdit l'exploration.
- N'importe qui ayant l'adresse peut voir le site : ne pas la diffuser en dehors de l'agence.
- Une protection par mot de passe existe chez Vercel, mais seulement avec le plan payant Pro.

## 2. Mise en production (plus tard)

**Uniquement quand** les éléments bloquants sont traités (voir `docs/questions-ouvertes.md` et `docs/05-elements-a-fournir.md`) :
mentions professionnelles et pages légales, barème d'honoraires, textes RGPD, mentions obligatoires des annonces, accords écrits de l'équipe pour les photos, droits sur les photos, point sur l'encadrement des loyers.

1. **Hébergement de production** : à décider : Vercel avec le plan Pro (le plan gratuit est réservé aux usages non commerciaux, à vérifier sur vercel.com/pricing), ou Clever Cloud comme Doxamed.
2. **Envoi réel des formulaires** : brancher Resend et les adresses de réception de chaque pôle (`lib/formulaires/envoi.ts`), puis vider la mention « [Démonstration… ] » (constante `MENTION_DEMO`, `lib/formulaires/schemas.ts`, seul endroit à modifier).
3. **Nom de domaine** : relier `www.century21-cabinet-rollin-bordeaux.com` au nouvel hébergement, et prévoir les redirections des adresses de l'ancien site.
4. **Ouvrir le référencement** : ajouter la variable d'environnement `SITE_INDEXABLE` = `oui`, puis redéployer.
   (Si le domaine change, ajouter aussi `NEXT_PUBLIC_SITE_URL` = l'adresse complète du site.)
5. **Déclarer le site** dans Google Search Console et y envoyer le plan du site : `https://www.century21-cabinet-rollin-bordeaux.com/sitemap.xml`.
6. **Relancer les tests** sur l'adresse de production (`BASE_URL=… npm run test:en-ligne`) et un audit Lighthouse.
