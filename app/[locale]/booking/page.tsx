import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoShell from "@/components/info-shell";
import BookingForm from "@/components/booking-form";
import { bookingUi } from "@/lib/booking";
import { dictionaries, type Locale } from "@/lib/i18n";
import { guideUi } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return (["ru", "az", "en"] as Locale[]).map((locale) => ({ locale })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in dictionaries)) return {};
  const language = locale as Locale;
  return pageMetadata(language, "booking", bookingUi[language].title, bookingUi[language].lead);
}
export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  if (!(locale in dictionaries)) notFound();
  const language = locale as Locale;
  const ui = bookingUi[language];
  return <InfoShell locale={language} current="booking"><main>
    <header className="info-hero booking-hero"><div className="container info-hero-inner"><a className="info-back" href={`/${language}`}>← {guideUi[language].back}</a><p className="section-kicker">CARTIME / BOOKING REQUEST</p><h1>{ui.title}</h1><p>{ui.lead}</p></div></header>
    <BookingForm locale={language} />
  </main></InfoShell>;
}
