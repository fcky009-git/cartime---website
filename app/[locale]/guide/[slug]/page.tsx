import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import { dictionaries, type Locale } from "@/lib/i18n";
import { guideSlugs, guides, guideSources, guideUi, type GuideSlug } from "@/lib/guides";
import { jsonLd, pageMetadata, siteOrigin } from "@/lib/seo";
import { locales } from "@/lib/locales";

type RouteParams = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => guideSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(locale in dictionaries) || !guideSlugs.includes(slug as GuideSlug)) return {};
  const guide = guides[locale as Locale][slug as GuideSlug];
  return pageMetadata(locale as Locale, `guide/${slug}`, guide.title, guide.description);
}

export default async function GuidePage({ params }: RouteParams) {
  const { locale, slug } = await params;
  if (!(locale in dictionaries) || !guideSlugs.includes(slug as GuideSlug)) notFound();
  const language = locale as Locale;
  const key = slug as GuideSlug;
  const guide = guides[language][key];
  const ui = guideUi[language];
  const related = guideSlugs.filter((item) => item !== key);
  return <InfoShell locale={language} current={`guide/${key}`}>
    <main>
      <header className={`info-hero info-hero--${key}`}>
        <div className="container info-hero-inner">
          <a className="info-back" href={`/${language}`}>← {ui.back}</a>
          <p className="section-kicker">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
        </div>
      </header>
      <div className="container info-body">
        <nav className="info-toc" aria-label={guide.title}>
          <strong>{guide.eyebrow}</strong>
          {guide.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}><span>0{index + 1}</span>{section.heading}</a>)}
          <a href="#checklist"><span>✓</span>{guide.checklistTitle}</a>
        </nav>
        <article className="info-article">
          {guide.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`}>
            <p className="info-section-number">0{index + 1} / {guide.eyebrow}</p>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </section>)}
          <section className="info-checklist" id="checklist">
            <h2>{guide.checklistTitle}</h2>
            <ul>{guide.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          {!!guideSources[key].length && <aside className="info-sources">
            <h2>{ui.sources}</h2>
            <p>{ui.sourcesLead}</p>
            <ul>{guideSources[key].map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a></li>)}</ul>
          </aside>}
        </article>
      </div>
      <section className="info-related">
        <div className="container">
          <div className="info-related-head"><div><p className="section-kicker">CARTIME / GUIDE</p><h2>{ui.next}</h2></div><a href={`/${language}/fleet`}>{ui.allCars} →</a></div>
          <div className="guide-card-grid">
            {related.map((item, index) => <a className="guide-card" key={item} href={`/${language}/guide/${item}`}><span>0{index + 1} / {guides[language][item].eyebrow}</span><h3>{guides[language][item].title}</h3><p>{guides[language][item].teaser}</p><b>{ui.read} ↗</b></a>)}
          </div>
        </div>
      </section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CarTime", item: `${siteOrigin}/${language}` },
        { "@type": "ListItem", position: 2, name: guide.title, item: `${siteOrigin}/${language}/guide/${key}` },
      ],
    }) }} />
  </InfoShell>;
}
