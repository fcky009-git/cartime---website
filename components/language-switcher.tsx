"use client";

import { localeInfo, switcherOrder, type Locale } from "@/lib/locales";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ locale, suffix = "", label }: {
  locale: Locale;
  suffix?: string;
  label: string;
}) {
  const router = useRouter();
  return <details className="language-switcher">
    <summary aria-label={label}><span className="language-mark" aria-hidden="true">◎</span><span className="language-name">{localeInfo[locale].name}</span><span className="language-code" aria-hidden="true">{locale.toUpperCase()}</span><span aria-hidden="true">⌄</span></summary>
    <div className="language-switcher-panel" aria-label={label}>
      {switcherOrder.map((code) => <a
        key={code}
        href={`/${code}${suffix}`}
        lang={localeInfo[code].hreflang}
        dir={localeInfo[code].dir}
        aria-current={code === locale ? "page" : undefined}
        onClick={(event) => {
          if (window.location.search && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            router.push(`/${code}${suffix}${window.location.search}`);
          }
        }}
      ><span>{localeInfo[code].name}</span><small>{code.toUpperCase()}</small></a>)}
    </div>
  </details>;
}
