import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { contact, contactLocation, phones, serviceUi, whatsappLink, whatsappUi } from "@/lib/service-info";
import { WhatsAppIcon } from "@/components/whatsapp-choice";

export default function ContactLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  return <div className={`contact-links ${className}`}>
    <strong>{serviceUi[locale].contactTitle}</strong>
    {phones.map((item) => <span className="contact-phone" key={item.phone}>
      <a href={`tel:${item.phone}`} dir="ltr"><Phone size={16} aria-hidden="true" />{item.display}</a>
      <a className="contact-whatsapp" href={whatsappLink(item.phone)} target="_blank" rel="noopener noreferrer" aria-label={`${whatsappUi[locale].open}: ${item.display}`}><WhatsAppIcon size={18} /></a>
    </span>)}
    <a href={`mailto:${contact.email}`}><Mail size={16} aria-hidden="true" />{contact.email}</a>
    <a href={contactLocation.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden="true" />{contactLocation.address}</a>
  </div>;
}
