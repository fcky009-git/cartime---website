import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cartime_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

function fromBase64Url(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toBase64Url(value: Uint8Array) {
  return btoa(String.fromCharCode(...value)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function passwordConfig() {
  const [version, iterationsText, saltText, expectedText] = (env.CARTIME_ADMIN_PASSWORD_HASH ?? "").split(":");
  const iterations = Number(iterationsText);
  if (version !== "pbkdf2" || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000 || !saltText || !expectedText) return null;
  try {
    const salt = fromBase64Url(saltText);
    const expected = fromBase64Url(expectedText);
    return expected.length === 32 && salt.length >= 16 ? { iterations, salt, expected } : null;
  } catch { return null; }
}

/** False when the deployment lacks usable secrets, so the login reports that instead of "wrong password". */
export function adminLoginConfigured() {
  return Boolean(passwordConfig() && (env.CARTIME_ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

export type PasswordCheck = "ok" | "invalid" | "unavailable";

export async function verifyAdminPassword(username: string, password: string): Promise<PasswordCheck> {
  const config = passwordConfig();
  if (!config) return "unavailable";
  try {
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const result = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: config.salt, iterations: config.iterations, hash: "SHA-256" }, key, config.expected.length * 8));
    let difference = 0;
    for (let index = 0; index < config.expected.length; index++) difference |= config.expected[index] ^ result[index];
    return username === "admin" && difference === 0 ? "ok" : "invalid";
  } catch (error) {
    // For example, a runtime that rejects this hash's iteration count.
    console.error("Admin password check failed", error);
    return "unavailable";
  }
}

let adminTables: Promise<unknown> | null = null;

/** Safety net for a deployment whose migration has not run yet. Runs once per Worker instance. */
export function ensureAdminTables() {
  if (!env.DB) return Promise.reject(new Error("Cloudflare D1 binding `DB` is unavailable"));
  adminTables ??= env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_login_attempts (fingerprint TEXT PRIMARY KEY, attempts INTEGER NOT NULL, window_start INTEGER NOT NULL, locked_until INTEGER NOT NULL DEFAULT 0)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_session_state (id INTEGER PRIMARY KEY, not_before INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_booking_events (id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, type TEXT NOT NULL, value TEXT NOT NULL, created_at TEXT NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS admin_booking_events_booking_idx ON admin_booking_events (booking_id, created_at)"),
  ]).catch((error) => { adminTables = null; throw error; });
  return adminTables;
}

async function signingKey() {
  const secret = env.CARTIME_ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createAdminSession() {
  const key = await signingKey();
  if (!key) return null;
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = `admin:${expires}:${crypto.randomUUID()}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${toBase64Url(encoder.encode(payload))}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSession(token: string | undefined) {
  if (!token || token.length > 512) return false;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra) return false;
  const key = await signingKey();
  if (!key) return false;
  try {
    const payload = new TextDecoder().decode(fromBase64Url(body));
    const [role, expiresText, nonce] = payload.split(":");
    const expires = Number(expiresText);
    if (role !== "admin" || !nonce || !Number.isSafeInteger(expires) || expires <= Date.now() || expires > Date.now() + SESSION_SECONDS * 1000) return false;
    if (!await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), encoder.encode(payload))) return false;
    await ensureAdminTables();
    const state = await env.DB!.prepare("SELECT not_before FROM admin_session_state WHERE id = 1").first<{ not_before: number }>();
    const issued = expires - SESSION_SECONDS * 1000;
    return issued > (state?.not_before ?? 0);
  } catch (error) {
    console.error("Admin session check failed", error);
    return false;
  }
}

export async function currentBookingAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminSession(token);
}

/** Signing out ends every session issued so far, not only the one in this browser. */
export async function revokeAdminSessions() {
  await ensureAdminTables();
  await env.DB!.prepare("INSERT INTO admin_session_state (id, not_before) VALUES (1, ?1) ON CONFLICT(id) DO UPDATE SET not_before = excluded.not_before").bind(Date.now()).run();
}

export function adminCookie(token: string, maxAge = SESSION_SECONDS) {
  return `${ADMIN_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}
