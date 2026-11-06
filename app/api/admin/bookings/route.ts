import { desc, eq, lte } from "drizzle-orm";
import { z } from "zod";
import { adminBookingEvents, bookingRequests, travelPasses } from "@/db/schema";
import { getDb } from "@/db";
import { currentBookingAdmin } from "@/lib/admin-auth";
import { ADMIN_PAGE_SIZE } from "@/lib/admin-bookings";

export const dynamic = "force-dynamic";
const statusUpdate = z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "confirmed", "cancelled"]) });

export async function GET(request: Request) {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const before = new URL(request.url).searchParams.get("before");
  if (before && Number.isNaN(Date.parse(before))) return Response.json({ error: "Invalid date" }, { status: 400 });
  try {
    const items = await getDb().select().from(bookingRequests)
      .where(before ? lte(bookingRequests.createdAt, before) : undefined)
      .orderBy(desc(bookingRequests.createdAt)).limit(ADMIN_PAGE_SIZE);
    return Response.json({ items }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin booking read failed", error);
    return Response.json({ error: "Could not load requests" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = statusUpdate.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid status" }, { status: 400 });
  try {
    const updatedAt = new Date().toISOString();
    const updated = await getDb().update(bookingRequests).set({ status: parsed.data.status, updatedAt }).where(eq(bookingRequests.id, parsed.data.id)).returning({ id: bookingRequests.id });
    if (!updated.length) return Response.json({ error: "Request not found" }, { status: 404 });
    try {
      await getDb().insert(adminBookingEvents).values({ id: crypto.randomUUID(), bookingId: parsed.data.id, type: "status", value: parsed.data.status, createdAt: updatedAt });
    } catch (error) {
      // The status itself is saved, so a history problem must not fail the request.
      console.error("Admin status history failed", error);
    }
    return Response.json({ id: parsed.data.id, status: parsed.data.status, updatedAt }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin booking update failed", error);
    return Response.json({ error: "Could not update request" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!id.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  try {
    const db = getDb();
    const removed = await db.delete(bookingRequests).where(eq(bookingRequests.id, id.data)).returning({ id: bookingRequests.id });
    if (!removed.length) return Response.json({ error: "Request not found" }, { status: 404 });
    await db.delete(adminBookingEvents).where(eq(adminBookingEvents.bookingId, id.data));
    await db.delete(travelPasses).where(eq(travelPasses.bookingId, id.data));
    return Response.json({ id: id.data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin booking delete failed", error);
    return Response.json({ error: "Could not delete request" }, { status: 503 });
  }
}
