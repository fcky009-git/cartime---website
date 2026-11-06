"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import QRCode from "qrcode";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Copy, Download, LockKeyhole, MapPin, MessageCircle, Phone, RefreshCw, ShieldCheck, Sparkles, Ticket, Wallet, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { localeInfo } from "@/lib/locales";
import { travelUi } from "@/lib/travel-ui";
import type { PublicTravelPass } from "@/lib/travel-pass";
import { formattedCode, googleCalendarLink, normalizeAccessCode, travelLink, tripCalendar } from "@/lib/travel-access";
import { copyText, downloadFile, saveFile } from "@/lib/device-actions";
import { renderTravelPass } from "@/lib/travel-pdf";
import { dayCountLabel } from "@/lib/count-labels";
import fleetImages from "@/lib/fleet-images.json";
import { contact, contactLocation, phones, whatsappLink, whatsappUi } from "@/lib/service-info";
import WhatsAppChoice from "@/components/whatsapp-choice";

const REFRESH_MS = 90_000;
/** The window for saving or copying, with a visible way out when a phone blocks the direct route. */
type Sheet =
  | { kind: "pdf"; status: "loading" | "failed" }
  | { kind: "pdf"; status: "ready"; preview: string; file: string; blob: Blob }
  | { kind: "calendar"; blob: Blob; google: string }
  | { kind: "link"; link: string }
  | { kind: "contact" };
const stages = ["new", "contacted", "confirmed", "active", "completed"] as const;

