import type { Metadata } from "next";
import { CarteBien } from "@/components/biens/CarteBien";
import {
  actionsFicheBien,
  actionsFicheConseiller,
  actionsParDefaut,
  BarreActionsMobile,
} from "@/components/layout/BarreActionsMobile";
import { Logo } from "@/components/layout/Logo";
import { Badge } from "@/components/ui/Badge";
import { Bouton, BoutonLien, LienFleche } from "@/components/ui/Bouton";
import { Compteur } from "@/components/ui/Compteur";
import { EmplacementPhoto } from "@/components/ui/EmplacementPhoto";
import { EnBref } from "@/components/ui/EnBref";
import { Faq } from "@/components/ui/Faq";
import { FilAriane } from "@/components/ui/FilAriane";
import { IconeCalendrier } from "@/components/ui/Icones";
import { RangeeDefilable } from "@/components/ui/RangeeDefilable";
import { TitreSection } from "@/components/ui/TitreSection";
import { getAgence, getAnnonces, getArticles } from "@/lib/data";
import { metaPage } from "@/lib/seo";

/**
 * Page de démonstration des composants (lot 1). Non indexée, absente du menu et du futur sitemap.
 * Tous les textes viennent de la maquette ou de contenus/ : rien n'est inventé.
 */

export const metadata: Metadata = metaPage({
  titre: "Composants",
  description: "Page de travail : composants du site.",
  chemin: "/styleguide",
  indexable: false,
});

// Couleurs de docs/04-charte-graphique.md.
const COULEURS = [
  { nom: "Relentless Gold", jeton: "gold", hex: "#BEAF87", role: "Aplats, boutons principaux, filets", classe: "bg-gold", texte: "text-grey-dark" },
  { nom: "Obsessed Grey", jeton: "grey-dark", hex: "#252526", role: "Texte courant, fonds sombres", classe: "bg-grey-dark", texte: "text-white" },
  { nom: "Dark Gold", jeton: "gold-dark", hex: "#A19276", role: "Survol des boutons or, filets, focus", classe: "bg-gold-dark", texte: "text-grey-dark" },
  { nom: "Medium Grey", jeton: "grey-medium", hex: "#808285", role: "Texte secondaire sur fond sombre, filets", classe: "bg-grey-medium", texte: "text-grey-dark" },
  { nom: "Light Grey", jeton: "grey-light", hex: "#E6E7E8", role: "Fonds de section, emplacements photo", classe: "bg-grey-light", texte: "text-grey-dark" },
  { nom: "Blanc", jeton: "white", hex: "#FFFFFF", role: "Fond principal", classe: "bg-white border border-grey-light", texte: "text-grey-dark" },
];

