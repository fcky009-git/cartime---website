"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Copy, Download, LockKeyhole, MapPin, MessageCircle, RefreshCw, ShieldCheck, Sparkles, Ticket, Wallet, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { localeInfo } from "@/lib/locales";
import { travelUi } from "@/lib/travel-ui";
import type { PublicTravelPass } from "@/lib/travel-pass";
import { formattedCode, normalizeAccessCode, travelLink, tripCalendar } from "@/lib/travel-access";
import { dayCountLabel } from "@/lib/count-labels";
import fleetImages from "@/lib/fleet-images.json";
import { contact, contactLocation } from "@/lib/service-info";

const REFRESH_MS = 90_000;
const stages = ["new", "contacted", "confirmed", "active", "completed"] as const;

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function TravelPass({ locale }: { locale: Locale }) {
  const t = travelUi[locale];
  const [reference, setReference] = useState("");
  const [code, setCode] = useState("");
  const [pass, setPass] = useState<PublicTravelPass | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [qr, setQr] = useState("");
  const pending = useRef(false);
  const lastChecked = useRef(0);
  const loadController = useRef<AbortController | null>(null);

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

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const date = (value: string) => new Intl.DateTimeFormat(localeInfo[locale].hreflang, { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Baku" }).format(new Date(`${value}T12:00:00+04:00`));
  const stamp = (value: string) => new Intl.DateTimeFormat(localeInfo[locale].hreflang, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Baku" }).format(new Date(value));
  const placeName = (value: string) => value === "airport" ? t.airport : value === "delivery" ? t.delivery : t.office;
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
    window.history.replaceState(null, "", `/${locale}/travel-pass`);
  };
  const copy = async () => {
    if (!pass) return;
    try {
      await navigator.clipboard.writeText(window.location.origin + travelLink(locale, { reference: pass.reference, accessCode: code }));
      setNotice(t.copied);
    } catch { setError(t.unavailable); }
  };
  const calendar = () => {
    if (!pass) return;
    const location = pass.pickup === "delivery" && pass.pickupAddress ? `${t.delivery}: ${pass.pickupAddress}` : placeName(pass.pickup);
    download(new Blob([tripCalendar({ ...pass, summary: `CarTime · ${pass.carName} · ${t[pass.status as "new"] || pass.status}`, location, description: `${pass.reference}. ${t.estimateHint}` })], { type: "text/calendar;charset=utf-8" }), `${pass.reference}.ics`);
  };
  const wallet = async () => {
    if (!pass) return;
    setBusy(true);
    try {
      const response = await fetch("/api/travel-pass", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: pass.reference, accessCode: code, wallet: true }) });
      if (!response.ok) throw new Error("wallet failed");
      download(await response.blob(), `${pass.reference}.pkpass`);
    } catch { setError(t.unavailable); }
    finally { setBusy(false); }
  };

  const stage = pass ? (pass.status === "cancelled" ? "cancelled" : pass.status === "confirmed" && pass.stage !== "booking" ? pass.stage : pass.status) : "new";
  const next = stage === "cancelled" ? t.nextCancelled : stage === "completed" ? t.nextCompleted : stage === "active" ? t.nextActive : stage === "confirmed" ? t.nextConfirmed : stage === "contacted" ? t.nextReview : t.nextNew;
  const stageIndex = stages.indexOf(stage as typeof stages[number]);
  const beforePickup = stage === "new" || stage === "contacted" || stage === "confirmed";
  const showInstructions = stage !== "cancelled" && stage !== "completed";
  const whatsapp = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;

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
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t.support} ↗</a>
        </section>
      </div> : <>
        <div className="travel-toolbar">
          <span><span className="travel-live" /> {t.updated}: {stamp(pass.updatedAt)}</span>
          <button onClick={() => void load(reference, code)} disabled={busy}><RefreshCw size={15} className={busy ? "travel-spin" : ""} />{t.refresh}</button>
          <button onClick={close}><X size={16} />{t.forget}</button>
        </div>
        {error && <p className="travel-error" role="alert">{error}</p>}
        {notice && <p className="travel-notice" role="status"><Check size={16} />{notice}</p>}
        <div className="travel-dashboard">
          <article className={`travel-ticket travel-state-${stage}`}>
            <div className="travel-ticket-top"><Image unoptimized src="/assets/logo-dark.png" alt="CarTime" width={160} height={45} /><span><LockKeyhole size={12} /> TRAVEL PASS</span></div>
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
              <button onClick={() => window.print()}><Download size={19} />{t.print}</button>
              <button onClick={() => void copy()}><Copy size={19} />{t.share}</button>
              <a href={`${whatsapp}?text=${encodeURIComponent(`CarTime ${pass.reference}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />{t.support}</a>
            </section>
          </aside>
        </div>
        <div className="travel-lower">
          {beforePickup && <section className="travel-panel"><h3><ShieldCheck size={20} />{t.checklist}</h3><ul><li>{t.documents}</li><li>{t.fuel}</li><li>{t.estimateHint}</li></ul></section>}
          <section className="travel-panel"><h3>{t.history}</h3><ol className="travel-history">{pass.history.slice(-12).reverse().map((event, index) => <li key={`${event.at}-${index}`}><span /><div><strong>{t[event.status as "new"] || event.status}</strong><time>{stamp(event.at)}</time></div></li>)}</ol></section>
        </div>
      </>}
    </div>
  </main>;
}
