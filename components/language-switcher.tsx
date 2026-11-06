"use client";

import { localeInfo, switcherOrder, type Locale } from "@/lib/locales";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function LanguageSwitcher({ locale, suffix = "", label }: {
  locale: Locale;
  suffix?: string;
  label: string;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) menuRef.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return <details ref={menuRef} className="language-switcher" onKeyDown={(event) => {
    if (event.key === "Escape" && menuRef.current) {
      menuRef.current.open = false;
      menuRef.current.querySelector("summary")?.focus();
    }
  }}>
    <summary aria-label={`${label}: ${localeInfo[locale].name}`}><span className="language-code" aria-hidden="true">{locale.toUpperCase()}</span><ChevronDown size={14} aria-hidden="true" /></summary>
    <div className="language-switcher-panel glass-panel" aria-label={label}>
      {switcherOrder.map((code) => <a
        key={code}
        href={`/${code}${suffix}`}
        lang={localeInfo[code].hreflang}
        dir={localeInfo[code].dir}
        aria-current={code === locale ? "page" : undefined}
        onClick={(event) => {
          if ((window.location.search || (suffix === "/travel-pass" && window.location.hash)) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            router.push(`/${code}${suffix}${window.location.search}${suffix === "/travel-pass" ? window.location.hash : ""}`);
          }
        }}
      ><span>{localeInfo[code].name}</span>{code === locale ? <Check size={15} aria-hidden="true" /> : <small>{code.toUpperCase()}</small>}</a>)}
    </div>
  </details>;
}
