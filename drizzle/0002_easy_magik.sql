CREATE TABLE IF NOT EXISTS `admin_booking_events` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `admin_booking_events_booking_idx` ON `admin_booking_events` (`booking_id`,`created_at`);