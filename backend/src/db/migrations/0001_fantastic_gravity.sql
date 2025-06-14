DROP INDEX "habit_id_idx";--> statement-breakpoint
DROP INDEX "group_habit_id_idx";--> statement-breakpoint
DROP INDEX "group_habits_unique_on_group_id_habit_id";--> statement-breakpoint
DROP INDEX "group_member_id_idx";--> statement-breakpoint
DROP INDEX "group_members_unique_on_group_id_user_id";--> statement-breakpoint
DROP INDEX "date_idx";--> statement-breakpoint
DROP INDEX "habit_id_date_unique";--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `goals` ALTER COLUMN "level" TO "level" text NOT NULL;--> statement-breakpoint
CREATE INDEX `habit_id_idx` ON `goals` (`habit_id`);--> statement-breakpoint
CREATE INDEX `group_habit_id_idx` ON `group_habits` (`habit_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_habits_unique_on_group_id_habit_id` ON `group_habits` (`group_id`,`habit_id`);--> statement-breakpoint
CREATE INDEX `group_member_id_idx` ON `group_members` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_members_unique_on_group_id_user_id` ON `group_members` (`group_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `habit_logs` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `habit_id_date_unique` ON `habit_logs` (`habit_id`,`date`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `habits` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `goals` ALTER COLUMN "target_value" TO "target_value" integer NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `goals` ALTER COLUMN "unit" TO "unit" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `goals` ALTER COLUMN "description" TO "description" text NOT NULL;