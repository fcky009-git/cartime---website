import type { Metadata } from "next";
import { defaultLocale, localeInfo, locales, type Locale } from "./locales";

export { defaultLocale, locales };

// Preview domain until cartime.az is purchased; then set NEXT_PUBLIC_SITE_URL (or change this default).
export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://cartime-baku-demo.brawnydill256.chatgpt.site").replace(/\/$/, "");

/**
 * Search engines may index the site only after a real domain is configured through
 * NEXT_PUBLIC_SITE_URL. Without it (preview, local) every page is sent with noindex.
 */
export const indexingEnabled = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const ogImage = { url: "/assets/og-cartime.jpg", width: 1200, height: 630, alt: "CarTime — car rental in Baku" } as const;

export function languageAlternates(path: string, origin = ""): Record<string, string> {
  const href = (language: Locale) => `${origin}/${language}${path ? `/${path}` : ""}`;
  return {
    ...Object.fromEntries(locales.map((language) => [localeInfo[language].hreflang, href(language)])),
    "x-default": href(defaultLocale),
  };
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const localPath = path ? `/${locale}/${path}` : `/${locale}`;
  const withBrand = `${title} | CarTime`;
  return {
    // Long titles are cut in search results, so drop the brand suffix when it would pass 60 characters.
    title: withBrand.length > 60 ? { absolute: title } : withBrand,
    description,
    alternates: {
      canonical: localPath,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: "CarTime",
      title,
      description,
      url: `${siteOrigin}${localPath}`,
      locale: localeInfo[locale].ogLocale,
      alternateLocale: locales.filter((code) => code !== locale).map((code) => localeInfo[code].ogLocale),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function jsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
