"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { dictionaries, type Locale } from "@/lib/i18n";
import { fleetUi } from "@/lib/fleet-ui";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import fleet from "@/lib/fleet.json";

type Theme = "hybrid" | "dark" | "light";
const themeNames: Theme[] = ["hybrid", "dark", "light"];
const anchors = ["fleet", "benefits", "airport", "faq"];
const categories = ["all", "Mini", "Economy", "Comfort", "SUV", "Business", "VAN", "Luxury"] as const;
const illustrationFor = (category: string) => category === "SUV" || category === "VAN" ? "/assets/suv.svg" : category === "Luxury" || category === "Business" ? "/assets/sedan-dark.svg" : "/assets/sedan.svg";

export default function CarTimeSite({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  const f = fleetUi[locale];
  const g = guideUi[locale];
  const [theme, setTheme] = useState<Theme>("hybrid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [modelQuery, setModelQuery] = useState("");
  const [sort, setSort] = useState("priceAsc");
  const [visibleCount, setVisibleCount] = useState(12);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [detailCar, setDetailCar] = useState<string | null>(null);
  const [pickup, setPickup] = useState("city");
  const [dropoff, setDropoff] = useState("city");
  const [fromDate, setFromDate] = useState("");
  const selectedCar = fleet.find((car) => car.id === detailCar);
  const filteredCars = fleet.filter((car) =>
    (category === "all" || car.category === category) &&
    car.name.toLocaleLowerCase().includes(modelQuery.trim().toLocaleLowerCase()),
  ).sort((a, b) => sort === "priceDesc" ? b.ratesUsd[0] - a.ratesUsd[0] : sort === "yearDesc" ? b.year - a.year || a.ratesUsd[0] - b.ratesUsd[0] : a.ratesUsd[0] - b.ratesUsd[0]);

  useEffect(() => {
    const stored = localStorage.getItem("cartime-theme");
    if (themeNames.includes(stored as Theme)) setTheme(stored as Theme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!detailCar) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setDetailCar(null); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [detailCar]);

  function changeTheme(next: Theme) {
    setTheme(next);
    localStorage.setItem("cartime-theme", next);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fromDate = String(formData.get("from") || "");
    const toDate = String(formData.get("to") || "");
    if (!fromDate || !toDate || toDate <= fromDate) {
      setMessage(t.searchError);
      setMessageIsError(true);
      return;
    }
    setMessage(t.searchResult);
    setMessageIsError(false);
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseAirport() {
    setPickup("airport");
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="CarTime — home">
            {/* The dark mark is extracted from the supplied approved reference. */}
            <img className="dark-logo" src="/assets/logo-dark.png" alt="CarTime" />
            <img className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {t.nav.map((label, index) => <a key={anchors[index]} href={`#${anchors[index]}`}>{label}</a>)}
            <a href="#guides">{g.nav}</a>
          </nav>
          <div className="header-actions">
            <div className="language-links" aria-label={t.languageLabel}>
              {(["az", "en", "ru"] as Locale[]).map((code) => <a key={code} href={`/${code}`} lang={code} aria-current={code === locale ? "page" : undefined}>{code.toUpperCase()}</a>)}
            </div>
            <div className="theme-picker" role="group" aria-label={t.themeLabel}>
              {themeNames.map((name, index) => <button key={name} type="button" aria-pressed={theme === name} onClick={() => changeTheme(name)}>{t.themes[index]}</button>)}
            </div>
            <a className="header-cta" href="#search">{t.findCar} <ArrowRight size={16} /></a>
            <button className="menu-button" type="button" aria-label={menuOpen ? t.close : t.mobileMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{t.nav.map((label, index) => <a key={anchors[index]} href={`#${anchors[index]}`} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}<a href="#guides" onClick={() => setMenuOpen(false)}>{g.nav}<ArrowRight size={16} /></a></nav>}
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-photo" role="img" aria-label="CarTime automotive scene inspired by Baku" />
          <div className="hero-sheen" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div>
              <h1>{t.heroTitle}</h1>
              <p className="hero-lead">{t.heroLead}</p>
              <div className="hero-actions"><a className="button-primary" href="#fleet">{t.explore}<ArrowRight size={18} /></a><span className="hero-slogan">Drive on Your Time</span></div>
            </div>
            <span className="hero-demo">{t.demoBadge}</span>
            <div className="hero-counter"><span>01</span><div /><span>03</span></div>
          </div>
        </section>

        <div className="container search-container" id="search">
          <form className="search-panel" onSubmit={submitSearch} noValidate>
            <div className="search-heading"><span className="search-icon"><ArrowDownRight size={20} /></span><strong>{t.searchTitle}</strong></div>
            <div className="search-fields">
              <label className="search-field"><span>{t.pickup}</span><select value={pickup} onChange={(e) => setPickup(e.target.value)}><option value="city">{t.city}</option><option value="airport">{t.airport}</option></select></label>
              <label className="search-field"><span>{t.dropoff}</span><select value={dropoff} onChange={(e) => setDropoff(e.target.value)}><option value="city">{t.city}</option><option value="airport">{t.airport}</option></select></label>
              <label className="search-field"><span>{t.start}</span><input name="from" type="date" onInput={(e) => setFromDate(e.currentTarget.value)} /></label>
              <label className="search-field"><span>{t.end}</span><input name="to" type="date" min={fromDate || undefined} /></label>
              <button className="search-button" type="submit">{t.search}<ArrowRight size={18} /></button>
            </div>
            {message && <p className={`search-message ${messageIsError ? "error" : ""}`} role="status">{message}</p>}
          </form>
        </div>

        <section className="section benefits-section" id="benefits">
          <div className="container">
            <div className="section-head"><div><p className="section-kicker">CARTIME / 01</p><h2>{t.benefitTitle}</h2></div><p className="section-intro">{t.benefitLead}</p></div>
            <div className="benefit-grid">{t.benefits.map((benefit) => <article className="benefit-card" key={benefit[0]}><span className="benefit-number">{benefit[0]}</span><div><h3>{benefit[1]}</h3><p>{benefit[2]}</p></div><ArrowDownRight size={20} aria-hidden="true" /></article>)}</div>
          </div>
        </section>

        <section className="section fleet-section" id="fleet">
          <div className="container">
            <div className="section-head"><div><p className="section-kicker">CARTIME / 02 · {f.kicker}</p><h2>{f.title}</h2></div><p className="section-intro">{f.lead}</p></div>
            <div className="fleet-toolbar"><label className="fleet-query"><Search size={17} /><span className="sr-only">{f.searchLabel}</span><input type="search" value={modelQuery} placeholder={f.searchPlaceholder} onChange={(event) => { setModelQuery(event.target.value); setVisibleCount(12); }} /></label><label className="fleet-sort"><span>{f.sortLabel}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="priceAsc">{f.sortOptions[0]}</option><option value="priceDesc">{f.sortOptions[1]}</option><option value="yearDesc">{f.sortOptions[2]}</option></select></label></div>
            <div className="filter-row" role="group" aria-label={f.title}>{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); setVisibleCount(12); }}>{f.categories[item]}</button>)}</div>
            <p className="fleet-count">{filteredCars.length} {f.count}</p>
            {filteredCars.length ? <div className="car-grid">{filteredCars.slice(0, visibleCount).map((car, index) => <article className="car-card" key={car.id}><div className="car-image"><span className="car-tag">{f.categories[car.category]}</span><img src={illustrationFor(car.category)} alt="" aria-hidden="true" loading={index < 3 ? "eager" : "lazy"} decoding="async" /><span className="car-art-note">{f.illustration}</span></div><div className="car-info"><div><h3>{car.name}</h3><p>{car.year} · {f.categories[car.category]}</p></div><div className="car-bottom"><div className="car-price"><strong>${car.ratesUsd[0]}</strong><small>{f.rateContext}</small></div><button type="button" onClick={() => setDetailCar(car.id)} aria-label={`${f.viewRates}: ${car.name} ${car.year}`}><ArrowRight size={20} /></button></div></div></article>)}</div> : <p className="fleet-empty">{f.empty}</p>}
            {filteredCars.length > visibleCount && <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 12)}>{f.more}<ArrowDownRight size={17} /></button>}
            <a className="fleet-all-link" href={`/${locale}/fleet`}>{g.allCars}<ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="airport-section" id="airport">
          <div className="container airport-inner"><div><p className="airport-kicker">{t.airportEyebrow}</p><h2>{t.airportTitle}</h2><p>{t.airportLead}</p><button className="airport-button" onClick={chooseAirport} type="button">{t.airportCta}<ArrowRight size={18} /></button><a className="airport-guide-link" href={`/${locale}/guide/airport`}>{guides[locale].airport.title} ↗</a></div></div>
        </section>

        <section className="section home-guides" id="guides"><div className="container"><div className="section-head"><div><p className="section-kicker">CARTIME / GUIDE</p><h2>{g.homeTitle}</h2></div><p className="section-intro">{g.homeLead}</p></div><div className="guide-card-grid">{guideSlugs.map((slug, index) => <a className="guide-card" key={slug} href={`/${locale}/guide/${slug}`}><span>0{index + 1} / {guides[locale][slug].eyebrow}</span><h3>{guides[locale][slug].title}</h3><p>{guides[locale][slug].teaser}</p><b>{g.read} ↗</b></a>)}</div></div></section>

        <section className="section faq-section" id="faq"><div className="container faq-inner"><div><p className="section-kicker">CARTIME / 03</p><h2>{t.faqTitle}</h2><p className="faq-slogan">Drive on Your Time</p></div><div className="faq-list">{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><img className="dark-logo" src="/assets/logo-dark.png" alt="CarTime" /><img className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" /><p>{t.footerText}</p></div><div className="footer-right"><p>{t.footerDemo}</p><a href={`/${locale}/fleet`}>{g.allCars} ↗</a><a href="#top">{t.backTop} ↑</a></div></div><nav className="container footer-guides" aria-label={g.nav}>{guideSlugs.map((slug) => <a key={slug} href={`/${locale}/guide/${slug}`}>{guides[locale][slug].title}</a>)}</nav><div className="container footer-bottom"><span>© {new Date().getFullYear()} CarTime</span><span>AZ / EN / RU</span></div></footer>

      {selectedCar && <div className="modal-backdrop" onMouseDown={() => setDetailCar(null)}><div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="car-modal-title" onMouseDown={(e) => e.stopPropagation()}><button type="button" className="modal-close" aria-label={t.close} onClick={() => setDetailCar(null)}><X size={20} /></button><div className="modal-image"><img src={illustrationFor(selectedCar.category)} alt="" aria-hidden="true" /><span>{f.illustration}</span></div><div className="modal-content"><p className="section-kicker">{f.categories[selectedCar.category]} · {selectedCar.year}</p><h2 id="car-modal-title">{selectedCar.name}</h2><h3>{f.tariffTitle}</h3><div className="tariff-list">{selectedCar.ratesUsd.map((rate, index) => <div key={f.durations[index]}><span>{f.durations[index]}</span><strong>${rate} <small>{f.perDay}</small></strong></div>)}</div><p className="tariff-note">{f.tariffNote}</p></div></div></div>}
    </div>
  );
}
