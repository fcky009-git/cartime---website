import fleetImages from "@/lib/fleet-images.json";

const images = fleetImages as Record<string, string>;

/**
 * Responsive sources for a fleet photo. Each photo in public/assets/fleet/ (1000px wide) has a
 * 600px copy in public/assets/fleet/600/ with the same name; the browser picks one from `sizes`.
 * Regenerate the copies whenever a fleet photo is added or replaced.
 */
export function fleetPhoto(id: string, sizes: string) {
  const full = images[id];
  if (!full) return null;
  const small = full.replace("/assets/fleet/", "/assets/fleet/600/");
  return { src: small, srcSet: `${small} 600w, ${full} 1000w`, sizes };
}

/** Card widths measured on the home page: one column on phones, about 285–355px from 768px up. */
export const cardSizes = "(max-width: 767px) calc(100vw - 32px), 360px";
/** Small thumbnails (car finder, comparison) never need more than the 600px copy. */
export const thumbSizes = "160px";
