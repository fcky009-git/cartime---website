import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { desc } from "drizzle-orm";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { isBookingAdmin } from "@/lib/admin-auth";
import { bookingRequests } from "@/db/schema";
import { getDb } from "@/db";
import AdminBoard from "@/components/admin-board";
import { dictionaries, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "CarTime — заявки", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const user = await requireChatGPTUser(`/${language}/admin`);
  if (!isBookingAdmin(user)) return <main className="admin-denied"><h1>Доступ закрыт</h1><p>Панель заявок доступна только владельцу CarTime.</p><a href={`/${language}`}>На сайт →</a></main>;

  let items: (typeof bookingRequests.$inferSelect)[] = [];
  let loadError = false;
  try { items = await getDb().select().from(bookingRequests).orderBy(desc(bookingRequests.createdAt)).limit(250); }
  catch (error) { console.error("Admin bookings page failed", error); loadError = true; }
  return <AdminBoard locale={language} accountEmail={user.email} initialItems={items} loadError={loadError} />;
}
