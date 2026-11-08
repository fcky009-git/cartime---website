# SEO and multilingual handoff (written by Claude, 5 Nov 2026)

## Кратко по-русски

- Здесь описано, что Claude изменил, что принять без вопросов, что решает владелец и как запускать сайт на настоящем домене.
- Домен cartime.az ещё не куплен, сайт работает как превью. Поэтому все страницы сейчас отдаются с `noindex`. Индексация включается сама, когда при сборке задан `NEXT_PUBLIC_SITE_URL` с настоящим доменом. Эту защиту нельзя убирать.
- Языки теперь настраиваются в одном файле `lib/locales.ts`. Это подготовка к немецкому, китайскому, корейскому, французскому и арабскому. Порядок добавления языка ниже.
- Всё, что здесь названо «решает владелец», Codex не должен решать сам.

## What changed and where

Two branches on GitHub (`fcky009-git/cartime---website`), the second is stacked on the first. Merge them in this order, or apply the single combined patch that comes with this file.

| Branch | Commits |
|---|---|
| `fix/audit-quick-wins` | price display `$$28` → `$28`; `fleetCount` instead of the typed "55"; hreflang `x-default`; `<html lang>` set on the server; fonts via `<link>`; hero preload; theme hook lint fix; `AGENTS.md`; preview domain kept as the default URL |
| `seo/improvements-1` | `99ae307` optimized webp images and a 1200x630 social card; `7e0f680` SEO foundation (below); this document and the updated `AGENTS.md` |

`7e0f680` contains: central language config (`lib/locales.ts`), indexing guard, site-wide business JSON-LD, breadcrumbs on all inner pages, Open Graph and Twitter tags, 404 page, optional Tag Manager.

## Verdicts for Codex

**Accept, and never undo:**

- `lib/locales.ts` and everything that reads it (`localeParams()`, `locales`, `localeInfo`, `switcherOrder`). Do not type language lists by hand.
- The indexing guard in `lib/seo.ts` (`indexingEnabled`), the `robots` entry in `app/[locale]/layout.tsx` and `app/robots.ts`. It keeps the preview out of Google.
- `<html lang dir>` from the URL in `app/[locale]/layout.tsx`, and the two root layouts (`app/(root)` and `app/[locale]`).
- Business JSON-LD in the layout (`lib/structured-data.ts`). One entity for the whole site; do not add a second Organization or AutoRental on single pages.
- `x-default` hreflang, Open Graph and Twitter tags from `pageMetadata()`.
- `fleetCount`, the `$` price fix, the `useSyncExternalStore` theme hook (it removes the only lint error).
- webp images and `og-cartime.jpg`. Keep the JPG/PNG originals; the JPG is still used for the social card and the PNG logo for structured data.

**Accept, with a condition:**

- Tag Manager scaffold (`lib/analytics.ts`). It does nothing until `NEXT_PUBLIC_GTM_ID` is set. Do not set it and do not commit a real ID before the owner decides on a consent banner (see the launch checklist).
- `hoursAvailable` 24/7 inside `contactPoint`. The README records that the owner confirmed 24/7 support. If the owner changes that, update `lib/structured-data.ts`.
- `supportLanguages` in `lib/structured-data.ts` (az, en, ru) is the list of languages in which support answers. It is deliberately not derived from `locales`. Change it only when the owner confirms.

**Owner decides (Codex must not decide these):**

- The domain, and when to switch indexing on.
- Whether the About copy may mention 9fleet (the README says it must not; the copy does).
- Real car photos, real prices, deposit, insurance and delivery terms.
- Social profile URLs for `sameAs`, a WhatsApp number, privacy policy and terms text (legal review).
- Which language comes first and whether `x-default` stays on `/ru`.

**If a Codex change conflicts with this work:** keep Claude's version of the files in the "accept" list above, and port Codex's visual or content changes onto them. For `components/site.tsx` the theme hook must stay lint-clean; the rest of that file is Codex's to restyle freely.

## Launch checklist (on the day the domain is bought)

1. Point the domain at the deployment and pick one canonical host (apex or `www`), HTTPS only.
2. Set `NEXT_PUBLIC_SITE_URL=https://cartime.az` in the build environment of the deployment.
3. Verify on the live site: view-source of `/ru` has no `noindex`; `/robots.txt` contains `Sitemap: https://cartime.az/sitemap.xml`; `/sitemap.xml` lists only cartime.az URLs; each page's canonical points to itself; hreflang links are reciprocal.
   If the hosting does not pass the variable to the build, indexing stays off. Then change the defaults in `lib/seo.ts` (`siteOrigin` and `indexingEnabled`) and verify again. Do not leave the site on `noindex` after launch.
