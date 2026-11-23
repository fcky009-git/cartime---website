import type { MetadataRoute } from "next";
import { publicPaths } from "@/lib/public-paths";
import { languageAlternates, locales, siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) => locales.map((locale) => ({
    url: `${siteOrigin}/${locale}${path ? `/${path}` : ""}`,
    changeFrequency: "monthly" as const,
    alternates: {
      languages: languageAlternates(path, siteOrigin),
    },
  })));
}
