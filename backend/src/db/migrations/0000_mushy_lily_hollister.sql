CREATE TABLE `goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`level` text,
	`target_value` integer NOT NULL,
	`unit` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `habit_id_idx` ON `goals` (`habit_id`);--> statement-breakpoint
CREATE TABLE `habit_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`date` integer,
	`goal_level` text,
	`actual_value` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `date_idx` ON `habit_progress` (`date`);--> statement-breakpoint
CREATE TABLE `habits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `habits` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`email_verified` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);