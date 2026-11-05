CREATE TABLE IF NOT EXISTS `admin_login_attempts` (
	`fingerprint` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`window_start` integer NOT NULL,
	`locked_until` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `admin_session_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`not_before` integer NOT NULL
);
