import type { Metadata } from "next";
import { dictionaries } from "@/lib/i18n";
import { defaultLocale, siteOrigin } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "CarTime — аренда автомобилей в Баку",
  description: "Автомобили и дневные тарифы в Баку, путеводители по городу и маршрутам Азербайджана.",
  icons: { icon: "/favicon.svg" },
};

const themeScript = `try{var t=localStorage.getItem('cartime-theme');document.documentElement.dataset.theme=['hybrid','dark','light'].includes(t)?t:'hybrid'}catch(e){document.documentElement.dataset.theme='hybrid'}`;
const fontsHref = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap";

// Root layout for every language page: <html lang> comes from the URL segment.
export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const lang = locale in dictionaries ? locale : defaultLocale;
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
