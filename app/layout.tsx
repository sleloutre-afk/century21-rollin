import type { Metadata } from "next";
import { Barlow_Semi_Condensed } from "next/font/google";
import { verifierContenus } from "@/lib/data";
import { INDEXABLE, NOM_SITE, URL_SITE } from "@/lib/seo";
import "./globals.css";

// Police téléchargée au moment du build et servie par le site lui-même :
// aucune connexion des visiteurs aux serveurs de Google.
const barlow = Barlow_Semi_Condensed({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: NOM_SITE,
    template: `%s · ${NOM_SITE}`,
  },
  description: "Agence immobilière aux Chartrons, à Bordeaux, depuis 1993 : vente, location et gestion locative.",
  openGraph: { siteName: NOM_SITE, locale: "fr_FR", type: "website" },
  // Site non référencé tant que SITE_INDEXABLE n'est pas « oui » (mise en production). Voir lib/seo.ts.
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Valide les 5 fichiers de contenus/ : un fichier invalide fait échouer le build.
  verifierContenus();

  return (
    <html lang="fr" className={`${barlow.variable} antialiased`}>
      <body className="min-h-dvh bg-white font-sans text-grey-dark">{children}</body>
    </html>
  );
}
