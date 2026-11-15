"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowRight, Menu, Moon, Sun, SunMoon, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { readTheme, saveTheme, subscribeToTheme, themeNames, type Theme } from "@/lib/theme-store";
import LanguageSwitcher from "@/components/language-switcher";
import LiquidGlass from "@/components/liquid-glass";
import SiteDirectory from "@/components/site-directory";
import { SearchButton } from "@/components/site-search";

const themeIcons = { hybrid: SunMoon, dark: Moon, light: Sun } as const;
const darkAreas = ".hero, .benefits-section, .airport-section, .home-guides, .home-about, .site-footer, .info-hero, .travel-page, .bf";

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lockedScrollRef = useRef<number | null>(null);
  const menuId = useId();

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  // The glass reads what is behind it: light surfaces get dark text, dark surfaces get white text.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let scheduled = false;
    const areas = [...document.querySelectorAll(darkAreas)];
    const update = () => {
      scheduled = false;
      const y = lockedScrollRef.current ?? window.scrollY;
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

  // iOS needs a fixed body as well as overflow:hidden to stop background rubber-banding.
  // Restore the exact position synchronously before a menu link follows its anchor.
  useLayoutEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const body = document.body;
    const x = window.scrollX, y = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, overflow: body.style.overflow };
    const rootOverflow = root.style.overflow;
    lockedScrollRef.current = y;
    root.style.overflow = "hidden";
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, left: `-${x}px`, width: "100%", overflow: "hidden" });
    return () => {
      Object.assign(body.style, previous);
      root.style.overflow = rootOverflow;
      window.scrollTo({ left: x, top: y, behavior: "instant" });
      lockedScrollRef.current = null;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };
    const desktop = window.matchMedia("(width > 1200px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
    };
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

  return <header ref={headerRef} className="glass-header" data-tone="dark" data-menu-open={menuOpen || undefined} onPointerMove={trackLight}>
    <LiquidGlass />
    {menuOpen && <div className="glass-menu-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
    <div className="glass-bar">
      <div className="glass-side glass-side-start">
        <button ref={menuButtonRef} className="glass-capsule glass-round glass-menu-button" type="button" aria-label={menuOpen ? closeLabel : menuLabel} aria-expanded={menuOpen} aria-controls={menuOpen ? menuId : undefined} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
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
    {menuOpen && <div id={menuId} className="glass-sheet glass-panel">
      <div className="glass-sheet-scroll">
        {cta && <a className="glass-sheet-cta" href={cta.href} onClick={() => setMenuOpen(false)}>{cta.label}<ArrowRight size={20} className="travel-flip" /></a>}
        <nav aria-label={navLabel}>{links.map((link) => <a key={link.href} className="glass-sheet-link" href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowRight size={18} className="travel-flip" /></a>)}</nav>
        <SiteDirectory locale={locale} inline onNavigate={() => setMenuOpen(false)} />
        <div className="glass-themes glass-themes-wide" role="group" aria-label={styleLabel}>
          {themeNames.map((name, index) => { const Icon = themeIcons[name]; return <button key={name} type="button" aria-pressed={theme === name} onClick={() => saveTheme(name)}><Icon size={16} aria-hidden="true" />{themeLabels[index]}</button>; })}
        </div>
      </div>
    </div>}
  </header>;
}
