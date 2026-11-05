"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clipboard, Download, ExternalLink, LogOut, Mail, MessageCircle, Printer, RefreshCw, Search, Sparkles } from "lucide-react";
import type { bookingRequests } from "@/db/schema";
import type { Locale } from "@/lib/i18n";
import fleetImages from "@/lib/fleet-images.json";
import { fleetUi } from "@/lib/fleet-ui";
import { bookingUi } from "@/lib/booking";
import { dayCountLabel } from "@/lib/count-labels";
import { ADMIN_PAGE_SIZE } from "@/lib/admin-bookings";
import { adminAccessCopy } from "@/components/admin-login";

type Booking = typeof bookingRequests.$inferSelect;
type Status = "new" | "contacted" | "confirmed" | "cancelled";
const statuses: Status[] = ["new", "contacted", "confirmed", "cancelled"];
const labels = {
  ru: { title: "Заявки CarTime", subtitle: "Новые запросы на аренду и история ответов", all: "Все", new: "Новые", contacted: "В работе", confirmed: "Подтверждены", cancelled: "Отменены", search: "Имя, телефон, модель или номер заявки", refresh: "Обновить", export: "Скачать CSV", empty: "Заявок пока нет", emptySearch: "По этому запросу ничего не найдено", details: "Детали заявки", contact: "Контакт", route: "Маршрут", driver: "Водитель", payment: "Оплата", notes: "Примечание", flight: "Рейс", second: "Второй водитель", yes: "Да", no: "Нет", status: "Статус", saved: "Сохранено", fail: "Не удалось обновить заявки. Попробуйте ещё раз.", created: "Создана", estimate: "Предварительно", rate: "Тариф", send: "Написать в WhatsApp", email: "Написать на почту", site: "На сайт", loading: "Сохраняем…", address: "Адрес", age: "Возраст", experience: "Стаж", years: "лет", visible: "Показано" },
  az: { title: "CarTime sorğuları", subtitle: "Yeni icarə sorğuları və cavab tarixçəsi", all: "Hamısı", new: "Yeni", contacted: "İşdə", confirmed: "Təsdiqlənib", cancelled: "Ləğv edilib", search: "Ad, telefon, model və ya sorğu nömrəsi", refresh: "Yenilə", export: "CSV yüklə", empty: "Hələ sorğu yoxdur", emptySearch: "Nəticə tapılmadı", details: "Sorğu detalları", contact: "Əlaqə", route: "Marşrut", driver: "Sürücü", payment: "Ödəniş", notes: "Qeyd", flight: "Reys", second: "İkinci sürücü", yes: "Bəli", no: "Xeyr", status: "Status", saved: "Yadda saxlanıldı", fail: "Sorğuları yeniləmək olmadı. Yenidən cəhd edin.", created: "Yaradılıb", estimate: "İlkin məbləğ", rate: "Tarif", send: "WhatsApp-da yaz", email: "E-poçt yaz", site: "Sayta qayıt", loading: "Yadda saxlanılır…", address: "Ünvan", age: "Yaş", experience: "Təcrübə", years: "il", visible: "Göstərilir" },
  en: { title: "CarTime requests", subtitle: "New rental enquiries and response history", all: "All", new: "New", contacted: "In progress", confirmed: "Confirmed", cancelled: "Cancelled", search: "Name, phone, car or request ID", refresh: "Refresh", export: "Download CSV", empty: "No requests yet", emptySearch: "No matching requests", details: "Request details", contact: "Contact", route: "Trip", driver: "Driver", payment: "Payment", notes: "Notes", flight: "Flight", second: "Second driver", yes: "Yes", no: "No", status: "Status", saved: "Saved", fail: "Could not update requests. Please try again.", created: "Created", estimate: "Estimate", rate: "Rate", send: "WhatsApp customer", email: "Email customer", site: "Back to site", loading: "Saving…", address: "Address", age: "Age", experience: "Experience", years: "years", visible: "Showing" },
  de: { title: "CarTime-Anfragen", subtitle: "Neue Mietanfragen und Antwortverlauf", all: "Alle", new: "Neu", contacted: "In Bearbeitung", confirmed: "Bestätigt", cancelled: "Abgesagt", search: "Name, Telefon, Auto oder Anfrage-ID", refresh: "Aktualisieren", export: "CSV herunterladen", empty: "Noch keine Anfragen", emptySearch: "Keine passenden Anfragen", details: "Anfragedetails", contact: "Kontakt", route: "Reise", driver: "Fahrer", payment: "Zahlung", notes: "Notizen", flight: "Flug", second: "Zweiter Fahrer", yes: "Ja", no: "Nein", status: "Status", saved: "Gespeichert", fail: "Anfragen konnten nicht aktualisiert werden. Bitte versuchen Sie es erneut.", created: "Erstellt", estimate: "Schätzung", rate: "Tagespreis", send: "Per WhatsApp schreiben", email: "E-Mail an den Kunden", site: "Zurück zur Website", loading: "Speichern…", address: "Adresse", age: "Alter", experience: "Erfahrung", years: "Jahre", visible: "Wird angezeigt" },
  zh: { title: "CarTime 请求", subtitle: "新的租车咨询和回复记录", all: "全部", new: "新", contacted: "进行中", confirmed: "已确认", cancelled: "已取消", search: "姓名、电话、汽车或请求 ID", refresh: "刷新", export: "下载 CSV", empty: "还没有请求", emptySearch: "没有匹配的请求", details: "请求详情", contact: "联系方式", route: "旅行", driver: "司机", payment: "付款", notes: "注释", flight: "航班", second: "第二位司机", yes: "是", no: "否", status: "状态", saved: "已保存", fail: "无法更新请求。请再试一次。", created: "已创建", estimate: "预估", rate: "日租金", send: "通过 WhatsApp 联系", email: "给客户发邮件", site: "返回网站", loading: "正在保存...", address: "地址", age: "年龄", experience: "经验", years: "年", visible: "显示中" },
  ko: { title: "CarTime 요청", subtitle: "신규 렌터카 문의 및 응답 내역", all: "전체", new: "신규", contacted: "진행 중", confirmed: "확인됨", cancelled: "취소됨", search: "이름, 전화번호, 차량 또는 요청 ID", refresh: "새로고침", export: "CSV 다운로드", empty: "아직 요청이 없습니다", emptySearch: "일치하는 요청이 없습니다.", details: "요청 세부정보", contact: "연락처", route: "여행", driver: "운전자", payment: "결제", notes: "메모", flight: "항공편", second: "두 번째 운전자", yes: "예", no: "아니요", status: "상태", saved: "저장됨", fail: "요청을 업데이트할 수 없습니다. 다시 시도해 주세요.", created: "생성됨", estimate: "견적", rate: "일일 요금", send: "WhatsApp으로 연락", email: "고객에게 이메일 보내기", site: "사이트로 돌아가기", loading: "저장 중…", address: "주소", age: "나이", experience: "경험", years: "년", visible: "표시 중" },
  fr: { title: "Demandes CarTime", subtitle: "Nouvelles demandes de location et historique des réponses", all: "Tous", new: "Nouveau", contacted: "En cours", confirmed: "Confirmé", cancelled: "Annulé", search: "Nom, téléphone, voiture ou identifiant de demande", refresh: "Actualiser", export: "Télécharger le CSV", empty: "Aucune demande pour l'instant", emptySearch: "Aucune demande correspondante", details: "Détails de la demande", contact: "Contact", route: "Voyage", driver: "Conducteur", payment: "Paiement", notes: "Remarques", flight: "Vol", second: "Deuxième conducteur", yes: "Oui", no: "Non", status: "Statut", saved: "Enregistré", fail: "Impossible de mettre à jour les demandes. Veuillez réessayer.", created: "Créé", estimate: "Estimation", rate: "Tarif", send: "Écrire sur WhatsApp", email: "Envoyer un e-mail au client", site: "Retour au site", loading: "Sauvegarde…", address: "Adresse", age: "Âge", experience: "Expérience", years: "ans", visible: "Affichage" },
  ar: { title: "طلبات كار تايم", subtitle: "استفسارات الإيجار الجديدة وتاريخ الاستجابة", all: "الكل", new: "جديد", contacted: "قيد التقدم", confirmed: "تم التأكيد", cancelled: "ملغى", search: "الاسم أو الهاتف أو السيارة أو رقم الطلب", refresh: "تحديث", export: "تنزيل ملف CSV", empty: "لا يوجد طلبات بعد", emptySearch: "لا توجد طلبات مطابقة", details: "تفاصيل الطلب", contact: "التواصل", route: "رحلة", driver: "سائق", payment: "الدفع", notes: "ملاحظات", flight: "الرحلة الجوية", second: "السائق الثاني", yes: "نعم", no: "لا", status: "الحالة", saved: "تم الحفظ", fail: "تعذر تحديث الطلبات. يرجى المحاولة مرة أخرى.", created: "تم الإنشاء", estimate: "تقدير", rate: "السعر اليومي", send: "مراسلة عبر واتساب", email: "مراسلة العميل بالبريد", site: "العودة للموقع", loading: "جاري الحفظ…", address: "العنوان", age: "العمر", experience: "خبرة", years: "سنة", visible: "جاري العرض" },
} as const;

