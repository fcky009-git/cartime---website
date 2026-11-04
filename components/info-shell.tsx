import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { guideSlugs, guides, guideUi } from "@/lib/guides";

export default function InfoShell({ locale, current, children }: { locale: Locale; current?: string; children: ReactNode }) {
  const ui = guideUi[locale];
  const suffix = current ? `/${current}` : "";
  return <div className="site-shell info-shell">
    <header className="site-header">
      <div className="container info-header-inner">
        <a className="brand" href={`/${locale}`} aria-label="CarTime">
          <img className="dark-logo" src="/assets/logo-dark.png" alt="CarTime" />
          <img className="light-logo" src="/assets/logo-light.svg" alt="" aria-hidden="true" />
        </a>
        <nav className="info-header-nav" aria-label={ui.nav}>
          <a href={`/${locale}`}>{ui.back}</a>
          <a href={`/${locale}/fleet`}>{ui.carCta}</a>
          <a href={`/${locale}/guide/baku`}>{ui.nav}</a>
        </nav>
        <div className="info-language-links" aria-label="Language">
          {(["az", "en", "ru"] as Locale[]).map((code) =>
            <a key={code} href={`/${code}${suffix}`} lang={code} aria-current={code === locale ? "page" : undefined}>{code.toUpperCase()}</a>,
          )}
        </div>
      </div>
    </header>
    {children}
    <footer className="site-footer">
      <div className="container info-footer-inner">
        <div><img src="/assets/logo-dark.png" alt="CarTime" /><p>{ui.homeLead}</p></div>
        <nav aria-label={ui.next}>
          <a href={`/${locale}`}>{ui.back}</a>
          <a href={`/${locale}/fleet`}>{ui.allCars}</a>
          {guideSlugs.map((slug) => <a key={slug} href={`/${locale}/guide/${slug}`}>{guides[locale][slug].title}</a>)}
        </nav>
      </div>
    </footer>
  </div>;
}
