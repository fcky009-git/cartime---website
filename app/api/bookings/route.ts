import { and, count, eq, gte, ne, or } from "drizzle-orm";
import { bookingInput, validateBooking } from "@/lib/booking-request";
import { bookingRequests, travelPasses } from "@/db/schema";
import { getDb } from "@/db";
import { notifyNewBooking } from "@/lib/booking-notify";
import { issueTravelPass, newAccessCode, newTravelPassRow } from "@/lib/travel-pass";

export const dynamic = "force-dynamic";

const HOUR_MS = 3_600_000;
const MAX_PER_CONTACT_PER_HOUR = 5;
const MAX_PER_IP_PER_HOUR = 20;
const tooMany = () => Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "3600" } });

// Best effort: each Worker instance keeps its own counts. The contact limit below is the durable one.
const recentByIp = new Map<string, number[]>();
function ipOverLimit(ip: string, now: number) {
  const recent = (recentByIp.get(ip) ?? []).filter((time) => now - time < HOUR_MS);
  if (recent.length >= MAX_PER_IP_PER_HOUR) return true;
  if (recentByIp.size > 5000) recentByIp.clear();
  recentByIp.set(ip, [...recent, now]);
  return false;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "JSON required" }, { status: 415 });

  let raw: unknown;
  try {
    const body = await request.text();
    if (body.length > 12_000) return Response.json({ error: "Request too large" }, { status: 413 });
    raw = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingInput.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Check the booking details" }, { status: 400 });
  const validated = validateBooking(parsed.data);
  if (!validated) return Response.json({ error: "Check the car, dates and driver details" }, { status: 400 });

  const data = parsed.data;
  const nowMs = Date.now();
  const ip = request.headers.get("cf-connecting-ip");
  if (ip && ipOverLimit(ip, nowMs)) return tooMany();

  const now = new Date(nowMs).toISOString();
  const id = data.requestId;
  const email = data.email.toLowerCase();
  let trip: { reference: string; accessCode: string } | null = null;
  try {
    const db = getDb();
    const [recent] = await db.select({ total: count() }).from(bookingRequests).where(and(
      gte(bookingRequests.createdAt, new Date(nowMs - HOUR_MS).toISOString()),
      or(eq(bookingRequests.phone, data.phone), eq(bookingRequests.email, email)),
      ne(bookingRequests.id, id),
    ));
    if (recent.total >= MAX_PER_CONTACT_PER_HOUR) return tooMany();
    const accessCode = data.accessCode || newAccessCode();
    // A retry of a saved request only returns its pass. It must not create one for an older request.
    const [existing] = await db.select({ id: bookingRequests.id }).from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
    if (existing) {
      trip = await issueTravelPass(id, accessCode, false);
      return Response.json({ id, status: "new", trip }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    // One batch: a request is never saved without its pass, and a retry never loses the manager's notification.
    const [inserted] = await db.batch([db.insert(bookingRequests).values({
      id, createdAt: now, updatedAt: now, status: "new", locale: data.locale,
      carId: data.carId, carName: validated.car.name, carYear: validated.car.year,
      pickup: data.pickup, pickupAddress: data.pickup === "delivery" ? data.pickupAddress : null,
      dropoff: data.dropoff, returnAddress: data.dropoff === "delivery" ? data.returnAddress : null,
      fromDate: data.fromDate, fromTime: data.fromTime, toDate: data.toDate, toTime: data.toTime,
      days: validated.days, dailyRateUsd: validated.dailyRateUsd, estimateUsd: validated.estimateUsd,
      customerName: data.customerName, phone: data.phone, email,
      age: data.age, experience: data.experience, flight: data.flight || null,
      secondDriver: data.secondDriver, payment: data.payment, notes: data.notes || null,
    }).onConflictDoNothing({ target: bookingRequests.id }).returning({ id: bookingRequests.id }),
    db.insert(travelPasses).values(await newTravelPassRow(id, accessCode)).onConflictDoNothing({ target: travelPasses.bookingId })]);
    trip = await issueTravelPass(id, accessCode, false);
    if (inserted.length) {
      await notifyNewBooking({
        id, locale: data.locale, carName: validated.car.name, carYear: validated.car.year, fromDate: data.fromDate, fromTime: data.fromTime, toDate: data.toDate, toTime: data.toTime,
        days: validated.days, estimateUsd: validated.estimateUsd, customerName: data.customerName, phone: data.phone, email, pickup: data.pickup === "delivery" ? `delivery: ${data.pickupAddress}` : data.pickup, flight: data.flight,
      }, new URL(request.url).origin);
    }
  } catch (error) {
    console.error("Booking persistence failed", error);
    return Response.json({ error: "Could not save the request. Please try again." }, { status: 503 });
  }
  return Response.json({ id, status: "new", trip }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
