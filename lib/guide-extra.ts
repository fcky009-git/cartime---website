import type { Locale } from "./i18n";
import type { Guide } from "./guides";

export type ExtraGuideSlug = "absheron" | "gobustan" | "sheki";

export const extraGuides: Record<Locale, Record<ExtraGuideSlug, Guide>> = {
  ru: {
    absheron: {
      title: "Апшерон на автомобиле: Атешгях, Янардаг и побережье",
      description: "Подробный маршрут по Апшерону из Баку: храм огня Атешгях, Янардаг, музейные остановки и советы по планированию поездки.",
      eyebrow: "АПШЕРОН / ОДИН ДЕНЬ",
      teaser: "История огня, необычный ландшафт и неспешный выезд из Баку.",
      intro: "Апшерон — удобное продолжение знакомства с Баку. Здесь тема «Страны огней» превращается из метафоры в реальные места: храмовый комплекс Атешгях и природное горение газа на Янардаге. Планируйте их как две разные остановки, а не один быстрый пункт на карте.",
      sections: [
        { heading: "Атешгях: история места", paragraphs: ["Храм огнепоклонников Атешгях расположен в Сураханах. Комплекс рассказывает о религиозных традициях, путях торговли и интересе путешественников к природному огню Апшерона. Сначала изучите экспозицию и внутренний двор, затем пройдитесь вокруг комплекса, чтобы увидеть его форму целиком.", "Исторический смысл места сложнее, чем одна эффектная фотография с пламенем. Если путешествуете с детьми, музейная часть помогает объяснить, почему огонь здесь стал культурным символом. Актуальные часы и правила билетов проверьте на официальной странице перед выездом."] },
        { heading: "Янардаг: природное явление", paragraphs: ["Янардаг известен пламенем, которое поддерживается выходящим из земли газом. Современная территория включает музейный комплекс. Здесь уместно задержаться, прочитать экспозицию и посмотреть на склон с разных точек, а не ограничиваться короткой остановкой.", "Ветер и погода меняют впечатление от открытого пространства. Не подходите за ограждения и учитывайте правила площадки. Если хочется увидеть оба объекта за день, оставьте запас времени между остановками и на обратную дорогу в город."] },
        { heading: "Как построить день", paragraphs: ["Начните поездку после завтрака, выберите порядок Атешгях — Янардаг или наоборот по вашему месту старта и текущей дорожной обстановке. Между объектами можно запланировать обед; не закладывайте точное время по карте как гарантированное время в пути.", "Если вы впервые за рулём в Баку, сохраните точки офлайн и заранее проверьте парковку. Для вечернего возвращения полезно помнить о плотном городском движении. Не смешивайте этот маршрут с длинной прогулкой по Старому городу: она заслуживает отдельного времени."] },
        { heading: "Что обсудить при аренде", paragraphs: ["Для Апшерона обычно подходит городской автомобиль, но конкретный выбор зависит от пассажиров, багажа и планируемых остановок. У CarTime действует пробег без лимита по Азербайджану. Уточните место выдачи, залог, страховку и условия возврата до поездки.", "Если захотите дополнить день более удалёнными точками полуострова, проверьте состояние дороги и пригодность выбранного автомобиля. Не съезжайте на неизвестные грунтовые участки, ориентируясь только на навигатор."] },
      ],
      checklistTitle: "Перед выездом на Апшерон",
      checklist: ["Сверьте часы работы и билеты Атешгях и Янардага.", "Сохраните обе точки маршрута и проверьте дорожную обстановку.", "Возьмите воду, удобную обувь и защиту от солнца или ветра по сезону.", "Согласуйте условия аренды и время возврата автомобиля."],
    },
    gobustan: {
      title: "Гобустан из Баку: наскальные рисунки и ландшафт",
      description: "Подробный гид по Гобустану: петроглифы ЮНЕСКО, музей, музыкальный камень, грязевые вулканы и практические советы для поездки на машине.",
      eyebrow: "ГОБУСТАН / КУЛЬТУРА И ПРИРОДА",
      teaser: "Древние изображения, каменный ландшафт и поездка за пределы города.",
      intro: "Гобустан интересен не только количеством петроглифов, но и тем, как они связаны с местностью. Дайте себе время на музей и прогулку по разрешённым дорожкам заповедника. Грязевые вулканы рассматривайте как отдельную остановку с отдельной проверкой доступа.",
      sections: [
        { heading: "Почему Гобустан важен", paragraphs: ["Культурный ландшафт наскальных рисунков Гобустана входит в Список всемирного наследия ЮНЕСКО. Официальный туристический портал сообщает о более чем 6 000 изображений: люди, животные, лодки, сцены охоты и танцев. Они помогают представить образ жизни разных эпох, а не составляют одну единую «картину».", "На территории также сохранились следы поселений, пещер и захоронений. Начните с вводной экспозиции, чтобы лучше понимать увиденное среди скал. Это особенно полезно, если у вас нет гида."] },
        { heading: "На что обратить внимание", paragraphs: ["Маршрут по заповеднику обычно связывают с массивом Бёюкдаш. Среди известных деталей — древняя надпись римского солдата и звучащий камень гавалдаш. Их стоит рассматривать в контексте всей площадки, а не как отдельные фотографии для списка посещённых мест.", "Пейзаж открыт солнцу и ветру; обувь с устойчивой подошвой удобнее для каменистых участков. Следуйте обозначенным маршрутам и правилам заповедника: это археологический объект, требующий бережного отношения."] },
        { heading: "Грязевые вулканы — отдельный план", paragraphs: ["В районе Гобустана есть грязевые вулканы, но они не являются той же самой музейной площадкой. Подъезд, состояние грунта и доступ могут меняться. Перед поездкой уточните точную точку, погоду и возможность добраться на выбранном автомобиле.", "Если маршрут ведёт по плохой грунтовой дороге, не предполагайте, что обычная арендованная легковая машина для неё подходит. Безопаснее обсудить подходящий вариант с менеджером и оставить право отказаться от участка при сомнениях."] },
        { heading: "Планирование дороги из Баку", paragraphs: ["Выделите поездке большую часть дня, чтобы спокойно посмотреть экспозицию и ландшафт, сделать остановки и вернуться без спешки. Заранее проверьте часы заповедника и актуальную дорогу, заряд телефона и запас воды.", "На обратном пути не планируйте жёсткую пересадку или мероприятие сразу после предполагаемого приезда: время в пути зависит от трафика и погоды. Если едете с семьёй, учитывайте открытое пространство и отсутствие тени на отдельных участках."] },
      ],
      checklistTitle: "Перед поездкой в Гобустан",
      checklist: ["Проверьте часы и правила посещения заповедника.", "Разделите заповедник и грязевые вулканы как две разные точки.", "Уточните состояние подъезда и допустимость грунтовой дороги для автомобиля.", "Возьмите воду, удобную обувь и заряд для телефона."],
    },
    sheki: {
      title: "Шеки и северо-запад Азербайджана: путешествие на несколько дней",
      description: "Маршрут по северо-западу Азербайджана: Шемаха, Исмаиллы, Лагич, Габала и Шеки, наследие ЮНЕСКО, ремёсла и советы водителю.",
      eyebrow: "СЕВЕРО-ЗАПАД / НЕСКОЛЬКО ДНЕЙ",
      teaser: "Горные пейзажи, ремёсла, Шёлковый путь и исторический Шеки.",
      intro: "Северо-западный маршрут лучше раскрывается без гонки между городами. Официальная туристическая схема связывает Баку, Шемаху, Исмаиллы, Габалу и Шеки, а при большем запасе времени — Ках и Закаталу. Выберите две или три главные остановки и оставьте место для неожиданного открытия по дороге.",
      sections: [
        { heading: "Первый этап: Шемаха и Исмаиллы", paragraphs: ["После выезда из Баку ландшафт постепенно меняется. Шемаха и Исмаиллы — точки, где удобно прервать длинный переезд и переключиться с городского ритма на региональный. Планируйте остановку по интересам и погоде, а не только по расстоянию.", "Лагич в Исмаиллинском районе известен мощёными улицами и традиционными ремёслами, особенно медной работой. Подъезд проходит через горную местность; перед заездом проверьте дорогу и световой день. В старом поселении лучше гулять пешком."] },
        { heading: "Габала: природа и пауза в дороге", paragraphs: ["Официальный туристический портал называет Габалу центром активного отдыха на северо-западном направлении. Это удобное место для ночёвки или спокойного дня между переездами. Выберите конкретные занятия заранее: прогулка, природная точка или отдых — день не обязан быть заполнен до минуты.", "Погода в горах отличается от Баку, а сезонность влияет на впечатление от открытых маршрутов. Уточняйте работу выбранных объектов непосредственно перед поездкой и не стройте весь план вокруг одного места."] },
        { heading: "Шеки: город Шёлкового пути", paragraphs: ["Исторический центр Шеки с ханским дворцом внесён в Список всемирного наследия ЮНЕСКО. В старых кварталах сохранились мощёные улицы, караван-сараи и ремесленные мастерские. Сам дворец известен росписью и витражами шебеке из дерева и цветного стекла.", "Пройдитесь по территории крепости, загляните в мастерские и выделите время на Верхний караван-сарай. Для Шеки лучше оставить целый день или ночёвку: тогда город не сведётся к одному посещению дворца."] },
        { heading: "Как распределить дни", paragraphs: ["Практичный ритм — выехать из Баку, остановиться в районе Шемахи или Исмаиллы, продолжить к Габале и затем провести отдельное время в Шеки. Это схема, а не обещание фиксированного времени в пути. При желании маршрут можно продлить дальше на северо-запад.", "Бронируйте ночёвки с учётом сезона, проверяйте прогноз и дорожные ограничения. Перед дальней поездкой уточните у CarTime условия аренды для выбранной машины, документы, срок возврата и поддержку на маршруте."] },
      ],
      checklistTitle: "Перед дорогой в Шеки",
      checklist: ["Выберите несколько остановок вместо попытки увидеть всё за день.", "Проверьте прогноз и состояние горных участков, особенно к Лагичу.", "Запланируйте ночёвку и время для прогулки по историческому Шеки.", "Согласуйте срок аренды, место возврата и поддержку в поездке."],
    },
  },
  az: {
    absheron: {
      title: "Abşeron avtomobillə: Atəşgah, Yanardağ və sahil",
      description: "Bakıdan Abşerona səfər: Atəşgah məbədi, Yanardağ və bir günlük marşrutu planlaşdırmaq üçün məsləhətlər.",
      eyebrow: "ABŞERON / BİR GÜN", teaser: "Odun tarixi, fərqli mənzərə və Bakıdan rahat çıxış.",
      intro: "Abşeron Bakı ilə tanışlığın təbii davamıdır. Atəşgah və Yanardağ iki fərqli dayanacaqdır: biri tarixi məbəd kompleksi, digəri isə təbii qazın yandığı ərazidir.",
      sections: [
        { heading: "Atəşgahın tarixini anlayın", paragraphs: ["Suraxanıdakı Atəşgah məbədi odla bağlı dini ənənələr və səyyahların tarixi haqqında danışır. Həyəti və ekspozisiyanı ayrı-ayrılıqda gəzin; məkan bir foto ilə bitmir.", "Uşaqlarla gəlirsinizsə, muzey hissəsi gördüklərinizi izah etməyə kömək edir. Səfərdən əvvəl rəsmi səhifədə iş vaxtını və bilet qaydalarını yoxlayın."] },
        { heading: "Yanardağı müşahidə edin", paragraphs: ["Yanardağ yeraltı qazın hesabına yanan alovu ilə tanınır. Müasir muzey ərazisində ekspozisiyanı oxumağa və açıq mənzərəni seyr etməyə vaxt ayırın.", "Külək və hava açıq məkanda hissləri dəyişir. Təhlükəsizlik çəpərlərini keçməyin və ziyarət qaydalarına əməl edin."] },
        { heading: "Günün ritmini qurun", paragraphs: ["İki məkan arasında nahar və yol üçün vaxt saxlayın. Xəritədə göstərilən hərəkət vaxtını zəmanət kimi qəbul etməyin; şəhərə qayıdışda tıxac ola bilər.", "Naviqasiya nöqtələrini öncədən yadda saxlayın. İçərişəhər gəzintisini eyni günə sıxışdırmaq əvəzinə ayrıca planlaşdırmaq daha rahatdır."] },
        { heading: "İcarə üçün nəyi dəqiqləşdirməli", paragraphs: ["Sərnişin və baqaj sayına uyğun avtomobil seçin. CarTime Azərbaycanda limitsiz yürüş təklif edir; depozit, sığorta və qaytarma vaxtını əvvəlcədən razılaşdırın.", "Daha uzaq nöqtələrə gedirsinizsə, yolun vəziyyətini yoxlayın. Naviqator göstərir deyə naməlum torpaq yola çıxmayın."] },
      ],
      checklistTitle: "Abşerona çıxmazdan əvvəl", checklist: ["Atəşgah və Yanardağın iş vaxtını yoxlayın.", "Yol və parklanma variantlarını nəzərdən keçirin.", "Su və mövsümə uyğun geyim götürün.", "İcarə və qaytarma şərtlərini təsdiqləyin."],
    },
    gobustan: {
      title: "Bakıdan Qobustana: qayaüstü rəsmlər və mənzərə",
      description: "Qobustan bələdçisi: UNESCO qayaüstü təsvirləri, muzey, qavaldaş, palçıq vulkanları və avtomobil səfəri.",
      eyebrow: "QOBUSTAN / MƏDƏNİYYƏT VƏ TƏBİƏT", teaser: "Qədim təsvirlər və şəhərdən kənardakı daş mənzərə.",
      intro: "Qobustanın dəyəri təkcə petroqliflərin sayında deyil, onların landşaftla əlaqəsindədir. Muzeyə və qoruğun icazəli gəzinti yoluna kifayət qədər vaxt ayırın. Palçıq vulkanlarını ayrıca səfər nöqtəsi kimi planlaşdırın.",
      sections: [
        { heading: "UNESCO irsi", paragraphs: ["Qobustan qayaüstü incəsənət mədəni landşaftı UNESCO Dünya İrsi Siyahısındadır. Rəsmi turizm portalı insanları, heyvanları, qayıqları və ov səhnələrini əks etdirən 6 000-dən çox təsviri qeyd edir.", "Muzeyin giriş ekspozisiyası müxtəlif dövrlər haqqında təsəvvür yaradır. Bundan sonra qayalar arasında gördükləriniz daha mənalı olur."] },
        { heading: "Qoruqda nəyi görməli", paragraphs: ["Böyükdaş ərazisində petroqliflərdən əlavə Roma yazısı və musiqili qavaldaş tanınır. Onlara ayrı-ayrı foto nöqtələri kimi deyil, ümumi tarixi məkanın hissəsi kimi baxın.", "Daşlıq cığırlar üçün rahat ayaqqabı seçin, işarələnmiş marşrutdan çıxmayın və qoruq qaydalarına riayət edin."] },
        { heading: "Palçıq vulkanlarını ayrıca yoxlayın", paragraphs: ["Palçıq vulkanları eyni muzey ərazisi deyil. Yaxınlaşma yolu, torpağın vəziyyəti və giriş şərtləri dəyişə bilər. Getməzdən əvvəl dəqiq istiqaməti öyrənin.", "Adi icarə avtomobilini uyğunsuz torpaq yola çıxarmayın. Avtomobilin uyğunluğunu menecerlə dəqiqləşdirin."] },
        { heading: "Bakıdan günü planlaşdırın", paragraphs: ["Muzey, açıq ərazi və yol üçün günün böyük hissəsini ayırın. İş saatını, hava proqnozunu və telefonun enerjisini yoxlayın.", "Qayıdış saatını dəqiq hesablamayın: tıxac və hava yol vaxtına təsir edir. Ailə ilə gedirsinizsə, açıq sahədə kölgənin az ola biləcəyini nəzərə alın."] },
      ],
      checklistTitle: "Qobustana çıxmazdan əvvəl", checklist: ["Qoruğun iş vaxtını yoxlayın.", "Qoruq və vulkanları iki ayrı nöqtə kimi saxlayın.", "Torpaq yolun avtomobil üçün uyğunluğunu soruşun.", "Su, rahat ayaqqabı və telefon üçün enerji götürün."],
    },
    sheki: {
      title: "Şəki və Azərbaycanın şimal-qərbi: çoxgünlük marşrut",
      description: "Şamaxı, İsmayıllı, Lahıc, Qəbələ və Şəki üzrə avtomobil marşrutu, UNESCO irsi və səfər planı.",
      eyebrow: "ŞİMAL-QƏRB / BİR NEÇƏ GÜN", teaser: "Dağ mənzərələri, sənətkarlıq və İpək yolu irsi.",
      intro: "Şimal-qərb marşrutunu tələsmədən gəzmək daha xoşdur. Rəsmi turizm istiqaməti Bakı, Şamaxı, İsmayıllı, Qəbələ və Şəkini birləşdirir; daha çox vaxt varsa Qax və Zaqatalaya da davam etmək olar.",
      sections: [
        { heading: "Şamaxı və İsmayıllıda dayanacaq", paragraphs: ["Bakıdan sonra mənzərə tədricən dəyişir. Şamaxı və İsmayıllı uzun yolu bölmək və bölgə ilə tanış olmaq üçün əlverişli dayanacaqlardır.", "İsmayıllıdakı Lahıc daş döşənmiş küçələri və misgərlik ənənələri ilə tanınır. Dağ yolunun və gün işığının vəziyyətini əvvəlcədən yoxlayın; qəsəbəni piyada gəzin."] },
        { heading: "Qəbələdə fasilə", paragraphs: ["Rəsmi turizm portalı Qəbələni açıq hava fəaliyyətləri üçün şimal-qərbin əsas nöqtələrindən biri kimi təqdim edir. Burada gecələmək və ya sakit bir gün keçirmək olar.", "Hava Bakıya nisbətən fərqli ola bilər. Seçdiyiniz təbiət və istirahət məkanlarının mövsüm üzrə işini yoxlayın."] },
        { heading: "Şəkinin tarixi mərkəzi", paragraphs: ["Şəkinin tarixi mərkəzi Xan sarayı ilə birlikdə UNESCO Dünya İrsi Siyahısındadır. Daş küçələr, karvansaralar və emalatxanalar İpək yolunun izlərini saxlayır.", "Xan sarayının rəngli şəbəkə pəncərələrinə baxın, qala ərazisini və Yuxarı Karvansaranı gəzin. Şəkini bir foto dayanacağına çevirməmək üçün ayrıca gün ayırın."] },
        { heading: "Günləri necə bölmək olar", paragraphs: ["Bakıdan çıxıb Şamaxı və ya İsmayıllıda dayanmaq, Qəbələyə davam etmək, sonra Şəkini ayrıca gəzmək rahat bir sxemdir. Bu sabit yol vaxtı vədi deyil.", "Gecələməni, hava proqnozunu və yol məhdudiyyətlərini yoxlayın. CarTime ilə seçilən avtomobilin şərtlərini və qaytarma vaxtını razılaşdırın."] },
      ],
      checklistTitle: "Şəki yolundan əvvəl", checklist: ["Bir gündə hər yeri görməyə çalışmayın.", "Dağ yollarını və hava proqnozunu yoxlayın.", "Şəkidə gəzinti və gecələmə üçün vaxt ayırın.", "İcarə müddətini və qaytarma yerini təsdiqləyin."],
    },
  },
  en: {
    absheron: {
      title: "Absheron by car: Ateshgah, Yanardag and the peninsula",
      description: "An Absheron day trip from Baku: the Ateshgah Fire Temple, Yanardag and practical planning advice.",
      eyebrow: "ABSHERON / DAY TRIP", teaser: "A history of fire and a different landscape beyond Baku.",
      intro: "Absheron is a natural extension of a Baku visit. Ateshgah and Yanardag tell different parts of the ‘Land of Fire’ story: one is a historic temple complex, the other a natural gas flame. Treat them as two separate stops.",
      sections: [
        { heading: "Understand Ateshgah", paragraphs: ["The Ateshgah Fire Temple in Surakhany introduces religious traditions, trade routes and travellers' fascination with natural flames. Explore the courtyard and exhibition before moving on.", "The site's meaning goes beyond a single photo. Check current hours and ticket arrangements on the official site before leaving Baku."] },
        { heading: "Experience Yanardag", paragraphs: ["Yanardag is known for flames fed by natural gas escaping from the ground. Its visitor area includes a museum complex; leave time to understand the display and the landscape.", "Wind changes the feel of this open site. Respect barriers and visitor rules, and allow enough time for the drive back to Baku."] },
        { heading: "Shape the day", paragraphs: ["Choose the order of the two sites based on your starting point and current traffic. Leave room for lunch, parking and a relaxed visit; a map estimate is not a guaranteed journey time.", "Save both locations in advance. Give the Old City its own walking day rather than squeezing it into the same itinerary."] },
        { heading: "Before renting", paragraphs: ["Match the vehicle to your passengers and luggage. CarTime offers unlimited mileage in Azerbaijan; confirm deposit, insurance and return time before departure.", "If you add more remote peninsula stops, check road quality and vehicle suitability. Do not follow a navigation app onto an unknown unpaved route without checking first."] },
      ],
      checklistTitle: "Before you head to Absheron", checklist: ["Check current hours at Ateshgah and Yanardag.", "Review roads and parking.", "Carry water and clothing for the season.", "Confirm rental and return arrangements."],
    },
    gobustan: {
      title: "Gobustan from Baku: rock art and landscape",
      description: "A Gobustan guide to UNESCO rock art, the museum, musical stone, mud volcanoes and a practical road trip from Baku.",
      eyebrow: "GOBUSTAN / CULTURE AND NATURE", teaser: "Ancient engravings and an extraordinary rocky landscape.",
      intro: "Gobustan is about more than a count of petroglyphs: the images and landscape belong together. Give the museum and permitted paths enough time. Treat the mud volcanoes as a separate stop with its own access check.",
      sections: [
        { heading: "Why Gobustan matters", paragraphs: ["The Gobustan Rock Art Cultural Landscape is a UNESCO World Heritage Site. Azerbaijan's tourism board describes over 6,000 images of people, animals, boats, hunting and dancing from different periods.", "The reserve also preserves traces of settlements and caves. Start with the introductory exhibition so the rock art outside has more context."] },
        { heading: "What to look for", paragraphs: ["Boyukdash is associated with many of the reserve's best-known sights, including a Roman inscription and the resonant gaval dash stone. View them as parts of a larger archaeological landscape.", "Wear shoes suited to rocky paths, follow marked routes and respect the reserve's preservation rules."] },
        { heading: "Mud volcanoes need a separate plan", paragraphs: ["The mud volcanoes are not the same museum site. Access, track conditions and visitor arrangements may change. Confirm the precise location and road before setting off.", "Do not assume a standard rental car is suitable for an unpaved approach. Ask the rental team, and skip a stretch if its condition is uncertain."] },
        { heading: "Plan the road from Baku", paragraphs: ["Leave most of a day for the exhibition, open landscape, journey and breaks. Check opening hours, weather, water and phone battery.", "Avoid a tight commitment immediately after your expected return: traffic and weather affect driving time. Families should plan for exposed areas with limited shade."] },
      ],
      checklistTitle: "Before visiting Gobustan", checklist: ["Check reserve hours and rules.", "Save the reserve and volcanoes as separate stops.", "Confirm whether an unpaved road suits your vehicle.", "Bring water, suitable shoes and a charged phone."],
    },
    sheki: {
      title: "Sheki and north-west Azerbaijan: a multi-day road trip",
      description: "Drive through Shamakhi, Ismayilli, Lahij, Gabala and Sheki for UNESCO heritage, crafts and mountain scenery.",
      eyebrow: "NORTH-WEST / MULTI-DAY", teaser: "Mountain landscapes, craft traditions and Silk Road heritage.",
      intro: "The north-west is more rewarding without a race between cities. Azerbaijan's official tourism route links Baku, Shamakhi, Ismayilli, Gabala and Sheki, and can continue to Gakh and Zagatala if you have more time.",
      sections: [
        { heading: "Pause in Shamakhi and Ismayilli", paragraphs: ["The scenery changes as you leave Baku. Shamakhi and Ismayilli are useful places to break a long journey and explore according to your interests and the weather.", "Lahij in the Ismayilli district is known for cobbled lanes and metalworking traditions. Check the mountain approach and daylight before the detour; explore the old settlement on foot."] },
        { heading: "Slow down in Gabala", paragraphs: ["Azerbaijan's tourism board presents Gabala as a north-western hub for outdoor activities. It works well for an overnight stop or a quieter day between drives.", "Mountain weather differs from Baku. Check seasonal access to any specific attraction rather than building the trip around an unverified opening time."] },
        { heading: "Explore historic Sheki", paragraphs: ["The Historic Centre of Sheki with the Khan's Palace is a UNESCO World Heritage Site. Cobbled streets, caravanserais and workshops reflect its Silk Road history.", "See the palace's painted interiors and intricate shebeke windows, then explore the fortress area and Upper Caravanserai. Give Sheki a full day or overnight stay."] },
        { heading: "Divide the journey", paragraphs: ["A sensible outline is to leave Baku, pause around Shamakhi or Ismayilli, continue to Gabala, then explore Sheki separately. It is a planning framework, not a promise of fixed driving times.", "Book overnight stops for your season, check the forecast and roads, and confirm vehicle terms and return arrangements with CarTime before leaving."] },
      ],
      checklistTitle: "Before the Sheki road trip", checklist: ["Choose a few stops instead of attempting them all in one day.", "Check mountain roads and the forecast.", "Allow time for an overnight stay and a Sheki walk.", "Confirm rental length and return arrangements."],
    },
  },
};
