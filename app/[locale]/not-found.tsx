import { localeInfo, locales } from "@/lib/locales";

// Shown for unknown URLs. The language is not known here, so every language is offered.
export default function NotFound() {
  return (
    <main className="container" style={{ minHeight: "70vh", display: "grid", alignContent: "center", gap: 16, padding: "64px 0" }}>
      <p style={{ margin: 0, color: "var(--muted)", letterSpacing: ".12em" }}>CARTIME / 404</p>
      <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.1 }}>404</h1>
      <p style={{ margin: 0, maxWidth: 720 }}>Страница не найдена · Səhifə tapılmadı · Page not found · Seite nicht gefunden · 页面未找到 · 페이지를 찾을 수 없습니다 · Page introuvable · الصفحة غير موجودة</p>
      <nav aria-label="Choose a language" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {locales.map((code) => <a key={code} href={`/${code}`} lang={localeInfo[code].hreflang} style={{ color: "inherit", fontWeight: 600 }}>{localeInfo[code].name} →</a>)}
      </nav>
    </main>
  );
}
