import type { Metadata } from "next";
import { localeInfo, locales } from "@/lib/locales";

export const metadata: Metadata = { title: "404 | CarTime", robots: { index: false, follow: false } };

// Shown for unknown URLs. The language is not known here, so every language is offered.
export default function NotFound() {
  return (
    <main className="not-found-page">
      <div>
        <h1>404</h1>
        <p>Страница не найдена · Səhifə tapılmadı · Page not found · Seite nicht gefunden · 页面未找到 · 페이지를 찾을 수 없습니다 · Page introuvable · الصفحة غير موجودة</p>
        <nav aria-label="Choose a language">
          {locales.map((code) => <a key={code} href={`/${code}`} lang={localeInfo[code].hreflang}>{localeInfo[code].name}</a>)}
        </nav>
      </div>
    </main>
  );
}
