import { createDb } from '@/db';
import { habitLogs, habits, insertHabitLogSchema, patchHabitLogSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertHabitLogSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ HabitLog insert validation failed:', parseResult.error.format())
    return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
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
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating habit log' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
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
    return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
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
