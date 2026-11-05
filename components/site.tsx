"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { dictionaries, type Locale } from "@/lib/i18n";
import { fleetUi } from "@/lib/fleet-ui";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import { faqItems, serviceUi } from "@/lib/service-info";
import QuickHelp from "@/components/quick-help";
import ContactLinks from "@/components/contact-links";
import { rentalPages, rentalSlugs, rentalUi } from "@/lib/rental-pages";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { bookingUi } from "@/lib/booking";
import { carDetailUi } from "@/lib/car-detail-ui";
import { addDaysIso, rentalDuration } from "@/lib/rental-duration";
import SiteDirectory from "@/components/site-directory";
import { contactLocation } from "@/lib/service-info";

type Theme = "hybrid" | "dark" | "light";
const themeNames: Theme[] = ["hybrid", "dark", "light"];
const themeConcepts: Record<Theme, string> = { hybrid: "Vision Glass", dark: "Obsidian Motion", light: "Aero Liquid" };
const editorialUi: Record<Locale, { lineOne: string; lineTwo: string; lead: string; select: string; explore: string; scroll: string; pickup: string; collection: string; styles: string }> = {
  ru: { lineOne: "Баку ближе.", lineTwo: "Когда вы за рулём.", lead: "Выберите автомобиль для поездок по Баку и всему Азербайджану. Маршрут задаёте вы.", select: "Выбрать автомобиль", explore: "Смотреть автопарк", scroll: "Листайте вниз", pickup: "Начните поездку", collection: "Выберите место и даты — покажем автомобили и тарифы.", styles: "Стиль сайта" },
  az: { lineOne: "Bakı daha yaxındır.", lineTwo: "Sükan sizdədir.", lead: "Bakı və bütün Azərbaycan üzrə səfəriniz üçün avtomobil seçin. Marşrutu siz müəyyənləşdirirsiniz.", select: "Avtomobil seçin", explore: "Avtoparka baxın", scroll: "Aşağı keçin", pickup: "Səfərə başlayın", collection: "Məkan və tarixləri seçin — avtomobilləri və tarifləri göstərəcəyik.", styles: "Saytın üslubu" },
  en: { lineOne: "Baku gets closer.", lineTwo: "Take the wheel.", lead: "Choose a car for Baku and the rest of Azerbaijan. The route is yours to make.", select: "Find your car", explore: "Explore the fleet", scroll: "Scroll to explore", pickup: "Begin your journey", collection: "Choose your place and dates to see cars and published rates.", styles: "Site style" },
};
const categories = ["all", "Mini", "Economy", "Comfort", "SUV", "Business", "VAN", "Luxury"] as const;
const bakuToday = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const homeFaqIds = ["rates", "cars", "airport", "documents", "deposit", "booking"];
const mapUi: Record<Locale, { kicker: string; title: string; lead: string; open: string; contact: string }> = {
  ru: { kicker: "CARTIME / КАРТА", title: "Наш офис в центре Баку", lead: "221F Nizami Gəncəvi, Bakı 1000. Можем согласовать получение здесь, в аэропорту GYD или доставку по адресу.", open: "Открыть в Google Картах", contact: "Контакты и маршрут" },
  az: { kicker: "CARTIME / XƏRİTƏ", title: "Bakının mərkəzində ofisimiz", lead: "221F Nizami Gəncəvi, Bakı 1000. Avtomobili burada, GYD hava limanında və ya ünvanda təhvil almağı razılaşdıra bilərsiniz.", open: "Google Xəritədə açın", contact: "Əlaqə və yol" },
  en: { kicker: "CARTIME / MAP", title: "Our office in central Baku", lead: "221F Nizami Gəncəvi, Bakı 1000. Arrange collection here, at GYD airport or at your address.", open: "Open in Google Maps", contact: "Contact and directions" },
};

