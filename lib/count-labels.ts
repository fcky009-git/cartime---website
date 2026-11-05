import { localeInfo, type Locale } from "./locales";

type Forms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Counted phrases per language; `{n}` is the number. Word order and plural rules differ by language. */
const carForms: Record<Locale, Forms> = {
  ru: { one: "{n} автомобиль", few: "{n} автомобиля", many: "{n} автомобилей", other: "{n} автомобиля" },
  az: { other: "{n} avtomobil" },
  en: { one: "{n} car", other: "{n} cars" },
  de: { one: "{n} Auto", other: "{n} Autos" },
  zh: { other: "{n} 辆汽车" },
  ko: { other: "자동차 {n}대" },
  fr: { one: "{n} voiture", other: "{n} voitures" },
  ar: { zero: "{n} سيارة", one: "سيارة واحدة", two: "سيارتان", few: "{n} سيارات", many: "{n} سيارة", other: "{n} سيارة" },
};

const answerForms: Record<Locale, Forms> = {
  ru: { one: "{n} ответ", few: "{n} ответа", many: "{n} ответов", other: "{n} ответа" },
  az: { other: "{n} cavab" },
  en: { one: "{n} answer", other: "{n} answers" },
  de: { one: "{n} Antwort", other: "{n} Antworten" },
  zh: { other: "{n} 个答案" },
  ko: { other: "답변 {n}개" },
  fr: { one: "{n} réponse", other: "{n} réponses" },
  ar: { zero: "{n} إجابة", one: "إجابة واحدة", two: "إجابتان", few: "{n} إجابات", many: "{n} إجابة", other: "{n} إجابة" },
};

const dayForms: Record<Locale, Forms> = {
  ru: { one: "{n} день", few: "{n} дня", many: "{n} дней", other: "{n} дня" },
  az: { other: "{n} gün" },
  en: { one: "{n} day", other: "{n} days" },
  de: { one: "{n} Tag", other: "{n} Tage" },
  zh: { other: "{n} 天" },
  ko: { other: "{n}일" },
  fr: { one: "{n} jour", other: "{n} jours" },
  ar: { zero: "{n} يوم", one: "يوم واحد", two: "يومان", few: "{n} أيام", many: "{n} يومًا", other: "{n} يوم" },
};

function countLabel(forms: Record<Locale, Forms>, locale: Locale, count: number) {
  const form = forms[locale];
  const rule = new Intl.PluralRules(localeInfo[locale].hreflang).select(count);
  return (form[rule] ?? form.other).replace("{n}", String(count));
}

export const carCountLabel = (locale: Locale, count: number) => countLabel(carForms, locale, count);
export const answerCountLabel = (locale: Locale, count: number) => countLabel(answerForms, locale, count);
export const dayCountLabel = (locale: Locale, count: number) => countLabel(dayForms, locale, count);
