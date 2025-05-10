import { createDb } from '@/db';
import { habits, insertHabitSchema, patchHabitSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertHabitSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY);

  let { name, userId, description } = parseResult.data;

  try {
    let [newHabit] = await db.insert(habits)
      .values({ name, userId, description })
      .returning();

    return c.json({ data: newHabit }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating habit' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);

  let url = new URL(c.req.url);
  let userId = url.searchParams.get('user_id');

  try {
    let whereClause = userId ? eq(habits.userId, Number(userId)) : undefined;
    let allHabits = await db.select().from(habits)
      .where(whereClause)
      .all();

    return c.json({ data: allHabits }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching habits' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function show(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [habit] = await db.select().from(habits)
      .where(eq(habits.id, id))
      .limit(1);

    if (!habit) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: habit }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while retrieving habit' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function update(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit ID' }, HttpStatusCodes.BAD_REQUEST);

  let parseResult = patchHabitSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY);

  let { name, userId, description } = parseResult.data;

  let updateFields = Object.fromEntries(
    Object.entries({ name, userId, description }).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(updateFields).length === 0) return c.json({ error: 'No fields provided to update' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [updatedHabit] = await db.update(habits)
      .set(updateFields)
      .where(eq(habits.id, id))
      .returning();

    if (!updatedHabit) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: updatedHabit }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while updating habit' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing habit ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let result = await db.delete(habits)
      .where(eq(habits.id, id))
      .run();
    if (result.rowsAffected === 0) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: id }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting habit' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
