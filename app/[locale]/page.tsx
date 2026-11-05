import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CarTimeSite from "@/components/site";
import { dictionaries, type Locale } from "@/lib/i18n";
import { pageMetadata, jsonLd, siteOrigin } from "@/lib/seo";

const homeMeta = {
  ru: ["Аренда автомобилей в Баку — каталог и тарифы", "Сравните 55 позиций каталога и дневные тарифы в USD. В парке CarTime 122 автомобиля; гиды по Баку и маршрутам помогут спланировать поездку."],
  az: ["Bakıda avtomobil icarəsi — kataloq və tariflər", "Kataloqdakı 55 mövqeni və USD ilə gündəlik tarifləri müqayisə edin. CarTime parkında 122 avtomobil var; Bakı və bölgə bələdçilərinə baxın."],
  en: ["Car rental in Baku — cars and daily rates", "Compare 55 catalogue entries and USD daily rates. CarTime's actual fleet has 122 vehicles; explore Baku and Azerbaijan road guides."],
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in homeMeta)) return {};
  const [title, description] = homeMeta[locale as Locale];
  return pageMetadata(locale as Locale, "", title, description);
}

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "az" }, { locale: "en" }];
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CarTime",
      url: siteOrigin,
      inLanguage: ["ru", "az", "en"],
      description: homeMeta[locale as Locale][1],
    }) }} />
    <CarTimeSite locale={locale as Locale} />
  </>;
}
