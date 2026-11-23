import { guideSlugs } from "./guides";
import { rentalSlugs } from "./rental-pages";

export const publicPaths = [
  "", "fleet", "booking", "about", "faq", "contact", "rental",
  ...rentalSlugs.map((slug) => `rental/${slug}`),
  ...guideSlugs.map((slug) => `guide/${slug}`),
];
