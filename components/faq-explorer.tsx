"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { faqItems, serviceUi, type FaqGroup } from "@/lib/service-info";

export default function FaqExplorer({ locale }: { locale: Locale }) {
  const ui = serviceUi[locale];
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<FaqGroup | "all">("all");
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    return faqItems[locale].filter((item) =>
      (group === "all" || item.group === group) &&
      (!needle || `${item.question} ${item.answer}`.toLocaleLowerCase(locale).includes(needle)),
    ).sort((a, b) => groupsOrder.indexOf(a.group) - groupsOrder.indexOf(b.group));
  }, [group, locale, query]);
  const groups = Object.keys(ui.faqGroups) as FaqGroup[];

  return <div className="faq-explorer">
    <label className="faq-search"><Search size={20} aria-hidden="true" /><span className="sr-only">{ui.faqSearch}</span><input type="search" placeholder={ui.faqSearchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="faq-filters" role="group" aria-label={ui.faqSearch}>
      <button type="button" aria-pressed={group === "all"} onClick={() => setGroup("all")}>{ui.faqAll}</button>
      {groups.map((key) => <button key={key} type="button" aria-pressed={group === key} onClick={() => setGroup(key)}>{ui.faqGroups[key]}</button>)}
    </div>
    <p className="faq-result-count" role="status">{matches.length} {locale === "ru" ? russianAnswerCount(matches.length) : locale === "en" && matches.length === 1 ? "answer" : ui.faqCount}</p>
    {matches.length ? <div className="faq-full-list">{matches.map((item) => <details id={`q-${item.id}`} key={item.id}>
      <summary><span><small>{ui.faqGroups[item.group]}</small>{item.question}</span><ChevronDown size={20} aria-hidden="true" /></summary>
      <div className="faq-answer"><p>{item.answer}</p>{(topicLinks[item.id] || item.href) && <a href={`/${locale}${topicLinks[item.id] || item.href}`}>{ui.faqDetails}<ArrowRight size={15} /></a>}</div>
    </details>)}</div> : <p className="faq-empty">{ui.faqEmpty}</p>}
  </div>;
}

const groupsOrder: FaqGroup[] = ["prices", "fleet", "pickup", "terms"];
const topicLinks: Record<string, string> = {
  rates: "/rental/long-term", longer: "/rental/long-term", "one-day": "/rental/conditions",
  classes: "/rental/economy", airport: "/rental/airport", delivery: "/rental/delivery",
  mileage: "/rental/mileage", regions: "/rental/mileage", documents: "/rental/conditions",
  deposit: "/rental/insurance", payment: "/rental/conditions", fuel: "/rental/conditions",
  "extra-driver": "/rental/conditions", support: "/contact",
};

function russianAnswerCount(count: number) {
  if (count % 100 >= 11 && count % 100 <= 14) return "ответов";
  if (count % 10 === 1) return "ответ";
  if (count % 10 >= 2 && count % 10 <= 4) return "ответа";
  return "ответов";
}
