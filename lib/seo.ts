import type { Metadata } from "next";
import type { Locale } from "./i18n";

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://cartime.az").replace(/\/$/, "");
export const locales: Locale[] = ["ru", "az", "en"];
// Language that `/` redirects to; also used as the hreflang x-default target.
export const defaultLocale: Locale = "ru";

export function languageAlternates(path: string, origin = ""): Record<string, string> {
  const href = (language: Locale) => `${origin}/${language}${path ? `/${path}` : ""}`;
  return {
    ...Object.fromEntries(locales.map((language) => [language, href(language)])),
    "x-default": href(defaultLocale),
  };
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const localPath = path ? `/${locale}/${path}` : `/${locale}`;
  return {
    title: `${title} | CarTime`,
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
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      images: ["/assets/hero-baku-editorial.jpg"],
    },
  };
}

export function jsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
