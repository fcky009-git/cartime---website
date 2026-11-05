import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { bookingRequests } from "@/db/schema";
import { getDb } from "@/db";
import { currentBookingAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
const statusUpdate = z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "confirmed", "cancelled"]) });

export async function GET() {
  if (!await currentBookingAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  try {
    const items = await getDb().select().from(bookingRequests).orderBy(desc(bookingRequests.createdAt)).limit(250);
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
    await getDb().update(bookingRequests).set({ status: parsed.data.status, updatedAt }).where(eq(bookingRequests.id, parsed.data.id));
    return Response.json({ id: parsed.data.id, status: parsed.data.status, updatedAt }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin booking update failed", error);
    return Response.json({ error: "Could not update request" }, { status: 503 });
  }
}
