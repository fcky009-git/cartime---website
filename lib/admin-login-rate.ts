import { env } from "cloudflare:workers";
import { ensureAdminTables } from "@/lib/admin-auth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function fingerprint(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const input = `${env.CARTIME_ADMIN_SESSION_SECRET}:${ip}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Counts the attempt before the password is checked, in one atomic statement,
 * so simultaneous requests cannot all pass on the same reading of the counter.
 */
export async function adminLoginLimiter(request: Request) {
  if (!env.DB || !env.CARTIME_ADMIN_SESSION_SECRET) throw new Error("Admin login is not configured");
  await ensureAdminTables();
  const key = await fingerprint(request);
  const now = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO admin_login_attempts (fingerprint, attempts, window_start, locked_until) VALUES (?1, 1, ?2, 0)
     ON CONFLICT(fingerprint) DO UPDATE SET
       attempts = CASE WHEN ?2 - window_start >= ?3 THEN 1 ELSE attempts + 1 END,
       window_start = CASE WHEN ?2 - window_start >= ?3 THEN ?2 ELSE window_start END
     RETURNING attempts`,
  ).bind(key, now, WINDOW_MS).first<{ attempts: number }>();
  return {
    blocked: (row?.attempts ?? 1) > MAX_ATTEMPTS,
    async clear() {
      await env.DB!.prepare("DELETE FROM admin_login_attempts WHERE fingerprint = ?1 OR window_start < ?2").bind(key, now - 24 * 60 * 60 * 1000).run();
    },
  };
}
