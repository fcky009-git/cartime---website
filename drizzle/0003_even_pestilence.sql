CREATE TABLE `travel_access_attempts` (
	`fingerprint` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `travel_passes` (
	`booking_id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`access_hash` text NOT NULL,
	`updated_at` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`pickup_instructions` text DEFAULT '' NOT NULL,
	`confirmed_total_usd` integer,
	`deposit_usd` integer,
	`stage` text DEFAULT 'booking' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `travel_passes_reference_unique` ON `travel_passes` (`reference`);