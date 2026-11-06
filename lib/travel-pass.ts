import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookingRequests, travelPasses } from "@/db/schema";
import { normalizeAccessCode, travelReference } from "@/lib/travel-access";

export const passHeaders = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };
export async function hashAccess(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalizeAccessCode(value)));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
}
export function newAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), b => alphabet[b & 31]).join("");
}
export function walletConfigured() {
  return Boolean(env.CARTIME_WALLET_PASS_TYPE_ID && env.CARTIME_WALLET_TEAM_ID && env.CARTIME_WALLET_CERT_PEM && env.CARTIME_WALLET_KEY_PEM && env.CARTIME_WALLET_WWDR_PEM);
}
/** The row for a new pass, so a booking and its pass can be saved in one batch. */
export async function newTravelPassRow(bookingId: string, code: string) {
  return { bookingId, reference: travelReference(bookingId), accessHash: await hashAccess(code), updatedAt: new Date().toISOString() };
}
export async function issueTravelPass(bookingId: string, code: string, create = true) {
  const accessHash = await hashAccess(code);
  const db = getDb();
  if (create) await db.insert(travelPasses).values(await newTravelPassRow(bookingId, code)).onConflictDoNothing({ target: travelPasses.bookingId });
  const [pass] = await db.select().from(travelPasses).where(eq(travelPasses.bookingId, bookingId));
  return pass?.accessHash === accessHash ? { reference: pass.reference, accessCode: normalizeAccessCode(code) } : null;
}
export async function travelAccessAllowed(request: Request) {
  const ip = request.headers.get("cf-connecting-ip");
  // Never use one shared "unknown" bucket for all visitors.
  if (!ip) return false;
  const fingerprint = await hashAccess(`${env.CARTIME_ADMIN_SESSION_SECRET}:${ip}`);
  const now = Date.now();
  // Old rows only need removing now and then; this runs on every automatic refresh.
  if (Math.random() < 0.02) await env.DB!.prepare("DELETE FROM travel_access_attempts WHERE window_start < ?1").bind(now-86400000).run();
  const row = await env.DB!.prepare(`INSERT INTO travel_access_attempts (fingerprint, attempts, window_start) VALUES (?1,1,?2)
    ON CONFLICT(fingerprint) DO UPDATE SET attempts = CASE WHEN ?2-window_start >= 900000 THEN 1 ELSE attempts+1 END,
    window_start = CASE WHEN ?2-window_start >= 900000 THEN ?2 ELSE window_start END RETURNING attempts`).bind(fingerprint,now).first<{attempts:number}>();
  return (row?.attempts ?? 61) <= 60;
}
export async function findTravelPass(reference: string, accessCode: string) {
  const [row] = await getDb().select({ pass: travelPasses, booking: bookingRequests }).from(travelPasses).innerJoin(bookingRequests, eq(bookingRequests.id, travelPasses.bookingId)).where(eq(travelPasses.reference, reference.toUpperCase().trim()));
  if (!row || await hashAccess(accessCode) !== row.pass.accessHash) return null;
  return row;
}
export type PublicTravelPass = {
  reference:string; status:string; stage:string; updatedAt:string; customerName:string;
  carId:string; carName:string; carYear:number; fromDate:string; fromTime:string; toDate:string; toTime:string; days:number;
  pickup:string; pickupAddress:string|null; dropoff:string; returnAddress:string|null;
  estimateUsd:number; confirmedTotalUsd:number|null; depositUsd:number|null; message:string; pickupInstructions:string;
  history:{status:string; at:string}[]; walletReady:boolean;
};
