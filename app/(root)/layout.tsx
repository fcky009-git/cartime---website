import "../globals.css";

// Minimal root layout for `/`, which only redirects to the default language.
// Language pages use their own root layout in app/[locale]/layout.tsx so that
// <html lang> is correct in the server-rendered HTML.
export default function RedirectRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
