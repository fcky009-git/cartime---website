/** How many requests the admin panel loads per query. Older ones are fetched page by page. */
export const ADMIN_PAGE_SIZE = 250;

// Baku time in one fixed format: locale formats differ between the server and browsers and break hydration.
export const bakuDate = (date: Date) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
export const bakuClock = (date: Date) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.hour}:${parts.minute}`;
};
export const bakuStamp = (date: Date) => `${bakuDate(date)} ${bakuClock(date)}`;
