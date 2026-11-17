import { travelReference } from "@/lib/travel-access";
import { env } from "cloudflare:workers";
import { localeInfo, type Locale } from "@/lib/locales";
import { contact } from "@/lib/service-info";
import { siteOrigin as canonicalOrigin } from "@/lib/seo";

type NewBooking = {
  id: string; locale: Locale; carName: string; carYear: number; fromDate: string; fromTime: string; toDate: string; toTime: string;
  days: number; estimateUsd: number; customerName: string; phone: string; email: string; pickup: string; flight: string;
  contactChannel: string; payment: string; childSeat: string;
};

const hostingerApi = "https://api.mail.hostinger.com/api/v1";

async function sendBookingEmail(booking: NewBooking) {
  const token = env.CARTIME_HOSTINGER_MAIL_API_TOKEN;
  if (!token) return;

  try {
    const signal = AbortSignal.timeout(5000);
    const authorization = `Bearer ${token}`;
    const account = await fetch(`${hostingerApi}/me`, {
      headers: { Authorization: authorization }, signal, redirect: "manual",
    });
    if (!account.ok) {
      console.error("Hostinger mailbox lookup failed with status", account.status);
      return;
    }
    const { data } = await account.json<{ data: { mailboxes: { address: string; resourceId: string }[] } }>();
    const sender = data.mailboxes.find(({ address }) => address.toLowerCase() === contact.email);
    if (!sender || !/^AC[A-Za-z0-9]+$/.test(sender.resourceId)) {
      console.error("Hostinger token does not expose the CarTime mailbox");
      return;
    }

    const reference = travelReference(booking.id);
    const response = await fetch(`${hostingerApi}/mailboxes/${sender.resourceId}/send`, {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      signal,
      redirect: "manual",
      body: JSON.stringify({
        to: [contact.email],
        displayName: "CarTime",
        subject: `CarTime · новая заявка ${reference}`,
        text: [
          `В админке сохранена новая заявка ${reference}.`,
          `Автомобиль: ${booking.carName} ${booking.carYear}`,
          `Аренда: ${booking.fromDate} ${booking.fromTime} → ${booking.toDate} ${booking.toTime} (${booking.days} дн., время Баку)`,
          `Предварительная стоимость: $${booking.estimateUsd}`,
          `Контакты клиента и полные детали заявки: ${canonicalOrigin}/admin`,
        ].join("\n"),
      }),
    });
    if (!response.ok) console.error("Hostinger email notification failed with status", response.status);
  } catch (error) {
    console.error("Hostinger email notification failed", error instanceof Error ? error.name : "unknown error");
  }
}

async function sendBookingTelegram(booking: NewBooking, siteOrigin: string) {
  const token = env.CARTIME_TELEGRAM_BOT_TOKEN;
  const chatId = env.CARTIME_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const text = [
    `CarTime: новая заявка ${travelReference(booking.id)}`,
    `${booking.carName} ${booking.carYear}`,
    `${booking.fromDate} ${booking.fromTime} → ${booking.toDate} ${booking.toTime} (${booking.days})`,
    `Получение: ${booking.pickup}`,
    `Сумма: $${booking.estimateUsd}`,
    `${booking.customerName}, ${booking.phone}, ${booking.email}`,
    `Связь: ${booking.contactChannel}, оплата: ${booking.payment}`,
    ...(booking.childSeat ? [`Детское кресло: ${booking.childSeat}`] : []),
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

/** Notify the manager after persistence. Each channel is optional. */
export async function notifyNewBooking(booking: NewBooking, siteOrigin: string) {
  await Promise.all([sendBookingEmail(booking), sendBookingTelegram(booking, siteOrigin)]);
}
