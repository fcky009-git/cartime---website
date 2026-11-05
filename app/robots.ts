import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "@/lib/seo";
import { locales } from "@/lib/locales";

export default function robots(): MetadataRoute.Robots {
  // On preview builds pages carry noindex, so crawling stays allowed (noindex must be readable)
  // and no sitemap is advertised.
  if (!indexingEnabled) return { rules: { userAgent: "*", allow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...locales.map((locale) => `/${locale}/admin`)] },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
