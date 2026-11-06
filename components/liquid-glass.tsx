"use client";

import { useEffect, useRef } from "react";

/**
 * Real edge refraction for glass surfaces.
 * Each surface gets a displacement map drawn for its exact size and corner radius, so the page behind
 * bends along the rim like a lens. Only Chromium can use an SVG filter as a backdrop; other browsers
 * keep the blur, tint and highlights from the stylesheet.
 */
const SELECTOR = ".glass-capsule, .glass-panel";
const EDGE = 14;
const SCALE = -38;

function displacementMap(width: number, height: number, radius: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="r" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="${EDGE / 2}"/></filter></defs><rect width="${width}" height="${height}" fill="#000"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#r)"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#g)" style="mix-blend-mode:screen"/><rect x="${EDGE}" y="${EDGE}" width="${Math.max(0, width - EDGE * 2)}" height="${Math.max(0, height - EDGE * 2)}" rx="${Math.max(0, radius - EDGE)}" fill="#808000" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function LiquidGlass() {
  const defs = useRef<SVGDefsElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    const chromium = Boolean(brands?.some(({ brand }) => brand === "Chromium"));
    const calm = window.matchMedia("(prefers-reduced-transparency: reduce), (pointer: coarse)").matches;
    if (!chromium || calm || !defs.current) return;
    const container = defs.current;
    const ns = "http://www.w3.org/2000/svg" as const;
    root.classList.add("liquid-refract");

    let count = 0;
    const known = new WeakMap<Element, SVGFilterElement>();
    const timers = new WeakMap<Element, number>();

    const draw = (element: HTMLElement) => {
      const { width, height } = element.getBoundingClientRect();
      if (width < 8 || height < 8) return;
      const w = Math.round(width), h = Math.round(height);
      const radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0, h / 2);
      let filter = known.get(element);
      if (!filter) {
        filter = document.createElementNS(ns, "filter");
        filter.id = `liquid-glass-${++count}`;
        filter.setAttribute("filterUnits", "userSpaceOnUse");
        filter.setAttribute("color-interpolation-filters", "sRGB");
        const image = document.createElementNS(ns, "feImage");
        image.setAttribute("result", "map");
        image.setAttribute("preserveAspectRatio", "none");
        const bend = document.createElementNS(ns, "feDisplacementMap");
        bend.setAttribute("in", "SourceGraphic");
        bend.setAttribute("in2", "map");
        bend.setAttribute("scale", String(SCALE));
        bend.setAttribute("xChannelSelector", "R");
        bend.setAttribute("yChannelSelector", "G");
        filter.appendChild(image);
        filter.appendChild(bend);
        container.appendChild(filter);
        known.set(element, filter);
        element.style.setProperty("--glass-bend", `url(#${filter.id})`);
      }
      for (const [name, value] of [["x", 0], ["y", 0], ["width", w], ["height", h]] as const) filter.setAttribute(name, String(value));
      const image = filter.firstElementChild as SVGFEImageElement;
      for (const [name, value] of [["x", 0], ["y", 0], ["width", w], ["height", h]] as const) image.setAttribute(name, String(value));
      image.setAttribute("href", displacementMap(w, h, radius));
    };

    // Resizing runs through a transition, so redraw only when it settles.
    const sizes = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        window.clearTimeout(timers.get(target));
        timers.set(target, window.setTimeout(() => draw(target as HTMLElement), 160));
      }
    });
    const track = () => document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
      if (known.has(element)) return;
      draw(element);
      sizes.observe(element);
    });
    track();
    // Panels and sheets appear later.
    const added = new MutationObserver(track);
    added.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });

    return () => {
      sizes.disconnect();
      added.disconnect();
      root.classList.remove("liquid-refract");
      container.replaceChildren();
    };
  }, []);

  return <svg className="liquid-glass-defs" aria-hidden="true" width="0" height="0" focusable="false"><defs ref={defs} /></svg>;
}
