const DAY_MS = 86_400_000;

export const rateTierIndex = (days: number) => days <= 3 ? 0 : days <= 7 ? 1 : days <= 14 ? 2 : days <= 21 ? 3 : days <= 31 ? 4 : 5;

export function addDaysIso(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return "";
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function rentalDuration(fromDate: string, fromTime: string, toDate: string, toTime: string) {
  const dateTime = (date: string, time: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NaN;
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const stamp = Date.UTC(year, month - 1, day, hour, minute);
    const validDate = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === date;
    return validDate && hour < 24 && minute < 60 ? stamp : NaN;
  };
  const start = dateTime(fromDate, fromTime);
  const end = dateTime(toDate, toTime);
  const milliseconds = end - start;
  const days = Number.isFinite(milliseconds) && milliseconds > 0 ? Math.ceil(milliseconds / DAY_MS) : 0;
  return { days, valid: days >= 2, milliseconds };
}
