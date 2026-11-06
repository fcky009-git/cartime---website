"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowRight, Menu, Moon, Sun, SunMoon, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { readTheme, saveTheme, subscribeToTheme, themeNames, type Theme } from "@/lib/theme-store";
import LanguageSwitcher from "@/components/language-switcher";
import LiquidGlass from "@/components/liquid-glass";
import SiteDirectory from "@/components/site-directory";
import { SearchButton } from "@/components/site-search";

const themeIcons = { hybrid: SunMoon, dark: Moon, light: Sun } as const;
const darkAreas = ".hero, .benefits-section, .airport-section, .home-guides, .home-about, .site-footer, .info-hero, .travel-page";

/** The floating header: navigation on the left, the logo in the middle, tools on the right. */
export default function GlassHeader({ locale, logoHref, links, cta, suffix = "", navLabel, languageLabel, menuLabel, closeLabel, styleLabel, themeLabels }: {
  locale: Locale;
  logoHref: string;
  links: { href: string; label: string }[];
  cta?: { href: string; label: string };
  suffix?: string;
  navLabel: string;
  languageLabel: string;
  menuLabel: string;
  closeLabel: string;
  styleLabel: string;
  themeLabels: readonly string[];
}) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, (): Theme => "hybrid");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  // The glass reads what is behind it: light surfaces get dark text, dark surfaces get white text.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let scheduled = false;
    const areas = [...document.querySelectorAll(darkAreas)];
    const update = () => {
      scheduled = false;
      const y = window.scrollY;
      header.toggleAttribute("data-scrolled", y > 36);
      const extent = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      header.style.setProperty("--page-progress", String(Math.min(1, y / extent)));
      const mode = document.documentElement.dataset.theme;
      const probe = header.getBoundingClientRect().top + 30;
      const overDark = mode === "dark" || areas.some((area) => {
        if (mode === "light" && area.matches(".hero")) return false;
        const { top, bottom } = area.getBoundingClientRect();
        return top <= probe && bottom > probe;
      });
      header.dataset.tone = overDark ? "dark" : "light";
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // A highlight on the glass follows the pointer, as light would.
  const trackLight = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const surface = (event.target as Element).closest<HTMLElement>(".glass-capsule");
    if (!surface) return;
    const box = surface.getBoundingClientRect();
    surface.style.setProperty("--light-x", `${event.clientX - box.left}px`);
    surface.style.setProperty("--light-y", `${event.clientY - box.top}px`);
  }, []);

  // A droplet flows between navigation items.
  const moveDroplet = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
    const nav = navRef.current;
    const item = (event.target as Element).closest<HTMLElement>(".glass-nav > a, .glass-nav > .site-directory > summary");
    if (!nav || !item) return;
    const box = item.getBoundingClientRect(), base = nav.getBoundingClientRect();
    nav.style.setProperty("--drop-x", `${box.left - base.left}px`);
    nav.style.setProperty("--drop-w", `${box.width}px`);
    nav.dataset.drop = "on";
  }, []);
  const hideDroplet = useCallback(() => { if (navRef.current) navRef.current.dataset.drop = "off"; }, []);

  return <header ref={headerRef} className="glass-header" data-tone="dark" onPointerMove={trackLight}>
    <LiquidGlass />
    <div className="glass-bar">
      <div className="glass-side glass-side-start">
        <button className="glass-capsule glass-round glass-menu-button" type="button" aria-label={menuOpen ? closeLabel : menuLabel} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav ref={navRef} className="glass-capsule glass-nav" aria-label={navLabel} data-drop="off" onPointerOver={moveDroplet} onFocus={moveDroplet} onPointerLeave={hideDroplet} onBlur={hideDroplet}>
          <span className="glass-droplet" aria-hidden="true" />
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <SiteDirectory locale={locale} />
        </nav>
      </div>
      <a className="glass-capsule glass-logo" href={logoHref} aria-label="CarTime">
        <Image unoptimized width={894} height={242} className="glass-logo-dark" src="/assets/logo-dark.webp" alt="" priority />
        <Image unoptimized width={748} height={216} className="glass-logo-light" src="/assets/logo-light.svg" alt="" />
        <span className="glass-progress" aria-hidden="true" />
      </a>
      <div className="glass-side glass-side-end">
        <div className="glass-capsule glass-tools">
          <SearchButton locale={locale} />
          <LanguageSwitcher locale={locale} suffix={suffix} label={languageLabel} />
          <div className="glass-themes" role="group" aria-label={styleLabel}>
            {themeNames.map((name, index) => { const Icon = themeIcons[name]; return <button key={name} type="button" title={themeLabels[index]} aria-label={themeLabels[index]} aria-pressed={theme === name} onClick={() => saveTheme(name)}><Icon size={15} aria-hidden="true" /></button>; })}
          </div>
        </div>
        {cta && <a className="glass-cta" href={cta.href}>{cta.label}</a>}
      </div>
    </div>
    {menuOpen && <div className="glass-sheet glass-panel">
      {cta && <a className="glass-sheet-cta" href={cta.href} onClick={() => setMenuOpen(false)}>{cta.label}<ArrowRight size={20} className="travel-flip" /></a>}
      <nav aria-label={navLabel}>{links.map((link) => <a key={link.href} className="glass-sheet-link" href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowRight size={18} className="travel-flip" /></a>)}</nav>
      <SiteDirectory locale={locale} inline onNavigate={() => setMenuOpen(false)} />
      <div className="glass-themes glass-themes-wide" role="group" aria-label={styleLabel}>
        {themeNames.map((name, index) => { const Icon = themeIcons[name]; return <button key={name} type="button" aria-pressed={theme === name} onClick={() => saveTheme(name)}><Icon size={16} aria-hidden="true" />{themeLabels[index]}</button>; })}
      </div>
    </div>}
  </header>;
}
