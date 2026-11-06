import { travelUi } from "@/lib/travel-ui";
import GlassHeader from "@/components/glass-header";
import { dictionaries } from "@/lib/i18n";
import type { ReactNode } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { guideSlugs, guides, guideUi } from "@/lib/guides";
import { serviceUi } from "@/lib/service-info";
import QuickHelp from "@/components/quick-help";
import ContactLinks from "@/components/contact-links";
import { rentalPages, rentalSlugs, rentalUi } from "@/lib/rental-pages";
import { bookingUi } from "@/lib/booking";

export default function InfoShell({ locale, current, children }: { locale: Locale; current?: string; children: ReactNode }) {
  const ui = guideUi[locale];
  const service = serviceUi[locale];
  const dictionary = dictionaries[locale];
  const suffix = current ? `/${current}` : "";
  return <div className={`site-shell info-shell${current === "booking" ? " info-booking-shell" : ""}`}>
    <GlassHeader
      locale={locale}
      logoHref={`/${locale}`}
      links={[{ href: `/${locale}`, label: ui.back }, { href: `/${locale}/fleet`, label: ui.carCta }]}
      cta={current === "booking" ? undefined : { href: `/${locale}/booking`, label: bookingUi[locale].nav }}
      suffix={suffix}
      navLabel={ui.nav}
      languageLabel={dictionary.languageLabel}
      menuLabel={dictionary.mobileMenu}
      closeLabel={dictionary.close}
      styleLabel={dictionary.themes.join(" / ")}
      themeLabels={dictionary.themes}
    />
    {children}
    <footer className="site-footer">
      <div className="container"><span className="footer-slogan" aria-hidden="true">Drive on <em>your time</em></span></div>
      <div className="container info-footer-inner">
        <div><Image unoptimized width={894} height={242} className="dark-logo" src="/assets/logo-dark.webp" alt="CarTime" /><Image unoptimized width={748} height={216} className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" /><span className="brand-caption" aria-hidden="true">CAR RENTAL</span><p>{ui.homeLead}</p><ContactLinks locale={locale} /></div>
        <nav aria-label={ui.next}>
          <a href={`/${locale}`}>{ui.back}</a>
          <a href={`/${locale}/fleet`}>{ui.allCars}</a>
          <a href={`/${locale}/booking`}>{bookingUi[locale].nav}</a>
          <a href={`/${locale}/travel-pass`}>{travelUi[locale].lookup}</a>
          <a href={`/${locale}/about`}>{service.aboutNav}</a>
          <a href={`/${locale}/faq`}>{service.faqNav}</a>
          <a href={`/${locale}/rental`}>{rentalUi[locale].nav}</a>
          <a href={`/${locale}/contact`}>{rentalUi[locale].contact}</a>
          {rentalSlugs.map((slug) => <a key={slug} href={`/${locale}/rental/${slug}`}>{rentalPages[locale][slug].title}</a>)}
          {guideSlugs.map((slug) => <a key={slug} href={`/${locale}/guide/${slug}`}>{guides[locale][slug].title}</a>)}
        </nav>
      </div>
    </footer>
    {current !== "faq" && <QuickHelp locale={locale} />}
  </div>;
}
