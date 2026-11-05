import fleet from "@/lib/fleet.json";
import { bookingUi } from "@/lib/booking";
import { fleetUi } from "@/lib/fleet-ui";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import type { Locale } from "@/lib/locales";
import { rentalPages, rentalSlugs, rentalUi } from "@/lib/rental-pages";
import { faqItems, serviceUi } from "@/lib/service-info";
import { upgradeUi } from "@/lib/upgrade-ui";

export type SearchGroup = "pages" | "cars" | "rental" | "guides" | "faq";
export type SearchItem = { group: SearchGroup; title: string; hint?: string; href: string };

/** Built on the server for one language, so pages carry only titles and not the full copy. */
export function buildSearchIndex(locale: Locale): SearchItem[] {
  const base = `/${locale}`;
  const categories = fleetUi[locale].categories;
  return [
    { group: "pages", title: upgradeUi[locale].finder.title, href: `${base}#finder` },
    { group: "pages", title: guideUi[locale].allCars, href: `${base}/fleet` },
    { group: "pages", title: bookingUi[locale].title, href: `${base}/booking` },
    { group: "pages", title: rentalUi[locale].nav, href: `${base}/rental` },
    { group: "pages", title: serviceUi[locale].faqNav, href: `${base}/faq` },
    { group: "pages", title: serviceUi[locale].aboutNav, href: `${base}/about` },
    { group: "pages", title: rentalUi[locale].contact, href: `${base}/contact` },
    ...fleet.map((car): SearchItem => ({ group: "cars", title: car.name, hint: `${car.year} · ${categories[car.category]} · $${car.ratesUsd[0]}`, href: `${base}?car=${car.id}` })),
    ...rentalSlugs.map((slug): SearchItem => ({ group: "rental", title: rentalPages[locale][slug].title, href: `${base}/rental/${slug}` })),
    ...guideSlugs.map((slug): SearchItem => ({ group: "guides", title: guides[locale][slug].title, href: `${base}/guide/${slug}` })),
    ...faqItems[locale].map((item): SearchItem => ({ group: "faq", title: item.question, href: `${base}/faq#q-${item.id}` })),
  ];
}