const extra: Record<Locale, { live: string; paused: string; logout: string; calendar: string; copy: string; copied: string; print: string; sort: string; newest: string; oldest: string; pickup: string; highest: string; allDates: string; today: string; nextWeek: string; past: string; upcoming: string; estimate: string; lastWeek: string; quickStatus: string; openCalendar: string; downloadCalendar: string; activity: string; todayPickup: string; todayReturn: string; activeTrips: string; autoRefresh: string; manualRefresh: string }> = {
  ru: { live: "Автообновление", paused: "Пауза", logout: "Выйти", calendar: "Календарь", copy: "Скопировать", copied: "Скопировано", print: "Печать", sort: "Порядок", newest: "Сначала новые", oldest: "Сначала старые", pickup: "По дате выдачи", highest: "По сумме", allDates: "Все даты", today: "Сегодня", nextWeek: "Ближайшие 7 дней", past: "Прошедшие", upcoming: "Скоро выдача", estimate: "Сумма подтверждённых", lastWeek: "За 7 дней", quickStatus: "Быстрый статус", openCalendar: "Google Календарь", downloadCalendar: "Скачать .ics", activity: "Поток заявок", todayPickup: "Выдачи сегодня", todayReturn: "Возвраты сегодня", activeTrips: "В работе", autoRefresh: "Автоматически каждые 30 секунд", manualRefresh: "Обновляется вручную" },
  az: { live: "Avtomatik yenilə", paused: "Fasilə", logout: "Çıxış", calendar: "Təqvim", copy: "Kopyala", copied: "Kopyalandı", print: "Çap et", sort: "Sıralama", newest: "Ən yenilər", oldest: "Ən köhnələr", pickup: "Götürmə tarixi", highest: "Məbləğə görə", allDates: "Bütün tarixlər", today: "Bu gün", nextWeek: "Növbəti 7 gün", past: "Keçmiş", upcoming: "Yaxın götürmələr", estimate: "Təsdiqlənənlərin cəmi", lastWeek: "7 gündə", quickStatus: "Sürətli status", openCalendar: "Google Təqvim", downloadCalendar: ".ics yüklə", activity: "Sorğu axını", todayPickup: "Bugünkü götürmələr", todayReturn: "Bugünkü qaytarmalar", activeTrips: "İşdə", autoRefresh: "Hər 30 saniyədən bir", manualRefresh: "Əl ilə yenilənir" },
  en: { live: "Live updates", paused: "Paused", logout: "Sign out", calendar: "Calendar", copy: "Copy summary", copied: "Copied", print: "Print", sort: "Sort", newest: "Newest first", oldest: "Oldest first", pickup: "Pickup date", highest: "Highest estimate", allDates: "All dates", today: "Today", nextWeek: "Next 7 days", past: "Past", upcoming: "Upcoming pickup", estimate: "Confirmed total", lastWeek: "Last 7 days", quickStatus: "Quick status", openCalendar: "Google Calendar", downloadCalendar: "Download .ics", activity: "Request activity", todayPickup: "Pickups today", todayReturn: "Returns today", activeTrips: "In progress", autoRefresh: "Every 30 seconds", manualRefresh: "Manual refresh" },
  de: { live: "Live-Updates", paused: "Pausiert", logout: "Abmelden", calendar: "Kalender", copy: "Zusammenfassung kopieren", copied: "Kopiert", print: "Drucken", sort: "Sortieren", newest: "Neueste zuerst", oldest: "Älteste zuerst", pickup: "Abholdatum", highest: "Höchster Schätzwert", allDates: "Alle Daten", today: "Heute", nextWeek: "Nächste 7 Tage", past: "Vergangen", upcoming: "Nächste Abholung", estimate: "Summe bestätigt", lastWeek: "Letzte 7 Tage", quickStatus: "Schnellstatus", openCalendar: "Google Kalender", downloadCalendar: ".ics laden", activity: "Anfrageverlauf", todayPickup: "Abholungen heute", todayReturn: "Rückgaben heute", activeTrips: "In Bearbeitung", autoRefresh: "Alle 30 Sekunden", manualRefresh: "Manuelle Aktualisierung" },
  zh: { live: "自动更新", paused: "已暂停", logout: "退出登录", calendar: "日历", copy: "复制摘要", copied: "已复制", print: "打印", sort: "排序", newest: "最新优先", oldest: "最早优先", pickup: "取车日期", highest: "金额最高", allDates: "所有日期", today: "今天", nextWeek: "未来 7 天", past: "过去", upcoming: "即将取车", estimate: "已确认总额", lastWeek: "过去 7 天", quickStatus: "快速状态", openCalendar: "Google 日历", downloadCalendar: "下载 .ics", activity: "请求动态", todayPickup: "今天取车", todayReturn: "今天还车", activeTrips: "处理中", autoRefresh: "每 30 秒", manualRefresh: "手动刷新" },
  ko: { live: "자동 새로고침", paused: "일시 중지", logout: "로그아웃", calendar: "캘린더", copy: "요약 복사", copied: "복사됨", print: "인쇄", sort: "정렬", newest: "최신순", oldest: "오래된순", pickup: "인수 날짜", highest: "예상 금액순", allDates: "모든 날짜", today: "오늘", nextWeek: "향후 7일", past: "지난 날짜", upcoming: "예정 인수", estimate: "확정 합계", lastWeek: "최근 7일", quickStatus: "빠른 상태 변경", openCalendar: "Google 캘린더", downloadCalendar: ".ics 다운로드", activity: "요청 현황", todayPickup: "오늘 인수", todayReturn: "오늘 반납", activeTrips: "진행 중", autoRefresh: "30초마다", manualRefresh: "수동 새로고침" },
  fr: { live: "Actualisation auto", paused: "En pause", logout: "Déconnexion", calendar: "Calendrier", copy: "Copier le résumé", copied: "Copié", print: "Imprimer", sort: "Trier", newest: "Plus récentes", oldest: "Plus anciennes", pickup: "Date de retrait", highest: "Estimation la plus haute", allDates: "Toutes les dates", today: "Aujourd'hui", nextWeek: "7 prochains jours", past: "Passées", upcoming: "Retrait prochain", estimate: "Total confirmé", lastWeek: "7 derniers jours", quickStatus: "Statut rapide", openCalendar: "Google Agenda", downloadCalendar: "Télécharger .ics", activity: "Activité des demandes", todayPickup: "Retraits aujourd'hui", todayReturn: "Retours aujourd'hui", activeTrips: "En cours", autoRefresh: "Toutes les 30 secondes", manualRefresh: "Actualisation manuelle" },
  ar: { live: "تحديث تلقائي", paused: "متوقف", logout: "تسجيل الخروج", calendar: "التقويم", copy: "نسخ الملخص", copied: "تم النسخ", print: "طباعة", sort: "ترتيب", newest: "الأحدث أولاً", oldest: "الأقدم أولاً", pickup: "تاريخ الاستلام", highest: "أعلى تقدير", allDates: "كل التواريخ", today: "اليوم", nextWeek: "الأيام السبعة القادمة", past: "الماضية", upcoming: "الاستلام القادم", estimate: "إجمالي المؤكدة", lastWeek: "آخر 7 أيام", quickStatus: "حالة سريعة", openCalendar: "تقويم Google", downloadCalendar: "تنزيل .ics", activity: "نشاط الطلبات", todayPickup: "استلام اليوم", todayReturn: "إرجاع اليوم", activeTrips: "قيد العمل", autoRefresh: "كل 30 ثانية", manualRefresh: "تحديث يدوي" },
};

