import { env } from "cloudflare:workers";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function fingerprint(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const input = `${env.CARTIME_ADMIN_SESSION_SECRET}:${ip}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function adminLoginLimiter(request: Request) {
  if (!env.DB || !env.CARTIME_ADMIN_SESSION_SECRET) throw new Error("Admin login is not configured");
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_login_attempts (fingerprint TEXT PRIMARY KEY, attempts INTEGER NOT NULL, window_start INTEGER NOT NULL, locked_until INTEGER NOT NULL)").run();
  const key = await fingerprint(request);
  const now = Date.now();
  const row = await env.DB.prepare("SELECT attempts, window_start, locked_until FROM admin_login_attempts WHERE fingerprint = ?").bind(key).first<{ attempts: number; window_start: number; locked_until: number }>();
  return {
    blocked: Boolean(row && row.locked_until > now),
    async fail() {
      const attempts = row && now - row.window_start < WINDOW_MS ? row.attempts + 1 : 1;
      const windowStart = row && now - row.window_start < WINDOW_MS ? row.window_start : now;
      const lockedUntil = attempts >= MAX_ATTEMPTS ? now + WINDOW_MS : 0;
      await env.DB!.prepare("INSERT INTO admin_login_attempts (fingerprint, attempts, window_start, locked_until) VALUES (?, ?, ?, ?) ON CONFLICT(fingerprint) DO UPDATE SET attempts = excluded.attempts, window_start = excluded.window_start, locked_until = excluded.locked_until").bind(key, attempts, windowStart, lockedUntil).run();
    },
    async clear() { await env.DB!.prepare("DELETE FROM admin_login_attempts WHERE fingerprint = ?").bind(key).run(); },
  };
}
