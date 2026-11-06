export type TravelCredentials = { reference: string; accessCode: string };

export const normalizeAccessCode = (value: string) => value.toUpperCase().replace(/[\s-]/g, "");
/** The one booking number shown to customers and managers. */
export const travelReference = (bookingId: string) => `CT-${bookingId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
export function makeAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (byte) => alphabet[byte & 31]).join("");
}
export function travelLink(locale: string, credentials: TravelCredentials) {
  return `/${locale}/travel-pass#${new URLSearchParams({ reference: credentials.reference, code: credentials.accessCode })}`;
}
export function formattedCode(code: string) {
  return code.match(/.{1,4}/g)?.join("-") || code;
}

// Baku has a fixed UTC+4 offset. UTC times need no VTIMEZONE block, which some calendar apps require for TZID.
const utcStamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const bakuToUtc = (date: string, time: string) => utcStamp(new Date(`${date}T${time}:00+04:00`));
const icsText = (value: string) => value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
/** RFC 5545: lines are at most 75 bytes, continued on the next line after a space. */
function foldLine(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (size + length > 74) { parts.push(current); current = " "; size = 1; }
    current += char;
    size += length;
  }
  parts.push(current);
  return parts.join("\r\n");
}

export function tripCalendar(trip: { reference: string; status: string; summary: string; location: string; description: string; fromDate: string; fromTime: string; toDate: string; toTime: string }) {
  const status = trip.status === "cancelled" ? "CANCELLED" : trip.status === "confirmed" ? "CONFIRMED" : "TENTATIVE";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CarTime//Travel Pass//EN", "BEGIN:VEVENT",
    `UID:${trip.reference}@cartime.az`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${bakuToUtc(trip.fromDate, trip.fromTime)}`,
    `DTEND:${bakuToUtc(trip.toDate, trip.toTime)}`,
    `SUMMARY:${icsText(trip.summary)}`,
    `LOCATION:${icsText(trip.location)}`,
    `DESCRIPTION:${icsText(trip.description)}`,
    `STATUS:${status}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].map(foldLine).join("\r\n");
}

/** Opens in any browser, so it is the fallback when a phone will not take a calendar file. */
export function googleCalendarLink(trip: { summary: string; location: string; description: string; fromDate: string; fromTime: string; toDate: string; toTime: string }) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: trip.summary,
    dates: `${bakuToUtc(trip.fromDate, trip.fromTime)}/${bakuToUtc(trip.toDate, trip.toTime)}`,
    location: trip.location,
    details: trip.description,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
