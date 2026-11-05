"use client";

import { useEffect, useState } from "react";
import { bakuStamp } from "@/lib/admin-bookings";
import { adminExtraUi } from "@/lib/admin-extra-ui";
import type { Locale } from "@/lib/locales";

type BookingEvent = { id: string; type: string; value: string; createdAt: string };

export default function AdminTimeline({ locale, bookingId, createdAt, changedAt, statusLabel, saving }: {
  locale: Locale; bookingId: string; createdAt: string; changedAt: string; statusLabel: (status: string) => string; saving: string;
}) {
  const t = adminExtraUi[locale];
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = `/api/admin/bookings/${bookingId}/events`;

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      if (response.status === 401 || response.status === 403) { window.location.reload(); return; }
      if (!response.ok) throw new Error("events failed");
      const data = await response.json() as { items: BookingEvent[] };
      setEvents(data.items);
      setFailed(false);
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [url, changedAt]);

  async function addNote(event: React.FormEvent) {
    event.preventDefault();
    if (!note.trim() || busy) return;
    setBusy(true); setFailed(false);
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
      if (response.status === 401 || response.status === 403) { window.location.reload(); return; }
      if (!response.ok) throw new Error("note failed");
      const data = await response.json() as { item: BookingEvent };
      setEvents((current) => [...current, data.item]);
      setNote("");
    } catch { setFailed(true); }
    finally { setBusy(false); }
  }

  return <div className="admin-timeline">
    <h3>{t.timeline}</h3>
    <ol>
      <li><time>{bakuStamp(new Date(createdAt))}</time><span>{t.createdEvent}</span></li>
      {events.map((item) => <li key={item.id} className={item.type === "note" ? "note" : ""}><time>{bakuStamp(new Date(item.createdAt))}</time><span>{item.type === "status" ? `${t.statusEvent}: ${statusLabel(item.value)}` : item.value}</span></li>)}
    </ol>
    {failed && <p className="admin-alert" role="alert">{t.timelineFail}</p>}
    <form onSubmit={addNote}>
      <textarea rows={2} maxLength={2000} value={note} aria-label={t.addNote} placeholder={t.notePlaceholder} onChange={(event) => setNote(event.target.value)} />
      <button type="submit" disabled={busy || !note.trim()}>{busy ? saving : t.addNote}</button>
    </form>
  </div>;
}
