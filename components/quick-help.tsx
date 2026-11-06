"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, X, ArrowRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { faqItems, serviceUi, whatsappUi } from "@/lib/service-info";
import ContactLinks from "@/components/contact-links";
import WhatsAppChoice, { WhatsAppIcon } from "@/components/whatsapp-choice";

const quickIds = ["rates", "total", "payment", "mileage", "availability", "airport", "deposit"];

export default function QuickHelp({ locale }: { locale: Locale }) {
  const [panel, setPanel] = useState<"help" | "whatsapp" | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const ui = serviceUi[locale];
  const wa = whatsappUi[locale];
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setPanel(null); };
    const onPointer = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setPanel(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [panel]);
  const open = panel === "help";
  return <div className="quick-help" ref={root}>
    {panel === "whatsapp" && <div className="whatsapp-panel" role="dialog" aria-label={wa.open}>
      <div className="whatsapp-panel-head"><div><strong>{wa.open}</strong><p>{wa.choose}</p></div><button type="button" aria-label={ui.quickClose} onClick={() => setPanel(null)}><X size={19} /></button></div>
      <WhatsAppChoice />
    </div>}
    {open && <div className="quick-help-panel" role="dialog" aria-label={ui.quickTitle}>
      <div className="quick-help-head"><div><strong>{ui.quickTitle}</strong><p>{ui.quickLead}</p></div><button type="button" aria-label={ui.quickClose} onClick={() => setPanel(null)}><X size={19} /></button></div>
      <div className="quick-help-questions">{quickIds.map((id) => {
        const item = faqItems[locale].find((entry) => entry.id === id);
        return item && <details key={id}><summary>{item.question}<ChevronDown size={16} aria-hidden="true" /></summary><p>{item.answer}</p></details>;
      })}</div>
      <ContactLinks locale={locale} />
      <a href={`/${locale}/faq`}>{ui.quickButton}<ArrowRight size={16} /></a>
    </div>}
    <button className="whatsapp-trigger" type="button" aria-expanded={panel === "whatsapp"} aria-label={wa.open} onClick={() => setPanel(panel === "whatsapp" ? null : "whatsapp")}>{panel === "whatsapp" ? <X size={24} /> : <WhatsAppIcon size={28} />}<span>WhatsApp</span></button>
    <button className="quick-help-trigger" type="button" aria-expanded={open} aria-label={open ? ui.quickClose : ui.quickOpen} onClick={() => setPanel(open ? null : "help")}>{open ? <X size={22} /> : <HelpCircle size={24} />}<span>{ui.quickTitle}</span></button>
  </div>;
}
