import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import { dictionaries, type Locale } from "@/lib/i18n";
import { contact, contactLocation, serviceUi } from "@/lib/service-info";
import { guideUi } from "@/lib/guides";
import { jsonLd, pageMetadata, siteOrigin } from "@/lib/seo";
import ContactLinks from "@/components/contact-links";
import { aboutStory } from "@/lib/about-story";

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
  const story = aboutStory[language];
  return <InfoShell locale={language} current="about">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CarTime",
      url: `${siteOrigin}/${language}`,
      email: contact.email,
      telephone: contact.phone,
      address: { "@type": "PostalAddress", streetAddress: "221F Nizami Gəncəvi", addressLocality: "Baku", postalCode: "1000", addressCountry: "AZ" },
      hasMap: contactLocation.mapsUrl,
      contactPoint: { "@type": "ContactPoint", telephone: contact.phone, email: contact.email, contactType: "customer support", availableLanguage: ["Azerbaijani", "English", "Russian"] },
    }) }} />
    <main>
      <header className="info-hero info-hero--about"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">{story.kicker}</p><h1>{story.title}</h1><p>{story.lead}</p><a className="about-hero-scroll" href="#our-story">↓ {story.timelineTitle}</a></div></header>
      <section className="container about-body">
        <div className="about-stats">{ui.aboutFacts.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
        <div className="about-intro-grid" id="our-story"><div><p className="section-kicker">{ui.aboutEyebrow}</p><h2>{story.timelineTitle}</h2></div><p>{ui.aboutIntro} {ui.aboutMission}</p></div>
        <div className="about-timeline">{story.timeline.map((item, index) => <article key={item.year} className="about-timeline-item"><div className="about-timeline-marker"><span>0{index + 1}</span><strong>{item.year}</strong></div><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
        <div className="about-fleet-story"><div className="about-fleet-copy"><p className="section-kicker">CARTIME / FLEET</p><h2>{story.fleetTitle}</h2><p>{story.fleetLead}</p><a href={`/${language}/fleet`}>{ui.aboutCta} <span aria-hidden="true">↗</span></a></div><div className="about-fleet-visual" role="img" aria-label={story.gallery[0].alt}><span>122 / 55</span></div></div>
        <div className="about-feature-grid">{story.fleetCards.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        <section className="about-gallery" aria-label={story.galleryTitle}><div className="about-section-head"><p className="section-kicker">CARTIME / JOURNAL</p><h2>{story.galleryTitle}</h2><p>{story.galleryLead}</p></div><div className="about-gallery-rail">{story.gallery.map((item, index) => <article className="about-gallery-slide" key={item.title} id={`story-slide-${index + 1}`}><img src={item.image} alt={item.alt} loading="lazy" /><div><span>0{index + 1} / 03</span><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div><nav className="about-gallery-nav" aria-label={story.galleryTitle}>{story.gallery.map((item, index) => <a key={item.title} href={`#story-slide-${index + 1}`} aria-label={`${index + 1}: ${item.title}`}>0{index + 1}</a>)}</nav></section>
        <section className="about-journey"><div className="about-section-head"><p className="section-kicker">CARTIME / EXPERIENCE</p><h2>{story.journeyTitle}</h2><p>{story.journeyLead}</p></div><div className="about-journey-grid">{story.journey.map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></section>
        <section className="about-promise"><div><p className="section-kicker">CARTIME / APPROACH</p><h2>{story.promiseTitle}</h2></div><ul>{story.promise.map((line) => <li key={line}>{line}</li>)}</ul></section>
        <div className="about-status"><div><p className="section-kicker">CARTIME / CONTACT</p><h2>{ui.aboutStatusTitle}</h2><p>{ui.aboutStatus}</p></div><div className="about-actions"><ContactLinks locale={language} /><a href={`/${language}/fleet`}>{ui.aboutCta} →</a><a href={`/${language}/faq`}>{ui.aboutFaqCta} →</a></div></div>
        <p className="about-editorial-note">{story.editorialNote}</p>
      </section>
    </main>
  </InfoShell>;
}