export default function CarTimeSite({ locale }: { locale: Locale }) {
  const t = dictionaries[locale];
  const f = fleetUi[locale];
  const g = guideUi[locale];
  const s = serviceUi[locale];
  const rental = rentalUi[locale];
  const carInfo = carDetailUi[locale];
  const e = editorialUi[locale];
  const [theme, setTheme] = useState<Theme>("hybrid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [modelQuery, setModelQuery] = useState("");
  const [sort, setSort] = useState("priceAsc");
  const [visibleCount, setVisibleCount] = useState(8);
  const [detailCar, setDetailCar] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [pickup, setPickup] = useState("city");
  const [dropoff, setDropoff] = useState("city");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("10:00");
  const [today, setToday] = useState("");
  const searchDays = rentalDuration(fromDate, fromTime, toDate, toTime).days;
  const selectedCar = fleet.find((car) => car.id === detailCar);
  const filteredCars = fleet.filter((car) =>
    (category === "all" || car.category === category) &&
    car.name.toLocaleLowerCase().includes(modelQuery.trim().toLocaleLowerCase()),
  ).sort((a, b) => sort === "priceDesc" ? b.ratesUsd[0] - a.ratesUsd[0] : sort === "yearDesc" ? b.year - a.year || a.ratesUsd[0] - b.ratesUsd[0] : a.ratesUsd[0] - b.ratesUsd[0]);

  useEffect(() => {
    const stored = localStorage.getItem("cartime-theme");
    if (themeNames.includes(stored as Theme)) setTheme(stored as Theme);
    const current = bakuToday();
    const start = addDaysIso(current, 1);
    setToday(current);
    setFromDate(start);
    setToDate(addDaysIso(start, 3));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".home-site .site-header");
    const hero = document.querySelector<HTMLElement>(".home-site .hero");
    if (!header || !hero) return;
    let scheduled = false;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 36);
      hero.style.setProperty("--hero-parallax", `${Math.min(y, 900) * .15}px`);
      const extent = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      header.style.setProperty("--page-progress", `${Math.min(100, y / extent * 100)}%`);
      scheduled = false;
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
    const sections = document.querySelectorAll<HTMLElement>(".home-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    sections.forEach((section) => observer.observe(section));
    document.documentElement.classList.add("motion-ready");
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, []);

  useEffect(() => {
    if (!detailCar) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalRef.current?.querySelector<HTMLElement>(".modal-close")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailCar(null);
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus?.focus(); };
  }, [detailCar]);

  function changeTheme(next: Theme) {
    setTheme(next);
    localStorage.setItem("cartime-theme", next);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams({ pickup, dropoff,
      from: String(formData.get("from") || fromDate), to: String(formData.get("to") || toDate),
      fromTime: String(formData.get("fromTime") || fromTime), toTime: String(formData.get("toTime") || toTime),
    });
    window.location.href = `/${locale}/booking?${params.toString()}`;
  }

  function chooseAirport() {
    setPickup("airport");
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="site-shell home-site">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="CarTime — home">
            {/* The dark mark is extracted from the supplied approved reference. */}
            <img className="dark-logo" src="/assets/logo-dark.png" alt="CarTime" />
            <img className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" />
            <span className="brand-caption" aria-hidden="true">CAR RENTAL</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#fleet">{t.nav[0]}</a>
            <a href="#benefits">{t.nav[1]}</a>
            <a href="#airport">{t.nav[2]}</a>
            <SiteDirectory locale={locale} />
          </nav>
          <div className="header-actions">
            <div className="language-links" aria-label={t.languageLabel}>
              {(["az", "en", "ru"] as Locale[]).map((code) => <a key={code} href={`/${code}`} lang={code} aria-current={code === locale ? "page" : undefined}>{code.toUpperCase()}</a>)}
            </div>
            <div className="theme-picker" role="group" aria-label={e.styles}>
              {themeNames.map((name, index) => <button key={name} type="button" title={themeConcepts[name]} aria-label={`${t.themes[index]} — ${themeConcepts[name]}`} aria-pressed={theme === name} onClick={() => changeTheme(name)}><span>{t.themes[index]}</span></button>)}
            </div>
            <a className="header-cta" href="#search">{e.select} <ArrowRight size={16} /></a>
            <button className="menu-button" type="button" aria-label={menuOpen ? t.close : t.mobileMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
          </div>
          <span className="nav-progress" aria-hidden="true" />
        </div>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#search" onClick={() => setMenuOpen(false)}>{e.select}<ArrowRight size={18} /></a><a href="#fleet" onClick={() => setMenuOpen(false)}>{t.nav[0]}<ArrowRight size={18} /></a><a href="#airport" onClick={() => setMenuOpen(false)}>{t.nav[2]}<ArrowRight size={18} /></a><a href="#map" onClick={() => setMenuOpen(false)}>{locale === "ru" ? "Карта" : locale === "az" ? "Xəritə" : "Map"}<ArrowRight size={18} /></a><SiteDirectory locale={locale} /><div className="mobile-theme-picker" role="group" aria-label={e.styles}>{themeNames.map((name, index) => <button key={name} type="button" aria-pressed={theme === name} onClick={() => { changeTheme(name); setMenuOpen(false); }}>{t.themes[index]}</button>)}</div></nav>}
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-photo" role="img" aria-label="CarTime automotive scene in Baku" />
          <div className="hero-sheen" />
          <div className="container hero-inner">
            <div className="hero-copy"><p className="hero-overline"><span className="overline-dot" />Drive on Your Time <span>·</span> {t.eyebrow}</p><h1><span>{e.lineOne}</span><em>{e.lineTwo}</em></h1></div>
            <div className="hero-side"><p className="hero-lead">{e.lead}</p><a className="button-primary" href="#search">{e.select}<ArrowRight size={18} /></a><a className="hero-text-link" href="#fleet">{e.explore}<ArrowDownRight size={17} /></a></div>
            <a className="hero-scroll" href="#search"><span className="scroll-line" /><span>{e.scroll}</span><ArrowDown size={14} /></a>
            <span className="hero-index">01 / 04 — BAKU</span>
          </div>
        </section>

        <div className="container search-container" id="search">
          <form className="search-panel" onSubmit={submitSearch} noValidate>
            <div className="search-heading"><span className="search-icon">01 / DRIVE</span><strong>{e.pickup}</strong><p>{e.collection}</p></div>
            <div className="search-fields">
              <label className="search-field"><span>{t.pickup}</span><select value={pickup} onChange={(e) => setPickup(e.target.value)}><option value="city">{t.city}</option><option value="airport">{t.airport}</option></select></label>
              <label className="search-field"><span>{t.dropoff}</span><select value={dropoff} onChange={(e) => setDropoff(e.target.value)}><option value="city">{t.city}</option><option value="airport">{t.airport}</option></select></label>
              <label className="search-field"><span>{t.start}</span><input name="from" type="date" min={today || undefined} value={fromDate} onChange={(e) => { const value = e.target.value; setFromDate(value); if (value && (!toDate || toDate <= value)) setToDate(addDaysIso(value, 3)); }} /></label>
              <label className="search-field search-time"><span>{bookingUi[locale].time}</span><input name="fromTime" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} /></label>
              <label className="search-field"><span>{t.end}</span><input name="to" type="date" min={fromDate || today || undefined} value={toDate} onChange={(e) => setToDate(e.target.value)} /></label>
              <label className="search-field search-time"><span>{bookingUi[locale].time}</span><input name="toTime" type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} /></label>
              <button className="search-button" type="submit">{t.search}<ArrowRight size={18} /></button>
            </div>
            <p className="search-message" aria-live="polite">{searchDays ? `${bookingUi[locale].days}: ${searchDays} · ` : ""}{bookingUi[locale].durationHint}</p>
          </form>
        </div>

        <section className="section benefits-section home-reveal" id="benefits">
          <div className="container">
            <div className="section-head"><div><p className="section-kicker">CARTIME / 01</p><h2>{t.benefitTitle}</h2></div><p className="section-intro">{t.benefitLead}</p></div>
            <div className="benefit-grid">{t.benefits.map((benefit) => <article className="benefit-card" key={benefit[0]}><span className="benefit-number">{benefit[0]}</span><div><h3>{benefit[1]}</h3><p>{benefit[2]}</p></div><ArrowDownRight size={20} aria-hidden="true" /></article>)}</div>
          </div>
        </section>

        <section className="section fleet-section home-reveal" id="fleet">
          <div className="container">
            <div className="section-head"><div><p className="section-kicker">CARTIME / 02 · {f.kicker}</p><h2>{f.title}</h2></div><p className="section-intro">{f.lead}</p></div>
            <div className="fleet-toolbar"><label className="fleet-query"><Search size={17} /><span className="sr-only">{f.searchLabel}</span><input type="search" value={modelQuery} placeholder={f.searchPlaceholder} onChange={(event) => { setModelQuery(event.target.value); setVisibleCount(8); }} /></label><label className="fleet-sort"><span>{f.sortLabel}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="priceAsc">{f.sortOptions[0]}</option><option value="priceDesc">{f.sortOptions[1]}</option><option value="yearDesc">{f.sortOptions[2]}</option></select></label></div>
            <div className="filter-row" role="group" aria-label={f.title}>{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); setVisibleCount(8); }}>{f.categories[item]}</button>)}</div>
            <p className="fleet-count">{filteredCars.length} {f.count}</p>
            <div className="fleet-showcase">{filteredCars.length ? <div className="car-grid">{filteredCars.slice(0, visibleCount).map((car, index) => <article className="car-card" key={car.id}><button className="car-card-open" type="button" onClick={() => setDetailCar(car.id)} aria-label={`${carInfo.details}: ${car.name} ${car.year}`}><div className="car-image"><span className="car-tag">{f.categories[car.category]}</span><img src={(fleetImages as Record<string, string>)[car.id]} alt={`${car.name} ${car.year}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" onError={(event) => { event.currentTarget.src = car.category === "SUV" ? "/assets/suv.svg" : "/assets/sedan.svg"; }} /></div><div className="car-info"><div className="car-heading"><div><p className="car-year">{car.year} · {f.categories[car.category]}</p><h3>{car.name}</h3></div><span className="car-card-arrow"><ArrowRight size={18} /></span></div><p className="car-fit">{carInfo.fit[car.category]}</p><div className="car-features"><span>{carInfo.included[0]}</span><span>{carInfo.included[1]}</span></div><div className="car-bottom"><div className="car-price"><strong>${car.ratesUsd[0]}</strong><small>{f.durations[0]} · {f.perDay}</small></div><div className="car-price car-price-long"><strong>${car.ratesUsd[1]}</strong><small>{f.durations[1]} · {f.perDay}</small></div></div></div></button></article>)}</div> : <p className="fleet-empty">{f.empty}</p>}</div>
            {filteredCars.length > visibleCount && <button className="load-more" type="button" onClick={() => setVisibleCount((count) => count + 12)}>{f.more}<ArrowDownRight size={17} /></button>}
            <a className="fleet-all-link" href={`/${locale}/fleet`}>{g.allCars}<ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="airport-section home-reveal" id="airport">
          <div className="container airport-inner"><div><p className="airport-kicker">{t.airportEyebrow}</p><h2>{t.airportTitle}</h2><p>{t.airportLead}</p><button className="airport-button" onClick={chooseAirport} type="button">{t.airportCta}<ArrowRight size={18} /></button><a className="airport-guide-link" href={`/${locale}/guide/airport`}>{guides[locale].airport.title} ↗</a></div></div>
        </section>

        <section className="section home-guides home-reveal" id="guides"><div className="container"><div className="section-head"><div><p className="section-kicker">CARTIME / GUIDE</p><h2>{g.homeTitle}</h2></div><p className="section-intro">{g.homeLead}</p></div><div className="guide-card-grid">{guideSlugs.map((slug, index) => <a className={`guide-card guide-card--${slug}`} key={slug} href={`/${locale}/guide/${slug}`}><span>0{index + 1} / {guides[locale][slug].eyebrow}</span><h3>{guides[locale][slug].title}</h3><p>{guides[locale][slug].teaser}</p><b>{g.read} ↗</b></a>)}</div></div></section>

        <section className="section home-rental home-reveal" id="rental"><div className="container"><div className="section-head"><div><p className="section-kicker">CARTIME / RENTAL</p><h2>{rental.hubTitle}</h2></div><p className="section-intro">{rental.hubLead}</p></div><div className="rental-hub-grid">{rentalSlugs.slice(0, 3).map((slug, index) => <a className="rental-topic" key={slug} href={`/${locale}/rental/${slug}`}><span>0{index + 1} / {rental.nav}</span><h3>{rentalPages[locale][slug].title}</h3><p>{rentalPages[locale][slug].teaser}</p><b>{rental.read} →</b></a>)}</div><div className="rental-hub-cta"><a href={`/${locale}/rental`}>{rental.nav} →</a><a href={`/${locale}/booking`}>{bookingUi[locale].nav} →</a><a href={`/${locale}/contact`}>{rental.contact} →</a></div></div></section>

        <section className="section home-map home-reveal" id="map"><div className="container home-map-grid"><div className="home-map-copy"><p className="section-kicker">{mapUi[locale].kicker}</p><h2>{mapUi[locale].title}</h2><p>{mapUi[locale].lead}</p><address>{contactLocation.address}</address><div className="home-map-actions"><a href={contactLocation.mapsUrl} target="_blank" rel="noopener noreferrer">{mapUi[locale].open} ↗</a><a href={`/${locale}/contact`}>{mapUi[locale].contact} →</a></div></div><div className="home-map-frame"><iframe title={mapUi[locale].title} src="https://maps.google.com/maps?q=40.3778175%2C49.8561227&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></div></section>

        <section className="section home-about" id="about"><div className="container home-about-inner"><div><p className="section-kicker">{s.aboutEyebrow}</p><h2>{s.aboutTitle}</h2><p>{s.aboutMission}</p><div className="home-about-actions"><a href={`/${locale}/about`}>{s.aboutNav}<ArrowRight size={17} /></a><a href={`/${locale}/fleet`}>{s.aboutCta}<ArrowRight size={17} /></a></div></div><div className="home-about-facts">{s.aboutFacts.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></div></section>

        <section className="section faq-section" id="faq"><div className="container faq-inner"><div><p className="section-kicker">CARTIME / FAQ</p><h2>{s.faqTitle}</h2><p className="faq-slogan">{s.quickLead}</p><a className="faq-all-link" href={`/${locale}/faq`}>{s.quickButton}<ArrowRight size={17} /></a></div><div className="faq-list">{homeFaqIds.map((id) => faqItems[locale].find((item) => item.id === id)).filter((item) => !!item).map((item) => <details key={item.id}><summary>{item.question}<ChevronDown size={20} /></summary><p>{item.answer}</p></details>)}</div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><img className="dark-logo" src="/assets/logo-dark.png" alt="CarTime" /><img className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" /><span className="brand-caption" aria-hidden="true">CAR RENTAL</span><p>{t.footerText}</p><ContactLinks locale={locale} /></div><div className="footer-right"><p>{t.footerDemo}</p><a href={`/${locale}/fleet`}>{g.allCars} ↗</a><a href={`/${locale}/booking`}>{bookingUi[locale].nav} ↗</a><a href="#top">{t.backTop} ↑</a></div></div><nav className="container footer-guides" aria-label={g.nav}><a href={`/${locale}/booking`}>{bookingUi[locale].nav}</a><a href={`/${locale}/about`}>{s.aboutNav}</a><a href={`/${locale}/faq`}>{s.faqNav}</a><a href={`/${locale}/rental`}>{rental.nav}</a><a href={`/${locale}/contact`}>{rental.contact}</a>{rentalSlugs.map((slug) => <a key={slug} href={`/${locale}/rental/${slug}`}>{rentalPages[locale][slug].title}</a>)}{guideSlugs.map((slug) => <a key={slug} href={`/${locale}/guide/${slug}`}>{guides[locale][slug].title}</a>)}</nav><div className="container footer-bottom"><span>© {new Date().getFullYear()} CarTime</span><span>AZ / EN / RU</span></div></footer>

      <QuickHelp locale={locale} />

      {selectedCar && <div className="modal-backdrop" onMouseDown={() => setDetailCar(null)}><div className="detail-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="car-modal-title" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label={carInfo.close} onClick={() => setDetailCar(null)}><X size={20} /></button>
        <div className="modal-image"><img src={(fleetImages as Record<string, string>)[selectedCar.id]} alt={`${selectedCar.name} ${selectedCar.year}`} /><span>{selectedCar.year} · {f.categories[selectedCar.category]}</span></div>
        <div className="modal-content"><p className="section-kicker">CARTIME / {f.categories[selectedCar.category]}</p><h2 id="car-modal-title">{selectedCar.name}</h2><p className="modal-fit">{carInfo.fit[selectedCar.category]}</p>
          <div className="modal-fact-groups"><section><h3>{carInfo.highlights}</h3><ul>{carInfo.included.map((line) => <li key={line}>✓ {line}</li>)}</ul></section><section><h3>{carInfo.before}</h3><ul>{carInfo.terms.map((line) => <li key={line}>✓ {line}</li>)}</ul></section></div>
          <h3>{carInfo.rates}</h3><div className="tariff-list">{selectedCar.ratesUsd.map((rate, index) => <div key={f.durations[index]}><span>{f.durations[index]}</span><strong>${rate} <small>{f.perDay}</small></strong></div>)}</div><p className="tariff-note">{carInfo.rateNote}</p><div className="modal-actions"><a className="booking-modal-link" href={`/${locale}/booking?car=${selectedCar.id}`}>{bookingUi[locale].nav}<ArrowRight size={18} /></a><a href={`/${locale}/fleet`}>{carInfo.compare} ↗</a></div>
        </div></div></div>}
    </div>
  );
}
