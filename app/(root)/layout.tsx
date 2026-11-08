import { defaultLocale } from "@/lib/locales";

// Minimal root layout for `/`, which only redirects to the default language.
// Language pages use their own root layout in app/[locale]/layout.tsx so that
// <html lang> is correct in the server-rendered HTML.
// It imports no CSS on purpose: a second import of globals.css made the build load it
// after the design tokens in app/redesign.css and override them on every page.
export default function RedirectRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
