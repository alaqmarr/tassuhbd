CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `memories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`emoji` text,
	`photos` text DEFAULT '[]',
	`order` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'milestone' NOT NULL,
	`quote` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`page_path` text NOT NULL,
	`entered_at` text NOT NULL,
	`exited_at` text,
	`duration_ms` integer,
	`is_replay` integer DEFAULT false NOT NULL,
	`replay_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text NOT NULL,
	`user_agent` text,
	`started_at` text NOT NULL,
	`last_active_at` text,
	`is_admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