type DateFilter = "all" | "today" | "week" | "past";
type Sort = "newest" | "oldest" | "pickup" | "highest";
const bakuDate = (date: Date) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const calendarStamp = (date: string, time: string) => `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
// Baku time in one fixed format: locale formats differ between the server and browsers and break hydration.
const bakuClock = (date: Date) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.hour}:${parts.minute}`;
};
const bakuStamp = (date: Date) => `${bakuDate(date)} ${bakuClock(date)}`;
const normalizeSearch = (value: string) => value.replace(/[İı]/g, "i").toLowerCase();
const sessionEnded = (response: Response) => response.status === 401 || response.status === 403;
const mergeBookings = (current: Booking[], incoming: Booking[]) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) {
    const known = byId.get(item.id);
    if (!known || item.updatedAt >= known.updatedAt) byId.set(item.id, item);
  }
  return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};
const escapeIcs = (value: string) => value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");

const place = (value: string, address: string | null, locale: Locale) => {
  const names = { ru: { office: "Офис, Баку", airport: "Аэропорт GYD", delivery: "Доставка" }, az: { office: "Bakı ofisi", airport: "GYD hava limanı", delivery: "Çatdırılma" }, en: { office: "Baku office", airport: "GYD airport", delivery: "Delivery" }, de: { office: "Büro Baku", airport: "Flughafen GYD", delivery: "Lieferung" }, zh: { office: "巴库办公室", airport: "GYD 机场", delivery: "送车上门" }, ko: { office: "바쿠 사무실", airport: "GYD 공항", delivery: "차량 배송" }, fr: { office: "Bureau de Bakou", airport: "Aéroport GYD", delivery: "Livraison" }, ar: { office: "مكتب باكو", airport: "مطار GYD", delivery: "التوصيل" } };
  return `${names[locale][value as "office" | "airport" | "delivery"] || value}${address ? ` · ${address}` : ""}`;
};

