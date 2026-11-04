import type { Locale } from "./i18n";

export const guideSlugs = ["baku", "routes", "airport", "rental"] as const;
export type GuideSlug = (typeof guideSlugs)[number];

type GuideSection = { heading: string; paragraphs: string[]; points?: string[] };
export type Guide = {
  title: string;
  description: string;
  eyebrow: string;
  teaser: string;
  intro: string;
  sections: GuideSection[];
  checklistTitle: string;
  checklist: string[];
};

export const guideSources: Record<GuideSlug, { name: string; url: string }[]> = {
  baku: [
    { name: "Azerbaijan Tourism Board — Old City", url: "https://azerbaijan.travel/explore-bakus-old-city" },
    { name: "Azerbaijan Tourism Board — Baku sights", url: "https://azerbaijan.travel/best-historical-and-cultural-sights-in-baku" },
    { name: "Azerbaijan Tourism Board — visitor map", url: "https://azerbaijan.travel/storage/pages/9537/5f179346-0024-4d5a-83e9-4546f339b3af.pdf" },
  ],
  routes: [
    { name: "Azerbaijan Tourism Board — Gobustan", url: "https://azerbaijan.travel/discover-gobustans-ancient-rock-art" },
    { name: "Azerbaijan Tourism Board — Ateshgah and Yanardag", url: "https://azerbaijan.travel/sites-of-ancient-fire-leave-a-burning-legacy" },
    { name: "Azerbaijan Tourism Board — north-western route", url: "https://azerbaijan.travel/north-western-route" },
  ],
  airport: [
    { name: "Heydar Aliyev International Airport — getting to the airport", url: "https://www.airport.az/en/guidelines-for-passengers/1.1.1/" },
    { name: "Heydar Aliyev International Airport — FAQ", url: "https://airport.az/en/faq/" },
  ],
  rental: [],
};

export const guideUi = {
  ru: {
    nav: "Путеводитель",
    homeTitle: "Планируйте поездку по Баку и дальше",
    homeLead: "Короткие практические гиды: прогулки по городу, маршруты на автомобиле, прилёт в GYD и выбор срока аренды.",
    read: "Читать гид",
    allCars: "Все 55 автомобилей и тарифы",
    sources: "Источники и проверка фактов",
    sourcesLead: "Сведения о достопримечательностях и аэропорте сверены с официальными ресурсами. Уточняйте часы работы, дороги и условия посещения перед поездкой.",
    back: "На главную",
    next: "Другие полезные разделы",
    carCta: "Сравнить автомобили",
    fleetTitle: "Каталог автомобилей в Баку",
    fleetDescription: "Все 55 моделей и опубликованные ставки за день в USD для шести сроков аренды. Выберите класс и сравните тарифы перед поездкой.",
    fleetIntro: "Здесь собраны модели, годы выпуска и дневные тарифы каталога CarTime. Указана ставка за один день, а не итоговая стоимость бронирования. Наличие, условия и окончательная цена пока не проверяются сайтом.",
    fleetDuration: ["2–3 дня", "4–7 дней", "8–14 дней", "15–21 день", "22–31 день", "32+ дня"],
    perDay: "USD/день",
    fleetNoteTitle: "Как читать таблицу",
    fleetNote: "Найдите нужную модель и срок аренды. Ставка в соответствующей колонке относится к одному дню. Даты, наличие машины, место выдачи и дополнительные условия необходимо подтвердить до бронирования.",
    updated: "Снимок тарифов: 4 ноября 2026",
  },
  az: {
    nav: "Səyahət bələdçisi",
    homeTitle: "Bakı və ölkə üzrə səfərinizi planlaşdırın",
    homeLead: "Şəhər gəzintisi, avtomobil marşrutları, GYD-yə gəliş və icarə müddəti barədə praktik bələdçilər.",
    read: "Bələdçini oxuyun",
    allCars: "55 avtomobil və bütün tariflər",
    sources: "Mənbələr və faktların yoxlanması",
    sourcesLead: "Görməli yerlər və hava limanı barədə məlumat rəsmi mənbələrlə yoxlanılıb. Səfərdən əvvəl iş saatlarını, yolları və ziyarət şərtlərini dəqiqləşdirin.",
    back: "Əsas səhifəyə",
    next: "Digər faydalı bölmələr",
    carCta: "Avtomobilləri müqayisə edin",
    fleetTitle: "Bakıda avtomobil kataloqu",
    fleetDescription: "55 modelin hamısı və altı icarə müddəti üçün USD ilə gündəlik tariflər. Səfərdən əvvəl sinifləri və qiymətləri müqayisə edin.",
    fleetIntro: "Burada CarTime kataloqundakı model, buraxılış illəri və gündəlik tariflər toplanıb. Göstərilən məbləğ yekun rezervasiya qiyməti deyil, bir günlük tarifdir. Mövcudluq, şərtlər və yekun qiymət saytda hələ təsdiqlənmir.",
    fleetDuration: ["2–3 gün", "4–7 gün", "8–14 gün", "15–21 gün", "22–31 gün", "32+ gün"],
    perDay: "USD/gün",
    fleetNoteTitle: "Cədvəli necə oxumalı",
    fleetNote: "Modeli və icarə müddətini seçin. Müvafiq sütundakı məbləğ bir günə aiddir. Tarixlər, avtomobilin mövcudluğu, təhvil yeri və əlavə şərtlər rezervasiyadan əvvəl təsdiqlənməlidir.",
    updated: "Tariflərin qeydə alındığı tarix: 4 noyabr 2026",
  },
  en: {
    nav: "Travel guides",
    homeTitle: "Plan Baku and the road beyond",
    homeLead: "Practical guides to city walks, road trips, arriving at GYD and choosing a rental period.",
    read: "Read guide",
    allCars: "All 55 cars and rates",
    sources: "Sources and fact checking",
    sourcesLead: "Place and airport facts were checked against official sources. Confirm opening hours, road conditions and visitor rules before you travel.",
    back: "Back to home",
    next: "Explore more guides",
    carCta: "Compare cars",
    fleetTitle: "Baku car rental catalogue",
    fleetDescription: "All 55 models and published USD daily rates across six rental lengths. Compare classes and rates before your trip.",
    fleetIntro: "This list shows the models, model years and daily rates in the CarTime catalogue. Each figure is a daily rate, not a booking total. Availability, terms and final prices are not yet checked on this site.",
    fleetDuration: ["2–3 days", "4–7 days", "8–14 days", "15–21 days", "22–31 days", "32+ days"],
    perDay: "USD/day",
    fleetNoteTitle: "How to read the table",
    fleetNote: "Find a model and rental length. The figure in that column is the rate for one day. Confirm dates, vehicle availability, collection point and additional terms before booking.",
    updated: "Rate snapshot: 4 November 2026",
  },
} as const;

