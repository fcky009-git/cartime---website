import type { Locale } from "@/lib/locales";

type MeasurementCopy = {
  title: string;
  message: string;
  allow: string;
  reject: string;
  privacy: string;
  settings: string;
};

export const measurementCopy: Record<Locale, MeasurementCopy> = {
  en: { title: "Cookie choices", message: "Allow optional cookies to measure site usage and ad results? You can change this anytime.", allow: "Allow measurement", reject: "Reject optional", privacy: "Privacy policy", settings: "Cookie settings" },
  ru: { title: "Выбор файлов cookie", message: "Разрешить необязательные cookie для измерения посещений и результатов рекламы? Выбор можно изменить в любой момент.", allow: "Разрешить измерение", reject: "Отклонить необязательные", privacy: "Политика конфиденциальности", settings: "Настройки cookie" },
  az: { title: "Kuki seçimləri", message: "Saytdan istifadəni və reklam nəticələrini ölçmək üçün əlavə kukilərə icazə verirsiniz? Seçimi istənilən vaxt dəyişə bilərsiniz.", allow: "Ölçməyə icazə ver", reject: "Əlavə kukiləri rədd et", privacy: "Məxfilik siyasəti", settings: "Kuki ayarları" },
  de: { title: "Cookie-Auswahl", message: "Optionale Cookies zur Messung der Websitenutzung und der Werbeergebnisse erlauben? Sie können Ihre Wahl jederzeit ändern.", allow: "Messung erlauben", reject: "Optionale ablehnen", privacy: "Datenschutzerklärung", settings: "Cookie-Einstellungen" },
  zh: { title: "Cookie 选项", message: "是否允许使用可选 Cookie 来衡量网站使用情况和广告效果？您可以随时更改选择。", allow: "允许衡量", reject: "拒绝可选 Cookie", privacy: "隐私政策", settings: "Cookie 设置" },
  ko: { title: "쿠키 선택", message: "사이트 이용과 광고 성과를 측정하는 선택적 쿠키를 허용하시겠습니까? 언제든지 선택을 바꿀 수 있습니다.", allow: "측정 허용", reject: "선택적 쿠키 거부", privacy: "개인정보 처리방침", settings: "쿠키 설정" },
  fr: { title: "Choix des cookies", message: "Autoriser les cookies facultatifs pour mesurer l’utilisation du site et les résultats publicitaires ? Vous pouvez modifier votre choix à tout moment.", allow: "Autoriser la mesure", reject: "Refuser les cookies facultatifs", privacy: "Politique de confidentialité", settings: "Paramètres des cookies" },
  ar: { title: "خيارات ملفات تعريف الارتباط", message: "هل تسمح بالملفات الاختيارية لقياس استخدام الموقع ونتائج الإعلانات؟ يمكنك تغيير اختيارك في أي وقت.", allow: "السماح بالقياس", reject: "رفض الملفات الاختيارية", privacy: "سياسة الخصوصية", settings: "إعدادات ملفات تعريف الارتباط" },
};
