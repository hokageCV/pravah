import { createDb } from '@/db';
import { groupHabits, habitLogs, habits, insertHabitLogSchema, patchHabitLogSchema } from '@/db/schema';
import { parseConstraint } from '@/utils/error';
import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertHabitLogSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ HabitLog insert validation failed:', parseResult.error.format())
    return c.json({ error: 'Required fields missing' }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
  }

  let userId = c.get('currentUser').id;
  let { habitId, goalLevel } = parseResult.data;

  try {
    let [habit] = await db.select().from(habits)
      .where(eq(habits.id, habitId))
      .limit(1);
    if (!habit) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);
    if (habit.userId !== userId) return c.json({ error: 'You do not have access to this habit' }, HttpStatusCodes.FORBIDDEN);

    let [newHabitLog] = await db.insert(habitLogs)
      .values({ habitId, goalLevel })
      .returning();

    return c.json({ data: newHabitLog }, HttpStatusCodes.CREATED);
  } catch (error) {
    if (!(error instanceof Error)) return c.json({ error: 'An unknown error occurred.' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);

    let constraint = parseConstraint(error);
    if (constraint?.type === 'unique') return c.json({ error: 'You have already logged this habit for today.' }, HttpStatusCodes.CONFLICT);

    return c.json({ error: error.message }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  let url = new URL(c.req.url);
  let habitIdParam = url.searchParams.get('habit_id');
  let habitId = Number(habitIdParam);
  if (!habitIdParam || Number.isNaN(habitId)) return c.json({ error: 'Missing or invalid habit_id' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [habit] = await db.select().from(habits)
      .where(eq(habits.id, habitId))
      .limit(1);
    if (!habit) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);
    if (habit.userId !== userId) return c.json({ error: 'You do not have access to this habit' }, HttpStatusCodes.FORBIDDEN);

    let allHabitLogs = await db.select().from(habitLogs)
      .where(eq(habitLogs.habitId, habitId))
      .all();

    return c.json({ data: allHabitLogs }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching habit logs' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function show(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit log ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [habitLog] = await db.select().from(habitLogs)
      .where(eq(habitLogs.id, id))
      .limit(1);
    if (!habitLog) return c.json({ error: 'Habit log not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: habitLog }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while retrieving habit log' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function update(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit log ID' }, HttpStatusCodes.BAD_REQUEST);

  let parseResult = patchHabitLogSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Habit log insert validation failed:', parseResult.error.format())
    return c.json({ error: 'Required fields missing' }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
  }

  let updateFields = Object.fromEntries(
    Object.entries(parseResult.data).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(updateFields).length === 0) return c.json({ error: 'No fields provided to update' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [updatedHabitLog] = await db.update(habitLogs)
      .set(updateFields)
      .where(eq(habitLogs.id, id))
      .returning();
    if (!updatedHabitLog) return c.json({ error: 'Habit log not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: updatedHabitLog }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while updating habit log' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit log ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let result = await db.delete(habitLogs)
      .where(eq(habitLogs.id, id))
      .run();

    if (result.rowsAffected === 0) return c.json({ error: 'Habit log not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: id }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting habit log' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function groupLogs(c: Context) {
  let db = createDb(c.env);

  let url = new URL(c.req.url);
  let groupIdParam = url.searchParams.get('group_id');
  let groupId = Number(groupIdParam);
  if (!groupId) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let now = new Date()
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  let startStr = startOfMonth.toISOString().split('T')[0]
  let endStr = endOfMonth.toISOString().split('T')[0]

  try {
    let habitData = await db
      .select({ habitId: groupHabits.habitId })
      .from(groupHabits)
      .where(eq(groupHabits.groupId, groupId));

    let habitIds = habitData.map(h => h.habitId);
    if (habitIds.length === 0) return c.json({ data: [] }, HttpStatusCodes.OK);

    let logs = await db.select().from(habitLogs)
      .where(
        and(
          inArray(habitLogs.habitId, habitIds),
          gte(habitLogs.date, startStr),
          lte(habitLogs.date, endStr)
        ))
      .orderBy(habitLogs.habitId);

    return c.json({ data: logs }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : 'Some error while fetching with habit logs' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
