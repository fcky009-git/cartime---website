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
  de: ["Autovermietung in Baku — Fahrzeuge und Tagespreise", `Vergleichen Sie ${fleetCount} Katalogeinträge und Tagespreise in USD. CarTime hat 122 Fahrzeuge im Fuhrpark; entdecken Sie unsere Reiseführer für Baku und Aserbaidschan.`],
  zh: ["巴库租车 — 车型与每日价格", `比较 ${fleetCount} 款车型及其美元每日租金。CarTime 车队共有 122 辆车；查看巴库与阿塞拜疆自驾指南。`],
  ko: ["바쿠 렌터카 — 차량 및 일일 요금", `카탈로그의 ${fleetCount}개 차량과 USD 일일 요금을 비교하세요. CarTime은 122대의 차량을 운영하며 바쿠와 아제르바이잔 여행 가이드를 제공합니다.`],
  fr: ["Location de voiture à Bakou — voitures et tarifs", `Comparez ${fleetCount} références du catalogue et leurs tarifs journaliers en USD. CarTime dispose de 122 voitures ; découvrez nos guides de Bakou et d'Azerbaïdjan.`],
  ar: ["تأجير السيارات في باكو — السيارات والأسعار اليومية", `قارن بين ${fleetCount} طرازاً وأسعار الإيجار اليومية بالدولار الأمريكي. يضم أسطول CarTime 122 سيارة؛ استكشف أدلة باكو وأذربيجان.`],
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
