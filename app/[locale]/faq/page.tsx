import { localeParams } from "@/lib/locales";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import JsonLd from "@/components/json-ld";
import FaqExplorer from "@/components/faq-explorer";
import { dictionaries, type Locale } from "@/lib/i18n";
import { faqItems, serviceUi } from "@/lib/service-info";
import { guideUi } from "@/lib/guides";
import { jsonLd, pageMetadata, siteOrigin } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const ui = serviceUi[locale as Locale];
  return pageMetadata(locale as Locale, "faq", ui.faqTitle, ui.faqDescription);
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = serviceUi[language];
  return <InfoShell locale={language} current="faq">
    <JsonLd data={breadcrumbJsonLd(language, [{ name: ui.faqTitle, path: "faq" }])} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: language,
      url: `${siteOrigin}/${language}/faq`,
      mainEntity: faqItems[language].map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
    }) }} />
    <main>
      <header className="info-hero info-hero--faq"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">{ui.faqEyebrow}</p><h1>{ui.faqTitle}</h1><p>{ui.faqIntro}</p></div></header>
      <section className="container faq-page-body"><FaqExplorer locale={language} /><aside className="faq-page-cta"><div><h2>{ui.faqMoreTitle}</h2><p>{ui.faqMoreText}</p></div><a href={`/${language}/fleet`}>{ui.faqMoreButton} →</a></aside></section>
    </main>
  </InfoShell>;
}
