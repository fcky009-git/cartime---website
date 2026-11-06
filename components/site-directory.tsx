"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Building2, CarFront, ChevronDown, Compass, ConciergeBell, FileText, Layers, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { travelUi } from "@/lib/travel-ui";

const labels = {
  ru: {
    all: "Разделы", cars: "Автомобили", fleet: "Каталог и тарифы", booking: "Заявка на аренду", map: "Адрес на карте",
    services: "Сервисы", terms: "Условия аренды", classes: "Классы авто", rental: "Все условия", conditions: "Правила аренды", airport: "Выдача в аэропорту", delivery: "Доставка по адресу", longTerm: "Долгосрочная аренда", insurance: "Страховка и залог", mileage: "Пробег без лимита", economy: "Эконом класс", suv: "Кроссоверы и SUV",
    travel: "Баку и маршруты", baku: "Что посмотреть в Баку", routes: "Маршруты по Азербайджану", absheron: "Апшерон и огни", gobustan: "Гобустан", sheki: "Шеки и северо-запад", airportGuide: "После прилёта в Баку", rentalGuide: "Как выбрать аренду",
    company: "Компания и помощь", about: "О CarTime", faq: "Вопросы и ответы", contact: "Контакты",
  },
  az: {
    all: "Bölmələr", cars: "Avtomobillər", fleet: "Kataloq və tariflər", booking: "İcarə sorğusu", map: "Xəritədə ünvan",
    services: "Xidmətlər", terms: "İcarə şərtləri", classes: "Avtomobil sinifləri", rental: "Bütün şərtlər", conditions: "İcarə qaydaları", airport: "Hava limanında təhvil", delivery: "Ünvana çatdırılma", longTerm: "Uzunmüddətli icarə", insurance: "Sığorta və depozit", mileage: "Limitsiz yürüş", economy: "Ekonom sinif", suv: "Krossover və SUV",
    travel: "Bakı və marşrutlar", baku: "Bakıda nə görməli", routes: "Azərbaycan marşrutları", absheron: "Abşeron və od", gobustan: "Qobustan", sheki: "Şəki və şimal-qərb", airportGuide: "Bakıya gəliş", rentalGuide: "İcarəni necə seçməli",
    company: "Şirkət və kömək", about: "CarTime haqqında", faq: "Suallar və cavablar", contact: "Əlaqə",
  },
  en: {
    all: "Explore", cars: "Cars", fleet: "Fleet and rates", booking: "Rental request", map: "Find us on the map",
    services: "Services", terms: "Rental terms", classes: "Car classes", rental: "All rental terms", conditions: "Rental conditions", airport: "Airport pickup", delivery: "Address delivery", longTerm: "Long rentals", insurance: "Insurance and deposit", mileage: "Unlimited mileage", economy: "Economy cars", suv: "Crossovers and SUVs",
    travel: "Baku and routes", baku: "Explore Baku", routes: "Azerbaijan road trips", absheron: "Absheron and fire", gobustan: "Gobustan", sheki: "Sheki and north-west", airportGuide: "Arriving in Baku", rentalGuide: "Choosing a rental",
    company: "Company and help", about: "About CarTime", faq: "Questions and answers", contact: "Contact",
  },
  de: {
    all: "Entdecken", cars: "Autos", fleet: "Flotte und Preise", booking: "Mietanfrage", map: "Finden Sie uns auf der Karte",
    services: "Dienstleistungen", terms: "Mietbedingungen", classes: "Fahrzeugklassen", rental: "Alle Mietbedingungen", conditions: "Mietbedingungen", airport: "Abholung vom Flughafen", delivery: "Adresszustellung", longTerm: "Lange Miete", insurance: "Versicherung und Kaution", mileage: "Unbegrenzte Kilometerzahl", economy: "Economy-Autos", suv: "Crossover und SUVs",
    travel: "Baku und Routen", baku: "Entdecken Sie Baku", routes: "Roadtrips durch Aserbaidschan", absheron: "Absheron und Feuer", gobustan: "Gobustan", sheki: "Scheki und Nordwesten", airportGuide: "Ankunft in Baku", rentalGuide: "Eine Miete auswählen",
    company: "Gesellschaft und Hilfe", about: "Über CarTime", faq: "Fragen und Antworten", contact: "Kontakt",
  },
  zh: {
    all: "探索", cars: "汽车", fleet: "机队和费率", booking: "租赁请求", map: "在地图上找到我们",
    services: "服务", terms: "租赁条款", classes: "汽车类", rental: "所有租赁条款", conditions: "租赁条件", airport: "机场接机", delivery: "送车上门", longTerm: "长租", insurance: "保险及押金", mileage: "无限里程", economy: "经济型轿车", suv: "跨界车和 SUV",
    travel: "巴库和航线", baku: "探索巴库", routes: "阿塞拜疆公路旅行", absheron: "阿布歇隆与火", gobustan: "戈布斯坦", sheki: "舍基和西北部", airportGuide: "抵达巴库", rentalGuide: "选择租赁",
    company: "陪伴与帮助", about: "关于 CarTime", faq: "问题与解答", contact: "联系方式",
  },
  ko: {
    all: "탐색", cars: "자동차", fleet: "함대 및 요금", booking: "대여요청", map: "지도에서 우리를 찾아보세요",
    services: "서비스", terms: "대여 조건", classes: "자동차 강습", rental: "모든 임대 조건", conditions: "대여 조건", airport: "공항 픽업", delivery: "주소 전달", longTerm: "장기 임대", insurance: "보험 및 보증금", mileage: "마일리지 무제한", economy: "경제형 자동차", suv: "크로스오버 및 SUV",
    travel: "바쿠 및 노선", baku: "바쿠 탐색", routes: "아제르바이잔 자동차 여행", absheron: "압셰론과 불", gobustan: "고부스탄", sheki: "셰키 및 북서쪽", airportGuide: "바쿠 도착", rentalGuide: "렌탈 선택",
    company: "회사 및 도움", about: "CarTime 소개", faq: "질문과 답변", contact: "연락처",
  },
  fr: {
    all: "Explorer", cars: "Voitures", fleet: "Flotte et tarifs", booking: "Demande de location", map: "Retrouvez-nous sur le plan",
    services: "Prestations", terms: "Conditions de location", classes: "Cours de voitures", rental: "Toutes les conditions de location", conditions: "Conditions de location", airport: "Prise en charge à l'aéroport", delivery: "Adresse de livraison", longTerm: "Locations longues", insurance: "Assurance et caution", mileage: "Kilométrage illimité", economy: "Voitures économiques", suv: "Crossovers et SUV",
    travel: "Bakou et itinéraires", baku: "Explorez Bakou", routes: "Road trips en Azerbaïdjan", absheron: "Absheron et le feu", gobustan: "Gobustan", sheki: "Sheki et nord-ouest", airportGuide: "Arrivée à Bakou", rentalGuide: "Choisir une location",
    company: "Entreprise et aide", about: "À propos de CarTime", faq: "Questions et réponses", contact: "Contact",
  },
  ar: {
    all: "اكتشف", cars: "سيارات", fleet: "الأسطول والأسعار", booking: "طلب الإيجار", map: "تابعونا على الخريطة",
    services: "الخدمات", terms: "شروط الإيجار", classes: "فئات السيارات", rental: "جميع شروط الإيجار", conditions: "شروط الإيجار", airport: "التوصيل من المطار", delivery: "تسليم العنوان", longTerm: "الإيجارات الطويلة", insurance: "التأمين ومبلغ التأمين", mileage: "أميال غير محدودة", economy: "سيارات اقتصادية", suv: "سيارات الكروس أوفر وسيارات الدفع الرباعي",
    travel: "باكو والطرق", baku: "اكتشف باكو", routes: "رحلات برية أذربيجان", absheron: "ابشرون ونار", gobustan: "قبوستان", sheki: "شكي والشمال الغربي", airportGuide: "الوصول إلى باكو", rentalGuide: "اختيار الإيجار",
    company: "صحبة ومساعدة", about: "نبذة عن CarTime", faq: "أسئلة وأجوبة", contact: "اتصل",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function SiteDirectory({ locale, inline = false }: { locale: Locale; inline?: boolean }) {
  const l = labels[locale];
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (inline) return;
    const closeOutside = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) menuRef.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [inline]);

  const close = () => { if (menuRef.current && !inline) menuRef.current.open = false; };
  const group = (Icon: LucideIcon, title: string, links: [string, string][]) => <div className="directory-group">
    <strong><Icon size={15} aria-hidden="true" />{title}</strong>
    {links.map(([path, label]) => <a key={path} href={`/${locale}${path}`} onClick={close}><span>{label}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}
  </div>;

  const panel = <div className={`site-directory-panel${inline ? "" : " glass-panel"}`}>
    <div className="directory-column">
      {group(CarFront, l.cars, [["/fleet", l.fleet], ["/travel-pass", travelUi[locale].lookup], ["#map", l.map]])}
      {group(Building2, l.company, [["/about", l.about], ["/faq", l.faq], ["/contact", l.contact]])}
    </div>
    <div className="directory-column">
      {group(ConciergeBell, l.services, [["/rental/airport", l.airport], ["/rental/delivery", l.delivery], ["/rental/long-term", l.longTerm]])}
      {group(Layers, l.classes, [["/rental/economy", l.economy], ["/rental/suv", l.suv]])}
    </div>
    <div className="directory-column">
      {group(FileText, l.terms, [["/rental", l.rental], ["/rental/conditions", l.conditions], ["/rental/insurance", l.insurance], ["/rental/mileage", l.mileage]])}
      <a className="directory-tile" href={`/${locale}/booking`} onClick={close}><span>{l.booking}</span><ArrowRight size={20} aria-hidden="true" className="travel-flip" /></a>
    </div>
    <div className="directory-column">
      {group(Compass, l.travel, [["/guide/baku", l.baku], ["/guide/routes", l.routes], ["/guide/absheron", l.absheron], ["/guide/gobustan", l.gobustan], ["/guide/sheki", l.sheki], ["/guide/airport", l.airportGuide], ["/guide/rental", l.rentalGuide]])}
    </div>
  </div>;

  return <details ref={menuRef} className="site-directory" onKeyDown={(event) => {
    if (event.key === "Escape" && menuRef.current) {
      menuRef.current.open = false;
      menuRef.current.querySelector("summary")?.focus();
    }
  }}><summary>{l.all}<ChevronDown size={15} aria-hidden="true" /></summary>{panel}</details>;
}
