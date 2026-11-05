# AGENTS.md — CarTime (cartime.az)

Instructions for coding agents (Codex, Claude Code and similar). Read `README.md` first for product context. SEO decisions and the launch checklist are in `docs/claude-seo-handoff.md`.

## Project

Car-rental site for Baku, Azerbaijan, in eight languages (`/ru`, `/az`, `/en`, `/de`, `/zh`, `/ko`, `/fr`, `/ar`). The last five are machine-translation drafts for the private preview and require native-speaker review before public launch. Next.js App Router API run by `vinext` on Cloudflare Workers. Status: owner-private preview. The request form saves leads to D1 for the owner-only admin panel; availability and final terms still require a manager. There is no online payment or instant confirmed booking.

## Commands

Node 22.13+ and npm.

```
npm run install:ci     # install (use this, not plain npm install)
npm run lint           # must stay at 0 errors (14 known <img> warnings)
npx tsc --noEmit       # must stay clean
npm run build          # must succeed
```

Run all three checks before every commit.

## Do not change the platform scaffolding

These files connect the project to the Sites/Codex preview and deployment. Do not delete, rename or "clean up" them unless the owner asks:

- `scripts/`, `worker/`, `vite.config.ts`, `.openai/hosting.json`
- `lib/connector*`, `lib/connectors.ts`, `app/chatgpt-auth.ts`
- `vendor/`, `pnpm-workspace.yaml`, the `name` in `package.json`
- `components/ui/` (unused shadcn components; harmless)

## Layout structure

- `app/[locale]/layout.tsx` is the root layout for all language pages. It sets `<html lang dir>` from the URL, the theme script, the font links, the site-wide business JSON-LD, the `noindex` guard and the optional Tag Manager snippet.
- `app/(root)/layout.tsx` exists only for `/`, which redirects to `/ru`.
- Do not re-add `app/layout.tsx`; it would conflict with the two root layouts.
- `app/[locale]/not-found.tsx` is the 404 page.

## Languages

All languages are configured in `lib/locales.ts` (codes, hreflang, og:locale, text direction, switcher order). Never type a language list by hand: use `locales`, `localeParams()`, `localeInfo` and `switcherOrder`. See "Adding a language" in `docs/claude-seo-handoff.md` before enabling a new one.

## Content rules

- Every user-facing string must exist in every language of `locales`. Copy lives in `lib/i18n.ts`, `lib/service-info.ts`, `lib/guides.ts`, `lib/rental-pages.ts` and `lib/fleet-ui.ts`.
- Never type the number of cars into copy. Use `fleetCount` from `lib/fleet-count.ts`.
- Fleet data is `lib/fleet.json`. Its source snapshot and reconciliation are in `data/` (rates from 9fleet.com, captured 4 Nov 2026, USD per day).
- Fleet photos live in `public/assets/fleet/` and `lib/fleet-images.json` points to them. The other brand's name was removed from their number plates. Never link to or re-upload the original 9fleet.com images; replace these files only with photos that show no other brand. Real CarTime photos are still needed before launch.
- Do not invent availability, deposit amounts, insurance coverage or delivery prices. Open items are listed in `README.md`; update `lib/service-info.ts` only when the owner confirms them.
- Do not add ratings, reviews, price ranges or social profile links to structured data unless they are real and confirmed.
- Do not claim instant confirmed booking or online payment. The request form is live and saves leads in the admin panel.
- The owner explicitly decided that CarTime is a separate project and the public interface must not mention 9fleet. Keep public copy about CarTime only.

## Adding a page

1. Add `generateStaticParams` returning `localeParams()` and `generateMetadata` using `pageMetadata()` from `lib/seo.ts` (it sets canonical, hreflang including `x-default`, Open Graph and Twitter tags).
2. Add the path to `app/sitemap.ts`.
3. Link it from the header, footer or a hub page so it is crawlable.
4. Add a breadcrumb with `breadcrumbJsonLd()` from `lib/structured-data.ts` rendered through `components/json-ld.tsx`. The business entity is already on every page; do not repeat it.

## Site URL, indexing and analytics

- `NEXT_PUBLIC_SITE_URL` sets canonical links, the sitemap and robots. Default: the preview domain in `lib/seo.ts`. The domain `cartime.az` is not purchased yet, so do not point canonical links at it until the owner confirms it is live.
- Indexing guard: while `NEXT_PUBLIC_SITE_URL` is not set, every page is sent with `noindex, nofollow` and robots.txt advertises no sitemap. Do not remove this guard. Setting the variable for the real domain turns indexing on.
- `NEXT_PUBLIC_GTM_ID` (format `GTM-XXXXXXX`) loads Google Tag Manager and pushes `click_phone`, `click_email` and `click_whatsapp` events. Unset means nothing loads. Never commit a real ID; set it in the deployment environment, and add a consent banner first (see the launch checklist).

## Git workflow

- GitHub (`github/main` in the Codex checkout) is the shared source of truth for Codex and Claude Code. Before starting a task, fetch and pull the latest `github/main`; if a task is already in progress, integrate upstream changes before delivery.
- Use one branch per task, make small commits, and send completed work to GitHub. Use a pull request for review before merging to `main`, unless the owner explicitly directs a different workflow for that task. Never force-push `main`.
- Coordinate ownership of files and avoid editing the same files as another agent at the same time.
- The Site deployment has its own source repository (see README). Sync it from GitHub `main` before publishing and keep the deployed source aligned with the shared repository.
