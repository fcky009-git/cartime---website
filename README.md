# CarTime website

CarTime is a car rental project in Baku. The site is an owner-private preview in Russian, Azerbaijani, English, German, Simplified Chinese, Korean, French and Arabic. The five newest language versions are machine-translation drafts and need native-speaker review before a public launch. The public copy presents CarTime as its own project. The owner confirmed that its history began in 2012 and that its operating fleet has 122 vehicles; the online catalogue lists distinct model and year entries, with repeat vehicles grouped together.

## Current experience

- Responsive Hybrid, Dark and Light designs; the explicit choice is stored as `cartime-theme`.
- Searchable car catalogue, published USD daily rates by rental length, illustrations and model detail panels.
- Date, time, location and car selection with a preliminary estimate in the booking request flow. Requests are saved through `/api/bookings` to D1. The owner-only `/admin` route opens the localized admin workspace. It requires a username and password, and provides live request updates, status management, search, date filters, activity and upcoming pickup views, CSV export, calendar export, print, and contact shortcuts. Customers can also share a request by WhatsApp or email. Availability, deposit, delivery and final price are confirmed by a manager; there is no online payment or instant confirmed booking.
- Localized About, FAQ, contact, rental service and travel guide pages. Contact includes the owner-provided Google Maps location.
- One site-wide AutoRental entity, per-page breadcrumbs, localized canonical and hreflang links, Open Graph and Twitter cards, sitemap and robots handling.

## Preview and launch

The domain `cartime.az` is not live. Without `NEXT_PUBLIC_SITE_URL`, all pages carry `noindex, nofollow`; robots.txt does not advertise a sitemap. Keep this guard in place until the owner configures and verifies the real domain. Do not enable `NEXT_PUBLIC_GTM_ID` before the owner decides on analytics and consent.

Vehicle images and editorial scenes are illustrative. The published rates are a snapshot, not a real-time availability or final-price quote. Real vehicle photos, current rates, deposit and insurance details, social URLs, WhatsApp details and privacy/terms copy require owner confirmation before public launch. See `docs/claude-seo-handoff.md` for the SEO handoff and remaining decisions.

## Development

Travel Pass adds a private client trip page, booking lookup with an access code, status updates, QR, calendar and print/PDF. Managers control public instructions and agreed amounts separately from internal notes. Apple Wallet signing is prepared but not enabled without the owner's Apple signing identity. See `docs/travel-pass.md` for access security, migration and Wallet setup.

Use Node.js 22.13+ and run `npm run install:ci`, `npm run lint`, `npx tsc --noEmit` and `npm run build`. The Sites deployment has its own source repository; the GitHub repository is used for collaboration and must be synchronized deliberately.

The home page has a trip-based car finder, a price calculator in the car window and a comparison of up to three cars, kept in the browser and shareable by link. `Ctrl/⌘+K` searches cars, pages and questions in the current language. The site can be added to a phone's home screen through its web manifest; there is no service worker, so nothing is cached offline. In the admin panel each request shows the customer's language, a history of status changes, private notes and a warning when the same model has overlapping dates.

New requests can also be sent to Telegram: set the Sites runtime secrets `CARTIME_TELEGRAM_BOT_TOKEN` and `CARTIME_TELEGRAM_CHAT_ID`. Without them nothing is sent. A delivery problem never blocks a request.

Admin login uses the Sites runtime secrets `CARTIME_ADMIN_PASSWORD_HASH` and `CARTIME_ADMIN_SESSION_SECRET`. The password hash format is `pbkdf2:<iterations>:<base64url salt>:<base64url derived key>` (PBKDF2-SHA256, 32-byte key, use exactly 100,000 iterations: Cloudflare Workers may reject higher counts, and the login then reports that it is unavailable). Generate a fresh random session secret of at least 32 characters. Neither value belongs in Git or client code. Sessions expire after eight hours and signing out ends all of them; five failed login attempts from one IP block further attempts for 15 minutes. Keep the Site owner-private while it is a preview.