export const guides: Record<Locale, Record<GuideSlug, Guide>> = {
  ru: {
    baku: {
      title: "Что посмотреть в Баку: город, море и архитектура",
      description: "Практический гид по Баку: Ичери-шехер, Приморский бульвар, современная архитектура и план прогулки на один или два дня.",
      eyebrow: "БАКУ / ГОРОДСКОЙ ГИД",
      teaser: "Старый город, Каспийский берег и современный Баку в одном понятном плане.",
      intro: "Баку удобно открывать по частям: исторический центр лучше изучать пешком, а автомобиль оставить для районов за пределами центра и поездок по Апшерону. Такой план помогает не превращать день в бесконечные переезды.",
      sections: [
        { heading: "Начните с Ичери-шехер", paragraphs: ["Старый город — историческое ядро Баку и объект Всемирного наследия ЮНЕСКО. Внутри крепостных стен находятся Девичья башня, дворец Ширваншахов, небольшие галереи, кафе и извилистые улицы. Для этой части города выделите отдельную прогулку: главная ценность здесь в деталях, которые трудно заметить из машины.", "Если хотите зайти в музеи, проверьте часы работы и билеты заранее. Не пытайтесь совместить все площадки в короткой остановке: даже одна неспешная прогулка даст больше впечатлений, чем спешка между точками."] },
        { heading: "Продолжите у Каспийского моря", paragraphs: ["После исторического центра можно пройти к Приморскому бульвару. Это удобный контраст к тесным улицам Ичери-шехер: открытая набережная, виды на бухту и современный городской ритм. В отдельный блок маршрута включите Музей ковра или другие площадки по интересам.", "Для панорамного вида на город туристическая карта Баку отмечает Нагорный парк и район Пламенных башен. Выберите время с хорошей видимостью и учитывайте, что ветер у моря может ощущаться сильнее, чем в закрытых кварталах."] },
        { heading: "Второй день: современная архитектура", paragraphs: ["Центр Гейдара Алиева и окружающее пространство дают совсем другое впечатление от Баку. Лучше планировать эту остановку отдельно от Старого города, чтобы осталось время на архитектуру, выставку при наличии интереса и спокойную прогулку.", "Если после города хочется продолжить поездку, посмотрите маршруты по Апшерону и в Гобустан. Для них автомобиль особенно полезен: точки находятся за пределами привычного пешеходного маршрута по центру."] },
      ],
      checklistTitle: "Удобный план на 1–2 дня",
      checklist: ["День 1: Ичери-шехер → прогулка у моря → панорама города.", "День 2: современная архитектура → выбранный музей или кафе → подготовка к поездке за город.", "Для Старого города выбирайте удобную обувь и планируйте пешую часть отдельно от автомобильной.", "Перед выездом проверьте часы работы площадок и место парковки."],
    },
    routes: {
      title: "Куда поехать из Баку на машине",
      description: "Идеи автомобильных маршрутов из Баку: Апшерон, Гобустан и северо-запад Азербайджана. Что выбрать для одного дня и для поездки с ночёвкой.",
      eyebrow: "АЗЕРБАЙДЖАН / МАРШРУТЫ",
      teaser: "Апшерон, Гобустан и направление на Габалу и Шеки — планы под разную длительность.",
      intro: "Автомобиль даёт свободу соединить несколько остановок за пределами Баку. Выбирайте маршрут по времени, погоде и интересам, а не по количеству отметок на карте. Для дальних направлений разумнее оставить запас и ночёвку.",
      sections: [
        { heading: "Апшерон: храм огня и Янардаг", paragraphs: ["Храм Атешгях и Янардаг — две связанные темы для поездки по Апшеронскому полуострову. В Атешгяхе знакомятся с историей храмового комплекса, а на Янардаге — с природным горением газа и музейной экспозицией. Туристический совет Азербайджана предлагает объединять эти места в одном маршруте.", "Это хороший вариант, если вы уже посмотрели центр Баку и хотите сменить городскую прогулку на выезд за пределы основных кварталов. Проверьте актуальные часы и билеты перед поездкой: они могут меняться."] },
        { heading: "Гобустан: наскальные рисунки", paragraphs: ["Гобустанский заповедник известен древними петроглифами и археологическими памятниками. Официальный туристический портал описывает более шести тысяч изображений. Основную часть дня стоит посвятить музею и ландшафту самого заповедника, а не воспринимать его как короткую остановку для фотографии.", "Грязевые вулканы находятся в том же регионе, но доступ к ним и состояние подъездов могут отличаться. Уточняйте дорогу и условия посещения отдельно; не считайте любой легковой автомобиль подходящим для грунтового участка."] },
        { heading: "Северо-запад: Шемаха, Исмаиллы, Габала, Шеки", paragraphs: ["Официальный северо-западный маршрут проходит через Шемаху, Исмаиллы, Габалу и Шеки. Он объединяет горные пейзажи, ремёсла, кухню и историческую архитектуру. Для такого направления лучше заложить несколько дней, особенно если хотите останавливаться по пути.", "Габала подойдёт тем, кто ищет природу, а Шеки — тем, кому интересны наследие и атмосфера Шёлкового пути. Перед дальней поездкой проверьте прогноз, дорожные условия, запас топлива и правила выбранного автомобиля для выезда в регионы."] },
      ],
      checklistTitle: "Перед выездом из города",
      checklist: ["Выберите один главный маршрут на день; оставьте запас на остановки и возвращение.", "Уточните дорогу к конкретной достопримечательности, а не только к ближайшему населённому пункту.", "Проверьте часы работы, погоду и связь на маршруте.", "Согласуйте условия использования арендованного автомобиля за пределами Баку."],
    },
    airport: {
      title: "Аэропорт Баку GYD: как спланировать получение автомобиля",
      description: "Практическая памятка для прилёта в аэропорт Баку GYD: расстояние до города, терминал, время прибытия и вопросы о получении арендованного авто.",
      eyebrow: "ПРИЛЁТ / GYD",
      teaser: "Что проверить после бронирования рейса и до встречи с автомобилем.",
      intro: "Международный аэропорт имени Гейдара Алиева (GYD) находится примерно в 20 км к востоку от центра Баку. Планируя аренду после прилёта, учитывайте не только время посадки, но и выход из терминала, багаж и точное место встречи.",
      sections: [
        { heading: "Уточните терминал и точку встречи", paragraphs: ["Аэропорт советует пассажирам заранее проверять терминал по данным рейса. Для получения автомобиля это особенно важно: «в аэропорту» может означать стойку, парковку или встречу за пределами терминала, в зависимости от компании.", "CarTime пока показывает выбор аэропорта в интерфейсе, но конкретная услуга выдачи, место встречи и стоимость не подтверждены. До реального бронирования эти детали должны появиться в условиях и подтверждении заявки."] },
        { heading: "Заложите время на прилёт", paragraphs: ["Паспортный контроль, выдача багажа и выход могут занять разное время. Указывайте номер рейса при согласовании встречи и уточняйте, что делать при задержке. Если прилетаете поздно, отдельно проверьте часы выдачи и способ связи с представителем.", "Перед отъездом из аэропорта полезно проверить адрес первого пункта маршрута и условия парковки у отеля. Аэропорт также указывает AeroExpress как альтернативу для связи с городом."] },
        { heading: "Возврат автомобиля перед вылетом", paragraphs: ["Согласуйте заранее место возврата, время осмотра и требуемый уровень топлива. Не рассчитывайте, что место получения и место возврата автоматически совпадают: это часть условий конкретной аренды.", "Официальные правила аэропорта различают выделенные зоны для операторов, работающих на его территории, и общие парковки для остальных автомобилей. Точную точку возврата должен назвать прокатчик."] },
      ],
      checklistTitle: "Пять вопросов до подтверждения аренды",
      checklist: ["Где именно встреча: терминал, выход, парковка или городская точка?", "Как связаться с представителем при задержке рейса?", "Есть ли доплата за аэропорт или позднее время?", "Где и когда возвращать автомобиль перед вылетом?", "Какие документы и условия нужно подтвердить заранее?"],
    },
    rental: {
      title: "Как выбрать автомобиль и срок аренды в Баку",
      description: "Как сравнить классы автомобилей и шесть ступеней дневных тарифов, выбрать срок аренды и подготовить вопросы перед бронированием машины в Баку.",
      eyebrow: "АРЕНДА / ПРАКТИЧЕСКИЙ ГИД",
      teaser: "Классы машин, шесть тарифных периодов и вопросы, которые стоит задать до заявки.",
      intro: "Начните с маршрута, числа пассажиров и багажа. Для коротких городских поездок и многодневной дороги нужны разные сценарии. Затем сравните дневную ставку для фактической длительности аренды — в каталоге CarTime она меняется по шести диапазонам.",
      sections: [
        { heading: "Подберите класс под поездку", paragraphs: ["Для одного-двух человек с небольшим багажом можно начать с компактных моделей. Если поездка включает чемоданы, детей или несколько пассажиров, сравните салон и багажник более просторных классов. Для поездки в регионы учитывайте длину маршрута и комфорт в дороге.", "Категория на сайте помогает сузить выбор, но не заменяет характеристики конкретного автомобиля. Перед оформлением уточняйте комплектацию, количество мест, коробку передач и другие важные для вас параметры."] },
        { heading: "Смотрите на ставку своего периода", paragraphs: ["В каталоге указаны дневные ставки в долларах США для 2–3, 4–7, 8–14, 15–21, 22–31 и 32+ дней. Ставка из одного диапазона не должна автоматически применяться к другому. Выберите реальные даты, затем сравните нужную колонку у нескольких моделей.", "Опубликованная ставка за день ещё не является итоговой суммой. Сайт пока не рассчитывает общую стоимость, не проверяет доступность и не принимает заявку. Финальные условия нужно подтвердить до оплаты."] },
        { heading: "Проверьте условия до решения", paragraphs: ["Спросите о залоге, страховании, франшизе, лимите пробега, топливе, дополнительном водителе и возможных ограничениях маршрута. Условия могут отличаться по модели и сроку; не стоит выводить их из одной дневной цены.", "Отдельно согласуйте время и место получения и возврата. Если прилетаете в GYD или выезжаете за пределы Баку, укажите это до подтверждения бронирования."] },
      ],
      checklistTitle: "Короткий список перед заявкой",
      checklist: ["Реальные даты и время получения и возврата.", "Пассажиры, багаж и нужный класс автомобиля.", "Дневной тариф для соответствующего диапазона.", "Итоговая стоимость, залог, страховка и ограничения пробега.", "Подтверждение наличия конкретной модели или допустимой замены."],
    },
  },
  az: {
    baku: {
      title: "Bakıda nə görməli: İçərişəhər, dənizkənarı və memarlıq",
      description: "Bakı bələdçisi: İçərişəhər, Qız qalası, Şirvanşahlar sarayı, Bulvar və bir-iki günlük gəzinti planı.",
      eyebrow: "BAKI / ŞƏHƏR BƏLƏDÇİSİ",
      teaser: "İçərişəhəri, Xəzər sahilini və müasir Bakını rahat marşrutda birləşdirin.",
      intro: "Bakını hissələrə bölərək kəşf etmək daha rahatdır. Tarixi mərkəzi piyada gəzin, avtomobili isə şəhərin digər hissələri və Abşeron səfərləri üçün planlaşdırın. Beləliklə, gününüz yalnız yolda keçməz.",
      sections: [
        { heading: "İçərişəhərdən başlayın", paragraphs: ["İçərişəhər Bakının tarixi mərkəzi və UNESCO Ümumdünya İrsi ərazisidir. Qala divarlarının içində Qız qalası, Şirvanşahlar sarayı, qalereyalar, kafelər və dar küçələr var. Bu hissəyə ayrıca piyada gəzinti ayırın.", "Muzeylərə daxil olmaq istəyirsinizsə, iş saatlarını və biletləri əvvəlcədən yoxlayın. Qısa dayanacaqla bütün məkanları görməyə çalışmaq əvəzinə bir neçə yerə vaxt ayırın."] },
        { heading: "Xəzər sahilinə keçin", paragraphs: ["Tarixi mərkəzdən sonra Bakı Bulvarı boyunca gəzin. Açıq sahil məkanı İçərişəhərin dar küçələrindən fərqli təəssürat yaradır. Marağınıza görə Xalça Muzeyini və yaxınlıqdakı digər məkanları əlavə edə bilərsiniz.", "Turizm xəritəsində Dağüstü park və Alov qüllələri ətrafı şəhər panoraması üçün göstərilir. Dənizkənarı hava küləkli ola bilər; gəzinti üçün hava proqnozuna baxın."] },
        { heading: "İkinci gün: müasir memarlıq", paragraphs: ["Heydər Əliyev Mərkəzi və ətraf məkan Bakının müasir memarlığını görmək üçün ayrıca dayanacaqdır. Buraya İçərişəhər gəzintisindən ayrıca vaxt ayırmaq daha rahatdır.", "Şəhərdən kənara çıxmaq istəyirsinizsə, Abşeron və Qobustan marşrutlarına baxın. Bu istiqamətlər üçün avtomobil şəhər mərkəzindəki piyada gəzintidən daha faydalıdır."] },
      ],
      checklistTitle: "1–2 günlük sadə plan",
      checklist: ["1-ci gün: İçərişəhər → Bulvar → şəhər panoraması.", "2-ci gün: müasir memarlıq → marağınıza uyğun muzey → şəhərdənkənar səfərə hazırlıq.", "İçərişəhər üçün rahat ayaqqabı seçin və piyada hissəni ayrıca planlaşdırın.", "Yola çıxmazdan əvvəl iş saatlarını və dayanacaq imkanlarını yoxlayın."],
    },
    routes: {
      title: "Bakıdan avtomobillə hara getmək olar",
      description: "Bakıdan Abşeron, Qobustan, Şamaxı, Qəbələ və Şəki istiqamətində avtomobil marşrutları və səfər planı.",
      eyebrow: "AZƏRBAYCAN / MARŞRUTLAR",
      teaser: "Abşeron, Qobustan və şimal-qərb istiqaməti: vaxtınıza uyğun yol seçin.",
      intro: "Avtomobil Bakıdan kənardakı məkanları bir səfərdə birləşdirməyə kömək edir. Marşrutu dayanacaqların sayına görə deyil, vaxtınıza, havaya və marağınıza görə seçin. Uzaq istiqamətlər üçün gecələmə planlaşdırın.",
      sections: [
        { heading: "Abşeron: Atəşgah və Yanardağ", paragraphs: ["Atəşgah məbədi və Yanardağ Abşeron yarımadasında birləşdirilə bilən iki məkandır. Birində tarixi məbəd kompleksi, digərində təbii qaz alovu və muzeylə tanış olmaq olar. Azərbaycan Turizm Bürosu bu yerləri eyni marşrutda təqdim edir.", "Bakının mərkəzini gəzdikdən sonra bu istiqamət şəhərdənkənar gün üçün uyğundur. İş saatlarını və bilet qaydalarını səfərdən əvvəl dəqiqləşdirin."] },
        { heading: "Qobustan: qayaüstü təsvirlər", paragraphs: ["Qobustan qoruğu qədim qayaüstü təsvirləri və arxeoloji abidələri ilə tanınır. Rəsmi turizm portalı burada altı mindən çox petroqlif olduğunu bildirir. Muzeyə və qoruq ərazisinə kifayət qədər vaxt ayırın.", "Palçıq vulkanları da həmin bölgədədir, lakin giriş yollarının vəziyyəti fərqli ola bilər. Torpaq yola çıxmazdan əvvəl marşrutu və seçdiyiniz avtomobilin uyğunluğunu ayrıca yoxlayın."] },
        { heading: "Şimal-qərb: Şamaxı, İsmayıllı, Qəbələ, Şəki", paragraphs: ["Rəsmi şimal-qərb marşrutu Şamaxı, İsmayıllı, Qəbələ və Şəkidən keçir. Dağ mənzərələri, sənətkarlıq, mətbəx və tarixi memarlıq burada bir araya gəlir. Dayanacaqlardan zövq almaq üçün bir neçə gün ayırmaq daha məntiqlidir.", "Qəbələ təbiət, Şəki isə İpək yolu irsi ilə maraqlananlar üçün seçimdir. Uzaq səfərdən əvvəl hava, yol vəziyyəti, yanacaq və icarə avtomobilinin regionlara çıxış şərtlərini dəqiqləşdirin."] },
      ],
      checklistTitle: "Şəhərdən çıxmazdan əvvəl",
      checklist: ["Bir günə bir əsas istiqamət seçin və geri dönüş üçün vaxt saxlayın.", "Yalnız yaşayış məntəqəsini deyil, konkret görməli yerə gedən yolu yoxlayın.", "İş saatlarına, havaya və əlaqə imkanlarına baxın.", "İcarə avtomobilinin Bakıdan kənarda istifadəsi şərtlərini təsdiqləyin."],
    },
    airport: {
      title: "Bakı GYD hava limanında avtomobil götürməyi necə planlaşdırmalı",
      description: "GYD hava limanına gəliş üçün yaddaş siyahısı: şəhərə məsafə, terminal, görüş yeri və icarə avtomobilinin qaytarılması.",
      eyebrow: "GƏLİŞ / GYD",
      teaser: "Uçuşdan avtomobillə yola düşənədək vacib detalları əvvəlcədən yoxlayın.",
      intro: "Heydər Əliyev Beynəlxalq Aeroportu (GYD) Bakının mərkəzindən təxminən 20 km şərqdə yerləşir. Gəlişdən sonra avtomobil götürməyi planlaşdırarkən yalnız eniş vaxtını deyil, baqajı və dəqiq görüş yerini də nəzərə alın.",
      sections: [
        { heading: "Terminalı və görüş yerini dəqiqləşdirin", paragraphs: ["Aeroport sərnişinlərə terminal məlumatını uçuş sənədlərində əvvəlcədən yoxlamağı tövsiyə edir. Avtomobil icarəsində «hava limanında» ifadəsi şirkətdən asılı olaraq terminal, dayanacaq və ya başqa görüş nöqtəsi ola bilər.", "CarTime interfeysində hava limanı seçimi var, lakin təhvil xidmətinin mövcudluğu, görüş yeri və qiyməti hələ təsdiqlənməyib. Bu məlumat real rezervasiyadan əvvəl şərtlərdə göstərilməlidir."] },
        { heading: "Gəliş üçün vaxt ehtiyatı saxlayın", paragraphs: ["Pasport nəzarəti, baqajın alınması və çıxış müxtəlif vaxt apara bilər. Görüşü razılaşdırarkən uçuş nömrəsini bildirin və gecikmə halında əlaqə qaydasını soruşun. Gec saatda gəlirsinizsə, təhvil saatlarını ayrıca yoxlayın.", "Yola çıxmazdan əvvəl ilk ünvanı və otel yaxınlığında dayanacaq imkanını yoxlayın. Aeroport şəhərlə əlaqə üçün AeroExpress avtobusunu da qeyd edir."] },
        { heading: "Uçuşdan əvvəl qaytarma", paragraphs: ["Qaytarma yerini, baxış üçün lazım olan vaxtı və yanacaq şərtini əvvəlcədən razılaşdırın. Təhvil və qaytarma nöqtələrinin eyni olacağını avtomatik qəbul etməyin.", "Aeroportun qaydalarında hava limanında fəaliyyət göstərən şirkətlər üçün ayrılmış yerlər və digər avtomobillər üçün ümumi dayanacaqlar fərqləndirilir. Dəqiq qaytarma nöqtəsini icarə şirkəti təsdiqləməlidir."] },
      ],
      checklistTitle: "Təsdiqdən əvvəl beş sual",
      checklist: ["Görüş dəqiq haradadır: terminal, çıxış, dayanacaq, yoxsa şəhərdə?", "Uçuş gecikərsə, kiminlə əlaqə saxlamalıyam?", "Hava limanı və ya gec saat üçün əlavə ödəniş varmı?", "Avtomobili harada və nə vaxt qaytarmalıyam?", "Hansı sənədlər və şərtlər əvvəlcədən təsdiqlənməlidir?"],
    },
    rental: {
      title: "Bakıda avtomobil və icarə müddətini necə seçməli",
      description: "Avtomobil siniflərini, altı gündəlik tarif dövrünü və rezervasiyadan əvvəl yoxlanmalı şərtləri müqayisə edin.",
      eyebrow: "İCARƏ / PRAKTİK BƏLƏDÇİ",
      teaser: "Avtomobil sinifləri, altı tarif dövrü və rezervasiyadan əvvəl suallar.",
      intro: "Əvvəlcə marşrutu, sərnişin sayını və baqajı müəyyən edin. Qısa şəhər səfəri ilə bir neçə günlük rayon yolu fərqli seçim tələb edə bilər. Sonra icarə müddətinizə uyğun gündəlik tarifi müqayisə edin.",
      sections: [
        { heading: "Səfərə uyğun sinif seçin", paragraphs: ["Bir-iki nəfər və az baqaj üçün kompakt modellərdən başlamaq olar. Çamadanlar, uşaqlar və daha çox sərnişin varsa, daha geniş siniflərin salonunu və baqaj yerini müqayisə edin. Uzun yolda rahatlığı da nəzərə alın.", "Saytdakı kateqoriya seçimi daraldır, lakin konkret avtomobilin xüsusiyyətlərini əvəz etmir. Rezervasiyadan əvvəl komplektasiya, oturacaq sayı və sürətlər qutusunu dəqiqləşdirin."] },
        { heading: "Öz müddətinizin tarifinə baxın", paragraphs: ["Kataloqda 2–3, 4–7, 8–14, 15–21, 22–31 və 32+ gün üçün USD ilə gündəlik tariflər göstərilir. Bir dövrün qiymətini digərinə tətbiq etməyin. Real tarixlərinizi seçib uyğun sütunda bir neçə modeli müqayisə edin.", "Dərc olunan gündəlik tarif yekun məbləğ deyil. Sayt hələ ümumi qiyməti hesablamır, mövcudluğu yoxlamır və müraciət qəbul etmir. Yekun şərtləri ödənişdən əvvəl təsdiqləyin."] },
        { heading: "Şərtləri əvvəlcədən soruşun", paragraphs: ["Depozit, sığorta, franşiza, yürüş limiti, yanacaq, əlavə sürücü və marşrut məhdudiyyətləri barədə soruşun. Şərtlər modelə və müddətə görə fərqlənə bilər; onları təkcə gündəlik qiymətdən təxmin etməyin.", "Götürmə və qaytarma vaxtını və yerini ayrıca razılaşdırın. GYD-yə gəlirsinizsə və ya Bakıdan kənara çıxırsınızsa, bunu rezervasiya təsdiqindən əvvəl bildirin."] },
      ],
      checklistTitle: "Müraciətdən əvvəl qısa siyahı",
      checklist: ["Götürmə və qaytarma tarixləri və saatları.", "Sərnişin, baqaj və lazım olan avtomobil sinfi.", "Uyğun müddət üçün gündəlik tarif.", "Yekun qiymət, depozit, sığorta və yürüş limiti.", "Konkret modelin və ya mümkün əvəzin mövcudluğu."],
    },
  },
  en: {
    baku: {
      title: "What to see in Baku: Old City, seafront and architecture",
      description: "A practical Baku guide to Icherisheher, the Caspian promenade, modern architecture and a one or two day city plan.",
      eyebrow: "BAKU / CITY GUIDE",
      teaser: "Old City lanes, the Caspian waterfront and modern Baku in one manageable plan.",
      intro: "Baku is easier to enjoy in parts. Explore its historic core on foot, then use a car for places beyond the centre and trips across Absheron. This keeps the day focused on places rather than constant transfers.",
      sections: [
        { heading: "Start in Icherisheher", paragraphs: ["The Old City is Baku's historic heart and a UNESCO World Heritage Site. Inside the walls are the Maiden Tower, Shirvanshahs' Palace, galleries, cafés and winding lanes. Give this area its own walk: details are easier to appreciate on foot than through a car window.", "If you plan to enter museums, check current hours and tickets first. A relaxed visit to a few places is more rewarding than a rushed stop at every landmark."] },
        { heading: "Continue to the Caspian", paragraphs: ["After the historic core, head toward Baku Boulevard. The open waterfront provides a contrast to the Old City's narrow streets, with bay views and a different pace. Add the Carpet Museum or another nearby venue if it fits your interests.", "Azerbaijan's visitor map marks Highland Park and the Flame Towers area for city panoramas. Choose a clear day and remember that the seafront can feel windier than sheltered streets."] },
        { heading: "Day two: contemporary architecture", paragraphs: ["The Heydar Aliyev Centre and its surroundings show another side of Baku. Leave time for the architecture, a walk around the site and an exhibition if one interests you.", "For a longer journey, see the Absheron and Gobustan routes. A car is especially useful there, while the Old City itself works best as a walking stop."] },
      ],
      checklistTitle: "A simple 1–2 day plan",
      checklist: ["Day 1: Old City → seafront walk → city panorama.", "Day 2: contemporary architecture → a chosen museum or café → plan a trip beyond the city.", "Wear comfortable shoes and separate your Old City walk from the driving part.", "Check venue hours and parking before setting out."],
    },
    routes: {
      title: "Road trips from Baku: Absheron, Gobustan and beyond",
      description: "Plan a drive from Baku to Absheron, Gobustan or Azerbaijan's north-west. Compare day trips with a longer route through Gabala and Shaki.",
      eyebrow: "AZERBAIJAN / ROAD TRIPS",
      teaser: "Absheron, Gobustan and the road to Gabala and Shaki for different trip lengths.",
      intro: "A car lets you link places beyond Baku at your own pace. Choose a route for the time, weather and interests you have, rather than trying to collect the most map pins. Allow an overnight stop for longer journeys.",
      sections: [
        { heading: "Absheron: Ateshgah and Yanardag", paragraphs: ["The Ateshgah Fire Temple and Yanardag make a connected Absheron outing. One introduces the history of the temple complex; the other shows natural gas flames and an exhibition. Azerbaijan's tourism board presents the two sites together.", "This is a useful choice after exploring central Baku. Check current opening hours and ticket rules before leaving, as visitor arrangements can change."] },
        { heading: "Gobustan: ancient rock art", paragraphs: ["Gobustan State Reserve is known for prehistoric petroglyphs and archaeological remains. The official tourism portal describes more than 6,000 rock carvings. Make time for the reserve and museum rather than treating it as a quick photo stop.", "Mud volcanoes are also in the region, but approach roads and access can vary. Check the exact route and vehicle suitability before taking an ordinary rental car onto an unpaved track."] },
        { heading: "North-west: Shamakhi, Ismayilli, Gabala and Shaki", paragraphs: ["The official north-western route connects Shamakhi, Ismayilli, Gabala and Shaki. Mountain landscapes, crafts, food and historic architecture make it better suited to several days if you want to stop along the way.", "Gabala suits travellers drawn to nature, while Shaki is known for Silk Road heritage. Before a longer drive, check the forecast, roads, fuel stops and your rental agreement's rules for regional travel."] },
      ],
      checklistTitle: "Before you leave Baku",
      checklist: ["Choose one main direction for a day and leave time for the return.", "Check the road to the specific attraction, not only the nearest town.", "Verify opening hours, weather and mobile coverage.", "Confirm that your rental terms allow your planned route."],
    },
    airport: {
      title: "Baku Airport GYD: planning a rental car pick-up",
      description: "A practical GYD arrival guide: distance to central Baku, terminals, meeting points, flight delays and returning a rental car.",
      eyebrow: "ARRIVAL / GYD",
      teaser: "The details to confirm between landing and driving away.",
      intro: "Heydar Aliyev International Airport (GYD) is about 20 km east of central Baku. If you plan to collect a rental car after landing, account for the terminal exit, bags and the exact meeting point as well as your scheduled arrival time.",
      sections: [
        { heading: "Confirm the terminal and meeting point", paragraphs: ["The airport advises passengers to check their terminal against their flight details in advance. For a rental, “at the airport” might mean a desk, a parking area or another meeting point, depending on the operator.", "CarTime currently lets visitors select the airport in its interface, but the actual collection service, meeting point and fee are not confirmed. These details need to be clear before a real booking is accepted."] },
        { heading: "Allow time after landing", paragraphs: ["Passport control, baggage collection and the walk out can take different amounts of time. Share your flight number when arranging a meeting and ask what happens if your flight is delayed. For a late arrival, check collection hours and a contact method.", "Before driving away, save your first destination and check parking at your accommodation. The airport also lists AeroExpress as a city connection."] },
        { heading: "Return before departure", paragraphs: ["Agree on the return point, inspection time and fuel requirement in advance. Do not assume that collection and return automatically happen at the same spot.", "Airport guidance distinguishes designated areas for operators based at the airport from general parking for other vehicles. Your rental operator must confirm the exact return location."] },
      ],
      checklistTitle: "Five questions before confirming",
      checklist: ["Where exactly is the meeting point: terminal, exit, parking or city office?", "Who do I contact if my flight is delayed?", "Is there an airport or late-hour charge?", "Where and when should I return the car before flying?", "Which documents and rental terms must be confirmed first?"],
    },
    rental: {
      title: "Choosing a car and rental period in Baku",
      description: "Compare car classes and six USD daily rate tiers, then prepare the right questions before booking a vehicle in Baku.",
      eyebrow: "RENTAL / PRACTICAL GUIDE",
      teaser: "Vehicle classes, six pricing periods and the questions to ask before a request.",
      intro: "Start with your route, passenger count and luggage. A short city stay and a multi-day regional journey call for different choices. Then compare the daily rate for the actual length of your rental: CarTime shows six pricing periods.",
      sections: [
        { heading: "Match the class to the journey", paragraphs: ["For one or two people with light luggage, begin with compact models. If you have suitcases, children or more passengers, compare roomier classes and boot space. Consider comfort on longer drives.", "A category narrows the catalogue but does not prove the features of an individual car. Confirm the exact specification, seating and transmission before making a booking."] },
        { heading: "Use the rate for your dates", paragraphs: ["The catalogue shows USD daily rates for 2–3, 4–7, 8–14, 15–21, 22–31 and 32+ days. A rate from one period should not be assumed for another. Work out your real dates, then compare the relevant column for a few models.", "The published daily rate is not a final total. The site does not yet calculate a booking price, check availability or accept requests. Confirm full terms before paying."] },
        { heading: "Check the terms first", paragraphs: ["Ask about deposit, insurance, excess, mileage, fuel, additional drivers and route restrictions. Terms may differ by model and period; the daily figure alone cannot tell you all of them.", "Agree on collection and return time and location. If you arrive at GYD or plan to leave Baku, mention that before a booking is confirmed."] },
      ],
      checklistTitle: "Before sending a request",
      checklist: ["Real collection and return dates and times.", "Passenger count, luggage and preferred vehicle class.", "The daily rate for the correct duration tier.", "Final total, deposit, insurance and mileage conditions.", "Availability of the specific model or an acceptable substitute."],
    },
  },
};
