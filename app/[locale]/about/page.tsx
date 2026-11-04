import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import { dictionaries, type Locale } from "@/lib/i18n";
import { serviceUi } from "@/lib/service-info";
import { guideUi } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "az" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const ui = serviceUi[locale as Locale];
  return pageMetadata(locale as Locale, "about", ui.aboutTitle, ui.aboutDescription);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = serviceUi[language];
  return <InfoShell locale={language} current="about">
    <main>
      <header className="info-hero info-hero--about"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">{ui.aboutEyebrow}</p><h1>{ui.aboutTitle}</h1><p>{ui.aboutIntro}</p></div></header>
      <section className="container about-body">
        <div className="about-stats">{ui.aboutFacts.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
        <div className="about-intro-grid"><div><p className="section-kicker">{ui.aboutEyebrow}</p><h2>{ui.aboutMissionTitle}</h2></div><p>{ui.aboutMission}</p></div>
        <h2>{ui.aboutWhatTitle}</h2>
        <div className="about-feature-grid">{ui.aboutWhat.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <div className="about-status"><div><p className="section-kicker">CARTIME / STATUS</p><h2>{ui.aboutStatusTitle}</h2><p>{ui.aboutStatus}</p></div><div className="about-actions"><a href={`/${language}/fleet`}>{ui.aboutCta} →</a><a href={`/${language}/faq`}>{ui.aboutFaqCta} →</a></div></div>
      </section>
    </main>
  </InfoShell>;
}
