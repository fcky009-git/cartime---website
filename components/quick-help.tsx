"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X, ArrowRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { faqItems, serviceUi } from "@/lib/service-info";
import ContactLinks from "@/components/contact-links";

const quickIds = ["rates", "total", "availability", "airport", "deposit"];

export default function QuickHelp({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ui = serviceUi[locale];
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return <div className="quick-help">
    {open && <div className="quick-help-panel" role="dialog" aria-label={ui.quickTitle}>
      <div className="quick-help-head"><div><strong>{ui.quickTitle}</strong><p>{ui.quickLead}</p></div><button type="button" aria-label={ui.quickClose} onClick={() => setOpen(false)}><X size={19} /></button></div>
      <div className="quick-help-questions">{quickIds.map((id) => {
        const item = faqItems[locale].find((entry) => entry.id === id);
        return item && <details key={id}><summary>{item.question}<ChevronDown size={16} aria-hidden="true" /></summary><p>{item.answer}</p></details>;
      })}</div>
      <ContactLinks locale={locale} />
      <a href={`/${locale}/faq`}>{ui.quickButton}<ArrowRight size={16} /></a>
    </div>}
    <button className="quick-help-trigger" type="button" aria-expanded={open} aria-label={open ? ui.quickClose : ui.quickOpen} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <HelpCircle size={24} />}<span>{ui.quickTitle}</span></button>
  </div>;
}
