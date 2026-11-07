import { env } from "cloudflare:workers";

/**
 * Counts one attempt for this visitor's IP address in D1 and reports whether it is still within the limit.
 * Shared by every Worker instance, unlike an in-memory counter. Uses the travel_access_attempts
 * table (migration 0003); `scope` keeps separate counters for different actions.
 * Throws when the database is unavailable, so each caller decides whether to fail open or closed.
 */
export async function withinIpLimit(ip: string, scope: string, windowMs: number, max: number) {
  if (!env.DB) throw new Error("Cloudflare D1 binding `DB` is unavailable");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${env.CARTIME_ADMIN_SESSION_SECRET}:${scope}:${ip}`));
  const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const now = Date.now();
  // Old rows only need removing now and then.
  if (Math.random() < 0.02) await env.DB.prepare("DELETE FROM travel_access_attempts WHERE window_start < ?1").bind(now - 86_400_000).run();
  const row = await env.DB.prepare(`INSERT INTO travel_access_attempts (fingerprint, attempts, window_start) VALUES (?1, 1, ?2)
    ON CONFLICT(fingerprint) DO UPDATE SET attempts = CASE WHEN ?2 - window_start >= ?3 THEN 1 ELSE attempts + 1 END,
    window_start = CASE WHEN ?2 - window_start >= ?3 THEN ?2 ELSE window_start END RETURNING attempts`).bind(fingerprint, now, windowMs).first<{ attempts: number }>();
  return (row?.attempts ?? max + 1) <= max;
}