4. Google Search Console: add the domain property (DNS verification), submit the sitemap, watch the Pages report.
5. Google Business Profile for 221F Nizami Gəncəvi (needs the owner): category, 24/7 support details, photos, website, phone. Use the same name, address and phone as in `lib/service-info.ts`.
6. Analytics and ads (needs the owner): GA4 and a Tag Manager container; add a consent banner (Consent Mode v2) before enabling tracking for visitors from the EU/EEA; set `NEXT_PUBLIC_GTM_ID`; mark `click_phone`, `click_whatsapp` and the lead form as conversions; link GA4 and Google Ads. Google Ads needs the live site and a privacy policy page.
7. Run PageSpeed Insights on the live URL for the home page and `/fleet`.
8. `/` currently redirects temporarily (307) to `/ru`. Decide whether to keep it or add language detection.

## Adding a language (German, Chinese, Korean, French, Arabic)

Each language adds 18 pages (home, fleet, about, FAQ, contact, rental hub, 8 rental pages, 4 guides).

1. `lib/locales.ts`: add the code to `locales` and an entry in `localeInfo`. Suggested values: `de` (`de`, `de_DE`), `zh` (`zh-CN`, `zh_CN`), `ko` (`ko`, `ko_KR`), `fr` (`fr`, `fr_FR`), `ar` (`ar`, `ar_AR`, `dir: "rtl"`). Add it to `switcherOrder`.
2. Run `npx tsc --noEmit`. TypeScript lists every dictionary that has no entry for the new language (`lib/i18n.ts`, `lib/service-info.ts`, `lib/guides.ts`, `lib/rental-pages.ts`, `lib/fleet-ui.ts`). Fill all of them. Do not enable a language that is only partly translated: the pages would be thin or mixed-language and would hurt search results.
3. Translations: use machine drafts at most; every language needs review by a native speaker before it goes public. Keep rental terms identical in meaning across languages.
4. Fonts: Inter and Sora have no Chinese, Korean or Arabic glyphs. Load Noto Sans SC, Noto Sans KR or Noto Sans Arabic only on pages of that language (in `app/[locale]/layout.tsx`).
5. Arabic (RTL): the layout already sets `dir="rtl"`, but `app/globals.css` uses physical properties (`left`, `right`, `margin-left`, arrows). Convert to logical properties and check every page.
6. The header shows the languages as inline links. Eight languages will not fit; switch to a dropdown.
7. `x-default` stays on `defaultLocale` (`ru`) unless the owner decides otherwise. The sitemap and hreflang update automatically.
8. Audience note: for visitors inside mainland China and South Korea, check whether Baidu or Naver matter for the owner's audience before investing in those languages. Visitors already in Azerbaijan usually use Google.

## SEO notes and content plan

