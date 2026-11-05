import { localeParams } from "@/lib/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import JsonLd from "@/components/json-ld";
import { dictionaries, type Locale } from "@/lib/i18n";
import { rentalPages, rentalSlugs, rentalUi } from "@/lib/rental-pages";
import { guideUi } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return localeParams(); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const ui = rentalUi[locale as Locale];
  return pageMetadata(locale as Locale, "rental", ui.hubTitle, ui.hubDescription);
}
export default async function RentalHub({ params }: Props) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = rentalUi[language];
  return <InfoShell locale={language} current="rental">
    <JsonLd data={breadcrumbJsonLd(language, [{ name: ui.hubTitle, path: "rental" }])} />
    <main>
      <header className="info-hero info-hero--rental"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">CARTIME / RENTAL</p><h1>{ui.hubTitle}</h1><p>{ui.hubLead}</p></div></header>
      <section className="container rental-hub"><div className="rental-hub-grid">{rentalSlugs.map((slug, index) => { const page = rentalPages[language][slug]; return <a key={slug} className="rental-topic" href={`/${language}/rental/${slug}`}><span>0{index + 1} / {ui.nav}</span><h2>{page.title}</h2><p>{page.teaser}</p><b>{ui.read} →</b></a>; })}</div><div className="rental-hub-cta"><a href={`/${language}/fleet`}>{ui.compare} →</a><a href={`/${language}/faq`}>{ui.faq} →</a><a href={`/${language}/contact`}>{ui.contact} →</a></div></section>
    </main>
  </InfoShell>;
}
