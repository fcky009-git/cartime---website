# CarTime website — first frontend version

This is the first frontend implementation of the supplied CarTime brand kit. The visual master and exact dark wordmark came from the handoff folder. The public interface does not mention the internal 9fleet project.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Localized routes: `/ru`, `/az`, `/en`
- Hybrid, Dark, Light themes; explicit choice is saved in `localStorage` under `cartime-theme`

## What works

- Responsive homepage, navigation, theme and language controls
- Date and pickup/return form with client-side validation and clear demo feedback
- Searchable 55-vehicle catalog with category filters, sorting, and published USD daily rates for six rental lengths
- Airport shortcut, 30 searchable FAQ answers in each language, category filters and quick help panel
- Full crawlable fleet table and four practical guides (Baku, road trips, GYD airport, rental planning) in RU/AZ/EN
- Dedicated About and FAQ pages in RU/AZ/EN, with links from the homepage, navigation and sitemap
- Clickable CarTime phone and email in About, footer and quick help; FAQPage and Organization structured data
- Per-page titles and descriptions, canonical and hreflang links, a sitemap, robots.txt, and conservative WebSite/Breadcrumb structured data

## Demo limits

Vehicle names, model years, categories, and six daily rates were captured from the owner's 9fleet.com catalog on 4 November 2026 after the owner chose that source over the conflicting 56-car list. The source snapshot and reconciliation are in `data/`. Rates are shown in USD per day; they may change and are not an availability or total-price quote. The images in the CarTime catalog are explicitly labelled category illustrations: the photos on 9fleet.com visibly carry that brand on number plates, so clean CarTime photos are still needed. The hero and airport backgrounds are AI-generated editorial scenes, not documentary photos of actual fleet cars or locations. This version sends no booking request and accepts no payment. Real booking needs a separate backend and server-side availability and price checks.

The guide pages contain original planning copy based on official Azerbaijan Tourism Board and Heydar Aliyev International Airport sources linked at the bottom of each relevant guide. They do not promise CarTime services or current attraction opening hours. The Site is currently owner-private, so Google cannot crawl it yet. Before public launch, verify business details and rental terms, set the public domain, set `NEXT_PUBLIC_SITE_URL` to that domain for canonical links and the sitemap, then make the Site public. Search indexing and rankings are never guaranteed.

The expanded FAQ follows the topic coverage of the owner's 9fleet site and uses EasyRent as an information-architecture reference. Its copy is original. The owner confirmed that CarTime is a new brand of the same business and that the 9fleet driver age, experience, two-day minimum, Azerbaijan-only travel, deposit and basic insurance conditions also apply. The owner supplied CarTime's phone and email and confirmed airport collection, address delivery, 24/7 support, car-dependent deposits, card/cash/bank-transfer payments, unlimited mileage, same-level fuel return and permission for a second driver. The exact deposit amount, insurance coverage, delivery charges and other unconfirmed details remain open; update `lib/service-info.ts` when confirmed.

## Development

Install dependencies and run `npm run dev` in an environment with Node.js 22.13+ and npm. Run `npm run build` for a production build.

The Site deployment has its own source repository. The owner also has a GitHub repository at `fcky009-git/cartime---website` for independent code history and collaboration.
