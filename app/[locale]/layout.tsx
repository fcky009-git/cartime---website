import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import SiteSearch from "@/components/site-search";
import { buildSearchIndex } from "@/lib/search-index";
import { clickEventsScript, gtmHeadScript, gtmId } from "@/lib/analytics";
import { dictionaries } from "@/lib/i18n";
import { defaultLocale, isLocale, localeInfo } from "@/lib/locales";
import { indexingEnabled, siteOrigin } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";
import "../globals.css";
import "../home-design.css";
import "../admin.css";
import "../navigation-polish.css";
import "../upgrades.css";
import "../travel-pass.css";
import "../redesign.css";
import "../liquid-glass.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "CarTime — аренда автомобилей в Баку",
  description: "Автомобили и дневные тарифы в Баку, путеводители по городу и маршрутам Азербайджана.",
  icons: { icon: "/favicon.svg" },
  // Preview and local builds stay out of search results until NEXT_PUBLIC_SITE_URL is set.
  robots: indexingEnabled ? undefined : { index: false, follow: false },
};

const themeScript = `try{var t=localStorage.getItem('cartime-theme');document.documentElement.dataset.theme=['hybrid','dark','light'].includes(t)?t:'hybrid'}catch(e){document.documentElement.dataset.theme='hybrid'}`;
const fontsHref = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Sofia+Sans+Extra+Condensed:wght@600;700;800&display=swap";
const localeFonts: Partial<Record<import("@/lib/locales").Locale, string>> = {
  // The display face has no Ə, which every Azerbaijani headline needs.
  az: "https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:wght@600;700;800&display=swap",
  zh: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap",
  ko: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap",
  ar: "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap",
};

// Root layout for every language page: <html lang> and dir come from the URL segment.
export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const code = isLocale(locale) && locale in dictionaries ? locale : defaultLocale;
  const info = localeInfo[code];
  return (
    <html lang={info.hreflang} dir={info.dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#060d1f" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
        {localeFonts[code] && <link rel="stylesheet" href={localeFonts[code]} />}
        {gtmId && <script dangerouslySetInnerHTML={{ __html: gtmHeadScript(gtmId) + clickEventsScript }} />}
      </head>
      <body>
        {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>}
        <JsonLd data={organizationJsonLd()} />
        {children}
        <SiteSearch locale={code} items={buildSearchIndex(code)} />
      </body>
    </html>
  );
}
