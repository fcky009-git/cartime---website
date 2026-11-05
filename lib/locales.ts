/**
 * Single place to configure site languages.
 *
 * To add a language, follow "Adding a language" in AGENTS.md. In short: add the code here,
 * then TypeScript lists every dictionary that still needs a translation.
 */
export const locales = ["ru", "az", "en", "de", "zh", "ko", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

/** Language that `/` redirects to; also the hreflang x-default target. */
export const defaultLocale: Locale = "ru";

type LocaleInfo = {
  /** Native name of the language. */
  name: string;
  /** Value for hreflang and <html lang>. */
  hreflang: string;
  /** Value for og:locale. */
  ogLocale: string;
  /** Text direction. Arabic needs "rtl". */
  dir: "ltr" | "rtl";
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  ru: { name: "Русский", hreflang: "ru", ogLocale: "ru_RU", dir: "ltr" },
  az: { name: "Azərbaycanca", hreflang: "az", ogLocale: "az_AZ", dir: "ltr" },
  en: { name: "English", hreflang: "en", ogLocale: "en_US", dir: "ltr" },
  de: { name: "Deutsch", hreflang: "de", ogLocale: "de_DE", dir: "ltr" },
  zh: { name: "简体中文", hreflang: "zh-CN", ogLocale: "zh_CN", dir: "ltr" },
  ko: { name: "한국어", hreflang: "ko", ogLocale: "ko_KR", dir: "ltr" },
  fr: { name: "Français", hreflang: "fr", ogLocale: "fr_FR", dir: "ltr" },
  ar: { name: "العربية", hreflang: "ar", ogLocale: "ar_AR", dir: "rtl" },
};

/** Order of the language links in the header. */
export const switcherOrder: Locale[] = ["az", "en", "ru", "de", "zh", "ko", "fr", "ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** For generateStaticParams of any route under app/[locale]. */
export function localeParams() {
  return locales.map((locale) => ({ locale }));
}
