"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import type { SearchGroup, SearchItem } from "@/lib/search-index";
import { upgradeUi } from "@/lib/upgrade-ui";

const openEvent = "cartime-open-search";
const groupOrder: SearchGroup[] = ["pages", "cars", "rental", "guides", "faq"];
const normalize = (value: string) => value.replace(/[İı]/g, "i").toLowerCase();

export function SearchButton({ locale }: { locale: Locale }) {
  return <button type="button" className="site-search-button" aria-label={upgradeUi[locale].search.open} title={upgradeUi[locale].search.open} onClick={() => window.dispatchEvent(new Event(openEvent))}><Search size={18} /></button>;
}

export default function SiteSearch({ locale, items }: { locale: Locale; items: SearchItem[] }) {
  const t = upgradeUi[locale].search;
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const hidden = pathname?.endsWith("/admin") ?? false;

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const matches = words.length
      ? items.filter((item) => { const text = normalize(`${item.title} ${item.hint ?? ""}`); return words.every((word) => text.includes(word)); })
      : items.filter((item) => item.group === "pages");
    return [...matches].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group)).slice(0, 30);
  }, [items, query]);

  useEffect(() => {
    if (hidden) return;
    const open = () => {
      setQuery(""); setActive(0);
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); open(); }
    };
    window.addEventListener(openEvent, open);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener(openEvent, open); window.removeEventListener("keydown", onKey); };
  }, [hidden]);

  if (hidden) return null;

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.length) return;
      const next = (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      setActive(next);
      document.getElementById(`site-search-${next}`)?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter" && results[active]) { event.preventDefault(); window.location.assign(results[active].href); }
  }

  return <dialog ref={dialogRef} className="site-search" aria-label={t.open} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
    <div className="site-search-panel">
      <div className="site-search-field">
        <Search size={19} aria-hidden="true" />
        <input autoFocus type="search" role="combobox" aria-expanded="true" aria-controls="site-search-results" aria-activedescendant={results[active] ? `site-search-${active}` : undefined} aria-label={t.open} placeholder={t.placeholder} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKey} />
        <button type="button" aria-label={t.close} onClick={() => dialogRef.current?.close()}><X size={18} /></button>
      </div>
      <ul id="site-search-results" role="listbox" aria-label={t.open}>
        {results.map((item, index) => <li key={item.href} role="presentation">
          {(index === 0 || results[index - 1].group !== item.group) && <p className="site-search-group">{t[item.group]}</p>}
          <a id={`site-search-${index}`} role="option" aria-selected={index === active} className={index === active ? "active" : ""} href={item.href} onMouseEnter={() => setActive(index)}><span>{item.title}</span>{item.hint && <small>{item.hint}</small>}</a>
        </li>)}
      </ul>
      {!results.length && <p className="site-search-empty" role="status">{t.empty}</p>}
    </div>
  </dialog>;
}
