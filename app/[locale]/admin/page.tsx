import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { desc } from "drizzle-orm";
import { currentBookingAdmin } from "@/lib/admin-auth";
import { ADMIN_PAGE_SIZE } from "@/lib/admin-bookings";
import { bookingRequests } from "@/db/schema";
import { getDb } from "@/db";
import AdminBoard from "@/components/admin-board";
import AdminLogin from "@/components/admin-login";
import { dictionaries, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "CarTime Admin", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  if (!await currentBookingAdmin()) return <AdminLogin locale={language} />;

  let items: (typeof bookingRequests.$inferSelect)[] = [];
  let loadError = false;
  try { items = await getDb().select().from(bookingRequests).orderBy(desc(bookingRequests.createdAt)).limit(ADMIN_PAGE_SIZE); }
  catch (error) { console.error("Admin bookings page failed", error); loadError = true; }
  // A request-time timestamp keeps server and client date filters in sync during hydration.
  // eslint-disable-next-line react-hooks/purity
  const initialNow = Date.now();
  return <AdminBoard locale={language} initialItems={items} loadError={loadError} initialNow={initialNow} />;
}
