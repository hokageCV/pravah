import { createDb } from '@/db';
import { goals, habits, insertGoalSchema, patchGoalSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertGoalSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Goal insert validation failed:', parseResult.error.format())
    return c.json({ error: 'Required fields missing.' }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
  }

  let { habitId, level, targetValue, unit, description } = parseResult.data;

  try {
    let existingGoals = await db.select().from(goals)
      .where(eq(goals.habitId, habitId))
      .all();
    if (existingGoals.length >= 3) return c.json({ error: 'A habit can have at most 3 goals' }, HttpStatusCodes.CONFLICT);

    let [newGoal] = await db.insert(goals)
      .values({ habitId, level, targetValue, unit, description })
      .returning();

    return c.json({ data: newGoal }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating goal' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
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

    let allGoals = await db.select().from(goals)
      .where(eq(goals.habitId, habitId))
      .all();

    return c.json({ data: allGoals }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching goals' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function show(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing goal ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [goal] = await db.select().from(goals)
      .where(eq(goals.id, id))
      .limit(1);
    if (!goal) return c.json({ error: 'Goal not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: goal }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while retrieving goal' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function update(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing goal ID' }, HttpStatusCodes.BAD_REQUEST);

  let parseResult = patchGoalSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Goal insert validation failed:', parseResult.error.format())
    return c.json({ error: 'Required fields missing.' }, HttpStatusCodes.UNPROCESSABLE_ENTITY)
  }

  let updateFields = Object.fromEntries(
    Object.entries(parseResult.data).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(updateFields).length === 0) return c.json({ error: 'No fields provided to update' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [updatedGoal] = await db.update(goals)
      .set(updateFields)
      .where(eq(goals.id, id))
      .returning();
    if (!updatedGoal) return c.json({ error: 'Goal not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: updatedGoal }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while updating goal' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: 'Invalid or missing goal ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let result = await db.delete(goals)
      .where(eq(goals.id, id))
      .run();

    if (result.rowsAffected === 0) return c.json({ error: 'Goal not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: id }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting goal' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
