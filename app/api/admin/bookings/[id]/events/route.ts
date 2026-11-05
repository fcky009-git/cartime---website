import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { adminBookingEvents, bookingRequests } from "@/db/schema";
import { getDb } from "@/db";
import { currentBookingAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const bookingId = z.string().uuid();
const noteInput = z.object({ note: z.string().trim().min(1).max(2000) });

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = bookingId.safeParse((await params).id);
  if (!id.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  try {
    const items = await getDb().select().from(adminBookingEvents).where(eq(adminBookingEvents.bookingId, id.data)).orderBy(asc(adminBookingEvents.createdAt));
    return Response.json({ items }, { headers: noStore });
  } catch (error) {
    console.error("Admin events read failed", error);
    return Response.json({ error: "Could not load history" }, { status: 503 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  const id = bookingId.safeParse((await params).id);
  if (!id.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = noteInput.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Invalid note" }, { status: 400 });
  try {
    const db = getDb();
    const [booking] = await db.select({ id: bookingRequests.id }).from(bookingRequests).where(eq(bookingRequests.id, id.data)).limit(1);
    if (!booking) return Response.json({ error: "Request not found" }, { status: 404 });
    const item = { id: crypto.randomUUID(), bookingId: id.data, type: "note", value: parsed.data.note, createdAt: new Date().toISOString() };
    await db.insert(adminBookingEvents).values(item);
    return Response.json({ item }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Admin note save failed", error);
    return Response.json({ error: "Could not save note" }, { status: 503 });
  }
}
