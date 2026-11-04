import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ru/admin", "/az/admin", "/en/admin", "/api/"] },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
