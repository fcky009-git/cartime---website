import { localeInfo, locales, type Locale } from "./locales";
import { contact, phones, contactLocation } from "./service-info";
import { ogImage, siteOrigin } from "./seo";

export const organizationId = `${siteOrigin}/#organization`;
export const websiteId = `${siteOrigin}/#website`;

// Languages in which customer support actually answers. Do NOT derive this from `locales`:
// a site language is not a support language. Update it only when the owner confirms.
const supportLanguages = ["az", "en", "ru"];

const everyDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * The business entity, rendered once for every page by app/[locale]/layout.tsx.
 * Only facts confirmed by the owner (see README) belong here: no ratings, no price range.
 * Add `sameAs` with the real Instagram/Facebook URLs when those profiles exist.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": organizationId,
    name: "CarTime",
    url: siteOrigin,
    logo: `${siteOrigin}/assets/logo-dark.png`,
    image: `${siteOrigin}${ogImage.url}`,
    telephone: contact.phone,
    email: contact.email,
    address: { "@type": "PostalAddress", streetAddress: "221F Nizami Gəncəvi", addressLocality: "Baku", postalCode: "1000", addressCountry: "AZ" },
    geo: { "@type": "GeoCoordinates", latitude: contactLocation.latitude, longitude: contactLocation.longitude },
    hasMap: contactLocation.mapsUrl,
    areaServed: [{ "@type": "City", name: "Baku" }, { "@type": "Country", name: "Azerbaijan" }],
    contactPoint: phones.map((item) => ({
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: item.phone,
      email: contact.email,
      availableLanguage: supportLanguages,
      hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: everyDay, opens: "00:00", closes: "23:59" },
    })),
  };
}

export function websiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: "CarTime",
    url: siteOrigin,
    inLanguage: locales.map((code) => localeInfo[code].hreflang),
    description,
    publisher: { "@id": organizationId },
  };
}

/** `trail` lists the pages below the home page, e.g. [{ name: "Fleet", path: "fleet" }]. */
export function breadcrumbJsonLd(locale: Locale, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "CarTime", path: "" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteOrigin}/${locale}${item.path ? `/${item.path}` : ""}`,
    })),
  };
}
