import type { MetadataRoute } from "next";
import { INDEXABLE, urlAbsolue } from "@/lib/seo";

/**
 * robots.txt : tout est bloqué tant que le site n'est pas en production (SITE_INDEXABLE=oui, voir lib/seo.ts).
 * En production : tout est ouvert, sauf la page des composants et le service interne d'adresses.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide", "/api/"] },
    sitemap: urlAbsolue("/sitemap.xml"),
  };
}