**Facts used.** FAQ rich results stopped appearing in Google Search on 7 May 2026 and Google removed the documentation on 15 June 2026 ([Google documentation page](https://developers.google.com/search/docs/appearance/structured-data/faqpage)). The FAQPage markup is kept because it is harmless, but do not expect rich results from it and do not spend more time on it.

**What search results look like (checked 5 Nov 2026).** For "rent a car Baku", "аренда авто Баку" and "Bakıda avtomobil icarəsi" the first results are global brands and aggregators (Avis, Europcar, Sixt, Expedia, Kayak, Skyscanner, VipCars) plus a few local rental sites and listicles. A new local site will not win the generic queries soon. The realistic target is specific queries where the owner has a real offer.

**No search volumes.** Claude had no keyword-volume tool. The table below is a set of hypotheses. Validate it with Google Keyword Planner (free inside a Google Ads account) and with Search Console after launch.

| Page | Example target queries (ru / az / en) | Status |
|---|---|---|
| Home | аренда авто Баку · Bakıda avtomobil icarəsi · car rental Baku | exists |
| `/rental/airport` | аренда авто аэропорт Баку · hava limanında avtomobil icarəsi · rent a car Baku airport | exists |
| `/rental/delivery` | аренда авто с доставкой в отель Баку · ünvana çatdırılma · car delivery to hotel Baku | exists |
| `/rental/long-term` | аренда авто Баку на месяц · aylıq avtomobil icarəsi · monthly car rental Baku | exists |
| `/rental/suv` | аренда внедорожника Баку · SUV icarəsi Bakı · SUV rental Baku | exists |
| `/rental/economy` | недорогая аренда авто Баку · ucuz avtomobil icarəsi · cheap car rental Baku | exists |
| `/rental/insurance`, `/rental/mileage` | залог аренда авто Баку · girov · car rental deposit Baku | exists (needs the owner's real deposit and insurance terms) |
| Regional guides (Gabala, Sheki, Lankaran, Guba) | маршруты из Баку на машине · road trip Baku to Sheki | to build, only from official sources (as the existing guides do) |
| Model pages (`/fleet/<model>`) | аренда Toyota Prado Баку · Prado rental Baku | to build after real photos and availability rules exist; add Car/Offer markup only then |
| Driving rules for tourists (licence, permit) | | to build only from verified legal sources; do not write from memory |

**Local signals.** Google Business Profile, real reviews only (never write or buy reviews), consistent name, address and phone everywhere, local directories and tourism sites for links, Instagram with the final site URL.

**9fleet.com and cartime.az share the same catalogue and prices.** Search engines may treat near-identical pages on two domains as duplicates. Write unique copy and use different photos for each site. Do not use cross-domain canonical tags between them unless the owner wants one of the sites to disappear from search.

## Technical backlog (not done yet)

- Lead capture: request form with a backend, WhatsApp button (the `click_whatsapp` event already fires for links containing `wa.me`).
- Real car photos, then model pages.
- Privacy policy and terms pages.
- Accessibility of the car detail modal (focus trap, return focus).
- Responsive images with `srcset` and explicit sizes; `<img>` lint warnings.
- Web app manifest and apple-touch-icon.
- `lastmod` in the sitemap once real content dates are tracked.
- Consent banner.

## What was and was not verified

Verified by Claude on local production builds: `tsc` clean, lint 0 errors, build passes; all 54 pages have one `h1` and JSON-LD; 53 of 54 titles are within 15–60 characters (the remaining one, `/az/guide/airport`, is 63); every page is `noindex` without `NEXT_PUBLIC_SITE_URL`; with the variable set there is no `noindex`, the sitemap and robots use the new origin, and a valid `NEXT_PUBLIC_GTM_ID` loads Tag Manager while a malformed one is ignored; `<html lang dir>` is correct for `/ru`, `/az`, `/en`; Open Graph and Twitter tags carry the 1200x630 image; unknown URLs return 404 with the new page; the new images are served.

Not verified: how the pages look in a browser, Lighthouse scores, whether the Sites/Codex hosting passes `NEXT_PUBLIC_*` variables to the build (check this on the first deploy, see the launch checklist), Search Console and Rich Results validation.

## Pre-launch audit, 8 November 2026

Checked on local production builds of all 176 sitemap pages (8 languages), with and without `NEXT_PUBLIC_SITE_URL=https://cartime.az`.

- Fixed: `app/(root)/layout.tsx` also imported `globals.css`, so the build put it in a separate stylesheet loaded after `app/redesign.css`. On the published site the old tokens (`--page`, `--surface`, `--ink`, `--muted`, `--border`) overrode the "Baku after dark" ones in every theme, and muted text failed WCAG contrast. Dev mode loaded them in the right order, which hid the bug. The redirect-only layout now imports no CSS; do not add it back.
- Fixed: five guide titles over 60 characters (de/fr/ru/az) and three descriptions over 165 characters (fr/de) were shortened; the broken French, Chinese, Korean and Arabic About descriptions were rewritten.
- Added: each guide has its own 1200x630 share image (`public/assets/og/guide-*.jpg`, made from the guide's hero photo) through the optional `image` argument of `pageMetadata()`.
- Added: `paymentAccepted` (cash, card) and `knowsLanguage` (support languages) in the `AutoRental` entity. Still no ratings, price range or `sameAs`.
- Fixed: the fleet tables had a "Choose a car" column with no cells. Each row now links to `/booking?car=<id>`, which opens the form with that car; the booking page's canonical stays `/booking`.
- Accessibility: horizontally scrolling tables and the About gallery are keyboard-focusable regions with a label; the hero search labels are lighter. axe-core (WCAG 2.1 A/AA) now reports no violations on the home page in all three themes, fleet, booking, FAQ, contact, a rental page, a guide and Arabic fleet. The About timeline is reported while its scroll animation has not run yet; it is readable on screen.
- Verified: one `h1`, a title, a description, a self-canonical and 9 reciprocal hreflang links (8 languages and `x-default`) on every page; no duplicate titles or descriptions; valid JSON-LD everywhere (`AutoRental` 176, `BreadcrumbList` 168, `WebSite` 8, `FAQPage` 8); every image has `alt`; 630 internal URLs and 63 assets return 200; with the domain set there is no `noindex`, robots lists the sitemap and blocks `/api/` and the admin, and the sitemap holds only `https://cartime.az` URLs.
- Left as is: Chinese, Korean and Arabic titles and descriptions look short by character count but are fine by width. The home page loads about 1 MB of photos as CSS backgrounds; lazy loading them needs a layout change and was not done before launch. Fonts come from Google Fonts; self-hosting them would remove a third-party request (and an EU privacy question) and can be done after launch.
- Not verified: the Google Maps frame on the contact page did not render in the test browser (the browser blocks third-party frames there); the site's headers do not restrict frames inside its pages. Check the map on a phone after publishing.
