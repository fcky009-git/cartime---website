"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Download, Mail, MessageCircle, RefreshCw, Search } from "lucide-react";
import type { bookingRequests } from "@/db/schema";
import type { Locale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";

type Booking = typeof bookingRequests.$inferSelect;
type Status = "new" | "contacted" | "confirmed" | "cancelled";
const statuses: Status[] = ["new", "contacted", "confirmed", "cancelled"];
const labels = {
  ru: { title: "Заявки CarTime", subtitle: "Новые запросы на аренду и история ответов", all: "Все", new: "Новые", contacted: "В работе", confirmed: "Подтверждены", cancelled: "Отменены", search: "Имя, телефон, модель или номер заявки", refresh: "Обновить", export: "Скачать CSV", empty: "Заявок пока нет", emptySearch: "По этому запросу ничего не найдено", details: "Детали заявки", contact: "Контакт", route: "Маршрут", driver: "Водитель", payment: "Оплата", notes: "Примечание", flight: "Рейс", second: "Второй водитель", yes: "Да", no: "Нет", status: "Статус", saved: "Сохранено", fail: "Не удалось обновить заявки. Попробуйте ещё раз.", created: "Создана", days: "дней", estimate: "Предварительно", rate: "Тариф", send: "Написать в WhatsApp", email: "Написать на почту", site: "На сайт", loading: "Сохраняем…", address: "Адрес", age: "Возраст", experience: "Стаж", years: "лет", visible: "Показано" },
  az: { title: "CarTime sorğuları", subtitle: "Yeni icarə sorğuları və cavab tarixçəsi", all: "Hamısı", new: "Yeni", contacted: "İşdə", confirmed: "Təsdiqlənib", cancelled: "Ləğv edilib", search: "Ad, telefon, model və ya sorğu nömrəsi", refresh: "Yenilə", export: "CSV yüklə", empty: "Hələ sorğu yoxdur", emptySearch: "Nəticə tapılmadı", details: "Sorğu detalları", contact: "Əlaqə", route: "Marşrut", driver: "Sürücü", payment: "Ödəniş", notes: "Qeyd", flight: "Reys", second: "İkinci sürücü", yes: "Bəli", no: "Xeyr", status: "Status", saved: "Yadda saxlanıldı", fail: "Sorğuları yeniləmək olmadı. Yenidən cəhd edin.", created: "Yaradılıb", days: "gün", estimate: "İlkin məbləğ", rate: "Tarif", send: "WhatsApp-da yaz", email: "E-poçt yaz", site: "Sayta qayıt", loading: "Yadda saxlanılır…", address: "Ünvan", age: "Yaş", experience: "Təcrübə", years: "il", visible: "Göstərilir" },
  en: { title: "CarTime requests", subtitle: "New rental enquiries and response history", all: "All", new: "New", contacted: "In progress", confirmed: "Confirmed", cancelled: "Cancelled", search: "Name, phone, car or request ID", refresh: "Refresh", export: "Download CSV", empty: "No requests yet", emptySearch: "No matching requests", details: "Request details", contact: "Contact", route: "Trip", driver: "Driver", payment: "Payment", notes: "Notes", flight: "Flight", second: "Second driver", yes: "Yes", no: "No", status: "Status", saved: "Saved", fail: "Could not update requests. Please try again.", created: "Created", days: "days", estimate: "Estimate", rate: "Rate", send: "WhatsApp customer", email: "Email customer", site: "Back to site", loading: "Saving…", address: "Address", age: "Age", experience: "Experience", years: "years", visible: "Showing" },
  de: { title: "CarTime-Anfragen", subtitle: "Neue Mietanfragen und Antwortverlauf", all: "Alle", new: "Neu", contacted: "In Bearbeitung", confirmed: "Bestätigt", cancelled: "Abgesagt", search: "Name, Telefon, Auto oder Wunsch-ID", refresh: "Aktualisieren", export: "CSV herunterladen", empty: "Noch keine Anfragen", emptySearch: "Keine passenden Anfragen", details: "Details anfordern", contact: "Kontakt", route: "Reise", driver: "Fahrer", payment: "Zahlung", notes: "Notizen", flight: "Flug", second: "Zweiter Fahrer", yes: "Ja", no: "Nein", status: "Status", saved: "Gespeichert", fail: "Anfragen konnten nicht aktualisiert werden. Bitte versuchen Sie es erneut.", created: "Erstellt", days: "Tage", estimate: "Schätzung", rate: "Tagespreis", send: "WhatsApp-Kunde", email: "E-Mail an den Kunden", site: "Zurück zur Website", loading: "Speichern…", address: "Adresse", age: "Alter", experience: "Erfahrung", years: "Jahre", visible: "Wird angezeigt" },
  zh: { title: "CarTime 请求", subtitle: "新的租金查询和回复历史记录", all: "全部", new: "新", contacted: "进行中", confirmed: "已确认", cancelled: "已取消", search: "姓名、电话、汽车或请求 ID", refresh: "刷新", export: "下载 CSV", empty: "还没有请求", emptySearch: "没有匹配的请求", details: "索取详情", contact: "联系方式", route: "旅行", driver: "司机", payment: "付款", notes: "注释", flight: "航班", second: "第二位司机", yes: "是", no: "没有", status: "状态", saved: "已保存", fail: "无法更新请求。请再试一次。", created: "已创建", days: "天", estimate: "预估", rate: "日租金", send: "WhatsApp 客户", email: "给客户发邮件", site: "返回网站", loading: "正在保存...", address: "地址", age: "年龄", experience: "经验", years: "年", visible: "显示中" },
  ko: { title: "CarTime 요청", subtitle: "신규 임대 문의 및 응답 내역", all: "전체", new: "신규", contacted: "진행 중", confirmed: "확인됨", cancelled: "취소됨", search: "이름, 전화번호, 차량 또는 요청 ID", refresh: "새로고침", export: "CSV 다운로드", empty: "아직 요청이 없습니다", emptySearch: "일치하는 요청이 없습니다.", details: "세부정보 요청", contact: "연락처", route: "여행", driver: "운전사", payment: "결제", notes: "메모", flight: "비행", second: "두 번째 운전자", yes: "예", no: "아니요", status: "상태", saved: "저장됨", fail: "요청을 업데이트할 수 없습니다. 다시 시도해 주세요.", created: "생성됨", days: "일", estimate: "견적", rate: "비율", send: "WhatsApp 고객", email: "고객에게 이메일 보내기", site: "사이트로 돌아가기", loading: "저장 중…", address: "주소", age: "나이", experience: "경험", years: "년", visible: "표시 중" },
  fr: { title: "Demandes CarTime", subtitle: "Nouvelles demandes de location et historique des réponses", all: "Tous", new: "Nouveau", contacted: "En cours", confirmed: "Confirmé", cancelled: "Annulé", search: "Nom, téléphone, voiture ou identifiant de demande", refresh: "Actualiser", export: "Télécharger le CSV", empty: "Aucune demande pour l'instant", emptySearch: "Aucune demande correspondante", details: "Demander des détails", contact: "Contact", route: "Voyage", driver: "Conducteur", payment: "Paiement", notes: "Remarques", flight: "Vol", second: "Deuxième conducteur", yes: "Oui", no: "Non", status: "Statut", saved: "Enregistré", fail: "Impossible de mettre à jour les demandes. Veuillez réessayer.", created: "Créé", days: "jours", estimate: "Estimation", rate: "Tarif", send: "Client WhatsApp", email: "Envoyer un e-mail au client", site: "Retour au site", loading: "Sauvegarde…", address: "Adresse", age: "Âge", experience: "Expérience", years: "ans", visible: "Affichage" },
  ar: { title: "طلبات كار تايم", subtitle: "استفسارات الإيجار الجديدة وتاريخ الاستجابة", all: "الكل", new: "جديد", contacted: "قيد التقدم", confirmed: "تم التأكيد", cancelled: "ملغى", search: "الاسم أو الهاتف أو السيارة أو رقم الطلب", refresh: "تحديث", export: "تنزيل ملف CSV", empty: "لا يوجد طلبات بعد", emptySearch: "لا توجد طلبات مطابقة", details: "تفاصيل الطلب", contact: "إتصل", route: "رحلة", driver: "سائق", payment: "الدفع", notes: "ملاحظات", flight: "طيران", second: "السائق الثاني", yes: "نعم", no: "لا", status: "الحالة", saved: "تم الحفظ", fail: "تعذر تحديث الطلبات. يرجى المحاولة مرة أخرى.", created: "تم الإنشاء", days: "يوم", estimate: "تقدير", rate: "معدل", send: "عميل الواتساب", email: "ايميل العميل", site: "العودة للموقع", loading: "جاري الحفظ…", address: "العنوان", age: "العمر", experience: "خبرة", years: "سنة", visible: "جاري العرض" },
} as const;

const place = (value: string, address: string | null, locale: Locale) => {
  const names = { ru: { office: "Офис, Баку", airport: "Аэропорт GYD", delivery: "Доставка" }, az: { office: "Bakı ofisi", airport: "GYD hava limanı", delivery: "Çatdırılma" }, en: { office: "Baku office", airport: "GYD airport", delivery: "Delivery" }, de: { office: "Büro Baku", airport: "Flughafen GYD", delivery: "Lieferung" }, zh: { office: "巴库办公室", airport: "GYD 机场", delivery: "送车上门" }, ko: { office: "바쿠 사무실", airport: "GYD 공항", delivery: "차량 배송" }, fr: { office: "Bureau de Bakou", airport: "Aéroport GYD", delivery: "Livraison" }, ar: { office: "مكتب باكو", airport: "مطار GYD", delivery: "التوصيل" } };
  return `${names[locale][value as "office" | "airport" | "delivery"] || value}${address ? ` · ${address}` : ""}`;
};

export default function AdminBoard({ locale, accountEmail, initialItems, loadError }: { locale: Locale; accountEmail: string; initialItems: Booking[]; loadError: boolean }) {
  const t = labels[locale];
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id || null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError ? t.fail : "");
  const [notice, setNotice] = useState("");
  const dateLocale = localeInfo[locale].hreflang;
  const counts = Object.fromEntries(statuses.map((status) => [status, items.filter((item) => item.status === status).length])) as Record<Status, number>;
  const visible = useMemo(() => items.filter((item) => (filter === "all" || item.status === filter) && `${item.customerName} ${item.phone} ${item.email} ${item.carName} ${item.id}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [items, filter, query]);
  const selected = visible.find((item) => item.id === selectedId) || visible[0];

  async function refresh() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (!response.ok) throw new Error("reload failed");
      const data = await response.json() as { items: Booking[] };
      setItems(data.items);
    } catch { setError(t.fail); }
    finally { setBusy(false); }
  }

  async function updateStatus(id: string, status: Status) {
    setPendingId(id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
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
      const safe = /^[=+@\-]/.test(text) ? `'${text}` : text;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const csv = [columns.join(","), ...visible.map((item) => columns.map((key) => safeCell(item[key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `cartime-bookings-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="admin-shell">
    <header className="admin-top"><a className="admin-logo" href={`/${locale}`}><img src="/assets/logo-dark.png" alt="CarTime" /></a><span>{accountEmail}</span><a href={`/${locale}`}>{t.site} <ArrowRight size={16} /></a></header>
    <div className="admin-wrap">
      <div className="admin-heading"><div><p>CARTIME / OPERATIONS</p><h1>{t.title}</h1><span>{t.subtitle}</span></div><div className="admin-tools"><button type="button" onClick={refresh} disabled={busy}><RefreshCw size={16} className={busy ? "admin-spin" : ""} />{t.refresh}</button><button type="button" onClick={exportCsv} disabled={!visible.length}><Download size={16} />{t.export}</button></div></div>
      <div className="admin-stats"><button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><span>{t.all}</span><strong>{items.length}</strong></button>{statuses.map((status) => <button type="button" key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}><span>{t[status]}</span><strong>{counts[status]}</strong></button>)}</div>
      <div className="admin-search"><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /><small>{t.visible}: {visible.length}</small></div>
      {error && <p className="admin-alert" role="alert">{error}</p>}{notice && <p className="admin-notice" role="status"><Check size={15} />{notice}</p>}
      <div className="admin-layout"><section className="admin-list" aria-label={t.title}>{visible.length ? visible.map((item) => <button key={item.id} type="button" className={`admin-list-item${selected?.id === item.id ? " selected" : ""}`} onClick={() => setSelectedId(item.id)}><div><strong>{item.customerName}</strong><span className={`admin-status admin-status-${item.status}`}>{t[item.status as Status]}</span></div><p>{item.carName} · {item.carYear}</p><small>{item.fromDate} → {item.toDate} <b>${item.estimateUsd}</b></small><em>{new Date(item.createdAt).toLocaleString(dateLocale)}</em></button>) : <p className="admin-empty">{items.length ? t.emptySearch : t.empty}</p>}</section>
      <section className="admin-detail" aria-label={t.details}>{selected ? <><div className="admin-detail-head"><div><span>{t.created} · {new Date(selected.createdAt).toLocaleString(dateLocale)}</span><h2>{selected.carName}</h2><p>{selected.carYear} · #{selected.id.slice(0, 8).toUpperCase()}</p></div><strong>${selected.estimateUsd}</strong></div>
        <div className="admin-detail-grid"><div><small>{t.route}</small><strong>{selected.fromDate} {selected.fromTime}</strong><p>{place(selected.pickup, selected.pickupAddress, locale)}</p><span>↓</span><strong>{selected.toDate} {selected.toTime}</strong><p>{place(selected.dropoff, selected.returnAddress, locale)}</p><em>{selected.days} {t.days} · {t.rate} ${selected.dailyRateUsd}/day</em></div><div><small>{t.contact}</small><strong>{selected.customerName}</strong><a href={`tel:${selected.phone}`}>{selected.phone}</a><a href={`mailto:${selected.email}`}>{selected.email}</a><p>{t.age}: {selected.age} · {t.experience}: {selected.experience} {t.years}</p><p>{t.second}: {selected.secondDriver ? t.yes : t.no}</p><p>{t.payment}: {selected.payment}</p>{selected.flight && <p>{t.flight}: {selected.flight}</p>}</div></div>
        {selected.notes && <div className="admin-notes"><small>{t.notes}</small><p>{selected.notes}</p></div>}
        <div className="admin-status-row"><label>{t.status}<select value={selected.status} disabled={pendingId === selected.id} onChange={(event) => updateStatus(selected.id, event.target.value as Status)}>{statuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select></label>{pendingId === selected.id && <small>{t.loading}</small>}</div>
        <div className="admin-contact-actions"><a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Здравствуйте, ${selected.customerName}! Пишем по вашей заявке CarTime на ${selected.carName} (${selected.fromDate}–${selected.toDate}).`)}`}><MessageCircle size={17} />{t.send}</a><a href={`mailto:${selected.email}?subject=${encodeURIComponent(`CarTime · ${selected.carName} · ${selected.id.slice(0, 8)}`)}`}><Mail size={17} />{t.email}</a></div>
      </> : <p className="admin-empty">{items.length ? t.emptySearch : t.empty}</p>}</section></div>
    </div>
  </main>;
}
