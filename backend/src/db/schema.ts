import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const timestamps = {
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date().toISOString()),
}

// ===========================================================

export const users = sqliteTable('users', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  emailVerified: integer({ mode: 'boolean' }).default(false),
  ...timestamps
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(
  users,
  {
    username: schema => schema.min(1).max(500),
    email: schema => schema.email(),
  },
).required({
  username: true,
  email: true,
  password: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchUserSchema = insertUserSchema.partial();

// ===========================================================

export const habits = sqliteTable('habits', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer({ mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text().notNull(),
  isActive: integer({ mode: 'boolean' }).default(true),
  description: text(),
  ...timestamps
}, (table) => [
  index('user_id_idx').on(table.userId),
]);

export const selectHabitSchema = createSelectSchema(habits);

export const insertHabitSchema = createInsertSchema(
  habits, { name: schema => schema.min(1).max(500) }
).required({ name: true })
  .omit({ createdAt: true, updatedAt: true, userId: true });

export const patchHabitSchema = insertHabitSchema.partial();

// ===========================================================

export const goals = sqliteTable('goals', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  habitId: integer({ mode: 'number' }).references(() => habits.id, { onDelete: 'cascade' }).notNull(),
  level: text({ enum: ['A', 'B', 'C'] }),
  targetValue: integer({ mode: 'number' }).notNull(),
  unit: text().notNull(),
  description: text(),
  ...timestamps
}, (table) => [
  index('habit_id_idx').on(table.habitId),
]);

export const selectGoalSchema = createSelectSchema(goals);

export const insertGoalSchema = createInsertSchema(goals)
  .required({ level: true, habitId: true, targetValue: true })
  .omit({ createdAt: true, updatedAt: true, });

export const patchGoalSchema = insertGoalSchema.partial();

// ===========================================================

export const habitLogs = sqliteTable('habit_logs', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  habitId: integer({ mode: 'number' }).references(() => habits.id, { onDelete: 'cascade' }).notNull(),
  date: text().default(sql`CURRENT_DATE`).notNull(),
  goalLevel: text({ enum: ['A', 'B', 'C'] }).notNull(),
  ...timestamps
}, (table) => [
  index('date_idx').on(table.date),
  unique('habit_id_date_unique').on(table.habitId, table.date),
]);

export const selectHabitLogSchema = createSelectSchema(habitLogs);

export const insertHabitLogSchema = createInsertSchema(habitLogs)
  .required({ habitId: true, goalLevel: true })
  .omit({ createdAt: true, updatedAt: true, date: true });

export const patchHabitLogSchema = insertHabitLogSchema.partial();

// ===========================================================