export default function AdminBoard({ locale, initialItems, loadError, initialNow }: { locale: Locale; initialItems: Booking[]; loadError: boolean; initialNow: number }) {
  const t = labels[locale];
  const x = extra[locale];
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [live, setLive] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id || null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError ? t.fail : "");
  const [notice, setNotice] = useState("");
  const [lastRefresh, setLastRefresh] = useState(initialNow);
  const searchRef = useRef<HTMLInputElement>(null);
  const today = bakuDate(new Date(lastRefresh));
  const weekEnd = bakuDate(new Date(lastRefresh + 7 * 86400000));
  const counts = Object.fromEntries(statuses.map((status) => [status, items.filter((item) => item.status === status).length])) as Record<Status, number>;
  const visible = useMemo(() => {
    const queryText = normalizeSearch(query.trim());
    const queryDigits = query.replace(/\D/g, "").replace(/^0+/, "");
    return items.filter((item) => {
    const matchesDate = dateFilter === "all" || (dateFilter === "today" ? item.fromDate === today || item.toDate === today : dateFilter === "week" ? item.fromDate >= today && item.fromDate <= weekEnd : item.toDate < today);
    return (filter === "all" || item.status === filter) && matchesDate && (normalizeSearch(`${item.customerName} ${item.phone} ${item.email} ${item.carName} ${item.id} ${item.flight || ""} ${item.notes || ""}`).includes(queryText) || (queryDigits.length >= 3 && item.phone.replace(/\D/g, "").includes(queryDigits)));
    }).sort((a, b) => sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : sort === "pickup" ? `${a.fromDate}${a.fromTime}`.localeCompare(`${b.fromDate}${b.fromTime}`) : sort === "highest" ? b.estimateUsd - a.estimateUsd : b.createdAt.localeCompare(a.createdAt));
  }, [items, filter, dateFilter, sort, query, today, weekEnd]);
  const selected = visible.find((item) => item.id === selectedId) || visible[0];
  const confirmedEstimate = items.filter((item) => item.status === "confirmed").reduce((sum, item) => sum + item.estimateUsd, 0);
  const weekItems = items.filter((item) => bakuDate(new Date(item.createdAt)) >= bakuDate(new Date(lastRefresh - 6 * 86400000)));
  const chart = Array.from({ length: 7 }, (_, index) => {
    const date = bakuDate(new Date(lastRefresh - (6 - index) * 86400000));
    return { date, count: items.filter((item) => bakuDate(new Date(item.createdAt)) === date).length };
  });
  const chartMax = Math.max(1, ...chart.map((day) => day.count));
  const upcoming = items.filter((item) => item.status !== "cancelled" && item.fromDate >= today && item.fromDate <= weekEnd).sort((a, b) => `${a.fromDate}${a.fromTime}`.localeCompare(`${b.fromDate}${b.fromTime}`)).slice(0, 4);

  const refresh = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (sessionEnded(response)) { window.location.reload(); return; }
      if (!response.ok) throw new Error("reload failed");
      const data = await response.json() as { items: Booking[] };
      setItems((current) => mergeBookings(current, data.items));
      setLastRefresh(Date.now());
    } catch { setError(t.fail); }
    finally { setBusy(false); }
  }, [t.fail]);

  // The first response holds the newest requests. Older ones load in the background
  // so statistics, search and CSV cover every request.
  useEffect(() => {
    if (initialItems.length < ADMIN_PAGE_SIZE) return;
    let active = true;
    void (async () => {
      let oldest = initialItems[initialItems.length - 1].createdAt;
      try {
        for (let page = 0; active && page < 200; page++) {
          const response = await fetch(`/api/admin/bookings?before=${encodeURIComponent(oldest)}`, { cache: "no-store" });
          if (sessionEnded(response)) { window.location.reload(); return; }
          if (!response.ok) throw new Error("older requests failed");
          const data = await response.json() as { items: Booking[] };
          if (active) setItems((current) => mergeBookings(current, data.items));
          const last = data.items[data.items.length - 1]?.createdAt;
          if (data.items.length < ADMIN_PAGE_SIZE || !last || last === oldest) return;
          oldest = last;
        }
      } catch { if (active) setError(t.fail); }
    })();
    return () => { active = false; };
  }, [initialItems, t.fail]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!live) return;
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 30_000);
    return () => window.clearInterval(interval);
  }, [live, refresh]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) { event.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function updateStatus(id: string, status: Status) {
    setPendingId(id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (sessionEnded(response)) { window.location.reload(); return; }
      if (!response.ok) throw new Error("update failed");
      const data = await response.json() as { updatedAt: string };
      setItems((current) => current.map((item) => item.id === id ? { ...item, status, updatedAt: data.updatedAt } : item));
      setNotice(t.saved);
    } catch { setError(t.fail); }
    finally { setPendingId(null); }
  }

  function exportCsv() {
    const columns = ["id", "createdAt", "status", "carName", "carYear", "fromDate", "fromTime", "toDate", "toTime", "days", "pickup", "pickupAddress", "dropoff", "returnAddress", "dailyRateUsd", "estimateUsd", "customerName", "phone", "email", "age", "experience", "flight", "secondDriver", "payment", "notes"] as const;
    const safeCell = (value: unknown) => {
      const text = String(value ?? "");
      // A leading tab keeps phone numbers as text in Excel without a visible apostrophe.
      if (/^\+[\d\s()-]+$/.test(text)) return `"\t${text}"`;
      const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const csv = [columns.join(","), ...visible.map((item) => columns.map((key) => safeCell(item[key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cartime-bookings-${bakuDate(new Date())}.csv`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copySummary(item: Booking) {
    const summary = [`CarTime #${item.id.slice(0, 8).toUpperCase()}`, `${item.carName} · ${item.carYear}`, `${item.fromDate} ${item.fromTime} → ${item.toDate} ${item.toTime}`, `${dayCountLabel(locale, item.days)} · $${item.estimateUsd} USD`, `${item.customerName} · ${item.phone} · ${item.email}`].join("\n");
    try { await navigator.clipboard.writeText(summary); setNotice(x.copied); }
    catch { setError(t.fail); }
  }

  function downloadCalendar(item: Booking) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CarTime//Booking Admin//EN", "BEGIN:VEVENT", `UID:${item.id}@cartime.az`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;TZID=Asia/Baku:${calendarStamp(item.fromDate, item.fromTime)}`, `DTEND;TZID=Asia/Baku:${calendarStamp(item.toDate, item.toTime)}`, `SUMMARY:${escapeIcs(`CarTime · ${item.carName}`)}`, `DESCRIPTION:${escapeIcs(`Request #${item.id.slice(0, 8).toUpperCase()}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([lines], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cartime-${item.id.slice(0, 8)}.ics`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function signOut() {
    try { await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }); }
    finally { window.location.reload(); }
  }

  const googleCalendarUrl = selected ? `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `CarTime · ${selected.carName}`, dates: `${calendarStamp(selected.fromDate, selected.fromTime)}/${calendarStamp(selected.toDate, selected.toTime)}`, ctz: "Asia/Baku", details: `Request #${selected.id.slice(0, 8).toUpperCase()}` })}` : "";

  return <main className="admin-shell">
    <header className="admin-top"><a className="admin-logo" href={`/${locale}`}><img src="/assets/logo-dark.png" alt="CarTime" /></a><span className="admin-top-label"><span className="admin-live-dot" />CARTIME / OPERATIONS</span><div className="admin-top-actions"><a href={`/${locale}`}>{t.site} <ArrowRight size={16} /></a><button type="button" onClick={signOut}><LogOut size={16} />{adminAccessCopy[locale].signout}</button></div></header>
    <div className="admin-wrap">
      <div className="admin-heading"><div><p><Sparkles size={14} /> CARTIME / CONTROL ROOM</p><h1>{t.title}</h1><span>{t.subtitle}</span></div><div className="admin-tools"><button type="button" className={live ? "admin-live-toggle active" : "admin-live-toggle"} onClick={() => setLive(!live)} aria-pressed={live}><span className="admin-live-dot" />{live ? x.live : x.paused}</button><button type="button" onClick={() => void refresh()} disabled={busy}><RefreshCw size={16} className={busy ? "admin-spin" : ""} />{t.refresh}</button><button type="button" onClick={exportCsv} disabled={!visible.length}><Download size={16} />{t.export}</button></div></div>
      <div className="admin-stats"><button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><span>{t.all}</span><strong>{items.length}</strong></button>{statuses.map((status) => <button type="button" key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}><span>{t[status]}</span><strong>{counts[status]}</strong></button>)}</div>
      <div className="admin-overview"><section className="admin-activity"><div className="admin-panel-heading"><div><small>{x.activity}</small><strong>{weekItems.length} · {x.lastWeek}</strong></div><span>{live ? x.autoRefresh : x.manualRefresh} · {bakuClock(new Date(lastRefresh))}</span></div><div className="admin-chart" role="img" aria-label={`${x.activity}: ${chart.map((day) => `${day.date} ${day.count}`).join(", ")}`}>{chart.map((day) => <div key={day.date}><span style={{ height: `${Math.max(8, day.count / chartMax * 100)}%` }} data-count={day.count} /><small>{day.date.slice(5)}</small></div>)}</div></section><section className="admin-upcoming"><div className="admin-panel-heading"><div><small>{x.upcoming}</small><strong>{upcoming.length} · {x.nextWeek}</strong></div><CalendarDays size={19} /></div><div className="admin-upcoming-list">{upcoming.length ? upcoming.map((item) => <button type="button" key={item.id} onClick={() => { setFilter("all"); setDateFilter("all"); setQuery(""); setSelectedId(item.id); }}><time>{item.fromDate.slice(5)}<small>{item.fromTime}</small></time><span><strong>{item.carName}</strong><small>{item.customerName}</small></span><ArrowRight size={15} /></button>) : <p>{t.empty}</p>}</div></section></div>
      <div className="admin-quickfacts"><span>{x.todayPickup}: <strong>{items.filter((item) => item.status !== "cancelled" && item.fromDate === today).length}</strong></span><span>{x.todayReturn}: <strong>{items.filter((item) => item.status !== "cancelled" && item.toDate === today).length}</strong></span><span>{x.activeTrips}: <strong>{counts.contacted}</strong></span><span>{x.estimate}: <strong>${confirmedEstimate} USD</strong></span></div>
      <div className="admin-workbar"><div className="admin-search"><Search size={18} /><input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /><small>{t.visible}: {visible.length}</small></div><label>{x.sort}<select value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="newest">{x.newest}</option><option value="oldest">{x.oldest}</option><option value="pickup">{x.pickup}</option><option value="highest">{x.highest}</option></select></label></div>
      <div className="admin-date-filters" role="group" aria-label={x.calendar}>{(["all", "today", "week", "past"] as DateFilter[]).map((choice) => <button key={choice} type="button" className={dateFilter === choice ? "active" : ""} onClick={() => setDateFilter(choice)}>{choice === "all" ? x.allDates : choice === "today" ? x.today : choice === "week" ? x.nextWeek : x.past}</button>)}</div>
      {error && <p className="admin-alert" role="alert">{error}</p>}{notice && <p className="admin-notice" role="status"><Check size={15} />{notice}</p>}
      <div className="admin-layout"><section className="admin-list" aria-label={t.title}>{visible.length ? visible.map((item) => <button key={item.id} type="button" className={`admin-list-item${selected?.id === item.id ? " selected" : ""}`} onClick={() => setSelectedId(item.id)}><div><strong>{item.customerName}</strong><span className={`admin-status admin-status-${item.status}`}>{t[item.status as Status]}</span></div><p>{item.carName} · {item.carYear}</p><small>{item.fromDate} → {item.toDate} <b>${item.estimateUsd}</b></small><em>{bakuStamp(new Date(item.createdAt))}</em></button>) : <p className="admin-empty">{items.length ? t.emptySearch : t.empty}</p>}</section>
      <section className="admin-detail" aria-label={t.details}>{selected ? <><div className="admin-detail-head"><div><span>{t.created} · {bakuStamp(new Date(selected.createdAt))}</span><h2>{selected.carName}</h2><p>{selected.carYear} · #{selected.id.slice(0, 8).toUpperCase()}</p></div><strong>${selected.estimateUsd}</strong></div>
        {fleetImages[selected.carId as keyof typeof fleetImages] && <div className="admin-car-visual"><img src={fleetImages[selected.carId as keyof typeof fleetImages]} alt={`${selected.carName} ${selected.carYear}`} /><span>{selected.carName} · {selected.carYear}</span></div>}
        <div className="admin-detail-grid"><div><small>{t.route}</small><strong>{selected.fromDate} {selected.fromTime}</strong><p>{place(selected.pickup, selected.pickupAddress, locale)}</p><span>↓</span><strong>{selected.toDate} {selected.toTime}</strong><p>{place(selected.dropoff, selected.returnAddress, locale)}</p><em>{dayCountLabel(locale, selected.days)} · {t.rate} ${selected.dailyRateUsd} {fleetUi[locale].perDay}</em></div><div><small>{t.contact}</small><strong>{selected.customerName}</strong><a href={`tel:${selected.phone}`}>{selected.phone}</a><a href={`mailto:${selected.email}`}>{selected.email}</a><p>{t.age}: {selected.age} · {t.experience}: {selected.experience} {t.years}</p><p>{t.second}: {selected.secondDriver ? t.yes : t.no}</p><p>{t.payment}: {bookingUi[locale][selected.payment] || selected.payment}</p>{selected.flight && <p>{t.flight}: {selected.flight}</p>}</div></div>
        {selected.notes && <div className="admin-notes"><small>{t.notes}</small><p>{selected.notes}</p></div>}
        <div className="admin-status-row"><span>{x.quickStatus}</span><div>{statuses.map((status) => <button type="button" key={status} className={selected.status === status ? "active" : ""} disabled={pendingId === selected.id} onClick={() => { if (selected.status !== status) void updateStatus(selected.id, status); }}>{t[status]}</button>)}</div>{pendingId === selected.id && <small>{t.loading}</small>}</div>
        <div className="admin-contact-actions"><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`CarTime · ${selected.carName} · ${selected.fromDate}–${selected.toDate} · #${selected.id.slice(0, 8).toUpperCase()}`)}`}><MessageCircle size={17} />{t.send}</a><a href={`mailto:${selected.email}?subject=${encodeURIComponent(`CarTime · ${selected.carName} · ${selected.id.slice(0, 8)}`)}`}><Mail size={17} />{t.email}</a><button type="button" onClick={() => void copySummary(selected)}><Clipboard size={17} />{x.copy}</button><a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={17} />{x.openCalendar}</a><button type="button" onClick={() => downloadCalendar(selected)}><CalendarDays size={17} />{x.downloadCalendar}</button><button type="button" onClick={() => window.print()}><Printer size={17} />{x.print}</button></div>
      </> : <p className="admin-empty">{items.length ? t.emptySearch : t.empty}</p>}</section></div>
    </div>
  </main>;
}
