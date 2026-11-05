import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookingRequests = sqliteTable("booking_requests", {
  id: text("id").primaryKey(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  status: text("status").notNull().default("new"),
  locale: text("locale").notNull(),
  carId: text("car_id").notNull(),
  carName: text("car_name").notNull(),
  carYear: integer("car_year").notNull(),
  pickup: text("pickup").notNull(),
  pickupAddress: text("pickup_address"),
  dropoff: text("dropoff").notNull(),
  returnAddress: text("return_address"),
  fromDate: text("from_date").notNull(),
  fromTime: text("from_time").notNull(),
  toDate: text("to_date").notNull(),
  toTime: text("to_time").notNull(),
  days: integer("days").notNull(),
  dailyRateUsd: integer("daily_rate_usd").notNull(),
  estimateUsd: integer("estimate_usd").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  experience: integer("experience").notNull(),
  flight: text("flight"),
  secondDriver: integer("second_driver", { mode: "boolean" }).notNull(),
  payment: text("payment").notNull(),
  notes: text("notes"),
}, (table) => [index("booking_requests_status_created_idx").on(table.status, table.createdAt)]);

export const adminLoginAttempts = sqliteTable("admin_login_attempts", {
  fingerprint: text("fingerprint").primaryKey(),
  attempts: integer("attempts").notNull(),
  windowStart: integer("window_start").notNull(),
  lockedUntil: integer("locked_until").notNull().default(0),
});

export const adminSessionState = sqliteTable("admin_session_state", {
  id: integer("id").primaryKey(),
  notBefore: integer("not_before").notNull(),
});
