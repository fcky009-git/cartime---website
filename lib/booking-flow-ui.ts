import type { Locale } from "./locales";

type BookingFlowText = {
  stepRoute: string; stepCar: string; stepDetails: string;
  quick: string; tierNudge: string; extend: string;
  sort: string; sortCheap: string; sortDear: string; sortNew: string; included: string;
  sectionDriver: string; sectionContact: string; sectionTrip: string;
  licenceCountry: string; licenceHint: string;
  channelLabel: string; telegram: string; call: string; emailChannel: string;
  passengers: string; childSeat: string; childDetails: string; childRequired: string; secondDriverName: string;
  tripPlan: string; tripPlanHint: string; optional: string;
  reviewTitle: string; change: string; cardHint: string; cashHint: string;
  whatNext: string; next1: string; next2: string; next3: string; newRequest: string;
};

/** Wording of the booking steps. The rest of the form's text lives in `lib/booking.ts`. */
export const bookingFlowUi: Record<Locale, BookingFlowText> = {
  ru: {
    stepRoute: "Маршрут", stepCar: "Автомобиль", stepDetails: "Ваши данные",
    quick: "Быстрый выбор", tierNudge: "Ещё {n}, и тариф снизится до {rate} в день", extend: "Продлить",
    sort: "Порядок", sortCheap: "Сначала дешевле", sortDear: "Сначала дороже", sortNew: "Сначала новее", included: "Что входит в аренду",
    sectionDriver: "Водитель", sectionContact: "Как с вами связаться", sectionTrip: "О поездке",
    licenceCountry: "Страна выдачи прав", licenceHint: "Например, Азербайджан",
    channelLabel: "Где удобнее получить ответ", telegram: "Telegram", call: "Звонок", emailChannel: "Почта",
    passengers: "Сколько человек поедет", childSeat: "Нужно детское кресло", childDetails: "Возраст и рост ребёнка", childRequired: "Укажите возраст и рост ребёнка.", secondDriverName: "Имя второго водителя",
    tripPlan: "Куда планируете ехать", tripPlanHint: "Например, Баку, Шахдаг, Габала", optional: "необязательно",
    reviewTitle: "Проверьте заявку", change: "Изменить",
    cardHint: "Visa и Mastercard. Номер карты здесь не нужен.", cashHint: "Валюту расчёта согласует менеджер.",
    whatNext: "Что дальше", next1: "Менеджер свяжется с вами: {channel}.", next2: "Подтвердит наличие автомобиля, итоговую цену и залог.", next3: "Обновления появятся в вашем Travel Pass.", newRequest: "Новая заявка",
  },
  az: {
    stepRoute: "Marşrut", stepCar: "Avtomobil", stepDetails: "Məlumatlarınız",
    quick: "Sürətli seçim", tierNudge: "Daha {n} və tarif gündə {rate} olacaq", extend: "Uzat",
    sort: "Sıralama", sortCheap: "Əvvəlcə ucuz", sortDear: "Əvvəlcə bahalı", sortNew: "Əvvəlcə yeni", included: "İcarəyə nələr daxildir",
    sectionDriver: "Sürücü", sectionContact: "Sizinlə necə əlaqə saxlayaq", sectionTrip: "Səfər haqqında",
    licenceCountry: "Sürücülük vəsiqəsinin verildiyi ölkə", licenceHint: "Məsələn, Azərbaycan",
    channelLabel: "Cavabı harada almaq rahatdır", telegram: "Telegram", call: "Zəng", emailChannel: "E-poçt",
    passengers: "Neçə nəfər gedəcək", childSeat: "Uşaq oturacağı lazımdır", childDetails: "Uşağın yaşı və boyu", childRequired: "Uşağın yaşını və boyunu yazın.", secondDriverName: "İkinci sürücünün adı",
    tripPlan: "Hara getməyi planlaşdırırsınız", tripPlanHint: "Məsələn, Bakı, Şahdağ, Qəbələ", optional: "istəyə görə",
    reviewTitle: "Sorğunu yoxlayın", change: "Dəyiş",
    cardHint: "Visa və Mastercard. Kart nömrəsi burada lazım deyil.", cashHint: "Ödəniş valyutasını menecer razılaşdıracaq.",
    whatNext: "Bundan sonra", next1: "Menecer sizinlə əlaqə saxlayacaq: {channel}.", next2: "Avtomobilin mövcudluğunu, yekun qiyməti və depoziti təsdiqləyəcək.", next3: "Yeniliklər Travel Pass-da görünəcək.", newRequest: "Yeni sorğu",
  },
  en: {
    stepRoute: "Route", stepCar: "Car", stepDetails: "Your details",
    quick: "Quick pick", tierNudge: "{n} more and the rate drops to {rate} a day", extend: "Extend",
    sort: "Order", sortCheap: "Lowest price", sortDear: "Highest price", sortNew: "Newest", included: "What the rental includes",
    sectionDriver: "Driver", sectionContact: "How to reach you", sectionTrip: "About the trip",
    licenceCountry: "Country that issued your licence", licenceHint: "For example, Azerbaijan",
    channelLabel: "Where you prefer a reply", telegram: "Telegram", call: "Phone call", emailChannel: "Email",
    passengers: "How many people are travelling", childSeat: "I need a child seat", childDetails: "Child's age and height", childRequired: "Enter the child's age and height.", secondDriverName: "Second driver's name",
    tripPlan: "Where you plan to drive", tripPlanHint: "For example, Baku, Shahdag, Gabala", optional: "optional",
    reviewTitle: "Check your request", change: "Change",
    cardHint: "Visa and Mastercard. Your card number is not needed here.", cashHint: "The manager will agree the currency with you.",
    whatNext: "What happens next", next1: "A manager will contact you: {channel}.", next2: "They confirm the car, the final price and the deposit.", next3: "Updates appear in your Travel Pass.", newRequest: "New request",
  },
  de: {
    stepRoute: "Route", stepCar: "Auto", stepDetails: "Ihre Angaben",
    quick: "Schnellauswahl", tierNudge: "Noch {n}, und der Tarif sinkt auf {rate} pro Tag", extend: "Verlängern",
    sort: "Reihenfolge", sortCheap: "Günstigste zuerst", sortDear: "Teuerste zuerst", sortNew: "Neueste zuerst", included: "Was die Miete enthält",
    sectionDriver: "Fahrer", sectionContact: "So erreichen wir Sie", sectionTrip: "Zur Reise",
    licenceCountry: "Ausstellungsland des Führerscheins", licenceHint: "Zum Beispiel Deutschland",
    channelLabel: "Wo Sie die Antwort bevorzugen", telegram: "Telegram", call: "Anruf", emailChannel: "E-Mail",
    passengers: "Wie viele Personen reisen", childSeat: "Ich brauche einen Kindersitz", childDetails: "Alter und Größe des Kindes", childRequired: "Geben Sie Alter und Größe des Kindes an.", secondDriverName: "Name des zweiten Fahrers",
    tripPlan: "Wohin Sie fahren möchten", tripPlanHint: "Zum Beispiel Baku, Schahdag, Gabala", optional: "optional",
    reviewTitle: "Anfrage prüfen", change: "Ändern",
    cardHint: "Visa und Mastercard. Die Kartennummer wird hier nicht benötigt.", cashHint: "Die Währung vereinbart der Manager mit Ihnen.",
    whatNext: "So geht es weiter", next1: "Ein Manager meldet sich bei Ihnen: {channel}.", next2: "Er bestätigt das Auto, den Endpreis und die Kaution.", next3: "Neuigkeiten erscheinen in Ihrem Travel Pass.", newRequest: "Neue Anfrage",
  },
  zh: {
    stepRoute: "路线", stepCar: "车辆", stepDetails: "您的信息",
    quick: "快速选择", tierNudge: "再加 {n}，日租金降至 {rate}", extend: "延长",
    sort: "排序", sortCheap: "价格从低到高", sortDear: "价格从高到低", sortNew: "最新车型", included: "租金包含的内容",
    sectionDriver: "驾驶员", sectionContact: "如何联系您", sectionTrip: "行程信息",
    licenceCountry: "驾照签发国家", licenceHint: "例如：中国",
    channelLabel: "您希望通过哪里接收回复", telegram: "Telegram", call: "电话", emailChannel: "电子邮件",
    passengers: "出行人数", childSeat: "需要儿童座椅", childDetails: "儿童年龄和身高", childRequired: "请填写儿童的年龄和身高。", secondDriverName: "第二驾驶员姓名",
    tripPlan: "计划前往的地方", tripPlanHint: "例如：巴库、沙赫达格、加巴拉", optional: "选填",
    reviewTitle: "核对您的申请", change: "修改",
    cardHint: "支持 Visa 和 Mastercard。此处无需填写卡号。", cashHint: "结算货币由经理与您商定。",
    whatNext: "接下来", next1: "经理将与您联系：{channel}。", next2: "确认车辆、最终价格和押金。", next3: "更新内容将显示在您的 Travel Pass 中。", newRequest: "新申请",
  },
  ko: {
    stepRoute: "경로", stepCar: "차량", stepDetails: "고객 정보",
    quick: "빠른 선택", tierNudge: "{n} 더 이용하면 요금이 하루 {rate}(으)로 내려갑니다", extend: "연장",
    sort: "정렬", sortCheap: "낮은 가격순", sortDear: "높은 가격순", sortNew: "최신순", included: "렌트에 포함된 내용",
    sectionDriver: "운전자", sectionContact: "연락 방법", sectionTrip: "여행 정보",
    licenceCountry: "면허 발급 국가", licenceHint: "예: 대한민국",
    channelLabel: "답변을 받기 편한 곳", telegram: "Telegram", call: "전화", emailChannel: "이메일",
    passengers: "탑승 인원", childSeat: "어린이 카시트 필요", childDetails: "어린이 나이와 키", childRequired: "어린이의 나이와 키를 입력해 주세요.", secondDriverName: "두 번째 운전자 이름",
    tripPlan: "방문 예정지", tripPlanHint: "예: 바쿠, 샤흐다그, 가발라", optional: "선택",
    reviewTitle: "요청 내용 확인", change: "변경",
    cardHint: "Visa와 Mastercard. 여기서 카드 번호는 필요 없습니다.", cashHint: "결제 통화는 관리자와 협의합니다.",
    whatNext: "다음 단계", next1: "관리자가 연락드립니다: {channel}.", next2: "차량, 최종 가격, 보증금을 확인해 드립니다.", next3: "업데이트는 Travel Pass에 표시됩니다.", newRequest: "새 요청",
  },
  fr: {
    stepRoute: "Trajet", stepCar: "Voiture", stepDetails: "Vos informations",
    quick: "Choix rapide", tierNudge: "Encore {n} et le tarif passe à {rate} par jour", extend: "Prolonger",
    sort: "Ordre", sortCheap: "Prix croissant", sortDear: "Prix décroissant", sortNew: "Plus récentes", included: "Ce que comprend la location",
    sectionDriver: "Conducteur", sectionContact: "Comment vous joindre", sectionTrip: "À propos du voyage",
    licenceCountry: "Pays de délivrance du permis", licenceHint: "Par exemple, France",
    channelLabel: "Où préférez-vous recevoir la réponse", telegram: "Telegram", call: "Appel", emailChannel: "E-mail",
    passengers: "Nombre de voyageurs", childSeat: "J'ai besoin d'un siège enfant", childDetails: "Âge et taille de l'enfant", childRequired: "Indiquez l'âge et la taille de l'enfant.", secondDriverName: "Nom du second conducteur",
    tripPlan: "Où prévoyez-vous d'aller", tripPlanHint: "Par exemple, Bakou, Shahdag, Gabala", optional: "facultatif",
    reviewTitle: "Vérifiez votre demande", change: "Modifier",
    cardHint: "Visa et Mastercard. Le numéro de carte n'est pas demandé ici.", cashHint: "Le responsable conviendra de la devise avec vous.",
    whatNext: "La suite", next1: "Un responsable vous contactera : {channel}.", next2: "Il confirme la voiture, le prix final et la caution.", next3: "Les mises à jour apparaissent dans votre Travel Pass.", newRequest: "Nouvelle demande",
  },
  ar: {
    stepRoute: "المسار", stepCar: "السيارة", stepDetails: "بياناتك",
    quick: "اختيار سريع", tierNudge: "{n} إضافية وينخفض السعر إلى {rate} في اليوم", extend: "تمديد",
    sort: "الترتيب", sortCheap: "الأقل سعرًا", sortDear: "الأعلى سعرًا", sortNew: "الأحدث", included: "ما يشمله الإيجار",
    sectionDriver: "السائق", sectionContact: "كيف نتواصل معك", sectionTrip: "عن الرحلة",
    licenceCountry: "بلد إصدار الرخصة", licenceHint: "مثلًا، أذربيجان",
    channelLabel: "أين تفضّل تلقي الرد", telegram: "Telegram", call: "مكالمة", emailChannel: "البريد الإلكتروني",
    passengers: "عدد المسافرين", childSeat: "أحتاج إلى مقعد أطفال", childDetails: "عمر الطفل وطوله", childRequired: "أدخل عمر الطفل وطوله.", secondDriverName: "اسم السائق الثاني",
    tripPlan: "إلى أين تخطط للذهاب", tripPlanHint: "مثلًا، باكو، شاه داغ، قبالا", optional: "اختياري",
    reviewTitle: "راجع طلبك", change: "تغيير",
    cardHint: "Visa وMastercard. لا حاجة إلى رقم البطاقة هنا.", cashHint: "يتفق معك المدير على العملة.",
    whatNext: "ماذا بعد", next1: "سيتواصل معك المدير: {channel}.", next2: "يؤكد السيارة والسعر النهائي والتأمين.", next3: "تظهر التحديثات في Travel Pass الخاص بك.", newRequest: "طلب جديد",
  },
};
