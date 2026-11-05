# AGENTS.md — CarTime (cartime.az)

Instructions for coding agents (Codex, Claude Code and similar). Read `README.md` first for product context.

## Project

Car-rental site for Baku, Azerbaijan, in three languages (`/ru`, `/az`, `/en`). Next.js App Router API run by `vinext` on Cloudflare Workers. Status: under construction, owner-private, no booking or payment backend yet.

## Commands

Node 22.13+ and npm.

```
npm run install:ci     # install (use this, not plain npm install)
npm run lint           # must stay at 0 errors (9 known <img> warnings)
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

- `app/[locale]/layout.tsx` is the root layout for all language pages. It sets `<html lang>` from the URL, the theme script and the font links.
- `app/(root)/layout.tsx` exists only for `/`, which redirects to `/ru`.
- Do not re-add `app/layout.tsx`; it would conflict with the two root layouts.

## Content rules

- Every user-facing string must exist in ru, az and en. Copy lives in `lib/i18n.ts`, `lib/service-info.ts`, `lib/guides.ts`, `lib/rental-pages.ts` and `lib/fleet-ui.ts`.
- Never type the number of cars into copy. Use `fleetCount` from `lib/fleet-count.ts`.
- Fleet data is `lib/fleet.json`. Its source snapshot and reconciliation are in `data/` (rates from 9fleet.com, captured 4 Nov 2026, USD per day).
- Do not use 9fleet.com photos: their number plates show the other brand. Catalog images are labelled category illustrations until clean CarTime photos exist.
- Do not invent availability, deposit amounts, insurance coverage or delivery prices. Open items are listed in `README.md`; update `lib/service-info.ts` only when the owner confirms them.
- Do not claim online booking or payment works.
- The README says the public interface should not mention 9fleet, but the About copy currently does (owner decision pending). Do not add new public mentions.

## Adding a page

1. Add `generateStaticParams` for all three locales and `generateMetadata` using `pageMetadata()` from `lib/seo.ts` (it sets canonical and hreflang including `x-default`).
2. Add the path to `app/sitemap.ts`.
3. Link it from the header, footer or a hub page so it is crawlable.
4. Add JSON-LD with `jsonLd()` from `lib/seo.ts` where it fits (it escapes `<`).

## Site URL

`NEXT_PUBLIC_SITE_URL` sets canonical links, the sitemap and robots. Default: the preview domain in `lib/seo.ts`. The domain `cartime.az` is not purchased yet, so do not point canonical links at it until the owner confirms it is live.

## Git workflow

- One branch per task, small commits, open a pull request instead of pushing to `main`.
- The Site deployment has its own source repository (see README). This GitHub repository is for history and collaboration, so keep the two in sync when merging.
