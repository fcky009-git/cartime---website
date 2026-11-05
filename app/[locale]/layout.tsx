import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import { clickEventsScript, gtmHeadScript, gtmId } from "@/lib/analytics";
import { dictionaries } from "@/lib/i18n";
import { defaultLocale, isLocale, localeInfo } from "@/lib/locales";
import { indexingEnabled, siteOrigin } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "CarTime — аренда автомобилей в Баку",
  description: "Автомобили и дневные тарифы в Баку, путеводители по городу и маршрутам Азербайджана.",
  icons: { icon: "/favicon.svg" },
  // Preview and local builds stay out of search results until NEXT_PUBLIC_SITE_URL is set.
  robots: indexingEnabled ? undefined : { index: false, follow: false },
};

const themeScript = `try{var t=localStorage.getItem('cartime-theme');document.documentElement.dataset.theme=['hybrid','dark','light'].includes(t)?t:'hybrid'}catch(e){document.documentElement.dataset.theme='hybrid'}`;
const fontsHref = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap";

// Root layout for every language page: <html lang> and dir come from the URL segment.
export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const code = isLocale(locale) && locale in dictionaries ? locale : defaultLocale;
  const info = localeInfo[code];
  return (
    <html lang={info.hreflang} dir={info.dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
        {gtmId && <script dangerouslySetInnerHTML={{ __html: gtmHeadScript(gtmId) + clickEventsScript }} />}
      </head>
      <body>
        {gtmId && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>}
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
