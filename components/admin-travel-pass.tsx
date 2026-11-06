"use client";
import { useEffect, useState } from "react";
import { Copy, ExternalLink, MessageCircle, Ticket } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { travelUi } from "@/lib/travel-ui";
import { copyText } from "@/lib/device-actions";
import { formattedCode, travelLink, type TravelCredentials } from "@/lib/travel-access";

type Fields = { reference: string; message: string; pickupInstructions: string; confirmedTotalUsd: number | null; depositUsd: number | null; stage: string };

export default function AdminTravelPass({ locale, customerLocale, phone, bookingId, confirmed, onSaved }: {
  locale: Locale;
  /** The language of the customer's own request: what they receive opens in it. */
  customerLocale: Locale;
  phone: string;
  bookingId: string;
  confirmed: boolean;
  onSaved: () => void;
}) {
  const t = travelUi[locale];
  const [fields, setFields] = useState<Fields | null>(null);
  const [credentials, setCredentials] = useState<TravelCredentials | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [rotateConfirm, setRotateConfirm] = useState(false);
  const url = `/api/admin/bookings/${bookingId}/travel-pass`;

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      if (response.status === 401 || response.status === 403) { window.location.reload(); return; }
      if (!response.ok) throw new Error("travel pass failed");
      const data = await response.json() as { pass: Fields | null };
      setFields(data.pass);
      setLoaded(true);
    }).catch(() => { if (!controller.signal.aborted) setError(t.unavailable); });
    return () => controller.abort();
  }, [url, t.unavailable]);

  async function save(rotate = false) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rotate ? { rotate: true } : {
        message: fields?.message || "",
        pickupInstructions: fields?.pickupInstructions || "",
        confirmedTotalUsd: fields?.confirmedTotalUsd ?? null,
        depositUsd: fields?.depositUsd ?? null,
        stage: confirmed ? (fields?.stage || "booking") : "booking",
      }) });
      if (response.status === 401 || response.status === 403) { window.location.reload(); return; }
      if (!response.ok) throw new Error("travel pass save failed");
      const data = await response.json() as { credentials: TravelCredentials | null };
      if (data.credentials) {
        const issued = data.credentials;
        setCredentials(issued);
        setFields((current) => current || { reference: issued.reference, message: "", pickupInstructions: "", confirmedTotalUsd: null, depositUsd: null, stage: "booking" });
      }
      setNotice(t.saved);
      setRotateConfirm(false);
      onSaved();
    } catch { setError(t.unavailable); }
    finally { setBusy(false); }
  }

  const customerText = () => {
    if (!credentials) return "";
    const c = travelUi[customerLocale];
    return `${c.reference}: ${credentials.reference}\n${c.code}: ${formattedCode(credentials.accessCode)}\n${window.location.origin}${travelLink(customerLocale, credentials)}`;
  };
  const copy = async () => {
    if (await copyText(customerText())) setNotice(t.copied);
    else setError(t.unavailable);
  };

  return <section className="admin-travel-editor">
    <h3><Ticket size={20} />{t.adminTitle}</h3>
    {error && <p role="alert" className="admin-alert">{error}</p>}
    {notice && <p role="status" className="admin-notice">{notice}</p>}
    {fields && <form onSubmit={(event) => { event.preventDefault(); void save(); }}>
      <strong>{fields.reference}</strong>
      <label>{t.adminMessage}<textarea maxLength={2000} value={fields.message} onChange={(event) => setFields({ ...fields, message: event.target.value })} /></label>
      <label>{t.adminInstructions}<textarea maxLength={2000} value={fields.pickupInstructions} onChange={(event) => setFields({ ...fields, pickupInstructions: event.target.value })} /></label>
      <div className="admin-travel-fields">{(["confirmedTotalUsd", "depositUsd"] as const).map((key) => <label key={key}>{key === "depositUsd" ? t.adminDeposit : t.adminPrice}<input type="number" min={0} max={1000000} step={1} placeholder={t.pending} value={fields[key] ?? ""} onChange={(event) => setFields({ ...fields, [key]: event.target.value === "" ? null : Number(event.target.value) })} /></label>)}</div>
      <label>{t.adminStage}<select disabled={!confirmed} value={confirmed ? fields.stage : "booking"} onChange={(event) => setFields({ ...fields, stage: event.target.value })}><option value="booking">{t.booking}</option><option value="active">{t.active}</option><option value="completed">{t.completed}</option></select></label>
      <button disabled={busy} type="submit">{busy ? t.loading : t.saveChanges}</button>
    </form>}
    {loaded && <>
      <p>{t.rotateHint}</p>
      <button type="button" disabled={busy} onClick={() => { if (fields && !rotateConfirm) { setRotateConfirm(true); return; } void save(true); }}>{rotateConfirm ? `${t.rotate} ✓` : t.rotate}</button>
    </>}
    {credentials && <div className="admin-travel-credentials">
      <strong>{credentials.reference}</strong>
      <code>{formattedCode(credentials.accessCode)}</code>
      <button type="button" onClick={() => void copy()}><Copy size={15} />{t.share}</button>
      <a href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(customerText())}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} />WhatsApp</a>
      <a href={travelLink(customerLocale, credentials)} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />{t.openPass}</a>
    </div>}
  </section>;
}
