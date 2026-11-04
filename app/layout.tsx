import type { Metadata } from "next";
import { siteOrigin } from "@/lib/seo";
import "./globals.css";
import "./home-design.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "CarTime — аренда автомобилей в Баку",
  description: "Автомобили и дневные тарифы в Баку, путеводители по городу и маршрутам Азербайджана.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="und" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('cartime-theme');document.documentElement.dataset.theme=['hybrid','dark','light'].includes(t)?t:'hybrid'}catch(e){document.documentElement.dataset.theme='hybrid'}var l=location.pathname.split('/')[1];if(['ru','az','en'].includes(l))document.documentElement.lang=l;` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
