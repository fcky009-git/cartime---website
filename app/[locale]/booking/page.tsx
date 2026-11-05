import { localeParams } from "@/lib/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import JsonLd from "@/components/json-ld";
import BookingForm from "@/components/booking-form";
import { bookingUi } from "@/lib/booking";
import { bookingExtras } from "@/lib/booking-extras";
import { dictionaries, type Locale } from "@/lib/i18n";
import { guideUi } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return localeParams(); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const language = locale as Locale;
  return pageMetadata(language, "booking", bookingUi[language].title, bookingUi[language].lead);
}
export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = bookingUi[language];
  const extra = bookingExtras[language];
  return <InfoShell locale={language} current="booking"><JsonLd data={breadcrumbJsonLd(language, [{ name: ui.title, path: "booking" }])} /><main>
    <header className="info-hero booking-hero"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">CARTIME / BOOKING REQUEST</p><h1>{ui.title}</h1><p>{ui.lead}</p></div></header>
    <BookingForm locale={language} />
    <section className="booking-extras container"><div className="booking-extras-head"><p className="section-kicker">{extra.eyebrow}</p><h2>{extra.title}</h2><p>{extra.lead}</p></div><div className="booking-extras-grid">{extra.points.map(([title, text], index) => <article key={title} style={{ animationDelay: `${index * 70}ms` }}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="booking-extras-faq"><h2>{extra.faqTitle}</h2>{extra.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
  </main></InfoShell>;
}
