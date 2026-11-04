"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, CarFront, Check, Clipboard, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { fleetUi } from "@/lib/fleet-ui";
import { bookingUi } from "@/lib/booking";
import { contact } from "@/lib/service-info";
import type { Locale } from "@/lib/i18n";

type Place = "office" | "airport" | "delivery";
type Car = (typeof fleet)[number];
type Currency = "USD" | "AZN" | "EUR" | "RUB" | "KZT" | "CNY" | "AED";
type Rates = { date: string; aznPerUnit: Record<Currency, number>; source: string; fallback: boolean };
const currencies: Currency[] = ["USD", "AZN", "EUR", "RUB", "KZT", "CNY", "AED"];
const places: Place[] = ["office", "airport", "delivery"];
const parsePlace = (value: string | null): Place => places.includes(value as Place) ? value as Place : "office";
const localToday = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const rentalDays = (fromDate: string, fromTime: string, toDate: string, toTime: string) => {
  if (!fromDate || !toDate || !fromTime || !toTime) return 0;
  const start = Date.parse(`${fromDate}T${fromTime}:00Z`);
  const end = Date.parse(`${toDate}T${toTime}:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.ceil((end - start) / 86_400_000);
};
const rateIndex = (days: number) => days <= 3 ? 0 : days <= 7 ? 1 : days <= 14 ? 2 : days <= 21 ? 3 : days <= 31 ? 4 : 5;

export default function BookingForm({ locale }: { locale: Locale }) {
  const ui = bookingUi[locale];
  const fleetText = fleetUi[locale];
  const categories = fleetText.categories;
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState("");
  const [pickup, setPickup] = useState<Place>("office");
  const [dropoff, setDropoff] = useState<Place>("office");
  const [pickupAddress, setPickupAddress] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("10:00");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("10:00");
  const [carId, setCarId] = useState("");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [flight, setFlight] = useState("");
  const [secondDriver, setSecondDriver] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rates, setRates] = useState<Rates | null>(null);
  const [ratesError, setRatesError] = useState(false);

  useEffect(() => {
    setToday(localToday());
    const search = new URLSearchParams(window.location.search);
    setPickup(parsePlace(search.get("pickup")));
    setDropoff(parsePlace(search.get("dropoff")));
    setFromDate(search.get("from") || "");
    setToDate(search.get("to") || "");
    const selected = search.get("car");
    if (fleet.some((car) => car.id === selected)) setCarId(selected || "");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rates", { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error("rates unavailable");
      return response.json() as Promise<Rates>;
    }).then(setRates).catch(() => { if (!controller.signal.aborted) setRatesError(true); });
    return () => controller.abort();
  }, []);

  const selectedCar = fleet.find((car) => car.id === carId) as Car | undefined;
  const days = rentalDays(fromDate, fromTime, toDate, toTime);
  const durationMs = Date.parse(`${toDate}T${toTime}:00Z`) - Date.parse(`${fromDate}T${fromTime}:00Z`);
  const rate = selectedCar && durationMs >= 2 * 86_400_000 ? selectedCar.ratesUsd[rateIndex(days)] : null;
  const amount = rate === null ? null : rate * days;
  const visibleCars = fleet.filter((car) => (category === "all" || car.category === category) && `${car.name} ${car.year}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const convert = (usd: number) => currency === "USD" || !rates ? usd : usd * rates.aznPerUnit.USD / rates.aznPerUnit[currency];
  const formatPrice = (usd: number) => `${new Intl.NumberFormat(locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: currency === "RUB" || currency === "KZT" ? 0 : 2, minimumFractionDigits: currency === "USD" ? 0 : 2 }).format(convert(usd))} ${currency}`;

  const locationText = (place: Place, address: string) => place === "delivery" ? `${ui.delivery}: ${address}` : ui[place];
  const message = [
    ui.request,
    `${ui.model}: ${selectedCar?.name || ""} ${selectedCar?.year || ""}`,
    `${ui.pickup}: ${locationText(pickup, pickupAddress)}`,
    `${ui.from}: ${fromDate} ${fromTime}`,
    `${ui.return}: ${locationText(dropoff, returnAddress)}`,
    `${ui.to}: ${toDate} ${toTime}`,
    `${ui.days}: ${days}`,
    `${ui.estimate}: ${amount === null ? "—" : `$${amount} USD`} (${ui.rate}: $${rate} USD)`,
    ...(amount !== null && currency !== "USD" && rates ? [`${ui.currency}: ${formatPrice(amount)} (${ui.rateDate}: ${rates.date})`] : []),
    `${ui.fullName}: ${name.trim()}`,
    `${ui.phone}: ${phone.trim()}`,
    `${ui.email}: ${email.trim()}`,
    `${ui.age}: ${age}`,
    `${ui.experience}: ${experience}`,
    `${ui.secondDriver}: ${secondDriver ? ui.secondYes : ui.secondNo}`,
    ...(flight.trim() ? [`${ui.flight}: ${flight.trim()}`] : []),
    ...(notes.trim() ? [`${ui.notes}: ${notes.trim()}`] : []),
    "",
    ui.requestOpen,
  ].join("\n");
  const whatsappHref = `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(ui.request)}&body=${encodeURIComponent(message)}`;

  function showReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!selectedCar) { setError(ui.carChoose); document.getElementById("booking-car")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (!formRef.current?.reportValidity()) return;
    const issue = !fromDate || fromDate < today ? ui.future
      : days === 0 ? ui.invalidDates
      : durationMs < 2 * 86_400_000 ? ui.minimum
      : pickup === "delivery" && !pickupAddress.trim() || dropoff === "delivery" && !returnAddress.trim() ? ui.requiredAddress
      : phone.replace(/\D/g, "").length < 7 ? ui.phoneError
      : +age < 24 || +age > 70 ? ui.ageError
      : +experience < 2 ? ui.experienceError
      : "";
    if (issue) { setError(issue); return; }
    setReview(true);
    window.setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function copyRequest() {
    try { await navigator.clipboard.writeText(message); setCopied(true); }
    catch { setError(ui.copyError); }
  }

  return <div className="booking-layout container">
    <div className="booking-main">
      <div className="booking-progress" aria-label={ui.review}><span className="active">01 <b>{ui.dates}</b></span><span className="active">02 <b>{ui.car}</b></span><span className="active">03 <b>{ui.driver}</b></span><span className={review ? "active" : ""}>04 <b>{ui.review}</b></span></div>
      <form ref={formRef} onSubmit={showReview} onChange={() => { setReview(false); setCopied(false); setError(""); }}>
        <section className="booking-card" aria-labelledby="booking-dates"><div className="booking-card-head"><span className="booking-card-icon"><MapPin size={21} /></span><div><small>{ui.step} 01</small><h2 id="booking-dates">{ui.dates}</h2></div></div>
          <div className="booking-grid">
            <label className="booking-field">{ui.pickup}<select value={pickup} onChange={(e) => setPickup(e.target.value as Place)}>{places.map((place) => <option key={place} value={place}>{ui[place]}</option>)}</select></label>
            <label className="booking-field">{ui.return}<select value={dropoff} onChange={(e) => setDropoff(e.target.value as Place)}>{places.map((place) => <option key={place} value={place}>{ui[place]}</option>)}</select></label>
            {pickup === "delivery" && <label className="booking-field">{ui.address}<input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder={ui.addressHint} required /></label>}
            {dropoff === "delivery" && <label className="booking-field">{ui.address}<input value={returnAddress} onChange={(e) => setReturnAddress(e.target.value)} placeholder={ui.addressHint} required /></label>}
          </div>
          <div className="booking-grid booking-dates-grid"><fieldset><legend>{ui.from}</legend><div><label className="booking-field">{ui.date}<input type="date" value={fromDate} min={today || undefined} onInput={(e) => { setFromDate(e.currentTarget.value); setReview(false); }} onBlur={(e) => setFromDate(e.currentTarget.value)} required /></label><label className="booking-field">{ui.time}<input type="time" value={fromTime} onInput={(e) => { setFromTime(e.currentTarget.value); setReview(false); }} required /></label></div></fieldset><fieldset><legend>{ui.to}</legend><div><label className="booking-field">{ui.date}<input type="date" value={toDate} min={fromDate || today || undefined} onInput={(e) => { setToDate(e.currentTarget.value); setReview(false); }} onBlur={(e) => setToDate(e.currentTarget.value)} required /></label><label className="booking-field">{ui.time}<input type="time" value={toTime} onInput={(e) => { setToTime(e.currentTarget.value); setReview(false); }} required /></label></div></fieldset></div>
        </section>
        <section className="booking-card" aria-labelledby="booking-car"><div className="booking-card-head"><span className="booking-card-icon"><CarFront size={22} /></span><div><small>{ui.step} 02</small><h2 id="booking-car">{ui.car}</h2></div></div>
          <div className="booking-currency"><div><strong>{ui.currency}</strong><p>{ui.currencyNote}</p></div><div className="booking-currency-options" role="group" aria-label={ui.currency}>{currencies.map((code) => <button key={code} type="button" disabled={code !== "USD" && !rates} aria-pressed={currency === code} onClick={() => setCurrency(code)}>{code}</button>)}</div><small>{rates ? <><a href={rates.source} target="_blank" rel="noopener noreferrer">{ui.ratesSource} ↗</a> · {ui.rateDate}: {rates.date}</> : ratesError ? ui.ratesUnavailable : "…"}</small></div>
          <div className="booking-car-tools"><label className="booking-field">{ui.carSearch}<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.carSearch} /></label><label className="booking-field">{ui.all}<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui.all}</option>{Object.entries(categories).filter(([key]) => key !== "all").map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
          <p className="booking-car-count">{visibleCars.length} {ui.carsShown}</p>
          <div className="booking-cars" aria-label={ui.carChoose}>{visibleCars.map((car, index) => {
            const carRate = car.ratesUsd[durationMs >= 2 * 86_400_000 ? rateIndex(days) : 0];
            const chosen = car.id === carId;
            return <button className={`booking-car-option${chosen ? " selected" : ""}`} type="button" aria-pressed={chosen} aria-label={`${ui.chooseCard}: ${car.name} ${car.year}`} onClick={() => { setCarId(car.id); setReview(false); setError(""); }} key={car.id} style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}>
              <span className="booking-car-photo"><img src={(fleetImages as Record<string, string>)[car.id]} alt={`${car.name} ${car.year} — ${ui.vehicleImage}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" /><span className="booking-car-photo-year">{car.year}</span></span>
              <span className="booking-car-content"><span className="booking-car-category">{categories[car.category]}</span><strong>{car.name}</strong><span className="booking-car-price"><b>{formatPrice(carRate)}</b><small>/ {fleetText.perDay.replace("USD / ", "")}</small></span><span className="booking-card-rates">{car.ratesUsd.map((value, rateNumber) => <span key={rateNumber}>{fleetText.durations[rateNumber]} · ${value}</span>)}</span><span className="booking-car-select"><Check size={17} />{chosen ? ui.selectedCard : ui.chooseCard}</span></span>
            </button>;
          })}</div>
          {visibleCars.length === 0 && <p className="booking-muted">{ui.noCar}</p>}
        </section>
        <section className="booking-card" aria-labelledby="booking-driver"><div className="booking-card-head"><span className="booking-card-icon"><ShieldCheck size={21} /></span><div><small>{ui.step} 03</small><h2 id="booking-driver">{ui.driver}</h2></div></div>
          <div className="booking-grid"><label className="booking-field">{ui.fullName}<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required /></label><label className="booking-field">{ui.phone}<input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994 ..." required /></label><label className="booking-field">{ui.email}<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="booking-field">{ui.flight}<input value={flight} onChange={(e) => setFlight(e.target.value)} /></label><label className="booking-field">{ui.age}<input type="number" min="24" max="70" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} required /></label><label className="booking-field">{ui.experience}<input type="number" min="2" max="70" inputMode="numeric" value={experience} onChange={(e) => setExperience(e.target.value)} required /></label></div>
          <label className="booking-check"><input type="checkbox" checked={secondDriver} onChange={(e) => setSecondDriver(e.target.checked)} />{ui.secondDriver}</label>
          <label className="booking-field">{ui.notes}<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={ui.notesHint} /></label>
          <p className="booking-privacy">{ui.privacy} <a href={`/${locale}/rental/conditions`}>{ui.conditions} ↗</a></p>
        </section>
        {error && <p className="booking-error" role="alert">{error}</p>}
        <button className="booking-review-button" type="submit">{ui.reviewButton}<ArrowRight size={20} /></button>
      </form>
      {review && <div className="booking-card booking-review" ref={reviewRef} id="booking-review" aria-live="polite"><div className="booking-card-head"><span className="booking-card-icon"><Check size={22} /></span><div><small>{ui.step} 04</small><h2>{ui.review}</h2></div></div><p>{ui.reviewLead}</p><div className="booking-review-lines"><span>{selectedCar?.name} · {selectedCar?.year}</span><span>{fromDate} {fromTime} → {toDate} {toTime}</span><span>{locationText(pickup, pickupAddress)} → {locationText(dropoff, returnAddress)}</span><strong>{ui.estimate}: {amount === null ? "—" : formatPrice(amount)}</strong>{currency !== "USD" && <small>USD {amount}</small>}</div><div className="booking-send-actions"><a className="booking-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />{ui.whatsapp}</a><a href={emailHref}><Mail size={19} />{ui.mail}</a><button type="button" onClick={copyRequest}><Clipboard size={18} />{copied ? ui.copied : ui.copy}</button></div></div>}
    </div>
    <aside className="booking-side"><div className="booking-summary"><span className="booking-summary-kicker"><CalendarDays size={17} /> {ui.summary}</span><h2>{selectedCar ? `${selectedCar.name} · ${selectedCar.year}` : ui.carChoose}</h2>{selectedCar && <img className="booking-summary-photo" src={(fleetImages as Record<string, string>)[selectedCar.id]} alt={`${selectedCar.name} ${selectedCar.year}`} />}<div className="booking-summary-row"><span>{ui.days}</span><strong>{durationMs >= 2 * 86_400_000 ? days : "—"}</strong></div><div className="booking-summary-row"><span>{ui.rate}</span><strong>{rate === null ? "—" : formatPrice(rate)}</strong></div><div className="booking-summary-total"><span>{ui.estimate}</span><strong>{amount === null ? "—" : formatPrice(amount)}</strong></div>{amount !== null && currency !== "USD" && <div className="booking-summary-base">USD {amount}</div>}<p>{amount === null ? ui.noEstimate : ui.estimateNote}</p><div className="booking-side-facts"><span><Check size={16} />{ui.noPayment}</span><span><Check size={16} />{ui.support}</span></div><a href={`/${locale}/contact`}>{ui.contact} <ArrowRight size={16} /></a></div></aside>
  </div>;
}
