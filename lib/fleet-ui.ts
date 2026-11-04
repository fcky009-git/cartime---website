import type { Locale } from "./i18n";

export const fleetUi: Record<Locale, {
  kicker: string;
  title: string;
  lead: string;
  count: string;
  categories: Record<string, string>;
  searchPlaceholder: string;
  searchLabel: string;
  sortLabel: string;
  sortOptions: [string, string, string];
  perDay: string;
  rateContext: string;
  illustration: string;
  viewRates: string;
  more: string;
  empty: string;
  year: string;
  tariffTitle: string;
  tariffNote: string;
  durations: [string, string, string, string, string, string];
}> = {
  ru: {
    kicker: "АВТОПАРК",
    title: "Найдите автомобиль для своей поездки",
    lead: "55 моделей и комплектаций с опубликованными тарифами в USD. Выберите класс, сравните сроки аренды и уточните наличие перед оформлением.",
    count: "автомобилей",
    categories: { all: "Все", Mini: "Мини", Economy: "Эконом", Comfort: "Комфорт", SUV: "SUV", Business: "Бизнес", VAN: "Минивэны", Luxury: "Люкс" },
    searchPlaceholder: "Поиск по модели",
    searchLabel: "Поиск автомобиля",
    sortLabel: "Сортировать",
    sortOptions: ["Цена: по возрастанию", "Цена: по убыванию", "Год: сначала новые"],
    perDay: "USD / день",
    rateContext: "за день при аренде на 2–3 дня",
    illustration: "Иллюстрация категории",
    viewRates: "Все тарифы",
    more: "Показать ещё",
    empty: "Автомобилей по этому запросу нет.",
    year: "год",
    tariffTitle: "Тарифы по сроку аренды",
    tariffNote: "Ставки указаны в USD за день. Наличие автомобиля и итоговая стоимость требуют подтверждения; бронирование на сайте пока не подключено.",
    durations: ["2–3 дня", "4–7 дней", "8–14 дней", "15–21 день", "22–31 день", "32+ дня"],
  },
  az: {
    kicker: "AVTOPARK",
    title: "Səyahətiniz üçün avtomobil tapın",
    lead: "USD ilə dərc olunmuş tarifləri olan 55 model və komplektasiya. Sinifləri və icarə müddətlərini müqayisə edin, sonra mövcudluğu təsdiqləyin.",
    count: "avtomobil",
    categories: { all: "Hamısı", Mini: "Mini", Economy: "Ekonom", Comfort: "Komfort", SUV: "SUV", Business: "Biznes", VAN: "Miniven", Luxury: "Lüks" },
    searchPlaceholder: "Modelə görə axtarış",
    searchLabel: "Avtomobil axtarışı",
    sortLabel: "Sıralama",
    sortOptions: ["Qiymət: artan", "Qiymət: azalan", "İl: əvvəl yeni"],
    perDay: "USD / gün",
    rateContext: "2–3 günlük icarədə gündəlik",
    illustration: "Kateqoriya illüstrasiyası",
    viewRates: "Bütün tariflər",
    more: "Daha çox göstər",
    empty: "Bu sorğuya uyğun avtomobil yoxdur.",
    year: "il",
    tariffTitle: "İcarə müddətinə görə tariflər",
    tariffNote: "Qiymətlər gündəlik USD ilə göstərilir. Mövcudluq və yekun məbləğ təsdiqlənməlidir; saytda rezervasiya hələ aktiv deyil.",
    durations: ["2–3 gün", "4–7 gün", "8–14 gün", "15–21 gün", "22–31 gün", "32+ gün"],
  },
  en: {
    kicker: "THE FLEET",
    title: "Find a car for your journey",
    lead: "55 models and specifications with published rates in USD. Compare classes and rental periods, then confirm availability before booking.",
    count: "cars",
    categories: { all: "All", Mini: "Mini", Economy: "Economy", Comfort: "Comfort", SUV: "SUV", Business: "Business", VAN: "Vans", Luxury: "Luxury" },
    searchPlaceholder: "Search by model",
    searchLabel: "Search cars",
    sortLabel: "Sort by",
    sortOptions: ["Price: low to high", "Price: high to low", "Year: newest first"],
    perDay: "USD / day",
    rateContext: "per day for a 2–3 day rental",
    illustration: "Category illustration",
    viewRates: "All rates",
    more: "Show more",
    empty: "No cars match this search.",
    year: "year",
    tariffTitle: "Daily rates by rental length",
    tariffNote: "Rates are shown in USD per day. Availability and the final total require confirmation; booking is not connected yet.",
    durations: ["2–3 days", "4–7 days", "8–14 days", "15–21 days", "22–31 days", "32+ days"],
  },
};
