import type { Locale } from "./i18n";

type Story = {
  kicker: string;
  title: string;
  lead: string;
  timelineTitle: string;
  timeline: { year: string; title: string; body: string }[];
  fleetTitle: string;
  fleetLead: string;
  fleetCards: { title: string; body: string }[];
  galleryTitle: string;
  galleryLead: string;
  gallery: { image: string; alt: string; title: string; body: string }[];
  journeyTitle: string;
  journeyLead: string;
  journey: { title: string; body: string }[];
  promiseTitle: string;
  promise: string[];
  editorialNote: string;
};

export const aboutStory: Record<Locale, Story> = {
  ru: {
    kicker: "ИСТОРИЯ CARTIME / С 2012 ГОДА",
    title: "Машина — начало вашей истории в Азербайджане",
    lead: "С 2012 года наша команда занимается арендой автомобилей. CarTime — новое имя знакомого нам дела и другой способ показать его онлайн: от выбора модели до маршрута, который хочется проехать.",
    timelineTitle: "История, которую мы продолжаем писать",
    timeline: [
      { year: "2012", title: "Начало пути", body: "В этом году началась работа команды в сфере аренды автомобилей. За прошедшие годы менялись машины, запросы и привычки путешественников — внимание к удобству поездки остаётся нашей отправной точкой." },
      { year: "9fleet", title: "Опыт той же команды", body: "CarTime и 9fleet — один бизнес. Мы сохраняем практический опыт работы с арендой и создаём отдельный бренд, в котором проще сравнивать автомобили и планировать путешествие." },
      { year: "2026", title: "CarTime в цифровом формате", body: "Здесь мы собираем каталог, тарифы по срокам, ответы на частые вопросы и маршруты. Сайт развивается поэтапно: заявку можно отправить сейчас, а наличие машины и окончательные условия подтверждает менеджер." },
      { year: "ДАЛЬШЕ", title: "Сервис вокруг маршрута", body: "Наш следующий ориентир — сделать путь от выбора до получения автомобиля ещё понятнее: меньше догадок о цене и условиях, больше полезной информации до поездки." },
    ],
    fleetTitle: "122 автомобиля в парке. 55 позиций в каталоге.",
    fleetLead: "Цифры описывают разные вещи. В действующем парке 122 автомобиля; часть машин одной модели и года повторяется. Поэтому на сайте опубликовано 55 разных позиций для выбора и сравнения. Каталог показывает тип автомобиля, а наличие конкретного экземпляра на ваши даты мы подтверждаем отдельно.",
    fleetCards: [
      { title: "Выбор по поездке", body: "Компактный автомобиль для города, седан для рабочих встреч, кроссовер для семьи или просторный автомобиль для компании — начните с задачи, а затем сравните модели." },
      { title: "Цена по сроку", body: "Дневная ставка зависит от длительности аренды. Для каждой позиции показаны тарифы по шести периодам, чтобы сравнение было честнее и понятнее." },
      { title: "Живое подтверждение", body: "Когда вы выбрали даты и модель, команда проверяет доступность, залог, место выдачи и итоговую стоимость. Заявка на сайте ещё не является оплаченной бронью." },
    ],
    galleryTitle: "Один город — разные начала путешествия",
    galleryLead: "Пролистайте три сценария поездки. Изображения передают настроение маршрутов; конкретный автомобиль при выдаче подтверждается отдельно.",
    gallery: [
      { image: "/assets/cartime-baku-sunrise.jpg", alt: "Баку и автомобиль у Каспийского моря", title: "Утро в Баку", body: "Начните с города: Ичери-шехер, бульвар, архитектура нефтяного Баку и современный центр. Для исторического ядра оставьте время на прогулку пешком." },
      { image: "/assets/cartime-airport-daylight.jpg", alt: "Автомобиль у аэропорта Баку", title: "Сразу после прилёта", body: "Укажите рейс и время прибытия, согласуйте точку встречи и начните маршрут в своём темпе. Выдача в аэропорту доступна по предварительной договорённости." },
      { image: "/assets/cartime-baku-night.jpg", alt: "Вечерний Баку и автомобиль", title: "Дальше за город", body: "Апшерон, Гобустан и северо-запад страны раскрывают другой Азербайджан. Для дальней поездки заранее проверьте дорогу, погоду и план остановок." },
    ],
    journeyTitle: "Как выглядит путь с CarTime",
    journeyLead: "Вместо красивых обещаний — понятная последовательность действий.",
    journey: [
      { title: "Расскажите о поездке", body: "Выберите даты, время, место получения и возврата, число пассажиров и желаемый класс. Если планируете выезд за пределы Баку, сообщите маршрут." },
      { title: "Сравните варианты", body: "Посмотрите модели, годы выпуска и дневные тарифы для своего срока. Если нужна помощь с выбором, свяжитесь с нами — обсудим багаж, детские кресла и особенности поездки." },
      { title: "Получите подтверждение", body: "После заявки менеджер сверит доступность конкретного автомобиля, залог, страхование, место выдачи и окончательную сумму. Только после этого договоримся о выдаче." },
      { title: "Отправляйтесь в путь", body: "Автомобиль можно получить в аэропорту или с доставкой по адресу. Во время аренды доступна поддержка 24/7, а пробег по Азербайджану не ограничен." },
    ],
    promiseTitle: "Что для нас важно",
    promise: ["Показывать тарифы по срокам аренды, а не одну цену без контекста.", "Помогать сравнить автомобиль под реальную поездку и количество багажа.", "Обсуждать залог, страховку, выдачу и итоговую стоимость до подтверждения.", "Давать полезные маршруты по Баку и Азербайджану, а не только каталог машин."],
    editorialNote: "История этой страницы описывает направление и принципы CarTime. Факты о годе начала работы и размере парка предоставлены командой CarTime; иллюстрации носят презентационный характер.",
  },
  az: {
    kicker: "CARTIME HEKAYƏSİ / 2012-Cİ İLDƏN",
    title: "Avtomobil Azərbaycandakı hekayənizin başlanğıcıdır",
    lead: "Komandamız 2012-ci ildən avtomobil icarəsi ilə məşğuldur. CarTime tanış işimizin yeni adı və onu onlayn təqdim etməyin yeni yoludur: model seçimindən getmək istədiyiniz marşruta qədər.",
    timelineTitle: "Davam edən hekayə",
    timeline: [
      { year: "2012", title: "Başlanğıc", body: "Komandamız avtomobil icarəsi sahəsində fəaliyyətə başladı. Avtomobillər və səyahət vərdişləri dəyişdi, rahat səfərə diqqət isə əsas prinsip olaraq qaldı." },
      { year: "9fleet", title: "Eyni komandanın təcrübəsi", body: "CarTime və 9fleet eyni biznesdir. İcarə sahəsində təcrübəmizi saxlayır, avtomobil müqayisəsi və səfər planını asanlaşdıran ayrıca brend yaradırıq." },
      { year: "2026", title: "CarTime onlayn", body: "Kataloq, müddətə görə tariflər, suallara cavablar və marşrutlar bir yerdədir. Sorğu göndərə bilərsiniz; mövcudluğu və yekun şərtləri menecer təsdiqləyir." },
      { year: "SONRA", title: "Marşrut ətrafında xidmət", body: "Seçimdən avtomobili təhvil almağa qədər yolu daha aydın etmək istəyirik: qiymət və şərtlər barədə daha az qeyri-müəyyənlik, səfərdən əvvəl daha çox faydalı məlumat." },
    ],
    fleetTitle: "Parkda 122 avtomobil. Kataloqda 55 mövqe.",
    fleetLead: "Bu rəqəmlər fərqli şeyləri göstərir. Parkda 122 avtomobil var; eyni model və ilin bir neçə avtomobili təkrarlanır. Buna görə saytda müqayisə üçün 55 fərqli mövqe göstərilir. Konkret avtomobilin tarixlərinizdə mövcudluğunu ayrıca təsdiqləyirik.",
    fleetCards: [
      { title: "Səfərə uyğun seçim", body: "Şəhər üçün kiçik avtomobil, iş görüşləri üçün sedan, ailə üçün krossover və ya geniş minivan: əvvəlcə səfərin ehtiyacını müəyyən edin." },
      { title: "Müddətə görə qiymət", body: "Gündəlik tarif icarə müddətindən asılıdır. Hər mövqe üçün altı müddət üzrə qiymət göstərilir." },
      { title: "Canlı təsdiq", body: "Tarix və modeli seçdikdən sonra komanda mövcudluğu, depoziti, təhvil yerini və yekun məbləği yoxlayır. Saytdakı sorğu ödənişli rezervasiya deyil." },
    ],
    galleryTitle: "Bir şəhər, fərqli səfər başlanğıcları",
    galleryLead: "Üç səyahət ssenarisini nəzərdən keçirin. Şəkillər marşrutların əhvalını göstərir; konkret avtomobil ayrıca təsdiqlənir.",
    gallery: [
      { image: "/assets/cartime-baku-sunrise.jpg", alt: "Xəzər sahilində Bakı və avtomobil", title: "Bakıda səhər", body: "İçərişəhər, Bulvar, neft dövrünün memarlığı və müasir mərkəz. Tarixi hissəni piyada kəşf etmək üçün vaxt ayırın." },
      { image: "/assets/cartime-airport-daylight.jpg", alt: "Bakı hava limanı yanında avtomobil", title: "Enişdən sonra", body: "Reys və gəliş vaxtını bildirin, görüş yerini razılaşdırın. Hava limanında təhvil əvvəlcədən razılaşdırılmaqla mümkündür." },
      { image: "/assets/cartime-baku-night.jpg", alt: "Axşam Bakısı və avtomobil", title: "Şəhərdən kənara", body: "Abşeron, Qobustan və şimal-qərb bölgəsi Azərbaycanın başqa tərəfini göstərir. Yol və hava şəraitini əvvəlcədən yoxlayın." },
    ],
    journeyTitle: "CarTime ilə səfər necə başlayır",
    journeyLead: "Seçimdən yola çıxmağa qədər aydın addımlar.",
    journey: [
      { title: "Səfəri təsvir edin", body: "Tarixləri, vaxtı, təhvil və qaytarma yerini, sərnişin sayını və sinfi seçin. Bakıdan kənara gedəcəksinizsə, marşrutu bildirin." },
      { title: "Variantları müqayisə edin", body: "Modeli, ili və müddətiniz üçün gündəlik tarifi görün. Baqaj, uşaq oturacağı və səfər barədə suallar üçün bizə yazın." },
      { title: "Təsdiq alın", body: "Menecer konkret avtomobilin mövcudluğunu, depoziti, sığortanı, təhvil yerini və yekun məbləği dəqiqləşdirir." },
      { title: "Yola çıxın", body: "Avtomobili hava limanında və ya ünvana çatdırılma ilə alın. İcarə zamanı 24/7 dəstək və Azərbaycan daxilində limitsiz yürüş mövcuddur." },
    ],
    promiseTitle: "Bizim üçün vacib olanlar",
    promise: ["Qiyməti icarə müddətinə görə göstərmək.", "Avtomobili real səfərə və baqaja uyğun seçməyə kömək etmək.", "Depozit, sığorta və yekun məbləği təsdiqdən əvvəl danışmaq.", "Avtomobil kataloqu ilə yanaşı faydalı səyahət bələdçiləri təqdim etmək."],
    editorialNote: "Bu səhifə CarTime-ın istiqamətini və prinsiplərini izah edir. Fəaliyyətin başlanğıcı və parkın ölçüsü barədə faktlar CarTime komandası tərəfindən verilib; şəkillər təqdimat xarakterlidir.",
  },
  en: {
    kicker: "THE CARTIME STORY / SINCE 2012",
    title: "The car is the beginning of your Azerbaijan story",
    lead: "Our team has worked in car rental since 2012. CarTime gives that familiar work a new name and a clearer online experience, from choosing a model to imagining the road ahead.",
    timelineTitle: "A story still being written",
    timeline: [
      { year: "2012", title: "Where it began", body: "Our team started working in car rental. Vehicles and travel habits have changed over the years; making the journey easier remains our starting point." },
      { year: "9fleet", title: "Experience from the same team", body: "CarTime and 9fleet are the same business. We bring our rental experience into a separate brand designed to make comparing cars and planning journeys clearer." },
      { year: "2026", title: "CarTime online", body: "The site brings together the catalogue, rates by rental period, answers and route guides. You can send a request now; a manager confirms availability and final terms." },
      { year: "NEXT", title: "Service around the journey", body: "We want to make the path from choosing a car to collecting it easier to understand, with clearer rates, terms and useful travel information." },
    ],
    fleetTitle: "122 cars in the fleet. 55 entries online.",
    fleetLead: "The figures describe different things. The actual fleet has 122 vehicles, including multiple cars of the same model and year. The website therefore lists 55 distinct entries to browse and compare. We confirm the availability of a specific vehicle for your dates separately.",
    fleetCards: [
      { title: "Choose for the journey", body: "Start with your needs: a compact city car, a sedan for meetings, a family crossover or a spacious vehicle for a group." },
      { title: "Rates by duration", body: "The daily rate depends on rental length. Every catalogue entry shows six periods for a more meaningful comparison." },
      { title: "A real confirmation", body: "After you choose dates and a model, our team checks availability, deposit, collection point and final price. A website request is not a paid booking." },
    ],
    galleryTitle: "One city, different beginnings",
    galleryLead: "Explore three ways a journey can start. Images are illustrative; the actual vehicle is confirmed separately.",
    gallery: [
      { image: "/assets/cartime-baku-sunrise.jpg", alt: "Baku and a car beside the Caspian", title: "Morning in Baku", body: "Discover Icherisheher, the Boulevard, oil-boom architecture and the contemporary city. Explore the historic centre on foot." },
      { image: "/assets/cartime-airport-daylight.jpg", alt: "A car near Baku airport", title: "After landing", body: "Share your flight and arrival time, then agree on the meeting point. Airport collection is available by prior arrangement." },
      { image: "/assets/cartime-baku-night.jpg", alt: "A car in evening Baku", title: "Beyond the city", body: "Absheron, Gobustan and the north-west reveal another Azerbaijan. Check roads, weather and stops before a longer drive." },
    ],
    journeyTitle: "Your journey with CarTime",
    journeyLead: "Clear steps from an idea to the road.",
    journey: [
      { title: "Describe your trip", body: "Choose dates, times, collection and return points, passenger count and preferred class. Mention your route if travelling beyond Baku." },
      { title: "Compare options", body: "Review models, years and daily rates for your rental length. Ask us about luggage, child seats and travel needs." },
      { title: "Get confirmation", body: "A manager checks the specific car, deposit, insurance, collection point and total price before arranging the handover." },
      { title: "Take the road", body: "Collect at the airport or request address delivery. Support is available 24/7, with unlimited mileage within Azerbaijan." },
    ],
    promiseTitle: "What matters to us",
    promise: ["Show rates in the context of rental length.", "Help match a vehicle to the real trip and its luggage.", "Discuss deposit, insurance and final price before confirmation.", "Offer useful Baku and Azerbaijan routes alongside the cars."],
    editorialNote: "This page describes CarTime's direction and principles. The founding year and fleet size were supplied by the CarTime team; images are illustrative.",
  },
};
