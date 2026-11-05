import { z } from "zod";
import fleet from "@/lib/fleet.json";
import { rentalDuration } from "@/lib/rental-duration";

export const bookingInput = z.object({
  requestId: z.string().uuid(),
  locale: z.enum(["ru", "az", "en"]),
  carId: z.string().min(1).max(90),
  pickup: z.enum(["office", "airport", "delivery"]),
  pickupAddress: z.string().trim().max(250),
  dropoff: z.enum(["office", "airport", "delivery"]),
  returnAddress: z.string().trim().max(250),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fromTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  toTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().email().max(160),
  age: z.number().int().min(24).max(70),
  experience: z.number().int().min(2).max(70),
  flight: z.string().trim().max(80),
  secondDriver: z.boolean(),
  payment: z.enum(["card", "cash", "transfer"]),
  notes: z.string().trim().max(2000),
  website: z.string().max(100).optional(),
});

export function validateBooking(data: z.infer<typeof bookingInput>) {
  const car = fleet.find((item) => item.id === data.carId);
  const duration = rentalDuration(data.fromDate, data.fromTime, data.toDate, data.toTime);
  const todayParts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baku", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  const today = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;
  if (!car || !duration.valid || data.fromDate < today || duration.days > 365) return null;
  if (data.phone.replace(/\D/g, "").length < 7) return null;
  if (data.pickup === "delivery" && !data.pickupAddress) return null;
  if (data.dropoff === "delivery" && !data.returnAddress) return null;
  if (data.website) return null;
  const rateIndex = duration.days <= 3 ? 0 : duration.days <= 7 ? 1 : duration.days <= 14 ? 2 : duration.days <= 21 ? 3 : duration.days <= 31 ? 4 : 5;
  const dailyRateUsd = car.ratesUsd[rateIndex];
  return { car, days: duration.days, dailyRateUsd, estimateUsd: duration.days * dailyRateUsd };
}
