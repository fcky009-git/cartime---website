import { localeParams } from "@/lib/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import JsonLd from "@/components/json-ld";
import ContactLinks from "@/components/contact-links";
import { dictionaries, type Locale } from "@/lib/i18n";
import { rentalUi } from "@/lib/rental-pages";
import { guideUi } from "@/lib/guides";
import { contactLocation } from "@/lib/service-info";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { bookingUi } from "@/lib/booking";

type Props = { params: Promise<{ locale: string }> };
const serviceLinks: Record<Locale, { airport: string; delivery: string }> = {
  ru: { airport: "Выдача в аэропорту", delivery: "Доставка по адресу" },
  az: { airport: "Hava limanında təhvil", delivery: "Ünvana çatdırılma" },
  en: { airport: "Airport collection", delivery: "Address delivery" },
  de: { airport: "Abholung am Flughafen", delivery: "Lieferung an Ihre Adresse" },
  zh: { airport: "机场取车", delivery: "送车上门" },
  ko: { airport: "공항 픽업", delivery: "주소지 배송" },
  fr: { airport: "Retrait à l'aéroport", delivery: "Livraison à votre adresse" },
  ar: { airport: "الاستلام من المطار", delivery: "التوصيل إلى عنوانك" },
};

export function generateStaticParams() { return localeParams(); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const ui = rentalUi[locale as Locale];
  return pageMetadata(locale as Locale, "contact", ui.contactTitle, ui.contactDescription);
}
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = rentalUi[language];
  return <InfoShell locale={language} current="contact"><main>
    <header className="info-hero info-hero--contact"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">CARTIME / CONTACT</p><h1>{ui.contactTitle}</h1><p>{ui.contactLead}</p></div></header>
    <section className="container contact-page"><div className="contact-page-copy"><ContactLinks locale={language} /><div className="rental-hub-cta"><a href={`/${language}/booking`}>{bookingUi[language].nav} →</a><a href={`/${language}/rental/airport`}>{serviceLinks[language].airport} →</a><a href={`/${language}/rental/delivery`}>{serviceLinks[language].delivery} →</a><a href={`/${language}/faq`}>{ui.faq} →</a></div></div><div className="contact-map"><div><h2>{ui.mapTitle}</h2><p>{ui.mapNote}</p></div><iframe title={ui.mapTitle} src="https://maps.google.com/maps?q=40.3778175%2C49.8561227&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={contactLocation.mapsUrl} target="_blank" rel="noopener noreferrer">{ui.mapLink} ↗</a></div></section>
  </main><JsonLd data={breadcrumbJsonLd(language, [{ name: ui.contactTitle, path: "contact" }])} /></InfoShell>;
}
