const codes = ["USD", "EUR", "RUB", "KZT", "CNY", "AED"] as const;
const recentSnapshot = {
  date: "04.11.2026",
  aznPerUnit: { AZN: 1, USD: 1.7, EUR: 1.9097, RUB: 0.020796, KZT: 0.003759, CNY: 0.2543, AED: 0.4628 },
};

function bakuDateParts(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(date).map((part) => [part.type, part.value]));
  return { display: `${parts.day}.${parts.month}.${parts.year}`, iso: `${parts.year}-${parts.month}-${parts.day}` };
}

function readRates(xml: string) {
  const date = xml.match(/<ValCurs\s+Date="([\d.]+)"/)?.[1];
  if (!date) return null;
  const aznPerUnit: Record<string, number> = { AZN: 1 };
  for (const code of codes) {
    const block = xml.match(new RegExp(`<Valute\\s+Code="${code}"[^>]*>([\\s\\S]*?)<\\/Valute>`))?.[1];
    const nominal = Number(block?.match(/<Nominal>\s*([\d.,]+)\s*<\/Nominal>/)?.[1]?.replace(",", "."));
    const value = Number(block?.match(/<Value>\s*([\d.,]+)\s*<\/Value>/)?.[1]?.replace(",", "."));
    if (!nominal || !value) return null;
    aznPerUnit[code] = value / nominal;
  }
  return { date, aznPerUnit };
}

export async function GET() {
  const now = new Date();
  const deadline = Date.now() + 7000;
  for (let offset = 0; offset < 8; offset++) {
    const day = new Date(now.getTime() - offset * 86_400_000);
    const { display } = bakuDateParts(day);
    try {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      const response = await fetch(`https://cbar.az/currencies/${display}.xml`, { signal: AbortSignal.timeout(Math.min(2000, remaining)) });
      if (!response.ok) continue;
      const rates = readRates(await response.text());
      if (rates) return Response.json({ ...rates, source: "https://www.cbar.az/currency/rates", fallback: false }, { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } });
    } catch { /* Try the previous published day. */ }
  }
  const snapshotDay = Date.parse("2026-11-04T00:00:00Z");
  if (now.getTime() - snapshotDay < 7 * 86_400_000) {
    return Response.json({ ...recentSnapshot, source: "https://www.cbar.az/currency/rates", fallback: true }, { headers: { "Cache-Control": "public, s-maxage=900" } });
  }
  return Response.json({ error: "Official exchange rates are temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
