# CarTime Travel Pass

Client page: `/[locale]/travel-pass`. This page is always noindex and sets no-referrer. It is linked from the directory, footer and site search. Individual credentials are never sitemap entries. The generic lookup page is omitted from the sitemap because it is deliberately noindex.

New booking submissions send a cryptographically random, 12-character access code (60 bits of entropy). D1 stores only its SHA-256 digest. The reference is `CT-` plus 12 UUID hex characters. A reference alone cannot retrieve a pass. Both a reference and code are required through a same-origin POST; private links put credentials in a URL fragment, not a query string. No personal data is present in the initial HTML. Responses use no-store. Lookup has a durable IP limit of 60 attempts per 15 minutes, including automatic refreshes. It fails closed if the trusted Cloudflare visitor IP is absent. Expired rate-limit rows are removed after 24 hours.

The client must save the code/link shown after submission. Automatic email delivery and account recovery by email are not implemented. Managers can issue a pass for older bookings or replace lost access in the admin panel; replacement invalidates the previous link and code. Verify the customer's identity before issuing replacement access. Codes are shown to the manager only at issuance. Anyone receiving the private URL or QR can view that trip; the interface explains this before sharing.

Only explicitly projected trip fields and status history are returned to clients. Customer phone/email, driver age, driving experience, form notes, internal admin notes, password hashes and other bookings are excluded. Managers have separate public message and pickup-instruction fields. Agreed rental price and deposit remain nullable until a manager supplies them. Pickup and return times are Baku time. Calendar files carry the request status and a confirmation notice.

The existing booking status controls confirmation/cancellation. A separate trip stage supports pre-pickup, active rental and completion. Active/completed stages can only be set for confirmed bookings. Cancellation overrides all trip stages in the client view. Status refresh occurs every 90 seconds while the tab is visible; manual refresh is available. The web pass is not an offline pass or a rental contract. PDF uses the browser print/save-PDF flow; the QR and access code are included.

Migration: `0003_even_pestilence` creates travel_passes and travel_access_attempts. Deleting a booking removes its pass. Replaying a booking POST cannot issue access to an older request lacking a pass. The original access code allows an idempotent retry to recover the same pass.

## Apple Wallet

The owner currently has no Apple Developer account. Download stays unavailable until all signing secrets are configured. The button explains this rather than pretending to add an unsigned file. Web pass, QR, calendar and PDF work independently.

The server contains a detached PKCS#7 signing and ZIP packaging path for `.pkpass`. Required Sites secrets:

- CARTIME_WALLET_PASS_TYPE_ID: registered Pass Type ID.
- CARTIME_WALLET_TEAM_ID: the Apple team identifier matching the certificate.
- CARTIME_WALLET_CERT_PEM: Apple-issued Pass Type ID signing certificate, PEM.
- CARTIME_WALLET_KEY_PEM: matching unencrypted private key, PEM (secret storage only).
- CARTIME_WALLET_WWDR_PEM: the correct Apple intermediate certificate for that signing certificate, PEM.

Redeploy after setting secrets. Never commit certificates or keys, and never send the private key in chat. Validate a real signed pass on an iPhone before enabling this for customers. This cannot be verified without the owner's Apple-issued signing identity. Wallet fields currently use English; the live web pass has eight languages. Automatic Wallet push updates / APNs and device registration are not implemented: download a new pass with the same serial number to update an installed pass. The live QR link always opens current web data. Apple Wallet is not Apple Pay, an NFC car key, or payment confirmation.

Official references: https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates and https://developer.apple.com/documentation/walletpasses/distributing-and-updating-a-pass
