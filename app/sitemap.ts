import type { MetadataRoute } from "next";
import { guideSlugs } from "@/lib/guides";
import { locales, siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "fleet", ...guideSlugs.map((slug) => `guide/${slug}`)];
  return paths.flatMap((path) => locales.map((locale) => ({
    url: `${siteOrigin}/${locale}${path ? `/${path}` : ""}`,
    changeFrequency: "monthly" as const,
    alternates: {
      languages: Object.fromEntries(locales.map((language) => [language, `${siteOrigin}/${language}${path ? `/${path}` : ""}`])),
    },
  })));
}
