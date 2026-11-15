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

/**
 * Ownership tokens for Google Search Console, Yandex Webmaster and Bing Webmaster Tools, set as
 * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_YANDEX_VERIFICATION and NEXT_PUBLIC_BING_VERIFICATION
 * in the build environment (the content value of each service's meta tag, not the whole tag).
 * Unset or malformed values are ignored. A DNS TXT record verifies a domain without any of these.
 */
export function searchConsoleVerification(): Metadata["verification"] {
  const token = (value: string | undefined) => (value && /^[A-Za-z0-9_-]{8,100}$/.test(value.trim()) ? value.trim() : undefined);
  const google = token(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
  const yandex = token(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION);
  const bing = token(process.env.NEXT_PUBLIC_BING_VERIFICATION);
  if (!google && !yandex && !bing) return undefined;
  return { google, yandex, ...(bing ? { other: { "msvalidate.01": bing } } : {}) };
}

export const ogImage = { url: "/assets/og-cartime.jpg", width: 1200, height: 630, alt: "CarTime — car rental in Baku" } as const;

export function languageAlternates(path: string, origin = ""): Record<string, string> {
  const href = (language: Locale) => `${origin}/${language}${path ? `/${path}` : ""}`;
  return {
    ...Object.fromEntries(locales.map((language) => [localeInfo[language].hreflang, href(language)])),
    "x-default": href(defaultLocale),
  };
}

/** `image` replaces the default share image, e.g. a guide's own photo (1200x630). */
export function pageMetadata(locale: Locale, path: string, title: string, description: string, image: { url: string; width: number; height: number; alt: string } = ogImage): Metadata {
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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function jsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
