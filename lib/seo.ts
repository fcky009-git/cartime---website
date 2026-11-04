import type { Metadata } from "next";
import type { Locale } from "./i18n";

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || "https://cartime-baku-demo.brawnydill256.chatgpt.site").replace(/\/$/, "");
export const locales: Locale[] = ["ru", "az", "en"];

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const localPath = path ? `/${locale}/${path}` : `/${locale}`;
  return {
    title: `${title} | CarTime`,
    description,
    alternates: {
      canonical: localPath,
      languages: Object.fromEntries(locales.map((language) => [language, path ? `/${language}/${path}` : `/${language}`])),
    },
    openGraph: {
      type: "website",
      siteName: "CarTime",
      title,
      description,
      url: `${siteOrigin}${localPath}`,
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      images: ["/assets/cartime-baku-sunrise.jpg"],
    },
  };
}

export function jsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
