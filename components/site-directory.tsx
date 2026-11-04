import type { Locale } from "@/lib/i18n";
import { bookingUi } from "@/lib/booking";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import { rentalPages, rentalSlugs, rentalUi } from "@/lib/rental-pages";
import { serviceUi } from "@/lib/service-info";

const labels: Record<Locale, { all: string; start: string; travel: string; help: string; map: string }> = {
  ru: { all: "Все разделы", start: "Автомобили и заявка", travel: "Маршруты и советы", help: "Компания и помощь", map: "Карта на главной" },
  az: { all: "Bütün bölmələr", start: "Avtomobillər və sorğu", travel: "Marşrutlar və məsləhətlər", help: "Şirkət və kömək", map: "Əsas səhifədə xəritə" },
  en: { all: "All pages", start: "Cars and requests", travel: "Routes and tips", help: "Company and help", map: "Map on homepage" },
};

export default function SiteDirectory({ locale }: { locale: Locale }) {
  const l = labels[locale];
  return <details className="site-directory"><summary>{l.all}<span aria-hidden="true">⌄</span></summary><div className="site-directory-panel">
    <div><strong>{l.start}</strong><a href={`/${locale}/fleet`}>{guideUi[locale].fleetTitle}</a><a href={`/${locale}/booking`}>{bookingUi[locale].nav}</a><a href={`/${locale}#map`}>{l.map}</a></div>
    <div><strong>{rentalUi[locale].nav}</strong><a href={`/${locale}/rental`}>{rentalUi[locale].hubTitle}</a>{rentalSlugs.map((slug) => <a key={slug} href={`/${locale}/rental/${slug}`}>{rentalPages[locale][slug].title}</a>)}</div>
    <div><strong>{l.travel}</strong>{guideSlugs.map((slug) => <a key={slug} href={`/${locale}/guide/${slug}`}>{guides[locale][slug].title}</a>)}</div>
    <div><strong>{l.help}</strong><a href={`/${locale}/about`}>{serviceUi[locale].aboutNav}</a><a href={`/${locale}/faq`}>{serviceUi[locale].faqNav}</a><a href={`/${locale}/contact`}>{rentalUi[locale].contact}</a></div>
  </div></details>;
}
