import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-choice";
import { bookingUi } from "@/lib/booking";
import { fleetUi } from "@/lib/fleet-ui";
import type { Locale } from "@/lib/locales";
import { rateTierIndex } from "@/lib/rental-duration";
import { rentalPages, type RentalSlug } from "@/lib/rental-pages";
import { contact, whatsappLink, whatsappUi } from "@/lib/service-info";
import fleet from "@/lib/fleet.json";
import "@/app/rental-hero-actions.css";

const priceLabel: Record<Locale, (usd: number) => string> = {
  en: (usd) => `From $${usd} per day`, ru: (usd) => `От $${usd} в сутки`, az: (usd) => `Gündə $${usd}-dən`,
  de: (usd) => `Ab $${usd} pro Tag`, zh: (usd) => `每天 $${usd} 起`, ko: (usd) => `하루 $${usd}부터`,
  fr: (usd) => `À partir de $${usd} par jour`, ar: (usd) => `ابتداءً من $${usd} في اليوم`,
};

const callLabel: Record<Locale, string> = {
  en: "Call CarTime", ru: "Позвонить", az: "Zəng edin", de: "CarTime anrufen",
  zh: "致电 CarTime", ko: "CarTime에 전화", fr: "Appeler CarTime", ar: "اتصل بنا",
};

export default function RentalHeroActions({ locale, topic }: { locale: Locale; topic: RentalSlug }) {
  const pickup = topic === "airport" || topic === "delivery" ? `?pickup=${topic}` : "";
  const dropoff = topic === "airport" ? "&dropoff=airport" : "";
  const category = rentalPages[locale][topic].fleetCategory;
  const cars = category ? fleet.filter((car) => car.category === category) : fleet;
  const tier = rateTierIndex(topic === "long-term" ? 32 : 2);
  const price = Math.min(...cars.map((car) => car.ratesUsd[tier]));

  return (
    <>
      {Number.isFinite(price) && (
        <p className="rental-hero-price">
          <bdi>{priceLabel[locale](price)}</bdi> · <bdi>{fleetUi[locale].durations[tier]}</bdi>
        </p>
      )}
      <div className="rental-hero-actions">
        <a className="rental-hero-book" href={`/${locale}/booking${pickup}${dropoff}`}>{bookingUi[locale].nav}</a>
        <a href={whatsappLink(contact.phone)} target="_blank" rel="noopener noreferrer" aria-label={whatsappUi[locale].open}>
          <WhatsAppIcon size={18} />WhatsApp
        </a>
        <a href={`tel:${contact.phone}`}><Phone size={17} aria-hidden="true" />{callLabel[locale]}</a>
      </div>
    </>
  );
}
