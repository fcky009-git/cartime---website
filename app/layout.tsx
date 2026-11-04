import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarTime — аренда автомобилей в Баку",
  description: "CarTime — выбор автомобиля для поездок по Баку и Азербайджану. Демонстрационная версия сайта.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "CarTime — Drive on Your Time",
    description: "Аренда автомобилей в Баку. Демонстрационная версия сайта.",
    images: ["/assets/approved-reference.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('cartime-theme');document.documentElement.dataset.theme=['hybrid','dark','light'].includes(t)?t:'hybrid'}catch(e){document.documentElement.dataset.theme='hybrid'}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
