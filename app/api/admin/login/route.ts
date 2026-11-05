import { adminCookie, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";
import { adminLoginLimiter } from "@/lib/admin-login-rate";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "JSON required" }, { status: 415, headers: noStore });
  let credentials: { username?: unknown; password?: unknown };
  try {
    const text = await request.text();
    if (text.length > 512) return Response.json({ error: "Invalid credentials" }, { status: 400, headers: noStore });
    credentials = JSON.parse(text);
  } catch { return Response.json({ error: "Invalid credentials" }, { status: 400, headers: noStore }); }
  if (typeof credentials.username !== "string" || typeof credentials.password !== "string" || credentials.username.length > 80 || credentials.password.length > 128) return Response.json({ error: "Invalid credentials" }, { status: 400, headers: noStore });

  try {
    const limiter = await adminLoginLimiter(request);
    if (limiter.blocked) return Response.json({ error: "Too many attempts" }, { status: 429, headers: { ...noStore, "Retry-After": "900" } });
    if (!await verifyAdminPassword(credentials.username, credentials.password)) {
      await limiter.fail();
      return Response.json({ error: "Invalid credentials" }, { status: 401, headers: noStore });
    }
    const token = await createAdminSession();
    if (!token) return Response.json({ error: "Admin login is unavailable" }, { status: 503, headers: noStore });
    await limiter.clear();
    return Response.json({ ok: true }, { headers: { ...noStore, "Set-Cookie": adminCookie(token) } });
  } catch (error) {
    console.error("Admin login failed", error);
    return Response.json({ error: "Admin login is unavailable" }, { status: 503, headers: noStore });
  }
}
