import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { contact, contactLocation, serviceUi } from "@/lib/service-info";

export default function ContactLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  return <div className={`contact-links ${className}`}>
    <strong>{serviceUi[locale].contactTitle}</strong>
    <a href={`tel:${contact.phone}`}><Phone size={16} aria-hidden="true" />{contact.phoneDisplay}</a>
    <a href={`mailto:${contact.email}`}><Mail size={16} aria-hidden="true" />{contact.email}</a>
    <a href={contactLocation.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden="true" />{contactLocation.address}</a>
  </div>;
}
