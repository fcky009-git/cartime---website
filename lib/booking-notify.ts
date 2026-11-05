import { env } from "cloudflare:workers";
import { localeInfo, type Locale } from "@/lib/locales";

type NewBooking = {
  id: string; locale: Locale; carName: string; carYear: number; fromDate: string; fromTime: string; toDate: string; toTime: string;
  days: number; estimateUsd: number; customerName: string; phone: string; email: string; pickup: string; flight: string;
};

/**
 * Optional Telegram message about a new request. Runs only when both secrets are set.
 * A delivery problem must never cost the customer their request, so errors are only logged.
 */
export async function notifyNewBooking(booking: NewBooking, siteOrigin: string) {
  const token = env.CARTIME_TELEGRAM_BOT_TOKEN;
  const chatId = env.CARTIME_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const text = [
    `CarTime: новая заявка #${booking.id.slice(0, 8).toUpperCase()}`,
    `${booking.carName} ${booking.carYear}`,
    `${booking.fromDate} ${booking.fromTime} → ${booking.toDate} ${booking.toTime} (${booking.days})`,
    `Получение: ${booking.pickup}`,
    `Сумма: $${booking.estimateUsd}`,
    `${booking.customerName}, ${booking.phone}, ${booking.email}`,
    `Язык: ${localeInfo[booking.locale].name}`,
    ...(booking.flight ? [`Рейс: ${booking.flight}`] : []),
    `${siteOrigin}/admin`,
  ].join("\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) console.error("Telegram notification failed with status", response.status);
  } catch (error) {
    console.error("Telegram notification failed", error instanceof Error ? error.name : "unknown error");
  }
}