export default function TravelPass({ locale }: { locale: Locale }) {
  const t = travelUi[locale];
  const [reference, setReference] = useState("");
  const [code, setCode] = useState("");
  const [pass, setPass] = useState<PublicTravelPass | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [qr, setQr] = useState("");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const pending = useRef(false);
  const lastChecked = useRef(0);
  const loadController = useRef<AbortController | null>(null);
  const pdfAttempt = useRef(0);

  const load = useCallback(async (ref: string, key: string, quiet = false) => {
    if (pending.current) return;
    pending.current = true;
    const controller = new AbortController();
    loadController.current = controller;
    if (!quiet) { setBusy(true); setError(""); }
    try {
      const response = await fetch("/api/travel-pass", { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", signal: controller.signal, body: JSON.stringify({ reference: ref, accessCode: key }) });
      if (controller.signal.aborted) return;
      lastChecked.current = Date.now();
      if (!response.ok) {
        // A failed background refresh keeps the last data on screen; only a replaced code closes the pass.
        if (response.status === 404) { setPass(null); setError(t.invalid); }
        else if (!quiet) setError(response.status === 429 ? t.limited : t.unavailable);
        return;
      }
      const data = await response.json() as { pass: PublicTravelPass };
      if (controller.signal.aborted) return;
      const accessCode = normalizeAccessCode(key);
      setError("");
      setPass(data.pass);
      setReference(data.pass.reference);
      setCode(accessCode);
      window.history.replaceState(null, "", travelLink(locale, { reference: data.pass.reference, accessCode }));
    } catch {
      if (!controller.signal.aborted && !quiet) setError(t.unavailable);
    } finally {
      if (loadController.current === controller) { pending.current = false; setBusy(false); }
    }
  }, [locale, t]);

  // Opens a private link on page load, and when a link is pasted while this page is already open.
  useEffect(() => {
    let active = true;
    const openFromHash = () => {
      const values = new URLSearchParams(window.location.hash.slice(1));
      const ref = values.get("reference"), key = values.get("code");
      if (!ref || !key) return;
      loadController.current?.abort();
      pending.current = false;
      setReference(ref);
      setCode(key);
      void load(ref, key);
    };
    queueMicrotask(() => { if (active) openFromHash(); });
    window.addEventListener("hashchange", openFromHash);
    return () => { active = false; window.removeEventListener("hashchange", openFromHash); };
  }, [load]);
  useEffect(() => () => { loadController.current?.abort(); }, []);

  const hasPass = Boolean(pass);
  useEffect(() => {
    if (!hasPass) return;
    const refresh = () => {
      if (document.visibilityState === "visible" && Date.now() - lastChecked.current >= REFRESH_MS - 1000) void load(reference, code, true);
    };
    const interval = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("online", refresh);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", refresh); window.removeEventListener("online", refresh); };
  }, [hasPass, reference, code, load]);

  const passReference = pass?.reference;
  useEffect(() => {
    if (!passReference) return;
    let active = true;
    QRCode.toDataURL(window.location.origin + travelLink(locale, { reference: passReference, accessCode: code }), { width: 240, margin: 2, errorCorrectionLevel: "M", color: { dark: "#0a1d2f", light: "#ffffff" } })
      .then((url) => { if (active) setQr(url); })
      .catch(() => {});
    return () => { active = false; };
  }, [passReference, code, locale]);

  const sheetUrls = useRef<string[]>([]);
  const closeSheet = useCallback(() => {
    sheetUrls.current.forEach((url) => URL.revokeObjectURL(url));
    sheetUrls.current = [];
    pdfAttempt.current++;
    setSheet(null);
  }, []);
  useEffect(() => closeSheet, [closeSheet]);
  const tempUrl = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    sheetUrls.current.push(url);
    return url;
  };

  useEffect(() => {
    if (!sheet) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeSheet(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet, closeSheet]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!error || !hasPass) return;
    const timer = window.setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error, hasPass]);

  const date = (value: string) => new Intl.DateTimeFormat(localeInfo[locale].hreflang, { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Baku" }).format(new Date(`${value}T12:00:00+04:00`));
  const stamp = (value: string) => new Intl.DateTimeFormat(localeInfo[locale].hreflang, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Baku" }).format(new Date(value));
  const placeName = (value: string) => value === "airport" ? t.airport : value === "delivery" ? t.delivery : t.office;
  const placeText = (value: string, address: string | null) => (value === "delivery" && address ? `${placeName(value)} · ${address}` : placeName(value));
  const place = (value: string, address: string | null) => <>{placeName(value)}{value === "delivery" && address ? <> · <bdi>{address}</bdi></> : null}</>;

  const close = () => {
    loadController.current?.abort();
    pending.current = false;
    setBusy(false);
    setQr("");
    setPass(null);
    setCode("");
    setError("");
    setNotice("");
    closeSheet();
    window.history.replaceState(null, "", `/${locale}/travel-pass`);
  };
  const stage = pass ? (pass.status === "cancelled" ? "cancelled" : pass.status === "confirmed" && pass.stage !== "booking" ? pass.stage : pass.status) : "new";
  const next = stage === "cancelled" ? t.nextCancelled : stage === "completed" ? t.nextCompleted : stage === "active" ? t.nextActive : stage === "confirmed" ? t.nextConfirmed : stage === "contacted" ? t.nextReview : t.nextNew;
  const stageIndex = stages.indexOf(stage as typeof stages[number]);
  const beforePickup = stage === "new" || stage === "contacted" || stage === "confirmed";
  const showInstructions = stage !== "cancelled" && stage !== "completed";
  const copy = async () => {
    if (!pass) return;
    const link = window.location.origin + travelLink(locale, { reference: pass.reference, accessCode: code });
    if (await copyText(link)) setNotice(t.copied);
    else setSheet({ kind: "link", link });
  };
  const calendar = () => {
    if (!pass) return;
    closeSheet();
    const location = pass.pickup === "delivery" && pass.pickupAddress ? `${t.delivery}: ${pass.pickupAddress}` : placeName(pass.pickup);
    const summary = `CarTime · ${pass.carName} · ${t[pass.status as "new"] || pass.status}`;
    const description = `${pass.reference}. ${t.estimateHint}`;
    const blob = new Blob([tripCalendar({ ...pass, summary, location, description })], { type: "text/calendar;charset=utf-8" });
    setSheet({ kind: "calendar", blob, google: googleCalendarLink({ ...pass, summary, location, description }) });
  };
  const pdf = async () => {
    if (!pass) return;
    closeSheet();
    const attempt = ++pdfAttempt.current;
    setSheet({ kind: "pdf", status: "loading" });
    try {
      const heading = document.querySelector(".travel-ticket h2") ?? document.body;
      const { preview, pdf: blob } = await renderTravelPass({
        rtl: localeInfo[locale].dir === "rtl",
        displayFont: getComputedStyle(heading).fontFamily,
        bodyFont: getComputedStyle(document.body).fontFamily,
        logo: "/assets/logo-dark.webp",
        carImage: fleetImages[pass.carId as keyof typeof fleetImages],
        qr: qr || undefined,
        reference: pass.reference,
        status: String(t[stage as "new"] || stage),
        carName: pass.carName,
        year: pass.carYear,
        guest: `${t.guest}: ${pass.customerName}`,
        pickup: { label: t.pickup, date: date(pass.fromDate), time: pass.fromTime, place: placeText(pass.pickup, pass.pickupAddress) },
        dropoff: { label: t.return, date: date(pass.toDate), time: pass.toTime, place: placeText(pass.dropoff, pass.returnAddress) },
        zone: t.timezone,
        amountLabel: pass.confirmedTotalUsd === null ? t.estimate : t.agreed,
        amount: `$${pass.confirmedTotalUsd ?? pass.estimateUsd} USD`,
        days: dayCountLabel(locale, pass.days),
        deposit: `${t.deposit}: ${pass.depositUsd === null ? t.pending : `$${pass.depositUsd} USD`}`,
        codeLabel: t.code,
        code: formattedCode(code),
        privacy: t.privacy,
        notes: [
          ...(pass.message ? [{ title: t.message, text: pass.message }] : []),
          ...(showInstructions && pass.pickupInstructions ? [{ title: t.instructions, text: pass.pickupInstructions }] : []),
        ],
        contact: `CarTime · ${contact.allPhones} · ${contact.email}`,
        hint: t.estimateHint,
      });
      if (attempt !== pdfAttempt.current) return;
      setSheet({ kind: "pdf", status: "ready", preview: tempUrl(preview), file: tempUrl(blob), blob });
    } catch {
      if (attempt === pdfAttempt.current) setSheet({ kind: "pdf", status: "failed" });
    }
  };
  const wallet = async () => {
    if (!pass) return;
    setBusy(true);
    try {
      const response = await fetch("/api/travel-pass", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: pass.reference, accessCode: code, wallet: true }) });
      if (!response.ok) throw new Error("wallet failed");
      downloadFile(await response.blob(), `${pass.reference}.pkpass`);
    } catch { setError(t.unavailable); }
    finally { setBusy(false); }
  };

  const sheetTitle = sheet?.kind === "pdf" ? t.print : sheet?.kind === "calendar" ? t.calendar : sheet?.kind === "contact" ? t.support : t.share;

  return <main className={`travel-page${pass ? " has-pass" : ""}`}>
    <div className="travel-aurora" aria-hidden="true" />
    <div className="travel-wrap">
      <header className="travel-heading"><p><Sparkles size={15} /> CARTIME / TRAVEL PASS</p><h1>{t.title}</h1><span>{t.lead}</span></header>
      {!pass ? <div className="travel-entry">
        <section className="travel-entry-art" aria-hidden="true">
          <div className="travel-sample"><span>CARTIME / BAKU</span><Ticket size={38} /><strong>Drive on<br />Your Time.</strong><div className="travel-sample-line" /><small>TRAVEL PASS</small></div>
          <i /><i />
        </section>
        <section className="travel-lookup">
          <span className="travel-lock"><LockKeyhole size={23} /></span>
          <h2>{t.lookup}</h2>
          <form onSubmit={(event) => { event.preventDefault(); void load(reference, code); }}>
            <label htmlFor="trip-reference">{t.reference}</label>
            <input id="trip-reference" value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="CT-XXXXXXXXXXXX" maxLength={32} required autoComplete="off" autoCapitalize="characters" spellCheck={false} dir="ltr" />
            <label htmlFor="trip-code">{t.code}</label>
            <input id="trip-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="XXXX-XXXX-XXXX" maxLength={40} required autoComplete="off" autoCapitalize="characters" spellCheck={false} dir="ltr" />
            {error && <p className="travel-error" role="alert">{error}</p>}
            <button className="travel-primary" disabled={busy}>{busy ? t.loading : t.open}<ArrowRight className="travel-flip" size={18} /></button>
          </form>
          <p className="travel-privacy"><ShieldCheck size={17} />{t.privacy}</p>
          {phones.map((item) => <a key={item.phone} href={whatsappLink(item.phone)} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">WhatsApp {item.display}</bdi> ↗</a>)}
        </section>
      </div> : <>
        <div className="travel-toolbar">
          <span><span className="travel-live" /> {t.updated}: {stamp(pass.updatedAt)}</span>
          <button onClick={() => void load(reference, code)} disabled={busy}><RefreshCw size={15} className={busy ? "travel-spin" : ""} />{t.refresh}</button>
          <button onClick={close}><X size={16} />{t.forget}</button>
        </div>
        {/* Shown over the page: on a phone the buttons are far below the top of the pass, so anything placed up there is never seen. */}
        {createPortal(<>
          {error && <p className="travel-toast travel-toast-error" role="alert">{error}</p>}
          {notice && <p className="travel-toast" role="status"><Check size={18} />{notice}</p>}
        </>, document.body)}
        <div className="travel-dashboard">
          <article className={`travel-ticket travel-state-${stage}`}>
            <div className="travel-ticket-top"><Image unoptimized src="/assets/logo-dark.webp" alt="CarTime" width={160} height={45} /><span><LockKeyhole size={12} /> TRAVEL PASS</span></div>
            <div className="travel-car">
              <div className="travel-car-halo" />
              {fleetImages[pass.carId as keyof typeof fleetImages] && <Image unoptimized src={fleetImages[pass.carId as keyof typeof fleetImages]} alt={`${pass.carName} ${pass.carYear}`} width={900} height={500} priority />}
              <span>{pass.carYear}</span>
            </div>
            <div className="travel-ticket-body">
              <div className="travel-ticket-label"><bdi>{pass.reference}</bdi><span className="travel-status">{t[stage as "new"] || stage}</span></div>
              <h2>{pass.carName}</h2>
              <p className="travel-guest">{t.guest} · <bdi>{pass.customerName}</bdi></p>
              <div className="travel-route">
                <section><small>{t.pickup}</small><strong>{date(pass.fromDate)}</strong><b>{pass.fromTime}</b><p><MapPin size={13} /><span>{place(pass.pickup, pass.pickupAddress)}</span></p></section>
                <span className="travel-route-arrow travel-flip">→</span>
                <section><small>{t.return}</small><strong>{date(pass.toDate)}</strong><b>{pass.toTime}</b><p><MapPin size={13} /><span>{place(pass.dropoff, pass.returnAddress)}</span></p></section>
              </div>
              <p className="travel-zone"><Clock3 size={13} />{t.timezone}</p>
              <div className="travel-perforation" />
              <div className="travel-ticket-bottom">
                <div>
                  <small>{pass.confirmedTotalUsd === null ? t.estimate : t.agreed}</small>
                  <strong><bdi>${pass.confirmedTotalUsd ?? pass.estimateUsd}<em> USD</em></bdi></strong>
                  <span>{dayCountLabel(locale, pass.days)}</span>
                  <p>{t.deposit}: {pass.depositUsd === null ? t.pending : <bdi>${pass.depositUsd} USD</bdi>}</p>
                </div>
                {qr && <Image unoptimized className="travel-qr" src={qr} alt={t.openPass} width={106} height={106} />}
              </div>
              <span className="travel-access-code">{t.code}<code dir="ltr">{formattedCode(code)}</code></span>
              <small className="travel-privacy">{t.privacy}</small>
            </div>
          </article>
          <aside className="travel-side">
            <section className="travel-panel travel-next">
              <span className="travel-icon"><CheckCircle2 size={23} /></span>
              <p className="travel-eyebrow">{t.timeline}</p>
              <h2>{t[stage as "new"] || stage}</h2>
              <p>{next}</p>
              <ol className="travel-stages">{stages.map((item, index) => <li key={item} className={stage !== "cancelled" && index <= stageIndex ? "done" : ""} aria-current={index === stageIndex ? "step" : undefined}><span>{index < stageIndex || stage === "completed" ? <Check size={12} /> : index + 1}</span>{t[item]}</li>)}</ol>
            </section>
            {(pass.message || showInstructions) && <section className="travel-panel">
              {pass.message && <><h3>{t.message}</h3><p className="travel-public-message" dir="auto">{pass.message}</p></>}
              {showInstructions && <>
                <h3>{t.instructions}</h3>
                {pass.pickupInstructions ? <p className="travel-public-message" dir="auto">{pass.pickupInstructions}</p> : <p className="travel-public-message">{t.noMessage}</p>}
                <a className="travel-text-link" href={pass.pickup === "office" ? contactLocation.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pass.pickup === "airport" ? "Heydar Aliyev International Airport" : pass.pickupAddress || "Baku")}`} target="_blank" rel="noopener noreferrer"><MapPin size={16} />{t.map} ↗</a>
              </>}
            </section>}
            <section className="travel-panel travel-actions">
              {pass.walletReady && <button className="travel-wallet-action" onClick={() => void wallet()} disabled={busy}><Wallet size={19} />{t.walletReady}<ArrowRight className="travel-flip" size={16} /></button>}
              <button onClick={calendar}><CalendarDays size={19} />{t.calendar}</button>
              <button onClick={() => void pdf()}><Download size={19} />{t.print}</button>
              <button onClick={() => void copy()}><Copy size={19} />{t.share}</button>
              <button type="button" onClick={() => setSheet({ kind: "contact" })}><MessageCircle size={19} />{t.support}</button>
            </section>
          </aside>
        </div>
        <div className="travel-lower">
          {beforePickup && <section className="travel-panel"><h3><ShieldCheck size={20} />{t.checklist}</h3><ul><li>{t.documents}</li><li>{t.fuel}</li><li>{t.estimateHint}</li></ul></section>}
          <section className="travel-panel"><h3>{t.history}</h3><ol className="travel-history">{pass.history.slice(-12).reverse().map((event, index) => <li key={`${event.at}-${index}`}><span /><div><strong>{t[event.status as "new"] || event.status}</strong><time>{stamp(event.at)}</time></div></li>)}</ol></section>
        </div>
      </>}
    </div>
    {sheet && pass && createPortal(<div className="travel-sheet-backdrop" onClick={closeSheet}>
      <div className="travel-sheet" role="dialog" aria-modal="true" aria-label={sheetTitle} onClick={(event) => event.stopPropagation()}>
        <div className="travel-sheet-head"><h3>{sheetTitle}</h3><button type="button" aria-label={t.closeSheet} onClick={closeSheet}><X size={20} /></button></div>
        {sheet.kind === "pdf" && sheet.status === "loading" && <p className="travel-sheet-state" role="status"><RefreshCw size={18} className="travel-spin" />{t.loading}</p>}
        {sheet.kind === "pdf" && sheet.status === "failed" && <><p className="travel-error" role="alert">{t.fileFailed}</p><button type="button" className="travel-sheet-primary" onClick={() => void pdf()}><RefreshCw size={18} />{t.refresh}</button></>}
        {sheet.kind === "pdf" && sheet.status === "ready" && <>
          {/* eslint-disable-next-line @next/next/no-img-element -- a local blob preview; holding it saves the image on any phone */}
          <img className="travel-sheet-preview" src={sheet.preview} alt={`Travel Pass ${pass.reference}`} />
          <button type="button" className="travel-sheet-primary" onClick={() => void saveFile(sheet.blob, `CarTime-${pass.reference}.pdf`)}><Download size={18} />{t.saveFile}</button>
          <a className="travel-sheet-secondary" href={sheet.file} target="_blank" rel="noopener">{t.openFile}</a>
          <p className="travel-sheet-hint">{t.holdToSave}</p>
        </>}
        {sheet.kind === "calendar" && <>
          <button type="button" className="travel-sheet-primary" onClick={() => void saveFile(sheet.blob, `CarTime-${pass.reference}.ics`)}><Download size={18} />{t.saveFile}</button>
          <a className="travel-sheet-secondary" href={sheet.google} target="_blank" rel="noopener noreferrer">Google Calendar ↗</a>
        </>}
        {sheet.kind === "contact" && <>
          <p className="travel-sheet-hint">{whatsappUi[locale].choose}</p>
          <WhatsAppChoice text={`CarTime ${pass.reference}`} />
          {phones.map((item) => <a key={item.phone} className="travel-sheet-secondary" href={`tel:${item.phone}`} dir="ltr"><Phone size={18} />{item.display}</a>)}
        </>}
        {sheet.kind === "link" && <>
          <label className="travel-sheet-hint" htmlFor="travel-link">{t.copyManual}</label>
          <input id="travel-link" className="travel-sheet-link" readOnly value={sheet.link} dir="ltr" onFocus={(event) => event.currentTarget.select()} />
          <a className="travel-sheet-secondary" href={`https://wa.me/?text=${encodeURIComponent(sheet.link)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />WhatsApp</a>
        </>}
      </div>
    </div>, document.body)}
  </main>;
}
