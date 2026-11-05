import { adminCookie, currentBookingAdmin, revokeAdminSessions } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  const headers = { "Cache-Control": "no-store", "Set-Cookie": adminCookie("", 0) };
  try {
    // Only a signed-in admin may end sessions; anyone else just gets their cookie cleared.
    if (await currentBookingAdmin()) await revokeAdminSessions();
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error("Admin logout failed", error);
    return Response.json({ error: "Could not end the session" }, { status: 503, headers });
  }
}
