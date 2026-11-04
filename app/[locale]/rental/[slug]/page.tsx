import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import ContactLinks from "@/components/contact-links";
import fleet from "@/lib/fleet.json";
import { dictionaries, type Locale } from "@/lib/i18n";
import { rentalPages, rentalSlugs, rentalUi, type RentalSlug } from "@/lib/rental-pages";
import { guideUi } from "@/lib/guides";
import { jsonLd, pageMetadata, siteOrigin } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return (["ru", "az", "en"] as Locale[]).flatMap((locale) => rentalSlugs.map((slug) => ({ locale, slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(locale in dictionaries) || !rentalSlugs.includes(slug as RentalSlug)) return {};
  const page = rentalPages[locale as Locale][slug as RentalSlug];
  return pageMetadata(locale as Locale, `rental/${slug}`, page.title, page.description);
}
export default async function RentalTopic({ params }: Props) {
  const { locale, slug } = await params;
  if (!(locale in dictionaries) || !rentalSlugs.includes(slug as RentalSlug)) notFound();
  const language = locale as Locale;
  const key = slug as RentalSlug;
  const page = rentalPages[language][key];
  const ui = rentalUi[language];
  const related = rentalSlugs.filter((item) => item !== key).slice(0, 4);
  const selectedCars = page.fleetCategory ? fleet.filter((car) => car.category === page.fleetCategory).slice(0, 6) : [];
  return <InfoShell locale={language} current={`rental/${key}`}>
    <main>
      <header className={`info-hero info-hero--rental info-hero--rental-${key}`}><div className="container info-hero-inner"><a className="info-back" href={`/${language}/rental`}>← {ui.nav}</a><p className="section-kicker">CARTIME / {ui.nav.toUpperCase()}</p><h1>{page.title}</h1><p>{page.lead}</p></div></header>
      <div className="container info-body"><nav className="info-toc" aria-label={page.title}><strong>{ui.nav}</strong>{page.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}{selectedCars.length > 0 && <a href="#models"><span>↗</span>{ui.rates}</a>}</nav><article className="info-article">{page.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><p className="info-section-number">0{index + 1} / CARTIME</p><h2>{section.heading}</h2><p>{section.text}</p>{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}{selectedCars.length > 0 && <section id="models" className="rental-models"><h2>{ui.rates}</h2><p>{ui.rateNote}</p><div>{selectedCars.map((car) => <a href={`/${language}/fleet#category-${page.fleetCategory}`} key={car.id}><span>{car.name} · {car.year}</span><strong>{car.ratesUsd[0]} {guideUi[language].perDay}</strong></a>)}</div></section>}<div className="rental-action"><ContactLinks locale={language} /><a href={`/${language}/fleet`}>{ui.compare} →</a><a href={`/${language}/faq`}>{ui.faq} →</a></div></article></div>
      <section className="info-related"><div className="container"><div className="info-related-head"><div><p className="section-kicker">CARTIME / RENTAL</p><h2>{ui.related}</h2></div><a href={`/${language}/rental`}>{ui.nav} →</a></div><div className="rental-hub-grid rental-hub-grid--related">{related.map((item) => { const relatedPage = rentalPages[language][item]; return <a className="rental-topic" key={item} href={`/${language}/rental/${item}`}><h3>{relatedPage.title}</h3><p>{relatedPage.teaser}</p><b>{ui.read} →</b></a>; })}</div></div></section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "CarTime", item: `${siteOrigin}/${language}` }, { "@type": "ListItem", position: 2, name: ui.nav, item: `${siteOrigin}/${language}/rental` }, { "@type": "ListItem", position: 3, name: page.title, item: `${siteOrigin}/${language}/rental/${key}` }] }) }} />
  </InfoShell>;
}
