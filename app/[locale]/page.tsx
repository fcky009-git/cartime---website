import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CarTimeSite from "@/components/site";
import JsonLd from "@/components/json-ld";
import { dictionaries, type Locale } from "@/lib/i18n";
import { fleetCount } from "@/lib/fleet-count";
import { localeParams } from "@/lib/locales";
import { pageMetadata } from "@/lib/seo";
import { websiteJsonLd } from "@/lib/structured-data";

const homeMeta = {
  ru: ["Аренда автомобилей в Баку — каталог и тарифы", `Сравните ${fleetCount} позиций каталога и дневные тарифы в USD. В парке CarTime 122 автомобиля; гиды по Баку и маршрутам помогут спланировать поездку.`],
  az: ["Bakıda avtomobil icarəsi — kataloq və tariflər", `Kataloqdakı ${fleetCount} mövqeni və USD ilə gündəlik tarifləri müqayisə edin. CarTime parkında 122 avtomobil var; Bakı və bölgə bələdçilərinə baxın.`],
  en: ["Car rental in Baku — cars and daily rates", `Compare ${fleetCount} catalogue entries and USD daily rates. CarTime's actual fleet has 122 vehicles; explore Baku and Azerbaijan road guides.`],
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in homeMeta)) return {};
  const [title, description] = homeMeta[locale as Locale];
  return pageMetadata(locale as Locale, "", title, description);
}

export function generateStaticParams() {
  return localeParams();
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  return <>
    <link rel="preload" as="image" href="/assets/cartime-baku-sunrise.jpg" type="image/jpeg" fetchPriority="high" />
    <JsonLd data={websiteJsonLd(homeMeta[locale as Locale][1])} />
    <CarTimeSite locale={locale as Locale} />
  </>;
}
