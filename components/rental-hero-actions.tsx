import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-choice";
import { bookingUi } from "@/lib/booking";
import type { Locale } from "@/lib/locales";
import type { RentalSlug } from "@/lib/rental-pages";
import { contact, whatsappLink, whatsappUi } from "@/lib/service-info";
import "@/app/rental-hero-actions.css";

const callLabel: Record<Locale, string> = {
  en: "Call CarTime", ru: "Позвонить", az: "Zəng edin", de: "CarTime anrufen",
  zh: "致电 CarTime", ko: "CarTime에 전화", fr: "Appeler CarTime", ar: "اتصل بنا",
};

export default function RentalHeroActions({ locale, topic }: { locale: Locale; topic: RentalSlug }) {
  const pickup = topic === "airport" || topic === "delivery" ? `?pickup=${topic}` : "";
  const dropoff = topic === "airport" ? "&dropoff=airport" : "";
  return <div className="rental-hero-actions">
    <a className="rental-hero-book" href={`/${locale}/booking${pickup}${dropoff}`}>{bookingUi[locale].nav}</a>
    <a href={whatsappLink(contact.phone)} target="_blank" rel="noopener noreferrer" aria-label={whatsappUi[locale].open}>
      <WhatsAppIcon size={18} />WhatsApp
    </a>
    <a href={`tel:${contact.phone}`}><Phone size={17} aria-hidden="true" />{callLabel[locale]}</a>
  </div>;
}
