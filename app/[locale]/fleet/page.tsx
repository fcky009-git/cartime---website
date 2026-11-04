import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import fleet from "@/lib/fleet.json";
import { dictionaries, type Locale } from "@/lib/i18n";
import { fleetUi } from "@/lib/fleet-ui";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "az" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const ui = guideUi[locale as Locale];
  return pageMetadata(locale as Locale, "fleet", ui.fleetTitle, ui.fleetDescription);
}

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = guideUi[language];
  const categories = fleetUi[language].categories;
  return <InfoShell locale={language} current="fleet">
    <main>
      <header className="info-hero info-hero--fleet">
        <div className="container info-hero-inner">
          <a className="info-back" href={`/${language}`}>← {ui.back}</a>
          <p className="section-kicker">CARTIME / 55 CARS</p>
          <h1>{ui.fleetTitle}</h1>
          <p>{ui.fleetIntro}</p>
          <span className="info-date">{ui.updated}</span>
        </div>
      </header>
      <div className="container fleet-page-body">
        <section className="info-checklist"><h2>{ui.fleetNoteTitle}</h2><p>{ui.fleetNote}</p></section>
        <div className="fleet-page-index" aria-label={ui.fleetTitle}>
          {Object.entries(categories).filter(([key]) => key !== "all").map(([key, name]) => <a key={key} href={`#category-${key}`}>{name}</a>)}
        </div>
        {Object.entries(categories).filter(([key]) => key !== "all").map(([key, name]) => {
          const cars = fleet.filter((car) => car.category === key);
          if (!cars.length) return null;
          return <section className="fleet-page-group" id={`category-${key}`} key={key}>
            <div className="fleet-page-group-head"><h2>{name}</h2><span>{cars.length}</span></div>
            <div className="fleet-table-scroll"><table className="fleet-table">
              <thead><tr><th scope="col">{language === "ru" ? "Модель / год" : language === "az" ? "Model / il" : "Model / year"}</th>{ui.fleetDuration.map((duration) => <th scope="col" key={duration}>{duration}<small>{ui.perDay}</small></th>)}</tr></thead>
              <tbody>{cars.map((car) => <tr key={car.id}><th scope="row">{car.name}<small>{car.year}</small></th>{car.ratesUsd.map((rate, index) => <td key={index}>$${rate}</td>)}</tr>)}</tbody>
            </table></div>
          </section>;
        })}
        <div className="fleet-page-more">
          <h2>{ui.next}</h2>
          <div className="guide-card-grid">{guideSlugs.map((slug) => <a className="guide-card" href={`/${language}/guide/${slug}`} key={slug}><span>{guides[language][slug].eyebrow}</span><h3>{guides[language][slug].title}</h3><p>{guides[language][slug].teaser}</p><b>{ui.read} ↗</b></a>)}</div>
        </div>
      </div>
    </main>
  </InfoShell>;
}
