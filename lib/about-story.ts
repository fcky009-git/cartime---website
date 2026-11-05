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
    title: "CarTime. В движении с 2012 года.",
    lead: "CarTime работает с 2012 года. Год за годом мы расширяли автопарк и развивали сервис. Сегодня за нашим именем — 122 автомобиля, разные классы для разных поездок и стремление сделать каждый этап аренды удобнее.",
    timelineTitle: "Год за годом — к большему масштабу",
    timeline: [
      { year: "2012", title: "Начало CarTime", body: "С этого года CarTime работает в сфере аренды автомобилей. Наш путь начался с простого принципа: автомобиль должен подходить человеку и его планам, а условия поездки должны быть понятны заранее." },
      { year: "ГОДЫ", title: "Рост без остановки", body: "Мы расширялись год за годом. Вместе с автопарком рос выбор для клиентов: от компактных машин для города до просторных семейных автомобилей, кроссоверов и представительских моделей." },
      { year: "24/7", title: "Сервис в ритме клиента", body: "Сегодня мы предлагаем получение автомобиля в аэропорту Баку, доставку по адресу и поддержку 24/7. Эти возможности помогают начать поездку там и тогда, где это удобно клиенту." },
      { year: "122", title: "Автопарк сегодняшнего дня", body: "В действующем парке CarTime 122 автомобиля. На сайте представлены 55 разных позиций: часть машин одной модели и года повторяется. Такой масштаб позволяет обсуждать выбор под разные маршруты и задачи." },
      { year: "2026", title: "Новая цифровая глава", body: "Мы собрали в одном месте каталог, тарифы по срокам, ответы на вопросы и путеводитель по Азербайджану. Сайт помогает подготовиться к аренде; конкретную машину и окончательные условия подтверждает менеджер." },
      { year: "ЦЕЛЬ", title: "Продолжать поднимать планку", body: "Мы не рассматриваем нынешний масштаб как финиш. Следующая глава CarTime — ещё более удобный выбор, более ясный процесс бронирования и сервис, к которому хочется вернуться." },
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
      { image: "/assets/cartime-baku-night-bmw-xm.jpg", alt: "BMW XM на фоне ночного Баку", title: "Дальше за город", body: "Апшерон, Гобустан и северо-запад страны раскрывают другой Азербайджан. Для дальней поездки заранее проверьте дорогу, погоду и план остановок." },
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
    editorialNote: "Факты о начале работы в 2012 году и размере парка предоставлены CarTime. Этапы роста описаны без привязки к неподтверждённым датам; иллюстрации носят презентационный характер.",
  },
  az: {
    kicker: "CARTIME HEKAYƏSİ / 2012-Cİ İLDƏN",
    title: "CarTime. 2012-ci ildən hərəkətdəyik.",
    lead: "CarTime 2012-ci ildən fəaliyyət göstərir. İldən-ilə avtomobil parkımızı və xidmətimizi genişləndirmişik. Bu gün CarTime adı altında 122 avtomobil və müxtəlif səfərlər üçün geniş seçim var.",
    timelineTitle: "İldən-ilə daha geniş imkanlar",
    timeline: [
      { year: "2012", title: "CarTime-ın başlanğıcı", body: "CarTime avtomobil icarəsi sahəsində fəaliyyətə başladı. Əsas prinsipimiz avtomobili insanın planına uyğun seçmək və səfər şərtlərini əvvəlcədən aydınlaşdırmaqdır." },
      { year: "ARTIŞ", title: "İldən-ilə böyümə", body: "Avtomobil parkını davamlı genişləndirdik. Şəhər üçün kompakt modellərdən ailə avtomobillərinə, krossoverlərə və yüksək sinif modellərə qədər seçim artdı." },
      { year: "24/7", title: "Müştərinin ritminə uyğun xidmət", body: "Bu gün Bakı hava limanında təhvil, ünvana çatdırılma və 24/7 dəstək təklif edirik. Səfərin başlanğıcını müştəri üçün daha rahat etmək istəyirik." },
      { year: "122", title: "Bugünkü avtomobil parkı", body: "CarTime parkında 122 avtomobil var. Saytda eyni model və ilin təkrarlanan maşınları bir mövqe kimi göstərildiyi üçün 55 fərqli kataloq mövqeyi yer alır." },
      { year: "2026", title: "Rəqəmsal mərhələ", body: "Kataloq, müddətə görə tariflər, suallar və Azərbaycan marşrutları bir yerdədir. Konkret avtomobilin mövcudluğunu və yekun şərtləri menecer təsdiqləyir." },
      { year: "HƏDƏF", title: "Daha yüksək səviyyəyə", body: "Bugünkü miqyas bizim üçün son nöqtə deyil. Seçimi, rezervasiya prosesini və xidmət təcrübəsini daha da yaxşılaşdırmaq istəyirik." },
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
      { image: "/assets/cartime-baku-night-bmw-xm.jpg", alt: "Gecə Bakısı fonunda BMW XM", title: "Şəhərdən kənara", body: "Abşeron, Qobustan və şimal-qərb bölgəsi Azərbaycanın başqa tərəfini göstərir. Yol və hava şəraitini əvvəlcədən yoxlayın." },
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
    editorialNote: "2012-ci il və avtomobil parkının ölçüsü barədə faktlar CarTime tərəfindən verilib. Artım mərhələləri təsdiqlənməmiş tarixlərə bağlanmayıb; şəkillər təqdimat xarakterlidir.",
  },
  en: {
    kicker: "THE CARTIME STORY / SINCE 2012",
    title: "CarTime. Moving forward since 2012.",
    lead: "CarTime has operated since 2012. Year after year, we have grown our fleet and developed our service. Today the CarTime name stands behind 122 vehicles and a wider choice for many kinds of journeys.",
    timelineTitle: "Growing year after year",
    timeline: [
      { year: "2012", title: "CarTime begins", body: "CarTime started working in car rental. Our guiding idea is to match the car to the traveller's plans and make the terms clear before the journey begins." },
      { year: "GROW", title: "Progress year after year", body: "We kept expanding the fleet. The choice grew from compact city cars to family vehicles, crossovers and executive models for different journeys." },
      { year: "24/7", title: "Service around the customer", body: "Today we offer Baku airport collection, address delivery and 24/7 support, helping customers start their trips where it suits them." },
      { year: "122", title: "The fleet today", body: "CarTime's working fleet has 122 vehicles. The website displays 55 distinct entries because multiple cars can share the same model and year." },
      { year: "2026", title: "A digital chapter", body: "The catalogue, rate periods, answers and Azerbaijan guides now live in one place. A manager confirms the specific car and final terms after a request." },
      { year: "NEXT", title: "Keep raising the standard", body: "Today's scale is not a finish line. We want to keep improving vehicle choice, the booking journey and the service customers return to." },
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
      { image: "/assets/cartime-baku-night-bmw-xm.jpg", alt: "BMW XM against Baku at night", title: "Beyond the city", body: "Absheron, Gobustan and the north-west reveal another Azerbaijan. Check roads, weather and stops before a longer drive." },
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
    editorialNote: "The 2012 start date and fleet size were supplied by CarTime. Growth stages are not assigned unverified dates; images are illustrative.",
  },
};
