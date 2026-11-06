"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CarFront, Check, Clipboard, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { fleetUi } from "@/lib/fleet-ui";
import { bookingUi } from "@/lib/booking";
import { addDaysIso, rateTierIndex as rateIndex, rentalDuration } from "@/lib/rental-duration";
import { contact } from "@/lib/service-info";
import type { Locale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";
import { travelUi } from "@/lib/travel-ui";
import { makeAccessCode,formattedCode,travelLink,travelReference,type TravelCredentials } from "@/lib/travel-access";

type Place = "office" | "airport" | "delivery";
type Car = (typeof fleet)[number];
type Currency = "USD" | "AZN" | "EUR" | "RUB" | "KZT" | "CNY" | "AED";
type Payment = "card" | "cash" | "transfer";
type Rates = { date: string; aznPerUnit: Record<Currency, number>; source: string; fallback: boolean };
const currencies: Currency[] = ["USD", "AZN", "EUR", "RUB", "KZT", "CNY", "AED"];
const places: Place[] = ["office", "airport", "delivery"];
const parsePlace = (value: string | null): Place => places.includes(value as Place) ? value as Place : "office";
const localToday = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const submissionUi: Record<Locale, { lead: string; submit: string; sending: string; success: string; reference: string; follow: string; failed: string; invalid: string; limited: string; mail: string }> = {
  ru: { invalid: "Проверьте данные заявки и попробуйте ещё раз.", limited: `Слишком много заявок за последний час. Позвоните нам: ${contact.phoneDisplay}`, lead: "Проверьте данные и отправьте заявку. Она сохранится в панели CarTime; менеджер подтвердит наличие и условия.", submit: "Отправить заявку", sending: "Отправляем…", success: "Заявка получена", reference: "Номер заявки", follow: "Хотите ускорить ответ? Поделитесь заявкой с менеджером в WhatsApp или отправьте копию по почте.", failed: "Не удалось сохранить заявку. Проверьте соединение и попробуйте ещё раз.", mail: "Отправить копию на info@cartime.az" },
  az: { invalid: "Sorğu məlumatlarını yoxlayın və yenidən cəhd edin.", limited: `Son bir saatda çox sorğu göndərilib. Bizə zəng edin: ${contact.phoneDisplay}`, lead: "Məlumatları yoxlayın və sorğunu göndərin. Sorğu CarTime panelində saxlanılacaq; menecer mövcudluğu və şərtləri təsdiqləyəcək.", submit: "Sorğunu göndər", sending: "Göndərilir…", success: "Sorğu qəbul edildi", reference: "Sorğu nömrəsi", follow: "Cavabı sürətləndirmək istəyirsiniz? Sorğunu WhatsApp-da paylaşın və ya e-poçtla surətini göndərin.", failed: "Sorğunu saxlamaq mümkün olmadı. Bağlantını yoxlayın və yenidən cəhd edin.", mail: "Surəti info@cartime.az-a göndər" },
  en: { invalid: "Please check your request details and try again.", limited: `Too many requests in the last hour. Please call us: ${contact.phoneDisplay}`, lead: "Review and send your request. It will be saved in CarTime's dashboard; a manager will confirm availability and terms.", submit: "Send request", sending: "Sending…", success: "Request received", reference: "Request ID", follow: "Want a faster reply? Share your request in WhatsApp or email a copy to the manager.", failed: "Could not save your request. Check your connection and try again.", mail: "Email a copy to info@cartime.az" },
  de: { invalid: "Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.", limited: `Zu viele Anfragen in der letzten Stunde. Bitte rufen Sie uns an: ${contact.phoneDisplay}`, lead: "Überprüfen und senden Sie Ihre Anfrage. Sie wird im Dashboard von CarTime gespeichert; ein Manager bestätigt die Verfügbarkeit und die Bedingungen.", submit: "Anfrage senden", sending: "Wird gesendet…", success: "Anfrage erhalten", reference: "Anforderungs-ID", follow: "Möchten Sie eine schnellere Antwort? Teilen Sie Ihre Anfrage in WhatsApp oder senden Sie eine Kopie per E-Mail an den Manager.", failed: "Ihre Anfrage konnte nicht gespeichert werden. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.", mail: "Senden Sie eine Kopie per E-Mail an info@cartime.az" },
  zh: { invalid: "请检查请求信息后重试。", limited: `过去一小时内的请求过多。请致电：${contact.phoneDisplay}`, lead: "查看并发送您的请求。它将保存在CarTime的仪表板中；经理将确认可用性和条款。", submit: "发送请求", sending: "正在发送...", success: "收到请求", reference: "请求 ID", follow: "想要更快的回复吗？在 WhatsApp 中分享您的请求或通过电子邮件将副本发送给经理。", failed: "无法保存您的请求。检查您的连接并重试。", mail: "通过电子邮件发送副本至 info@cartime.az" },
  ko: { invalid: "요청 내용을 확인한 후 다시 시도해 주세요.", limited: `지난 1시간 동안 요청이 너무 많았습니다. 전화해 주세요: ${contact.phoneDisplay}`, lead: "요청을 검토하고 보내주세요. CarTime의 대시보드에 저장됩니다. 관리자가 이용 가능 여부와 조건을 확인해 드릴 것입니다.", submit: "요청 보내기", sending: "보내는 중…", success: "요청 접수됨", reference: "요청 ID", follow: "더 빠른 답변을 원하시나요? WhatsApp에서 요청을 공유하거나 관리자에게 사본을 이메일로 보내세요.", failed: "요청을 저장할 수 없습니다. 연결을 확인하고 다시 시도하세요.", mail: "info@cartime.az로 사본을 이메일로 보내세요." },
  fr: { invalid: "Vérifiez les informations de votre demande et réessayez.", limited: `Trop de demandes au cours de la dernière heure. Appelez-nous : ${contact.phoneDisplay}`, lead: "Vérifiez et envoyez votre demande. Elle sera enregistrée dans le tableau de bord de CarTime ; un responsable confirmera la disponibilité et les conditions.", submit: "Envoyer la demande", sending: "Envoi…", success: "Demande reçue", reference: "ID de demande", follow: "Vous souhaitez une réponse plus rapide ? Partagez votre demande sur WhatsApp ou envoyez-en une copie par e-mail au responsable.", failed: "Impossible d'enregistrer votre demande. Vérifiez votre connexion et réessayez.", mail: "Envoyez une copie par e-mail à info@cartime.az" },
  ar: { invalid: "يرجى التحقق من بيانات الطلب والمحاولة مرة أخرى.", limited: `طلبات كثيرة خلال الساعة الماضية. يرجى الاتصال بنا: ${contact.phoneDisplay}`, lead: "قم بمراجعة طلبك وإرساله. سيتم حفظه في لوحة معلومات CarTime؛ سيقوم المدير بتأكيد التوفر والشروط.", submit: "أرسل الطلب", sending: "جاري الإرسال…", success: "تم استلام الطلب", reference: "معرف الطلب", follow: "هل تريد الرد بشكل أسرع؟ شارك طلبك عبر تطبيق WhatsApp أو أرسل نسخة بالبريد الإلكتروني إلى المدير.", failed: "لا يمكن حفظ طلبك. تحقق من اتصالك وحاول مرة أخرى.", mail: "أرسل نسخة بالبريد الإلكتروني إلى info@cartime.az" },
};

export default function BookingForm({ locale }: { locale: Locale }) {
  const ui = bookingUi[locale];
  const submitText = submissionUi[locale];
  const fleetText = fleetUi[locale];
  const categories = fleetText.categories;
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [today, setToday] = useState("");
  const [pickup, setPickup] = useState<Place>("office");
  const [dropoff, setDropoff] = useState<Place>("office");
  const [differentReturn, setDifferentReturn] = useState(false);
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
  const [payment, setPayment] = useState<Payment>("card");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rates, setRates] = useState<Rates | null>(null);
  const [ratesError, setRatesError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [travelCredentials,setTravelCredentials]=useState<TravelCredentials|null>(null);
  const travelCodeRef=useRef<string|null>(null);
  const [accessCopied,setAccessCopied]=useState(false);
  const [website, setWebsite] = useState("");

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
    if (!active) return;
    const current = localToday();
    setToday(current);
    const search = new URLSearchParams(window.location.search);
    const firstPlace = parsePlace(search.get("pickup"));
    const lastPlace = parsePlace(search.get("dropoff"));
    setPickup(firstPlace);
    setDropoff(lastPlace);
    setDifferentReturn(firstPlace !== lastPlace);
    const start = search.get("from");
    const end = search.get("to");
    const initialStart = start && /^\d{4}-\d{2}-\d{2}$/.test(start) && start >= current ? start : addDaysIso(current, 1);
    setFromDate(initialStart);
    setToDate(end && /^\d{4}-\d{2}-\d{2}$/.test(end) && end > initialStart ? end : addDaysIso(initialStart, 3));
    const startTime = search.get("fromTime");
    const endTime = search.get("toTime");
    if (startTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) setFromTime(startTime);
    if (endTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) setToTime(endTime);
    const selected = search.get("car");
    if (fleet.some((car) => car.id === selected)) setCarId(selected || "");
    });
    return () => { active = false; };
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
  const { days, valid: validDuration } = rentalDuration(fromDate, fromTime, toDate, toTime);
  const rate = selectedCar && validDuration ? selectedCar.ratesUsd[rateIndex(days)] : null;
  const amount = rate === null ? null : rate * days;
  const visibleCars = fleet.filter((car) => (category === "all" || car.category === category) && `${car.name} ${car.year}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const convert = (usd: number) => currency === "USD" || !rates ? usd : usd * rates.aznPerUnit.USD / rates.aznPerUnit[currency];
  const formatPrice = (usd: number) => {
    const wholeCurrency = currency === "RUB" || currency === "KZT";
    return `${new Intl.NumberFormat(localeInfo[locale].hreflang, { maximumFractionDigits: wholeCurrency ? 0 : 2, minimumFractionDigits: currency === "USD" || wholeCurrency ? 0 : 2 }).format(convert(usd))} ${currency}`;
  };

  const locationText = (place: Place, address: string) => place === "delivery" ? `${ui.delivery}: ${address}` : ui[place];
  const message = [
    ui.request,
    ...(savedId ? [`${submitText.reference}: ${travelReference(savedId)}`] : []),
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
    `${ui.payment}: ${ui[payment]}`,
    `${ui.secondDriver}: ${secondDriver ? ui.secondYes : ui.secondNo}`,
    ...(flight.trim() ? [`${ui.flight}: ${flight.trim()}`] : []),
    ...(notes.trim() ? [`${ui.notes}: ${notes.trim()}`] : []),
    "",
    ui.requestOpen,
  ].join("\n");
  const whatsappHref = `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(ui.request)}&body=${encodeURIComponent(message)}`;

  function goTo(next: number) {
    setError("");
    setStep(next);
    window.requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function nextStep() {
    setError("");
    if (step === 1) {
      const issue = !fromDate || fromDate < today ? ui.future
        : !toDate || days === 0 ? ui.invalidDates
        : !validDuration ? ui.minimum
        : days > 365 ? ui.invalidDates
        : pickup === "delivery" && !pickupAddress.trim() || dropoff === "delivery" && !returnAddress.trim() ? ui.requiredAddress
        : !selectedCar ? ui.carChoose : "";
      if (issue) { setError(issue); return; }
    }
    if (step === 3) {
      if (!formRef.current?.reportValidity()) return;
      const issue = name.trim().length < 2 ? submitText.invalid
        : phone.replace(/\D/g, "").length < 7 ? ui.phoneError
        : +age < 24 || +age > 70 ? ui.ageError
        : +experience < 2 ? ui.experienceError : "";
      if (issue) { setError(issue); return; }
    }
    if (step < 4) goTo(step + 1);
  }

  async function copyAccess() {
    if (!travelCredentials) return;
    try { await navigator.clipboard.writeText(`${travelUi[locale].reference}: ${travelCredentials.reference}\n${travelUi[locale].code}: ${formattedCode(travelCredentials.accessCode)}\n${window.location.origin}${travelLink(locale, travelCredentials)}`); setAccessCopied(true); }
    catch { setError(ui.copyError); }
  }

  async function copyRequest() {
    try { await navigator.clipboard.writeText(message); setCopied(true); }
    catch { setError(ui.copyError); }
  }

  async function submitRequest() {
    if (saving || savedId) return;
    setError("");
    if (!selectedCar || !validDuration || !name.trim() || !phone.trim() || !email.trim()) { setError(submitText.failed); return; }
    setSaving(true);
    try {
      requestIdRef.current ||= crypto.randomUUID();
      travelCodeRef.current ||= makeAccessCode();
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        requestId: requestIdRef.current, accessCode:travelCodeRef.current, locale, carId, pickup, pickupAddress, dropoff, returnAddress, fromDate, fromTime, toDate, toTime,
        customerName: name.trim(), phone: phone.trim(), email: email.trim(), age: Number(age), experience: Number(experience),
        flight: flight.trim(), secondDriver, payment, notes: notes.trim(), website,
      }) });
      if (response.status === 429) { setError(submitText.limited); return; }
      if (response.status === 400) { setError(submitText.invalid); return; }
      if (!response.ok) throw new Error("booking save failed");
      const result = await response.json() as { id: string; trip:TravelCredentials|null };
      if (!result.id) throw new Error("booking reference missing");
      setSavedId(result.id);
      setTravelCredentials(result.trip);
    } catch { setError(submitText.failed); }
    finally { setSaving(false); }
  }

  const stepNames = [ui.datesAndCar, ui.protection, ui.driver, ui.paymentAndReview];
  const money = (value: number | null) => value === null ? "—" : formatPrice(value);

  return <div className="booking-layout booking-wizard container" ref={topRef}>
    <div className="booking-main">
      <nav className="booking-progress" aria-label={ui.bookingSteps}>{stepNames.map((label, index) => <button type="button" key={label} className={step === index + 1 ? "current" : step > index + 1 ? "complete" : ""} aria-current={step === index + 1 ? "step" : undefined} disabled={index + 1 > step || Boolean(savedId)} onClick={() => goTo(index + 1)}><span>{step > index + 1 ? <Check size={16} /> : `0${index + 1}`}</span><b>{label}</b></button>)}</nav>
      <form ref={formRef} onSubmit={(event) => { event.preventDefault(); if (step === 4) void submitRequest(); else nextStep(); }} onChange={() => { requestIdRef.current = null; setCopied(false); setError(""); }}>
        <input className="booking-honeypot" type="text" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {step === 1 && <>
        <section className="booking-card" aria-labelledby="booking-dates"><div className="booking-card-head"><span className="booking-card-icon"><MapPin size={21} /></span><div><small>{ui.step} 01</small><h2 id="booking-dates">{ui.dates}</h2></div></div>
          <div className="booking-grid">
            <label className="booking-field">{ui.pickup}<select value={pickup} onChange={(e) => { const place = e.target.value as Place; setPickup(place); if (!differentReturn) setDropoff(place); }}>{places.map((place) => <option key={place} value={place}>{ui[place]}</option>)}</select></label>
            {pickup === "delivery" && <label className="booking-field">{ui.address}<input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder={ui.addressHint} maxLength={250} required /></label>}
          </div>
          <div className="booking-grid booking-dates-grid"><fieldset><legend>{ui.from}</legend><div><label className="booking-field">{ui.date}<input aria-label={`${ui.from} · ${ui.date}`} type="date" value={fromDate} min={today || undefined} onChange={(e) => { const date = e.target.value; setFromDate(date); if (date && (!toDate || toDate <= date)) setToDate(addDaysIso(date, 3)); }} required /></label><label className="booking-field">{ui.time}<input aria-label={`${ui.from} · ${ui.time}`} type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} required /></label></div></fieldset><fieldset><legend>{ui.to}</legend><div><label className="booking-field">{ui.date}<input aria-label={`${ui.to} · ${ui.date}`} type="date" value={toDate} min={fromDate || today || undefined} onChange={(e) => setToDate(e.target.value)} required /></label><label className="booking-field">{ui.time}<input aria-label={`${ui.to} · ${ui.time}`} type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} required /></label></div></fieldset></div>
          <label className="booking-check booking-different"><input type="checkbox" checked={differentReturn} onChange={(e) => { setDifferentReturn(e.target.checked); if (!e.target.checked) setDropoff(pickup); }} />{ui.differentReturn}</label>
          {differentReturn && <div className="booking-grid"><label className="booking-field">{ui.return}<select value={dropoff} onChange={(e) => setDropoff(e.target.value as Place)}>{places.map((place) => <option key={place} value={place}>{ui[place]}</option>)}</select></label>{dropoff === "delivery" && <label className="booking-field">{ui.address}<input value={returnAddress} onChange={(e) => setReturnAddress(e.target.value)} placeholder={ui.addressHint} maxLength={250} required /></label>}</div>}
          <div className={`booking-duration ${days && !validDuration ? "invalid" : ""}`} aria-live="polite"><CalendarDays size={18} /><span>{ui.days}:</span><strong>{days || "—"}</strong><small>{days && !validDuration ? ui.minimum : ui.durationHint}</small></div>
        </section>
        <section className="booking-card" aria-labelledby="booking-car"><div className="booking-card-head"><span className="booking-card-icon"><CarFront size={22} /></span><div><small>{ui.step} 01</small><h2 id="booking-car">{ui.carChoose}</h2></div></div>
          <div className="booking-currency"><div><strong>{ui.currency}</strong><p>{ui.currencyNote}</p></div><div className="booking-currency-options" role="group" aria-label={ui.currency}>{currencies.map((code) => <button key={code} type="button" disabled={code !== "USD" && !rates} aria-pressed={currency === code} onClick={() => setCurrency(code)}>{code}</button>)}</div><small>{rates ? <><a href={rates.source} target="_blank" rel="noopener noreferrer">{ui.ratesSource} ↗</a> · {ui.rateDate}: {rates.date}</> : ratesError ? ui.ratesUnavailable : "…"}</small></div>
          <div className="booking-car-tools"><label className="booking-field">{ui.carSearch}<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.carSearch} /></label><label className="booking-field">{ui.all}<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui.all}</option>{Object.entries(categories).filter(([key]) => key !== "all").map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
          <p className="booking-car-count">{visibleCars.length} {ui.carsShown}</p>
          <div className="booking-cars" aria-label={ui.carChoose}>{visibleCars.map((car, index) => {
            const carRate = car.ratesUsd[rateIndex(Math.max(2, days))];
            const chosen = car.id === carId;
            return <button className={`booking-car-option${chosen ? " selected" : ""}`} type="button" aria-pressed={chosen} aria-label={`${ui.chooseCard}: ${car.name} ${car.year}`} onClick={() => { setCarId(car.id); setError(""); }} key={car.id} style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}>
              <span className="booking-car-photo"><img src={(fleetImages as Record<string, string>)[car.id]} alt={`${car.name} ${car.year} — ${ui.vehicleImage}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" /><span className="booking-car-photo-year">{car.year}</span></span>
              <span className="booking-car-content"><span className="booking-car-category">{categories[car.category]}</span><strong>{car.name}</strong><span className="booking-car-price"><b>{formatPrice(carRate)}</b><small>/ {fleetText.perDay.replace("USD / ", "")}</small></span>{validDuration && <span className="booking-car-total">{ui.estimate}: <b>{formatPrice(carRate * days)}</b></span>}<span className="booking-car-facts"><span>✓ {ui.unlimitedMileage}</span><span>✓ {ui.basicProtection}</span></span><span className="booking-car-select"><Check size={17} />{chosen ? ui.selectedCard : ui.chooseCard}</span></span>
            </button>;
          })}</div>
          {visibleCars.length === 0 && <p className="booking-muted">{ui.noCar}</p>}
        </section>
        </>}
        {step === 2 && <section className="booking-card booking-services"><div className="booking-card-head"><span className="booking-card-icon"><ShieldCheck size={21} /></span><div><small>{ui.step} 02</small><h2>{ui.protection}</h2></div></div><p className="booking-step-lead">{ui.protectionLead}</p><div className="booking-service-grid"><article><ShieldCheck size={24} /><h3>{ui.basicProtection}</h3><p>{ui.basicProtectionText}</p><strong>{ui.included}</strong></article><article><CarFront size={24} /><h3>{ui.unlimitedMileage}</h3><p>{ui.mileageText}</p><strong>{ui.included}</strong></article><article><MapPin size={24} /><h3>{ui.deposit}</h3><p>{ui.depositText}</p><strong>{ui.managerConfirms}</strong></article><article><CalendarDays size={24} /><h3>{ui.pickupService}</h3><p>{ui.pickupServiceText}</p><strong>{ui.managerConfirms}</strong></article></div><label className="booking-check booking-second-driver"><input type="checkbox" checked={secondDriver} onChange={(e) => setSecondDriver(e.target.checked)} />{ui.secondDriver}</label><p className="booking-privacy">{ui.estimateNote} <a href={`/${locale}/rental/conditions`}>{ui.conditions} ↗</a></p></section>}
        {step === 3 && <>
        <section className="booking-card" aria-labelledby="booking-driver"><div className="booking-card-head"><span className="booking-card-icon"><ShieldCheck size={21} /></span><div><small>{ui.step} 03</small><h2 id="booking-driver">{ui.driver}</h2></div></div>
          <p className="booking-step-lead">{ui.driverLead}</p>
          <div className="booking-grid"><label className="booking-field">{ui.fullName}<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={120} required /></label><label className="booking-field">{ui.phone}<input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994 ..." maxLength={40} required /></label><label className="booking-field">{ui.email}<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} required /></label><label className="booking-field">{ui.flight}<input value={flight} onChange={(e) => setFlight(e.target.value)} maxLength={80} /></label><label className="booking-field">{ui.age}<input type="number" min="24" max="70" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} required /></label><label className="booking-field">{ui.experience}<input type="number" min="2" max="70" inputMode="numeric" value={experience} onChange={(e) => setExperience(e.target.value)} required /></label></div>
          <label className="booking-field">{ui.notes}<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={ui.notesHint} maxLength={2000} /></label>
          <p className="booking-privacy">{ui.privacy} <a href={`/${locale}/rental/conditions`}>{ui.conditions} ↗</a></p>
        </section>
        </>}
        {step === 4 && <div className="booking-card booking-review" id="booking-review" aria-live="polite"><div className="booking-card-head"><span className="booking-card-icon"><Check size={22} /></span><div><small>{ui.step} 04</small><h2>{ui.paymentAndReview}</h2></div></div><p>{submitText.lead}</p><fieldset className="booking-payment" disabled={Boolean(savedId)}><legend>{ui.payment}</legend><div>{(["card", "cash", "transfer"] as Payment[]).map((method) => <label key={method} className={payment === method ? "selected" : ""}><input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} /><span>{ui[method]}</span></label>)}</div><small>{ui.paymentNote}</small></fieldset><div className="booking-review-lines"><span>{selectedCar?.name} · {selectedCar?.year}</span><span>{fromDate} {fromTime} → {toDate} {toTime}</span><span>{locationText(pickup, pickupAddress)} → {locationText(dropoff, returnAddress)}</span><span>{ui.days}: {days} · {ui.rate}: {money(rate)}</span><strong>{ui.estimate}: {money(amount)}</strong>{currency !== "USD" && <small>USD {amount}</small>}</div>{savedId ? <div className="booking-saved" role="status"><Check size={24} /><div><strong>{submitText.success}</strong><span>{submitText.reference}: <bdi>{travelReference(savedId)}</bdi></span><p>{submitText.follow}</p></div></div> : <button className="booking-submit" type="submit" disabled={saving}>{saving ? submitText.sending : submitText.submit}<ArrowRight size={18} /></button>}{travelCredentials&&<div className="booking-travel-issued"><span>CarTime / Travel Pass</span><h3>{travelUi[locale].credentials}</h3><dl><div><dt>{travelUi[locale].reference}</dt><dd dir="ltr">{travelCredentials.reference}</dd></div><div><dt>{travelUi[locale].code}</dt><dd dir="ltr">{formattedCode(travelCredentials.accessCode)}</dd></div></dl><p>{travelUi[locale].save}</p><a href={travelLink(locale,travelCredentials)}>{travelUi[locale].openPass}<ArrowRight className="travel-flip" size={18}/></a><button type="button" onClick={copyAccess}><Clipboard size={17}/>{accessCopied ? travelUi[locale].copied : travelUi[locale].share}</button></div>}{savedId && <div className="booking-send-actions"><a className="booking-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />{ui.whatsapp}</a><a href={emailHref}><Mail size={19} />{submitText.mail}</a><button type="button" onClick={copyRequest}><Clipboard size={18} />{copied ? ui.copied : ui.copy}</button></div>}{!savedId && <button className="booking-edit" type="button" onClick={() => goTo(1)}><ArrowLeft size={17} />{ui.edit}</button>}</div>}
        {step === 4 && error && <p className="booking-error" role="alert">{error}</p>}
      </form>
    </div>
    <aside className="booking-side"><div className="booking-summary"><span className="booking-summary-kicker"><CalendarDays size={17} /> {ui.summary}</span><h2>{selectedCar ? `${selectedCar.name} · ${selectedCar.year}` : ui.carChoose}</h2>{selectedCar && <img className="booking-summary-photo" src={(fleetImages as Record<string, string>)[selectedCar.id]} alt={`${selectedCar.name} ${selectedCar.year}`} />}<div className="booking-summary-row"><span>{ui.days}</span><strong>{days || "—"}</strong></div><div className="booking-summary-row"><span>{ui.rate}</span><strong>{money(rate)}</strong></div><div className="booking-summary-total"><span>{ui.estimate}</span><strong>{money(amount)}</strong></div>{amount !== null && currency !== "USD" && <div className="booking-summary-base">USD {amount}</div>}<p>{amount === null ? ui.noEstimate : ui.estimateNote}</p><div className="booking-side-facts"><span><Check size={16} />{ui.noPayment}</span><span><Check size={16} />{ui.support}</span></div><a href={`/${locale}/contact`}>{ui.contact} <ArrowRight size={16} /></a></div></aside>
    {step < 4 && <div className="booking-action-bar" role="group" aria-label={ui.bookingSteps}>{error && <p className="booking-action-error" role="alert">{error}</p>}<div className="booking-action-inner"><div className="booking-action-detail"><small>{step === 1 ? selectedCar ? `${selectedCar.name} · ${selectedCar.year}` : ui.carChoose : stepNames[step - 1]}</small><strong>{days ? `${days} ${ui.daysShort} · ` : ""}{money(amount)}</strong></div><div className="booking-action-buttons">{step > 1 && <button type="button" className="booking-back" onClick={() => goTo(step - 1)}><ArrowLeft size={18} /><span>{ui.back}</span></button>}<button type="button" className="booking-next" onClick={nextStep}>{ui.next}<ArrowRight size={19} /></button></div></div></div>}
  </div>;
}
