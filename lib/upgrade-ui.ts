import type { Locale } from "./locales";

export type TripType = "city" | "road" | "business" | "group";

type UpgradeCopy = {
  finder: {
    title: string; lead: string; trip: string; trips: Record<TripType, string>; days: string; budget: string; anyBudget: string; upTo: string;
    total: string; details: string; book: string; empty: string; note: string;
  };
  shortlist: { save: string; unsave: string; compare: string; clear: string; title: string; remove: string; share: string; copied: string; lowest: string; close: string; book: string };
  search: { open: string; placeholder: string; empty: string; cars: string; pages: string; guides: string; rental: string; faq: string; close: string };
  calc: { title: string; days: string; total: string; share: string; copied: string };
};

export const upgradeUi: Record<Locale, UpgradeCopy> = {
  ru: {
    finder: { title: "Подберите машину под поездку", lead: "Выберите поездку и срок. Цены пересчитываются сразу по опубликованным тарифам.", trip: "Какая поездка", trips: { city: "По городу", road: "По Азербайджану", business: "Деловая", group: "Большая компания" }, days: "Срок аренды", budget: "Бюджет в день", anyBudget: "Любой", upTo: "до", total: "Предварительно за весь срок", details: "Подробнее", book: "Оставить заявку", empty: "В этом бюджете подходящих машин нет. Увеличьте бюджет или выберите другую поездку.", note: "Предварительный расчёт. Наличие и итоговую цену подтвердит менеджер." },
    shortlist: { save: "Добавить к сравнению", unsave: "Убрать из сравнения", compare: "Сравнить", clear: "Очистить", title: "Сравнение автомобилей", remove: "Убрать", share: "Скопировать ссылку", copied: "Ссылка скопирована", lowest: "самая низкая цена", close: "Закрыть", book: "Оставить заявку" },
    search: { open: "Поиск по сайту", placeholder: "Модель, условия, маршрут или вопрос", empty: "Ничего не найдено. Попробуйте другое слово.", cars: "Автомобили", pages: "Разделы", guides: "Гиды", rental: "Условия и услуги", faq: "Вопросы", close: "Закрыть поиск" },
    calc: { title: "Посчитайте стоимость", days: "Срок", total: "Предварительно", share: "Поделиться", copied: "Ссылка скопирована" },
  },
  az: {
    finder: { title: "Səfərinizə uyğun avtomobil seçin", lead: "Səfəri və müddəti seçin. Qiymətlər dərc olunmuş tariflərlə dərhal hesablanır.", trip: "Hansı səfər", trips: { city: "Şəhərdə", road: "Azərbaycan üzrə", business: "İşgüzar", group: "Böyük qrup" }, days: "İcarə müddəti", budget: "Günlük büdcə", anyBudget: "İstənilən", upTo: "maks.", total: "Bütün müddət üçün ilkin məbləğ", details: "Ətraflı", book: "Sorğu göndər", empty: "Bu büdcəyə uyğun avtomobil yoxdur. Büdcəni artırın və ya başqa səfər seçin.", note: "İlkin hesablamadır. Mövcudluğu və yekun qiyməti menecer təsdiqləyəcək." },
    shortlist: { save: "Müqayisəyə əlavə et", unsave: "Müqayisədən çıxar", compare: "Müqayisə et", clear: "Təmizlə", title: "Avtomobillərin müqayisəsi", remove: "Çıxar", share: "Linki kopyala", copied: "Link kopyalandı", lowest: "ən aşağı qiymət", close: "Bağla", book: "Sorğu göndər" },
    search: { open: "Saytda axtarış", placeholder: "Model, şərtlər, marşrut və ya sual", empty: "Heç nə tapılmadı. Başqa söz yoxlayın.", cars: "Avtomobillər", pages: "Bölmələr", guides: "Bələdçilər", rental: "Şərtlər və xidmətlər", faq: "Suallar", close: "Axtarışı bağla" },
    calc: { title: "Qiyməti hesablayın", days: "Müddət", total: "İlkin məbləğ", share: "Paylaş", copied: "Link kopyalandı" },
  },
  en: {
    finder: { title: "Find a car for your trip", lead: "Choose your trip and rental length. Prices update straight away from the published rates.", trip: "Your trip", trips: { city: "Around the city", road: "Across Azerbaijan", business: "Business", group: "Large group" }, days: "Rental length", budget: "Daily budget", anyBudget: "Any", upTo: "up to", total: "Estimate for the full rental", details: "View details", book: "Send a request", empty: "No matching cars in this budget. Raise the budget or choose another trip.", note: "This is an estimate. A manager confirms availability and the final price." },
    shortlist: { save: "Add to comparison", unsave: "Remove from comparison", compare: "Compare", clear: "Clear", title: "Compare cars", remove: "Remove", share: "Copy link", copied: "Link copied", lowest: "lowest price", close: "Close", book: "Send a request" },
    search: { open: "Search the site", placeholder: "Model, terms, route or question", empty: "No results. Try a different word.", cars: "Cars", pages: "Sections", guides: "Guides", rental: "Terms and services", faq: "Questions", close: "Close search" },
    calc: { title: "Work out the price", days: "Length", total: "Estimate", share: "Share", copied: "Link copied" },
  },
  de: {
    finder: { title: "Finden Sie das passende Auto", lead: "Wählen Sie Reise und Mietdauer. Die Preise werden sofort anhand der veröffentlichten Tarife berechnet.", trip: "Ihre Reise", trips: { city: "In der Stadt", road: "Durch Aserbaidschan", business: "Geschäftsreise", group: "Große Gruppe" }, days: "Mietdauer", budget: "Tagesbudget", anyBudget: "Beliebig", upTo: "bis", total: "Schätzung für die gesamte Miete", details: "Details ansehen", book: "Anfrage senden", empty: "Keine passenden Autos in diesem Budget. Erhöhen Sie das Budget oder wählen Sie eine andere Reise.", note: "Dies ist eine Schätzung. Verfügbarkeit und Endpreis bestätigt ein Manager." },
    shortlist: { save: "Zum Vergleich hinzufügen", unsave: "Aus dem Vergleich entfernen", compare: "Vergleichen", clear: "Leeren", title: "Autos vergleichen", remove: "Entfernen", share: "Link kopieren", copied: "Link kopiert", lowest: "niedrigster Preis", close: "Schließen", book: "Anfrage senden" },
    search: { open: "Website durchsuchen", placeholder: "Modell, Bedingungen, Route oder Frage", empty: "Keine Treffer. Versuchen Sie ein anderes Wort.", cars: "Autos", pages: "Bereiche", guides: "Reiseführer", rental: "Bedingungen und Leistungen", faq: "Fragen", close: "Suche schließen" },
    calc: { title: "Preis berechnen", days: "Dauer", total: "Schätzung", share: "Teilen", copied: "Link kopiert" },
  },
  zh: {
    finder: { title: "按行程选车", lead: "选择行程和租期，价格会按公布的费率立即更新。", trip: "您的行程", trips: { city: "市内出行", road: "阿塞拜疆全境", business: "商务出行", group: "多人出行" }, days: "租期", budget: "每日预算", anyBudget: "不限", upTo: "不超过", total: "整个租期的预估费用", details: "查看详情", book: "发送请求", empty: "此预算内没有合适的车辆。请提高预算或选择其他行程。", note: "此为预估费用，车辆情况和最终价格由经理确认。" },
    shortlist: { save: "加入对比", unsave: "移出对比", compare: "对比", clear: "清空", title: "车辆对比", remove: "移除", share: "复制链接", copied: "链接已复制", lowest: "最低价", close: "关闭", book: "发送请求" },
    search: { open: "搜索网站", placeholder: "车型、条款、路线或问题", empty: "未找到结果，请换个词试试。", cars: "车辆", pages: "栏目", guides: "指南", rental: "条款和服务", faq: "问题", close: "关闭搜索" },
    calc: { title: "计算费用", days: "租期", total: "预估费用", share: "分享", copied: "链接已复制" },
  },
  ko: {
    finder: { title: "여행에 맞는 차량 찾기", lead: "여행과 대여 기간을 선택하세요. 공시 요금으로 가격이 바로 계산됩니다.", trip: "여행 유형", trips: { city: "시내 이동", road: "아제르바이잔 일주", business: "출장", group: "단체 여행" }, days: "대여 기간", budget: "일일 예산", anyBudget: "제한 없음", upTo: "최대", total: "전체 기간 예상 금액", details: "자세히 보기", book: "요청 보내기", empty: "이 예산에 맞는 차량이 없습니다. 예산을 늘리거나 다른 여행을 선택하세요.", note: "예상 금액입니다. 이용 가능 여부와 최종 가격은 매니저가 확인합니다." },
    shortlist: { save: "비교에 추가", unsave: "비교에서 제거", compare: "비교하기", clear: "비우기", title: "차량 비교", remove: "제거", share: "링크 복사", copied: "링크가 복사되었습니다", lowest: "최저가", close: "닫기", book: "요청 보내기" },
    search: { open: "사이트 검색", placeholder: "모델, 조건, 경로 또는 질문", empty: "결과가 없습니다. 다른 단어로 검색해 보세요.", cars: "차량", pages: "메뉴", guides: "가이드", rental: "조건 및 서비스", faq: "질문", close: "검색 닫기" },
    calc: { title: "가격 계산", days: "기간", total: "예상 금액", share: "공유", copied: "링크가 복사되었습니다" },
  },
  fr: {
    finder: { title: "Trouvez la voiture pour votre voyage", lead: "Choisissez le voyage et la durée. Les prix se mettent à jour aussitôt selon les tarifs publiés.", trip: "Votre voyage", trips: { city: "En ville", road: "À travers l'Azerbaïdjan", business: "Affaires", group: "Grand groupe" }, days: "Durée de location", budget: "Budget par jour", anyBudget: "Sans limite", upTo: "jusqu'à", total: "Estimation pour toute la location", details: "Voir les détails", book: "Envoyer une demande", empty: "Aucune voiture adaptée à ce budget. Augmentez le budget ou choisissez un autre voyage.", note: "Il s'agit d'une estimation. Un responsable confirme la disponibilité et le prix final." },
    shortlist: { save: "Ajouter à la comparaison", unsave: "Retirer de la comparaison", compare: "Comparer", clear: "Vider", title: "Comparer les voitures", remove: "Retirer", share: "Copier le lien", copied: "Lien copié", lowest: "prix le plus bas", close: "Fermer", book: "Envoyer une demande" },
    search: { open: "Rechercher sur le site", placeholder: "Modèle, conditions, itinéraire ou question", empty: "Aucun résultat. Essayez un autre mot.", cars: "Voitures", pages: "Rubriques", guides: "Guides", rental: "Conditions et services", faq: "Questions", close: "Fermer la recherche" },
    calc: { title: "Calculer le prix", days: "Durée", total: "Estimation", share: "Partager", copied: "Lien copié" },
  },
  ar: {
    finder: { title: "اختر السيارة المناسبة لرحلتك", lead: "اختر الرحلة والمدة. تتحدث الأسعار فوراً وفق التعريفات المنشورة.", trip: "نوع الرحلة", trips: { city: "داخل المدينة", road: "في أنحاء أذربيجان", business: "رحلة عمل", group: "مجموعة كبيرة" }, days: "مدة الإيجار", budget: "الميزانية اليومية", anyBudget: "أي ميزانية", upTo: "حتى", total: "التقدير لكامل المدة", details: "عرض التفاصيل", book: "إرسال طلب", empty: "لا توجد سيارات مناسبة ضمن هذه الميزانية. زد الميزانية أو اختر رحلة أخرى.", note: "هذا تقدير. يؤكد المدير التوفر والسعر النهائي." },
    shortlist: { save: "إضافة إلى المقارنة", unsave: "إزالة من المقارنة", compare: "مقارنة", clear: "مسح", title: "مقارنة السيارات", remove: "إزالة", share: "نسخ الرابط", copied: "تم نسخ الرابط", lowest: "أقل سعر", close: "إغلاق", book: "إرسال طلب" },
    search: { open: "البحث في الموقع", placeholder: "الطراز أو الشروط أو المسار أو سؤال", empty: "لا توجد نتائج. جرب كلمة أخرى.", cars: "السيارات", pages: "الأقسام", guides: "الأدلة", rental: "الشروط والخدمات", faq: "الأسئلة", close: "إغلاق البحث" },
    calc: { title: "احسب السعر", days: "المدة", total: "التقدير", share: "مشاركة", copied: "تم نسخ الرابط" },
  },
};
