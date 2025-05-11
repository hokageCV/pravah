ALTER TABLE `habit_progress` RENAME TO `habit_logs`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`date` text DEFAULT CURRENT_DATE NOT NULL,
	`goal_level` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_habit_logs`("id", "habit_id", "date", "goal_level", "created_at", "updated_at") SELECT "id", "habit_id", "date", "goal_level", "created_at", "updated_at" FROM `habit_logs`;--> statement-breakpoint
DROP TABLE `habit_logs`;--> statement-breakpoint
ALTER TABLE `__new_habit_logs` RENAME TO `habit_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `date_idx` ON `habit_logs` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `habit_id_date_unique` ON `habit_logs` (`habit_id`,`date`);