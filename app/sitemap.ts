import type { MetadataRoute } from "next";
import { guideSlugs } from "@/lib/guides";
import { rentalSlugs } from "@/lib/rental-pages";
import { languageAlternates, locales, siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "fleet", "booking", "about", "faq", "contact", "rental", ...rentalSlugs.map((slug) => `rental/${slug}`), ...guideSlugs.map((slug) => `guide/${slug}`)];
  return paths.flatMap((path) => locales.map((locale) => ({
    url: `${siteOrigin}/${locale}${path ? `/${path}` : ""}`,
    changeFrequency: "monthly" as const,
    alternates: {
      languages: languageAlternates(path, siteOrigin),
    },
  })));
}
