import { adminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 });
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "Set-Cookie": adminCookie("", 0) } });
}
