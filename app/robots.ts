import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // On preview builds pages carry noindex, so crawling stays allowed (noindex must be readable)
  // and no sitemap is advertised.
  if (!indexingEnabled) return { rules: { userAgent: "*", allow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
