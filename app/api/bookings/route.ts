import { bookingInput, validateBooking } from "@/lib/booking-request";
import { bookingRequests } from "@/db/schema";
import { getDb } from "@/db";

export const dynamic = "force-dynamic";

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
  const now = new Date().toISOString();
  const id = data.requestId;
  try {
    await getDb().insert(bookingRequests).values({
      id, createdAt: now, updatedAt: now, status: "new", locale: data.locale,
      carId: data.carId, carName: validated.car.name, carYear: validated.car.year,
      pickup: data.pickup, pickupAddress: data.pickup === "delivery" ? data.pickupAddress : null,
      dropoff: data.dropoff, returnAddress: data.dropoff === "delivery" ? data.returnAddress : null,
      fromDate: data.fromDate, fromTime: data.fromTime, toDate: data.toDate, toTime: data.toTime,
      days: validated.days, dailyRateUsd: validated.dailyRateUsd, estimateUsd: validated.estimateUsd,
      customerName: data.customerName, phone: data.phone, email: data.email.toLowerCase(),
      age: data.age, experience: data.experience, flight: data.flight || null,
      secondDriver: data.secondDriver, payment: data.payment, notes: data.notes || null,
    }).onConflictDoNothing({ target: bookingRequests.id });
  } catch (error) {
    console.error("Booking persistence failed", error);
    return Response.json({ error: "Could not save the request. Please try again." }, { status: 503 });
  }
  return Response.json({ id, status: "new" }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
