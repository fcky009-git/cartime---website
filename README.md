# CarTime website — first frontend version

This is the first frontend implementation of the supplied CarTime brand kit. The visual master and exact dark wordmark came from the handoff folder. The public interface does not mention the internal 9fleet project.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Localized routes: `/ru`, `/az`, `/en`
- Hybrid, Dark, Light themes; explicit choice is saved in `localStorage` under `cartime-theme`

## What works

- Responsive homepage, navigation, theme and language controls
- Date and pickup/return form with client-side validation and clear demo feedback
- Demo vehicle category filter and model information dialog
- Airport shortcut and FAQ

## Demo limits

Vehicle cards and hero art are concept illustrations from the handoff package. They do not establish the actual fleet, availability, rates, insurance, pickup service, or conditions. This version sends no booking request and accepts no payment. Real booking needs a separate backend, verified data, and server-side availability and price checks.

## Development

Install dependencies and run `npm run dev` in an environment with Node.js 22.13+ and npm. Run `npm run build` for a production build.

The Site deployment has its own source repository. A separate GitHub repository can be connected later if the owner wants independent code history and collaboration.