function Bloc({ id, titre, sombre = false, children }: { id: string; titre: string; sombre?: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={`py-14 md:py-20 ${sombre ? "bg-grey-dark text-white" : "border-t border-grey-light"}`}>
      <div className="conteneur flex flex-col gap-8">
        <h2 id={id} className={`m-0 font-display text-sm font-medium uppercase tracking-[0.28em] ${sombre ? "text-gold" : ""}`}>
          {titre}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function Styleguide() {
  const agence = getAgence();
  const annonces = getAnnonces();
  const article = getArticles()[0];
  const coupsDeCoeur = annonces.filter((a) => a.coupDeCoeur);
  const c = agence.chiffres;

  return (
    <>
      <FilAriane etapes={[{ libelle: "Composants" }]} />

      <div className="pb-6 pt-12 md:pt-16">
        <div className="conteneur">
          <h1 className="m-0 text-[40px] font-medium uppercase leading-none md:text-6xl">Composants du site</h1>
          <p className="m-0 mt-4 max-w-[620px] text-[17px] leading-normal">
            Page de travail, non indexée : elle rassemble les éléments réutilisés sur toutes les pages, pour validation.
          </p>
        </div>
      </div>

      <Bloc id="sg-couleurs" titre="Couleurs de la charte">
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {COULEURS.map((couleur) => (
            <li key={couleur.jeton} className="flex flex-col">
              <div className={`flex h-28 items-end p-4 ${couleur.classe} ${couleur.texte}`}>
                <span className="font-display text-lg font-semibold">{couleur.nom}</span>
              </div>
              <p className="m-0 pt-3 text-sm">
                <strong>{couleur.hex}</strong> · jeton <code>{couleur.jeton}</code>
                <br />
                {couleur.role}
              </p>
            </li>
          ))}
        </ul>
        <p className="m-0 text-sm">Jamais de texte or sur fond blanc : l&apos;or s&apos;emploie en aplat, en filet, ou en texte sur fond Obsessed Grey.</p>
      </Bloc>

      <Bloc id="sg-typo" titre="Typographies">
        <div className="flex flex-col gap-6">
          <p className="m-0 font-display text-[clamp(40px,5vw,72px)] font-medium uppercase leading-[0.98]">
            Les Chartrons, on les connaît par cœur.
          </p>
          <p className="m-0 font-display text-[54px] font-semibold">1 099 000 €</p>
          <p className="m-0 max-w-[620px] text-lg leading-normal">
            Texte courant en Arial (alternative officielle à Oakes). Titres, chiffres et accroches en Barlow Semi Condensed,
            en attendant les licences Typold.
          </p>
        </div>
      </Bloc>

      <Bloc id="sg-logo" titre="Logo provisoire">
        <div className="flex flex-wrap items-center gap-12">
          <Logo taille="normal" lien={false} />
          <Logo taille="compact" lien={false} />
          <span className="bg-grey-dark p-6">
            <Logo taille="pied" surFondSombre lien={false} />
          </span>
        </div>
        <p className="m-0 text-sm">Bloc typographique en attendant le fichier SVG officiel fourni par le réseau.</p>
      </Bloc>

      <Bloc id="sg-boutons" titre="Boutons et liens">
        <div className="flex flex-wrap items-center gap-4">
          <BoutonLien href="/estimation" variante="or">
            Estimer mon bien
          </BoutonLien>
          <BoutonLien href="/biens" variante="sombre" taille="grand">
            Voir les 8 biens en vente
          </BoutonLien>
          <BoutonLien href="/biens" variante="contour" taille="grand">
            Créer une alerte e-mail
          </BoutonLien>
          <Bouton variante="contour" taille="grand">
            <IconeCalendrier taille={18} />
            Prendre rendez-vous
          </Bouton>
          <Bouton variante="sombre" disabled>
            Bouton désactivé
          </Bouton>
        </div>
        <LienFleche href="/biens">Voir tous nos biens</LienFleche>
      </Bloc>

      <Bloc id="sg-sombre" titre="Sur fond sombre" sombre>
        <div className="flex flex-wrap items-center gap-6">
          <BoutonLien href="/estimation" variante="or" taille="grand">
            Estimer mon bien
          </BoutonLien>
          <BoutonLien href="/contact" variante="contourClair" taille="grand">
            Prendre rendez-vous
          </BoutonLien>
          <LienFleche href="/biens-vendus" surFondSombre>
            Tous les biens vendus
          </LienFleche>
        </div>
        <TitreSection
          surtitre="La preuve par les ventes"
          titre="Récemment vendus"
          texte={`Plus de ${c.ventes.replace("+", "")} ventes ${c.periode}. Voici les dernières, quartier par quartier.`}
          surFondSombre
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <article key={n} className="group flex flex-col gap-3">
              <EmplacementPhoto libelle="Photo du bien vendu" surFondSombre className="h-[200px] md:h-[300px]">
                <Badge variante="vendu" className="absolute left-[18px] top-[18px]" />
              </EmplacementPhoto>
              <span className="font-display text-sm uppercase tracking-[0.18em] text-gold">[Quartier]</span>
              <span className="text-[17px]">[Type · surface]</span>
              <span className="text-[15px] text-grey-light">Vendu en [—] jours</span>
            </article>
          ))}
        </div>
      </Bloc>

      <Bloc id="sg-badges" titre="Badges et emplacements photo">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variante="exclusivite" />
          <Badge variante="nouveau" className="border border-grey-light" />
          <Badge variante="vendu" />
          <Badge variante="categorie">Faire gérer</Badge>
          <Badge variante="pole">Transaction</Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group">
            <EmplacementPhoto libelle="Photo · façade en pierre blonde" className="h-[260px]" />
          </div>
          <div className="group">
            <EmplacementPhoto libelle="Portrait à fournir" className="aspect-[4/5]" />
          </div>
          <div className="group">
            <EmplacementPhoto libelle="Photo · quai des Chartrons" etiquette="haut-droite" className="h-[260px]" />
          </div>
        </div>
        <p className="m-0 text-sm">Survolez un emplacement : zoom doux, coupé si vous avez demandé moins d&apos;animations.</p>
      </Bloc>

      <Bloc id="sg-cartes" titre="Cartes de bien">
        <TitreSection
          surtitre="Nos biens"
          titre="Nos coups de cœur"
          aside={<LienFleche href="/biens">Voir tous nos biens</LienFleche>}
        />
        <div className="flex flex-wrap gap-x-6 gap-y-8">
          {coupsDeCoeur.slice(0, 2).map((annonce, i) => (
            <div key={annonce.slug} className={i === 0 ? "flex-[2_1_640px]" : "flex-[1_1_340px]"}>
              <CarteBien annonce={annonce} format="grande" />
            </div>
          ))}
          {coupsDeCoeur.slice(2, 5).map((annonce) => (
            <div key={annonce.slug} className="flex-[1_1_340px]">
              <CarteBien annonce={annonce} />
            </div>
          ))}
        </div>
      </Bloc>

      <Bloc id="sg-rangee" titre="Rangée défilable (manuelle)">
        <RangeeDefilable libelle="Annonces">
          {annonces.map((annonce) => (
            <CarteBien key={annonce.slug} annonce={annonce} />
          ))}
        </RangeeDefilable>
      </Bloc>

      <Bloc id="sg-compteurs" titre="Compteurs animés" sombre>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
          <Compteur valeur={c.ventes} legende={`ventes ${c.periode}`} surFondSombre />
          <Compteur valeur={c.locations} legende={`locations ${c.periode}`} surFondSombre />
          <Compteur valeur={c.biensGeres} legende={`biens en gestion ${c.periode}`} surFondSombre accent />
        </div>
      </Bloc>

      <Bloc id="sg-contenu" titre="FAQ et bloc « En bref »">
        <p className="m-0 text-sm">Exemple : article « {article.titre} » (contenus/articles.json).</p>
        <div className="flex flex-wrap gap-12">
          <div className="flex-[1_1_380px]">
            <EnBref points={article.bref} id="sg-en-bref" />
          </div>
          <div className="flex-[1.6_1_480px]">
            <Faq questions={article.faq} premiereOuverte />
          </div>
        </div>
      </Bloc>

      <Bloc id="sg-ariane" titre="Fil d'Ariane">
        <div className="border border-grey-light">
          <FilAriane etapes={[{ libelle: "Nos quartiers", href: "/quartiers" }, { libelle: "Chartrons" }]} />
        </div>
      </Bloc>

      <Bloc id="sg-barres" titre="Barres d'actions mobiles">
        <div className="grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { titre: "Par défaut", actions: actionsParDefaut(agence.telephoneE164) },
            { titre: "Fiche bien", actions: actionsFicheBien(agence.telephoneE164) },
            { titre: "Fiche conseiller", actions: actionsFicheConseiller(agence.telephoneE164) },
          ].map((variante) => (
            <div key={variante.titre} className="flex flex-col gap-2">
              <span className="text-sm font-bold">{variante.titre}</span>
              <div className="max-w-[390px]">
                <BarreActionsMobile actions={variante.actions} fixe={false} />
              </div>
            </div>
          ))}
        </div>
      </Bloc>
    </>
  );
}
