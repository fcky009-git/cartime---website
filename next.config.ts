import type { NextConfig } from "next";

/**
 * Security headers for every page and API response. Scripts are not restricted by CSP,
 * because the theme script is inline and Tag Manager may be added at launch.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

// Pages with customer data or admin actions may not be shown inside another site's frame
// (clickjacking). Public pages stay frameable so hosting previews keep working.
const noFraming = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
];
const privatePage = [...noFraming, { key: "Cache-Control", value: "no-store, private" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  async headers() {
    // vinext keeps the first value it finds for a header, so the specific rules come first.
    return [
      { source: "/:locale/admin", headers: privatePage },
      { source: "/:locale/travel-pass", headers: privatePage },
      { source: "/api/:path*", headers: noFraming },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
