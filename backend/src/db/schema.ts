import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod'

const timestamps = {
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date().toISOString()),
};

// ===========================================================

export const users = sqliteTable('users', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  emailVerified: integer({ mode: 'boolean' }).default(false),
  ...timestamps,
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(1).max(500),
  email: (schema) => schema.email(),
})
  .required({
    username: true,
    email: true,
    password: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchUserSchema = insertUserSchema.partial();

// ===========================================================

export const habits = sqliteTable(
  'habits',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: integer({ mode: 'number' })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    name: text().notNull(),
    isActive: integer({ mode: 'boolean' }).default(true),
    description: text(),
    ...timestamps,
  },
  (table) => [index('user_id_idx').on(table.userId)],
);

export const selectHabitSchema = createSelectSchema(habits);

export const insertHabitSchema = createInsertSchema(habits, {
  name: (schema) => schema.min(1).max(500),
})
  .required({ name: true })
  .omit({ createdAt: true, updatedAt: true, userId: true });

export const patchHabitSchema = insertHabitSchema.partial();

// ===========================================================

export const goals = sqliteTable(
  'goals',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    habitId: integer({ mode: 'number' })
      .references(() => habits.id, { onDelete: 'cascade' })
      .notNull(),
    level: text({ enum: ['A', 'B', 'C'] }).notNull(),
    targetValue: integer({ mode: 'number' }).notNull().default(1),
    unit: text().notNull().default(''),
    description: text().notNull(),
    ...timestamps,
  },
  (table) => [index('habit_id_idx').on(table.habitId)],
);

export const selectGoalSchema = createSelectSchema(goals);

export const insertGoalSchema = createInsertSchema(goals)
  .required({ level: true, habitId: true, description: true })
  .omit({ createdAt: true, updatedAt: true });

export const patchGoalSchema = insertGoalSchema.partial();

// ===========================================================

export const habitLogs = sqliteTable(
  'habit_logs',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    habitId: integer({ mode: 'number' })
      .references(() => habits.id, { onDelete: 'cascade' })
      .notNull(),
    date: text().default(sql`CURRENT_DATE`).notNull(),
    goalLevel: text({ enum: ['A', 'B', 'C'] }).notNull(),
    ...timestamps,
  },
  (table) => [
    index('date_idx').on(table.date),
    unique('habit_id_date_unique').on(table.habitId, table.date),
  ],
);

export const selectHabitLogSchema = createSelectSchema(habitLogs);

export const insertHabitLogSchema = createInsertSchema(habitLogs)
  .required({ habitId: true, goalLevel: true })
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    date: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((date) => {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        return d.getFullYear() === year &&
               d.getMonth() === month - 1 &&
               d.getDate() === day;
      }, {
        message: 'Invalid date'
      })
      .optional()
  });

export const patchHabitLogSchema = insertHabitLogSchema.partial();

// ===========================================================

export const groups = sqliteTable('groups', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  ownerId: integer({ mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});

export const selectGroupSchema = createSelectSchema(groups);

export const insertGroupSchema = createInsertSchema(groups, {
  name: (schema) => schema.min(1).max(100),
})
  .required({ name: true })
  .omit({ createdAt: true, updatedAt: true, ownerId: true });

export const patchGroupSchema = insertGroupSchema.partial();

// ==== ==== ==== ====

export const groupMembers = sqliteTable(
  'group_members',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    groupId: integer({ mode: 'number' })
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer({ mode: 'number' })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index('group_member_id_idx').on(table.userId),
    unique('group_members_unique_on_group_id_user_id').on(
      table.groupId,
      table.userId,
    ),
  ],
);

export const selectGroupMemberSchema = createSelectSchema(groupMembers);

export const insertGroupMemberSchema = createInsertSchema(groupMembers)
  .required({ userId: true })
  .omit({ createdAt: true, updatedAt: true, groupId: true });

export const patchGroupMemberSchema = insertGroupMemberSchema.partial();

// ==== ==== ==== ====

export const groupHabits = sqliteTable(
  'group_habits',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    groupId: integer({ mode: 'number' })
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    habitId: integer({ mode: 'number' })
      .references(() => habits.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index('group_habit_id_idx').on(table.habitId),
    unique('group_habits_unique_on_group_id_habit_id').on(
      table.groupId,
      table.habitId,
    ),
  ],
);

export const selectGroupHabitSchema = createSelectSchema(groupHabits);

export const insertGroupHabitSchema = createInsertSchema(groupHabits)
  .required({ habitId: true })
  .omit({ createdAt: true, updatedAt: true, groupId: true });

export const patchGroupHabitSchema = insertGroupHabitSchema.partial();

// ===========================================================
