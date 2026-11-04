"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";

const labels = {
  ru: {
    all: "Разделы", cars: "Автомобили", fleet: "Каталог и тарифы", booking: "Заявка на аренду", map: "Адрес на карте",
    services: "Аренда и услуги", rental: "Все условия", conditions: "Правила аренды", airport: "Выдача в аэропорту", delivery: "Доставка по адресу", longTerm: "Долгосрочная аренда", insurance: "Страховка и залог", mileage: "Пробег без лимита", economy: "Эконом класс", suv: "Кроссоверы и SUV",
    travel: "Баку и маршруты", baku: "Что посмотреть в Баку", routes: "Маршруты по Азербайджану", airportGuide: "После прилёта в Баку", rentalGuide: "Как выбрать аренду",
    company: "Компания и помощь", about: "О CarTime", faq: "Вопросы и ответы", contact: "Контакты",
  },
  az: {
    all: "Bölmələr", cars: "Avtomobillər", fleet: "Kataloq və tariflər", booking: "İcarə sorğusu", map: "Xəritədə ünvan",
    services: "İcarə və xidmətlər", rental: "Bütün şərtlər", conditions: "İcarə qaydaları", airport: "Hava limanında təhvil", delivery: "Ünvana çatdırılma", longTerm: "Uzunmüddətli icarə", insurance: "Sığorta və depozit", mileage: "Limitsiz yürüş", economy: "Ekonom sinif", suv: "Krossover və SUV",
    travel: "Bakı və marşrutlar", baku: "Bakıda nə görməli", routes: "Azərbaycan marşrutları", airportGuide: "Bakıya gəliş", rentalGuide: "İcarəni necə seçməli",
    company: "Şirkət və kömək", about: "CarTime haqqında", faq: "Suallar və cavablar", contact: "Əlaqə",
  },
  en: {
    all: "Explore", cars: "Cars", fleet: "Fleet and rates", booking: "Rental request", map: "Find us on the map",
    services: "Rental services", rental: "All rental terms", conditions: "Rental conditions", airport: "Airport pickup", delivery: "Address delivery", longTerm: "Long rentals", insurance: "Insurance and deposit", mileage: "Unlimited mileage", economy: "Economy cars", suv: "Crossovers and SUVs",
    travel: "Baku and routes", baku: "Explore Baku", routes: "Azerbaijan road trips", airportGuide: "Arriving in Baku", rentalGuide: "Choosing a rental",
    company: "Company and help", about: "About CarTime", faq: "Questions and answers", contact: "Contact",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function SiteDirectory({ locale }: { locale: Locale }) {
  const l = labels[locale];
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) menuRef.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return <details ref={menuRef} className="site-directory" onKeyDown={(event) => {
    if (event.key === "Escape" && menuRef.current) {
      menuRef.current.open = false;
      menuRef.current.querySelector("summary")?.focus();
    }
  }}><summary>{l.all}<span aria-hidden="true">⌄</span></summary><div className="site-directory-panel">
    <div className="directory-group"><strong>{l.cars}</strong><a href={`/${locale}/fleet`}>{l.fleet}</a><a href={`/${locale}/booking`}>{l.booking}</a><a href={`/${locale}#map`}>{l.map}</a></div>
    <div className="directory-group"><strong>{l.services}</strong><a href={`/${locale}/rental`}>{l.rental}</a><a href={`/${locale}/rental/conditions`}>{l.conditions}</a><a href={`/${locale}/rental/airport`}>{l.airport}</a><a href={`/${locale}/rental/delivery`}>{l.delivery}</a><a href={`/${locale}/rental/long-term`}>{l.longTerm}</a><a href={`/${locale}/rental/insurance`}>{l.insurance}</a><a href={`/${locale}/rental/mileage`}>{l.mileage}</a><a href={`/${locale}/rental/economy`}>{l.economy}</a><a href={`/${locale}/rental/suv`}>{l.suv}</a></div>
    <div className="directory-group"><strong>{l.travel}</strong><a href={`/${locale}/guide/baku`}>{l.baku}</a><a href={`/${locale}/guide/routes`}>{l.routes}</a><a href={`/${locale}/guide/airport`}>{l.airportGuide}</a><a href={`/${locale}/guide/rental`}>{l.rentalGuide}</a></div>
    <div className="directory-group"><strong>{l.company}</strong><a href={`/${locale}/about`}>{l.about}</a><a href={`/${locale}/faq`}>{l.faq}</a><a href={`/${locale}/contact`}>{l.contact}</a></div>
  </div></details>;
}
