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

export async function verifyAdminPassword(username: string, password: string) {
  const config = env.CARTIME_ADMIN_PASSWORD_HASH;
  if (!config) return false;
  const [version, iterationsText, saltText, expectedText] = config.split(":");
  const iterations = Number(iterationsText);
  if (version !== "pbkdf2" || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000 || !saltText || !expectedText) return false;
  try {
    const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const expected = fromBase64Url(expectedText);
    if (expected.length !== 32 || fromBase64Url(saltText).length < 16) return false;
    const result = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromBase64Url(saltText), iterations, hash: "SHA-256" }, key, expected.length * 8));
    let difference = 0;
    for (let index = 0; index < expected.length; index++) difference |= expected[index] ^ result[index];
    return username === "admin" && difference === 0;
  } catch { return false; }
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
    return crypto.subtle.verify("HMAC", key, fromBase64Url(signature), encoder.encode(payload));
  } catch { return false; }
}

export async function currentBookingAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminSession(token);
}

export function adminCookie(token: string, maxAge = SESSION_SECONDS) {
  return `${ADMIN_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}
