# CarTime website

CarTime is a car rental project in Baku. The site is an owner-private preview in Russian, Azerbaijani and English. The public copy presents CarTime as its own project. The owner confirmed that its history began in 2012 and that its operating fleet has 122 vehicles; the online catalogue lists distinct model and year entries, with repeat vehicles grouped together.

## Current experience

- Responsive Hybrid, Dark and Light designs; the explicit choice is stored as `cartime-theme`.
- Searchable car catalogue, published USD daily rates by rental length, illustrations and model detail panels.
- Date, time, location and car selection with a preliminary estimate in the booking request flow. Requests are saved through `/api/bookings` to D1, and the owner-only `/[locale]/admin` panel shows them. Customers can also share a request by WhatsApp or email. Availability, deposit, delivery and final price are confirmed by a manager; there is no online payment or instant confirmed booking.
- Localized About, FAQ, contact, rental service and travel guide pages. Contact includes the owner-provided Google Maps location.
- One site-wide AutoRental entity, per-page breadcrumbs, localized canonical and hreflang links, Open Graph and Twitter cards, sitemap and robots handling.

## Preview and launch

The domain `cartime.az` is not live. Without `NEXT_PUBLIC_SITE_URL`, all pages carry `noindex, nofollow`; robots.txt does not advertise a sitemap. Keep this guard in place until the owner configures and verifies the real domain. Do not enable `NEXT_PUBLIC_GTM_ID` before the owner decides on analytics and consent.

Vehicle images and editorial scenes are illustrative. The published rates are a snapshot, not a real-time availability or final-price quote. Real vehicle photos, current rates, deposit and insurance details, social URLs, WhatsApp details and privacy/terms copy require owner confirmation before public launch. See `docs/claude-seo-handoff.md` for the SEO handoff and remaining decisions.

## Development

Use Node.js 22.13+ and run `npm run install:ci`, `npm run lint`, `npx tsc --noEmit` and `npm run build`. The Sites deployment has its own source repository; the GitHub repository is used for collaboration and must be synchronized deliberately.
