"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Banknote, Building2, CalendarDays, CarFront, Check, ChevronDown, Clipboard, CreditCard, Mail, MapPin, MessageCircle, Phone, Plane, Plus, Send, ShieldCheck, Sparkles, Ticket, Users } from "lucide-react";
import fleet from "@/lib/fleet.json";
import fleetImages from "@/lib/fleet-images.json";
import { fleetUi } from "@/lib/fleet-ui";
import { bookingUi } from "@/lib/booking";
import { bookingFlowUi } from "@/lib/booking-flow-ui";
import { dayCountLabel } from "@/lib/count-labels";
import { MastercardMark, VisaMark } from "@/components/payment-marks";
import { addDaysIso, rateTierIndex as rateIndex, rentalDuration } from "@/lib/rental-duration";
import { contact, whatsappUi } from "@/lib/service-info";
import WhatsAppChoice from "@/components/whatsapp-choice";
import type { Locale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";
import { travelUi } from "@/lib/travel-ui";
import { copyText } from "@/lib/device-actions";
import { makeAccessCode,formattedCode,travelLink,travelReference,type TravelCredentials } from "@/lib/travel-access";

type Place = "office" | "airport" | "delivery";
type Car = (typeof fleet)[number];
type Currency = "USD" | "AZN" | "EUR" | "RUB" | "KZT" | "CNY" | "AED";
type Payment = "card" | "cash";
type Channel = "whatsapp" | "telegram" | "call" | "email";
type Sort = "cheap" | "dear" | "new";
type Rates = { date: string; aznPerUnit: Record<Currency, number>; source: string; fallback: boolean };
const currencies: Currency[] = ["USD", "AZN", "EUR", "RUB", "KZT", "CNY", "AED"];
const places: Place[] = ["office", "airport", "delivery"];
const placeIcons = { office: Building2, airport: Plane, delivery: MapPin };
const channels: Channel[] = ["whatsapp", "telegram", "call", "email"];
const channelIcons = { whatsapp: MessageCircle, telegram: Send, call: Phone, email: Mail };
const quickDays = [3, 7, 14, 30];
const tierStarts = [4, 8, 15, 22, 32];
const peopleOptions = [1, 2, 3, 4, 5, 6];
const draftKey = "cartime-booking-draft";
const parsePlace = (value: string | null): Place => places.includes(value as Place) ? value as Place : "office";
const localToday = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const submissionUi: Record<Locale, { lead: string; submit: string; sending: string; success: string; reference: string; follow: string; failed: string; invalid: string; limited: string; mail: string }> = {
  ru: { invalid: "Проверьте данные заявки и попробуйте ещё раз.", limited: `Слишком много заявок за последний час. Позвоните нам: ${contact.allPhones}`, lead: "Проверьте данные и отправьте заявку. Она сохранится в панели CarTime; менеджер подтвердит наличие и условия.", submit: "Отправить заявку", sending: "Отправляем…", success: "Заявка получена", reference: "Номер заявки", follow: "Хотите ускорить ответ? Поделитесь заявкой с менеджером в WhatsApp или отправьте копию по почте.", failed: "Не удалось сохранить заявку. Проверьте соединение и попробуйте ещё раз.", mail: "Отправить копию на info@cartime.az" },
  az: { invalid: "Sorğu məlumatlarını yoxlayın və yenidən cəhd edin.", limited: `Son bir saatda çox sorğu göndərilib. Bizə zəng edin: ${contact.allPhones}`, lead: "Məlumatları yoxlayın və sorğunu göndərin. Sorğu CarTime panelində saxlanılacaq; menecer mövcudluğu və şərtləri təsdiqləyəcək.", submit: "Sorğunu göndər", sending: "Göndərilir…", success: "Sorğu qəbul edildi", reference: "Sorğu nömrəsi", follow: "Cavabı sürətləndirmək istəyirsiniz? Sorğunu WhatsApp-da paylaşın və ya e-poçtla surətini göndərin.", failed: "Sorğunu saxlamaq mümkün olmadı. Bağlantını yoxlayın və yenidən cəhd edin.", mail: "Surəti info@cartime.az-a göndər" },
  en: { invalid: "Please check your request details and try again.", limited: `Too many requests in the last hour. Please call us: ${contact.allPhones}`, lead: "Review and send your request. It will be saved in CarTime's dashboard; a manager will confirm availability and terms.", submit: "Send request", sending: "Sending…", success: "Request received", reference: "Request ID", follow: "Want a faster reply? Share your request in WhatsApp or email a copy to the manager.", failed: "Could not save your request. Check your connection and try again.", mail: "Email a copy to info@cartime.az" },
  de: { invalid: "Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.", limited: `Zu viele Anfragen in der letzten Stunde. Bitte rufen Sie uns an: ${contact.allPhones}`, lead: "Überprüfen und senden Sie Ihre Anfrage. Sie wird im Dashboard von CarTime gespeichert; ein Manager bestätigt die Verfügbarkeit und die Bedingungen.", submit: "Anfrage senden", sending: "Wird gesendet…", success: "Anfrage erhalten", reference: "Anforderungs-ID", follow: "Möchten Sie eine schnellere Antwort? Teilen Sie Ihre Anfrage in WhatsApp oder senden Sie eine Kopie per E-Mail an den Manager.", failed: "Ihre Anfrage konnte nicht gespeichert werden. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.", mail: "Senden Sie eine Kopie per E-Mail an info@cartime.az" },
  zh: { invalid: "请检查请求信息后重试。", limited: `过去一小时内的请求过多。请致电：${contact.allPhones}`, lead: "查看并发送您的请求。它将保存在CarTime的仪表板中；经理将确认可用性和条款。", submit: "发送请求", sending: "正在发送...", success: "收到请求", reference: "请求 ID", follow: "想要更快的回复吗？在 WhatsApp 中分享您的请求或通过电子邮件将副本发送给经理。", failed: "无法保存您的请求。检查您的连接并重试。", mail: "通过电子邮件发送副本至 info@cartime.az" },
  ko: { invalid: "요청 내용을 확인한 후 다시 시도해 주세요.", limited: `지난 1시간 동안 요청이 너무 많았습니다. 전화해 주세요: ${contact.allPhones}`, lead: "요청을 검토하고 보내주세요. CarTime의 대시보드에 저장됩니다. 관리자가 이용 가능 여부와 조건을 확인해 드릴 것입니다.", submit: "요청 보내기", sending: "보내는 중…", success: "요청 접수됨", reference: "요청 ID", follow: "더 빠른 답변을 원하시나요? WhatsApp에서 요청을 공유하거나 관리자에게 사본을 이메일로 보내세요.", failed: "요청을 저장할 수 없습니다. 연결을 확인하고 다시 시도하세요.", mail: "info@cartime.az로 사본을 이메일로 보내세요." },
  fr: { invalid: "Vérifiez les informations de votre demande et réessayez.", limited: `Trop de demandes au cours de la dernière heure. Appelez-nous : ${contact.allPhones}`, lead: "Vérifiez et envoyez votre demande. Elle sera enregistrée dans le tableau de bord de CarTime ; un responsable confirmera la disponibilité et les conditions.", submit: "Envoyer la demande", sending: "Envoi…", success: "Demande reçue", reference: "ID de demande", follow: "Vous souhaitez une réponse plus rapide ? Partagez votre demande sur WhatsApp ou envoyez-en une copie par e-mail au responsable.", failed: "Impossible d'enregistrer votre demande. Vérifiez votre connexion et réessayez.", mail: "Envoyez une copie par e-mail à info@cartime.az" },
  ar: { invalid: "يرجى التحقق من بيانات الطلب والمحاولة مرة أخرى.", limited: `طلبات كثيرة خلال الساعة الماضية. يرجى الاتصال بنا: ${contact.allPhones}`, lead: "قم بمراجعة طلبك وإرساله. سيتم حفظه في لوحة معلومات CarTime؛ سيقوم المدير بتأكيد التوفر والشروط.", submit: "أرسل الطلب", sending: "جاري الإرسال…", success: "تم استلام الطلب", reference: "معرف الطلب", follow: "هل تريد الرد بشكل أسرع؟ شارك طلبك عبر تطبيق WhatsApp أو أرسل نسخة بالبريد الإلكتروني إلى المدير.", failed: "لا يمكن حفظ طلبك. تحقق من اتصالك وحاول مرة أخرى.", mail: "أرسل نسخة بالبريد الإلكتروني إلى info@cartime.az" },
};

export default function BookingForm({ locale }: { locale: Locale }) {
  const ui = bookingUi[locale];
  const flow = bookingFlowUi[locale];
  const submitText = submissionUi[locale];
  const fleetText = fleetUi[locale];
  const categories = fleetText.categories;
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);
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
  const [pinnedCar, setPinnedCar] = useState("");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("cheap");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [licenceCountry, setLicenceCountry] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [flight, setFlight] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [needChildSeat, setNeedChildSeat] = useState(false);
  const [childDetails, setChildDetails] = useState("");
  const [secondDriver, setSecondDriver] = useState(false);
  const [secondDriverName, setSecondDriverName] = useState("");
  const [tripPlan, setTripPlan] = useState("");
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
  const [accessManual,setAccessManual]=useState(false);
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
    if (fleet.some((car) => car.id === selected)) { setCarId(selected || ""); setPinnedCar(selected || ""); }
    // A reload in the same tab keeps what was typed, and the access code of a sent request.
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey) ?? "null");
      if (draft && typeof draft === "object") {
        if (typeof draft.name === "string") setName(draft.name);
        if (typeof draft.phone === "string") setPhone(draft.phone);
        if (typeof draft.email === "string") setEmail(draft.email);
        if (typeof draft.age === "string") setAge(draft.age);
        if (typeof draft.experience === "string") setExperience(draft.experience);
        if (typeof draft.licenceCountry === "string") setLicenceCountry(draft.licenceCountry);
        if (channels.includes(draft.channel)) setChannel(draft.channel);
        if (typeof draft.flight === "string") setFlight(draft.flight);
        if (peopleOptions.includes(draft.passengers)) setPassengers(draft.passengers);
        if (typeof draft.needChildSeat === "boolean") setNeedChildSeat(draft.needChildSeat);
        if (typeof draft.childDetails === "string") setChildDetails(draft.childDetails);
        if (typeof draft.secondDriver === "boolean") setSecondDriver(draft.secondDriver);
        if (typeof draft.secondDriverName === "string") setSecondDriverName(draft.secondDriverName);
        if (typeof draft.tripPlan === "string") setTripPlan(draft.tripPlan);
        if (draft.payment === "card" || draft.payment === "cash") setPayment(draft.payment);
        if (typeof draft.notes === "string") setNotes(draft.notes);
        if (!search.toString()) {
          if (places.includes(draft.pickup)) setPickup(draft.pickup);
          if (places.includes(draft.dropoff)) { setDropoff(draft.dropoff); setDifferentReturn(draft.dropoff !== draft.pickup); }
          if (typeof draft.pickupAddress === "string") setPickupAddress(draft.pickupAddress);
          if (typeof draft.returnAddress === "string") setReturnAddress(draft.returnAddress);
          if (typeof draft.fromDate === "string" && draft.fromDate >= current) {
            setFromDate(draft.fromDate);
            if (typeof draft.toDate === "string" && draft.toDate > draft.fromDate) setToDate(draft.toDate);
          }
          if (typeof draft.fromTime === "string" && /^\d{2}:\d{2}$/.test(draft.fromTime)) setFromTime(draft.fromTime);
          if (typeof draft.toTime === "string" && /^\d{2}:\d{2}$/.test(draft.toTime)) setToTime(draft.toTime);
          if (fleet.some((car) => car.id === draft.carId)) { setCarId(draft.carId); setPinnedCar(draft.carId); }
          if (draft.savedId && draft.trip) {
            setSavedId(draft.savedId);
            setTravelCredentials(draft.trip);
            setStep(4);
          } else if ([1, 2, 3, 4].includes(draft.step)) setStep(draft.step);
        }
      }
    } catch {
      // Storage can be blocked or hold something unreadable: start clean.
    }
    setReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify({ step, pickup, dropoff, pickupAddress, returnAddress, fromDate, fromTime, toDate, toTime, carId, name, phone, email, age, experience, licenceCountry, channel, flight, passengers, needChildSeat, childDetails, secondDriver, secondDriverName, tripPlan, payment, notes, savedId, trip: travelCredentials }));
    } catch {
      // Without storage the form still works; only a reload loses the draft.
    }
  }, [ready, step, pickup, dropoff, pickupAddress, returnAddress, fromDate, fromTime, toDate, toTime, carId, name, phone, email, age, experience, licenceCountry, channel, flight, passengers, needChildSeat, childDetails, secondDriver, secondDriverName, tripPlan, payment, notes, savedId, travelCredentials]);

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
  const listRate = (car: Car) => car.ratesUsd[rateIndex(Math.max(2, days))];
  const visibleCars = fleet
    .filter((car) => (category === "all" || car.category === category) && `${car.name} ${car.year}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => Number(b.id === pinnedCar) - Number(a.id === pinnedCar) || (sort === "new" ? b.year - a.year : 0) || (sort === "dear" ? listRate(b) - listRate(a) : listRate(a) - listRate(b)));
  const convert = (usd: number) => currency === "USD" || !rates ? usd : usd * rates.aznPerUnit.USD / rates.aznPerUnit[currency];
  const formatPrice = (usd: number) => {
    const wholeCurrency = currency === "RUB" || currency === "KZT";
    return `${new Intl.NumberFormat(localeInfo[locale].hreflang, { maximumFractionDigits: wholeCurrency ? 0 : 2, minimumFractionDigits: currency === "USD" || wholeCurrency ? 0 : 2 }).format(convert(usd))} ${currency}`;
  };
  // Calculated from the published rates: how much longer until the next, lower tier.
  const nextTier = selectedCar && validDuration && rate !== null ? tierStarts.find((start) => start > days) : undefined;
  const nextRate = selectedCar && nextTier ? selectedCar.ratesUsd[rateIndex(nextTier)] : null;
  const showNudge = nextTier !== undefined && nextRate !== null && rate !== null && nextRate < rate;
  const prettyDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "—";
    return new Intl.DateTimeFormat(localeInfo[locale].hreflang, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
  };
  const channelName = (value: Channel) => value === "whatsapp" ? "WhatsApp" : value === "telegram" ? flow.telegram : value === "call" ? flow.call : flow.emailChannel;

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
    `${flow.channelLabel}: ${channelName(channel)}`,
    `${ui.age}: ${age}`,
    `${ui.experience}: ${experience}`,
    ...(licenceCountry.trim() ? [`${flow.licenceCountry}: ${licenceCountry.trim()}`] : []),
    `${ui.payment}: ${ui[payment]}`,
    `${flow.passengers}: ${passengers === 6 ? "6+" : passengers}`,
    `${ui.secondDriver}: ${secondDriver ? `${ui.secondYes}${secondDriverName.trim() ? ` (${secondDriverName.trim()})` : ""}` : ui.secondNo}`,
    ...(needChildSeat ? [`${flow.childSeat}: ${childDetails.trim()}`] : []),
    ...(pickup === "airport" && flight.trim() ? [`${ui.flight}: ${flight.trim()}`] : []),
    ...(tripPlan.trim() ? [`${flow.tripPlan}: ${tripPlan.trim()}`] : []),
    ...(notes.trim() ? [`${ui.notes}: ${notes.trim()}`] : []),
    "",
    ui.requestOpen,
  ].join("\n");
  const emailHref = `mailto:${contact.email}?subject=${encodeURIComponent(ui.request)}&body=${encodeURIComponent(message)}`;

  function goTo(next: number) {
    setError("");
    setStep(next);
    window.requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function fail(message: string, field?: string) {
    setError(message);
    if (field) formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  }

  function nextStep() {
    setError("");
    if (step === 1) {
      if (!fromDate || fromDate < today) return fail(ui.future, "fromDate");
      if (!toDate || days === 0 || days > 365) return fail(ui.invalidDates, "toDate");
      if (!validDuration) return fail(ui.minimum, "toDate");
      if (pickup === "delivery" && !pickupAddress.trim()) return fail(ui.requiredAddress, "pickupAddress");
      if (dropoff === "delivery" && !returnAddress.trim()) return fail(ui.requiredAddress, "returnAddress");
    }
    if (step === 2 && !selectedCar) return fail(ui.carChoose);
    if (step === 3) {
      if (!formRef.current?.reportValidity()) return;
      if (name.trim().length < 2) return fail(submitText.invalid, "name");
      if (phone.replace(/\D/g, "").length < 7) return fail(ui.phoneError, "phone");
      if (+age < 24 || +age > 70) return fail(ui.ageError, "age");
      if (+experience < 2) return fail(ui.experienceError, "experience");
      if (needChildSeat && !childDetails.trim()) return fail(flow.childRequired, "childDetails");
    }
    if (step < 4) goTo(step + 1);
  }

  async function copyAccess() {
    if (!travelCredentials) return;
    const text = `${travelUi[locale].reference}: ${travelCredentials.reference}\n${travelUi[locale].code}: ${formattedCode(travelCredentials.accessCode)}\n${window.location.origin}${travelLink(locale, travelCredentials)}`;
    if (await copyText(text)) setAccessCopied(true);
    else setAccessManual(true);
  }

  async function copyRequest() {
    if (await copyText(message)) setCopied(true);
    else setError(ui.copyError);
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
        flight: pickup === "airport" ? flight.trim() : "", secondDriver, payment, notes: notes.trim(), website,
        contactChannel: channel, licenceCountry: licenceCountry.trim(), passengers, childSeat: needChildSeat ? childDetails.trim() : "",
        secondDriverName: secondDriver ? secondDriverName.trim() : "", tripPlan: tripPlan.trim(),
      }) });
      if (response.status === 429) { setError(submitText.limited); return; }
      if (response.status === 400) { setError(submitText.invalid); return; }
      if (!response.ok) throw new Error("booking save failed");
      const result = await response.json() as { id: string; trip:TravelCredentials|null };
      if (!result.id) throw new Error("booking reference missing");
      setSavedId(result.id);
      setTravelCredentials(result.trip);
      window.requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch { setError(submitText.failed); }
    finally { setSaving(false); }
  }

  function startOver() {
    requestIdRef.current = null;
    travelCodeRef.current = null;
    setSavedId(null);
    setTravelCredentials(null);
    setAccessCopied(false);
    setAccessManual(false);
    setCopied(false);
    setCarId("");
    setPinnedCar("");
    setNotes("");
    setChildDetails("");
    setNeedChildSeat(false);
    setTripPlan("");
    goTo(1);
  }

  const stepNames = [flow.stepRoute, flow.stepCar, flow.stepDetails, ui.paymentAndReview];
  const stepTitles = [ui.dates, ui.carChoose, ui.driver, savedId ? submitText.success : ui.paymentAndReview];
  const money = (value: number | null) => value === null ? "—" : formatPrice(value);
  const optional = (label: string) => <span className="bf-label">{label} <em>{flow.optional}</em></span>;

  return <div className="bf" ref={topRef}>
    <div className="bf-layout container">
      <div className="bf-main">
        <ol className="bf-steps" aria-label={ui.bookingSteps} style={{ "--bf-progress": `${((savedId ? 4 : step) - 1) / 3}` } as React.CSSProperties}>
          {stepNames.map((label, index) => {
            const number = index + 1;
            const state = savedId || step > number ? "done" : step === number ? "now" : "next";
            return <li key={label} className={`bf-step is-${state}`}>
              <button type="button" disabled={Boolean(savedId) || number >= step} aria-current={step === number ? "step" : undefined} onClick={() => goTo(number)}>
                <span>{state === "done" ? <Check size={15} strokeWidth={3} /> : number}</span><b>{label}</b>
              </button>
            </li>;
          })}
        </ol>

        <form ref={formRef} onSubmit={(event) => { event.preventDefault(); if (step === 4) void submitRequest(); else nextStep(); }} onChange={() => { requestIdRef.current = null; setCopied(false); setError(""); }}>
          <input className="booking-honeypot" type="text" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <header className="bf-head">
            {savedId ? <span className="bf-done-mark"><Check size={30} strokeWidth={3} /></span> : <small>{ui.step} {step} / 4</small>}
            <h2 ref={headingRef} tabIndex={-1}>{stepTitles[step - 1]}</h2>
          </header>

          {step === 1 && <>
            <section className="bf-panel">
              <fieldset className="bf-group">
                <legend>{ui.pickup}</legend>
                <div className="bf-tiles">{places.map((place) => { const Icon = placeIcons[place]; return <label key={place} className={`bf-tile${pickup === place ? " is-on" : ""}`}>
                  <input type="radio" name="pickup" value={place} checked={pickup === place} onChange={() => { setPickup(place); if (!differentReturn) setDropoff(place); }} />
                  <Icon size={22} /><span>{ui[place]}</span>
                </label>; })}</div>
              </fieldset>
              {pickup === "delivery" && <label className="bf-field">{<span className="bf-label">{ui.address}</span>}<input name="pickupAddress" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder={ui.addressHint} maxLength={250} required /></label>}
              {pickup === "airport" && <label className="bf-field">{optional(ui.flight)}<input name="flight" value={flight} onChange={(e) => setFlight(e.target.value)} placeholder="J2 8011" maxLength={80} /></label>}
              <label className="bf-switch"><input type="checkbox" checked={differentReturn} onChange={(e) => { setDifferentReturn(e.target.checked); if (!e.target.checked) setDropoff(pickup); }} /><i aria-hidden="true" />{ui.differentReturn}</label>
              {differentReturn && <fieldset className="bf-group">
                <legend>{ui.return}</legend>
                <div className="bf-tiles">{places.map((place) => { const Icon = placeIcons[place]; return <label key={place} className={`bf-tile${dropoff === place ? " is-on" : ""}`}>
                  <input type="radio" name="dropoff" value={place} checked={dropoff === place} onChange={() => setDropoff(place)} />
                  <Icon size={22} /><span>{ui[place]}</span>
                </label>; })}</div>
              </fieldset>}
              {differentReturn && dropoff === "delivery" && <label className="bf-field"><span className="bf-label">{ui.address}</span><input name="returnAddress" value={returnAddress} onChange={(e) => setReturnAddress(e.target.value)} placeholder={ui.addressHint} maxLength={250} required /></label>}
            </section>
            <section className="bf-panel">
              <div className="bf-dates">
                <fieldset><legend>{ui.from}</legend><div>
                  <label className="bf-field"><span className="bf-label">{ui.date}</span><input name="fromDate" aria-label={`${ui.from} · ${ui.date}`} type="date" value={fromDate} min={today || undefined} onChange={(e) => { const date = e.target.value; setFromDate(date); if (date && (!toDate || toDate <= date)) setToDate(addDaysIso(date, 3)); }} required /></label>
                  <label className="bf-field"><span className="bf-label">{ui.time}</span><input aria-label={`${ui.from} · ${ui.time}`} type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} required /></label>
                </div></fieldset>
                <fieldset><legend>{ui.to}</legend><div>
                  <label className="bf-field"><span className="bf-label">{ui.date}</span><input name="toDate" aria-label={`${ui.to} · ${ui.date}`} type="date" value={toDate} min={fromDate || today || undefined} onChange={(e) => setToDate(e.target.value)} required /></label>
                  <label className="bf-field"><span className="bf-label">{ui.time}</span><input aria-label={`${ui.to} · ${ui.time}`} type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} required /></label>
                </div></fieldset>
              </div>
              <div className="bf-quick" role="group" aria-label={flow.quick}>
                <span>{flow.quick}</span>
                {quickDays.map((count) => <button key={count} type="button" aria-pressed={days === count && fromTime === toTime} onClick={() => { setToDate(addDaysIso(fromDate, count)); setToTime(fromTime); setError(""); }}>{dayCountLabel(locale, count)}</button>)}
              </div>
              <div className={`bf-duration${days && !validDuration ? " is-bad" : ""}`} aria-live="polite">
                <strong>{days || "—"}</strong>
                <span><b>{ui.days}</b><small>{days && !validDuration ? ui.minimum : ui.durationHint}</small></span>
              </div>
            </section>
          </>}

          {step === 2 && <section className="bf-panel bf-panel-cars">
            <div className="bf-tools">
              <label className="bf-field"><span className="bf-label">{ui.carSearch}</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.carSearch} /></label>
              <label className="bf-field"><span className="bf-label">{flow.sort}</span><select value={sort} onChange={(e) => setSort(e.target.value as Sort)}><option value="cheap">{flow.sortCheap}</option><option value="dear">{flow.sortDear}</option><option value="new">{flow.sortNew}</option></select></label>
            </div>
            <div className="bf-chips" role="group" aria-label={ui.all}>
              <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>{ui.all}</button>
              {Object.entries(categories).filter(([key]) => key !== "all").map(([key, label]) => <button key={key} type="button" aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>)}
            </div>
            <div className="bf-currency">
              <div className="bf-chips bf-chips-small" role="group" aria-label={ui.currency}>{currencies.map((code) => <button key={code} type="button" disabled={code !== "USD" && !rates} aria-pressed={currency === code} onClick={() => setCurrency(code)}>{code}</button>)}</div>
              <small>{ui.currencyNote} {rates ? <><a href={rates.source} target="_blank" rel="noopener noreferrer">{ui.ratesSource} ↗</a> · {ui.rateDate}: {rates.date}</> : ratesError ? ui.ratesUnavailable : ""}</small>
            </div>
            <details className="bf-included">
              <summary><span><Check size={15} />{ui.unlimitedMileage}</span><span><Check size={15} />{ui.basicProtection}</span><b>{flow.included}<ChevronDown size={16} /></b></summary>
              <div>
                <article><ShieldCheck size={20} /><h3>{ui.basicProtection}</h3><p>{ui.basicProtectionText}</p><strong>{ui.included}</strong></article>
                <article><CarFront size={20} /><h3>{ui.unlimitedMileage}</h3><p>{ui.mileageText}</p><strong>{ui.included}</strong></article>
                <article><CreditCard size={20} /><h3>{ui.deposit}</h3><p>{ui.depositText}</p><strong>{ui.managerConfirms}</strong></article>
                <article><CalendarDays size={20} /><h3>{ui.pickupService}</h3><p>{ui.pickupServiceText}</p><strong>{ui.managerConfirms}</strong></article>
              </div>
            </details>
            {showNudge && <div className="bf-nudge"><Sparkles size={18} /><span>{flow.tierNudge.replace("{n}", dayCountLabel(locale, nextTier - days)).replace("{rate}", formatPrice(nextRate))}</span><button type="button" onClick={() => setToDate(addDaysIso(toDate, nextTier - days))}><Plus size={15} />{flow.extend}</button></div>}
            <p className="bf-count" aria-live="polite">{visibleCars.length} {ui.carsShown}</p>
            <div className="bf-cars" aria-label={ui.carChoose}>{visibleCars.map((car, index) => {
              const carRate = listRate(car);
              const chosen = car.id === carId;
              return <button className={`bf-car${chosen ? " is-on" : ""}`} type="button" aria-pressed={chosen} aria-label={`${ui.chooseCard}: ${car.name} ${car.year}`} onClick={() => { setCarId(car.id); setError(""); }} key={car.id}>
                <span className="bf-car-stage"><img src={(fleetImages as Record<string, string>)[car.id]} alt={`${car.name} ${car.year} — ${ui.vehicleImage}`} loading={index < 4 ? "eager" : "lazy"} decoding="async" /><i>{chosen ? <Check size={16} strokeWidth={3} /> : null}</i></span>
                <span className="bf-car-text">
                  <small>{categories[car.category]} · {car.year}</small>
                  <strong>{car.name}</strong>
                  <span className="bf-car-price"><b>{formatPrice(carRate)}</b><em>/ {fleetText.perDay.replace("USD / ", "")}</em></span>
                  {validDuration && <span className="bf-car-total">{ui.estimate}: {formatPrice(carRate * days)}</span>}
                </span>
              </button>;
            })}</div>
            {visibleCars.length === 0 && <p className="bf-muted">{ui.noCar}</p>}
          </section>}

          {step === 3 && <>
            <p className="bf-lead">{ui.driverLead}</p>
            <section className="bf-panel">
              <h3 className="bf-sub">{flow.sectionDriver}</h3>
              <div className="bf-grid">
                <label className="bf-field bf-wide"><span className="bf-label">{ui.fullName}</span><input name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={120} required /></label>
                <label className="bf-field"><span className="bf-label">{ui.age}</span><input name="age" type="number" min="24" max="70" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} required /></label>
                <label className="bf-field"><span className="bf-label">{ui.experience}</span><input name="experience" type="number" min="2" max="70" inputMode="numeric" value={experience} onChange={(e) => setExperience(e.target.value)} required /></label>
                <label className="bf-field bf-wide">{optional(flow.licenceCountry)}<input name="licenceCountry" autoComplete="country-name" value={licenceCountry} onChange={(e) => setLicenceCountry(e.target.value)} placeholder={flow.licenceHint} maxLength={80} /></label>
              </div>
              <label className="bf-switch"><input type="checkbox" checked={secondDriver} onChange={(e) => setSecondDriver(e.target.checked)} /><i aria-hidden="true" />{ui.secondDriver}</label>
              {secondDriver && <label className="bf-field">{optional(flow.secondDriverName)}<input name="secondDriverName" value={secondDriverName} onChange={(e) => setSecondDriverName(e.target.value)} maxLength={120} /></label>}
            </section>
            <section className="bf-panel">
              <h3 className="bf-sub">{flow.sectionContact}</h3>
              <div className="bf-grid">
                <label className="bf-field"><span className="bf-label">{ui.phone}</span><input name="phone" type="tel" autoComplete="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994 ..." maxLength={40} required /></label>
                <label className="bf-field"><span className="bf-label">{ui.email}</span><input name="email" type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} required /></label>
              </div>
              <fieldset className="bf-group">
                <legend>{flow.channelLabel}</legend>
                <div className="bf-tiles bf-tiles-four">{channels.map((value) => { const Icon = channelIcons[value]; return <label key={value} className={`bf-tile${channel === value ? " is-on" : ""}`}>
                  <input type="radio" name="channel" value={value} checked={channel === value} onChange={() => setChannel(value)} />
                  <Icon size={20} /><span>{channelName(value)}</span>
                </label>; })}</div>
              </fieldset>
            </section>
            <section className="bf-panel">
              <h3 className="bf-sub">{flow.sectionTrip}</h3>
              <fieldset className="bf-group">
                <legend><Users size={16} />{flow.passengers}</legend>
                <div className="bf-people">{peopleOptions.map((count) => <label key={count} className={passengers === count ? "is-on" : ""}>
                  <input type="radio" name="passengers" value={count} checked={passengers === count} onChange={() => setPassengers(count)} /><span>{count === 6 ? "6+" : count}</span>
                </label>)}</div>
              </fieldset>
              <label className="bf-switch"><input type="checkbox" checked={needChildSeat} onChange={(e) => setNeedChildSeat(e.target.checked)} /><i aria-hidden="true" />{flow.childSeat}</label>
              {needChildSeat && <label className="bf-field"><span className="bf-label">{flow.childDetails}</span><input name="childDetails" value={childDetails} onChange={(e) => setChildDetails(e.target.value)} maxLength={120} required /></label>}
              <label className="bf-field">{optional(flow.tripPlan)}<input name="tripPlan" value={tripPlan} onChange={(e) => setTripPlan(e.target.value)} placeholder={flow.tripPlanHint} maxLength={250} /></label>
              <label className="bf-field">{optional(ui.notes)}<textarea name="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={ui.notesHint} maxLength={2000} /></label>
            </section>
            <p className="bf-fine">{ui.privacy} <a href={`/${locale}/rental/conditions`}>{ui.conditions} ↗</a></p>
          </>}

          {step === 4 && !savedId && <div aria-live="polite">
            <section className="bf-panel">
              <fieldset className="bf-group bf-pay">
                <legend>{ui.payment}</legend>
                <div className="bf-pay-options">
                  <label className={`bf-pay-option${payment === "card" ? " is-on" : ""}`}>
                    <input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} />
                    <span className="bf-pay-top"><CreditCard size={28} /><i aria-hidden="true" /></span>
                    <strong>{ui.card}</strong>
                    <span className="bf-pay-marks"><VisaMark /><MastercardMark /></span>
                    <small>{flow.cardHint}</small>
                  </label>
                  <label className={`bf-pay-option${payment === "cash" ? " is-on" : ""}`}>
                    <input type="radio" name="payment" value="cash" checked={payment === "cash"} onChange={() => setPayment("cash")} />
                    <span className="bf-pay-top"><Banknote size={28} /><i aria-hidden="true" /></span>
                    <strong>{ui.cash}</strong>
                    <small>{flow.cashHint}</small>
                  </label>
                </div>
                <p className="bf-pay-note"><ShieldCheck size={18} />{ui.paymentNote}</p>
              </fieldset>
            </section>
            <section className="bf-panel bf-review">
              <h3 className="bf-sub">{flow.reviewTitle}</h3>
              <div className="bf-review-block">
                <div><small>{flow.stepRoute}</small><p>{locationText(pickup, pickupAddress)} → {locationText(dropoff, returnAddress)}</p><p>{prettyDate(fromDate)} {fromTime} → {prettyDate(toDate)} {toTime}</p></div>
                <button type="button" onClick={() => goTo(1)}>{flow.change}</button>
              </div>
              <div className="bf-review-block">
                <div><small>{flow.stepCar}</small><p>{selectedCar?.name} · {selectedCar?.year}</p><p>{dayCountLabel(locale, days)} · {ui.rate}: {money(rate)}</p></div>
                <button type="button" onClick={() => goTo(2)}>{flow.change}</button>
              </div>
              <div className="bf-review-block">
                <div><small>{flow.stepDetails}</small><p>{name}</p><p><bdi>{phone}</bdi> · <bdi>{email}</bdi></p><p>{flow.channelLabel}: {channelName(channel)}</p></div>
                <button type="button" onClick={() => goTo(3)}>{flow.change}</button>
              </div>
              <div className="bf-review-total"><span>{ui.estimate}</span><strong>{money(amount)}</strong>{currency !== "USD" && <small>USD {amount}</small>}</div>
              <p className="bf-fine">{ui.estimateNote}</p>
            </section>
            {error && <p className="bf-error" role="alert">{error}</p>}
            <button className="bf-submit" type="submit" disabled={saving}>{saving ? submitText.sending : submitText.submit}<ArrowRight className="travel-flip" size={20} /></button>
            <p className="bf-fine">{submitText.lead}</p>
          </div>}

          {step === 4 && savedId && <div className="bf-done" aria-live="polite">
            {!travelCredentials && <section className="bf-panel bf-done-head" role="status">
              <div><small>{submitText.reference}</small><strong dir="ltr">{travelReference(savedId)}</strong></div>
            </section>}
            {travelCredentials && <section className="bf-pass">
              <span className="bf-pass-kicker"><Ticket size={17} />Travel Pass</span>
              <h3>{travelUi[locale].credentials}</h3>
              <dl>
                <div><dt>{travelUi[locale].reference}</dt><dd dir="ltr">{travelCredentials.reference}</dd></div>
                <div><dt>{travelUi[locale].code}</dt><dd dir="ltr">{formattedCode(travelCredentials.accessCode)}</dd></div>
              </dl>
              <p>{travelUi[locale].save}</p>
              <a className="bf-primary" href={travelLink(locale, travelCredentials)}>{travelUi[locale].openPass}<ArrowRight className="travel-flip" size={19} /></a>
              <button className="bf-secondary" type="button" onClick={copyAccess}><Clipboard size={17} />{accessCopied ? travelUi[locale].copied : travelUi[locale].share}</button>
              {accessManual && <label className="booking-travel-manual">{travelUi[locale].copyManual}<input readOnly dir="ltr" value={window.location.origin + travelLink(locale, travelCredentials)} onFocus={(event) => event.currentTarget.select()} /></label>}
            </section>}
            <section className="bf-panel">
              <h3 className="bf-sub">{flow.whatNext}</h3>
              <ol className="bf-timeline">
                <li>{flow.next1.replace("{channel}", channelName(channel))}</li>
                <li>{flow.next2}</li>
                <li>{flow.next3}</li>
              </ol>
            </section>
            <section className="bf-panel">
              <p className="bf-lead">{submitText.follow}</p>
              <div className="bf-send">
                <div className="bf-whatsapp-choice"><strong>{ui.whatsapp}</strong><span>{whatsappUi[locale].choose}</span><WhatsAppChoice text={message} /></div>
                <a className="bf-secondary" href={emailHref}><Mail size={19} />{submitText.mail}</a>
                <button className="bf-secondary" type="button" onClick={copyRequest}><Clipboard size={18} />{copied ? ui.copied : ui.copy}</button>
              </div>
              {error && <p className="bf-error" role="alert">{error}</p>}
            </section>
            <button className="bf-link" type="button" onClick={startOver}><ArrowLeft className="travel-flip" size={17} />{flow.newRequest}</button>
          </div>}

          {step < 4 && <div className="bf-bar" role="group" aria-label={ui.bookingSteps}>
            {error && <p className="bf-bar-error" role="alert">{error}</p>}
            <div className="bf-bar-row">
              <div className="bf-bar-info"><small>{selectedCar ? `${selectedCar.name} · ${selectedCar.year}` : ui.carChoose}</small><strong>{days ? `${days} ${ui.daysShort} · ` : ""}{money(amount)}</strong></div>
              {step > 1 && <button type="button" className="bf-back" aria-label={ui.back} onClick={() => goTo(step - 1)}><ArrowLeft className="travel-flip" size={19} /></button>}
              <button type="button" className="bf-next" onClick={nextStep}>{ui.next}<ArrowRight className="travel-flip" size={19} /></button>
            </div>
          </div>}
        </form>
      </div>

      <aside className="bf-side">
        <div className="bf-ticket">
          <div className="bf-ticket-stage">
            {selectedCar ? <img src={(fleetImages as Record<string, string>)[selectedCar.id]} alt={`${selectedCar.name} ${selectedCar.year}`} /> : <CarFront size={54} strokeWidth={1.2} aria-hidden="true" />}
          </div>
          <div className="bf-ticket-body">
            <small>{ui.summary}</small>
            <h2>{selectedCar ? `${selectedCar.name} ${selectedCar.year}` : ui.carChoose}</h2>
            <div className="bf-ticket-route">
              <div><small>{ui.from}</small><b>{prettyDate(fromDate)}</b><strong>{fromTime}</strong><span>{ui[pickup]}</span></div>
              <div><small>{ui.to}</small><b>{prettyDate(toDate)}</b><strong>{toTime}</strong><span>{ui[dropoff]}</span></div>
            </div>
          </div>
          <div className="bf-ticket-tear" aria-hidden="true" />
          <div className="bf-ticket-body">
            <div className="bf-ticket-row"><span>{ui.days}</span><b>{days || "—"}</b></div>
            <div className="bf-ticket-row"><span>{ui.rate}</span><b>{money(rate)}</b></div>
            <div className="bf-ticket-total"><span>{ui.estimate}</span><strong>{money(amount)}</strong></div>
            {amount !== null && currency !== "USD" && <small className="bf-ticket-base">USD {amount}</small>}
            <p>{amount === null ? ui.noEstimate : ui.estimateNote}</p>
            <div className="bf-ticket-facts"><span><Check size={15} />{ui.noPayment}</span><span><Check size={15} />{ui.support}</span></div>
            <a href={`/${locale}/contact`}>{ui.contact} <ArrowRight className="travel-flip" size={16} /></a>
          </div>
        </div>
      </aside>
    </div>
  </div>;
}
