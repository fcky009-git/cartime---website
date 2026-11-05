import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CarTimeSite from "@/components/site";
import { dictionaries, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { fleetCount } from "@/lib/fleet-count";
import { localeParams } from "@/lib/locales";
import JsonLd from "@/components/json-ld";
import { websiteJsonLd } from "@/lib/structured-data";

const homeMeta = {
  ru: ["Аренда автомобилей в Баку — каталог и тарифы", `Сравните ${fleetCount} автомобилей и дневные тарифы в USD для поездок по Баку и Азербайджану. Гиды по городу, аэропорту GYD и маршрутам.`],
  az: ["Bakıda avtomobil icarəsi — kataloq və tariflər", `Bakı və Azərbaycan səfərləri üçün ${fleetCount} avtomobili və USD ilə gündəlik tarifləri müqayisə edin. Şəhər, GYD və marşrut bələdçiləri.`],
  en: ["Car rental in Baku — cars and daily rates", `Compare ${fleetCount} cars and USD daily rates for trips around Baku and Azerbaijan. Guides to the city, GYD airport and road trips.`],
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
    {/* The hero is a CSS background image, so the browser would find it late; hint it early. */}
    <link rel="preload" as="image" href="/assets/hero-baku-editorial.webp" type="image/webp" fetchPriority="high" />
    <JsonLd data={websiteJsonLd(homeMeta[locale as Locale][1])} />
    <CarTimeSite locale={locale as Locale} />
  </>;
}
