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
- Airport shortcut and FAQ

## Demo limits

Vehicle names, model years, categories, and six daily rates were captured from the owner's 9fleet.com catalog on 4 November 2026 after the owner chose that source over the conflicting 56-car list. The source snapshot and reconciliation are in `data/`. Rates are shown in USD per day; they may change and are not an availability or total-price quote. The images in the CarTime catalog are explicitly labelled category illustrations: the photos on 9fleet.com visibly carry that brand on number plates, so clean CarTime photos are still needed. The hero and airport backgrounds are AI-generated editorial scenes, not documentary photos of actual fleet cars or locations. This version sends no booking request and accepts no payment. Real booking needs a separate backend and server-side availability and price checks.

## Development

Install dependencies and run `npm run dev` in an environment with Node.js 22.13+ and npm. Run `npm run build` for a production build.

The Site deployment has its own source repository. The owner also has a GitHub repository at `fcky009-git/cartime---website` for independent code history and collaboration.
