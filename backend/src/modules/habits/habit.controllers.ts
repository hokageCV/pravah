import { createDb } from '@/db';
import { habits, insertHabitSchema, patchHabitSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';

export const create = async (c: Context) => {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertHabitSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: parseResult.error.format() }, 400);

  let { name, userId, description } = parseResult.data;

  try {
    let [newHabit] = await db.insert(habits)
      .values({ name, userId, description })
      .returning();

    return c.json({ message: 'Habit created', habit: newHabit });
  } catch (error) {
    return c.json({ error: 'Some error while creating habit' }, 500);
  }
};

export const index = async (c: Context) => {
  let db = createDb(c.env);

  let url = new URL(c.req.url);
  let userId = url.searchParams.get('user_id');

  try {
    let whereClause = userId ? eq(habits.userId, Number(userId)) : undefined;
    let allHabits = await db.select().from(habits)
      .where(whereClause)
      .all();

    return c.json({ habits: allHabits });
  } catch (error) {
    return c.json({ error: 'Some error while fetching habits' }, 500);
  }
};

export const show = async (c: Context) => {
  const db = createDb(c.env);

  const id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: { id: 'Invalid or missing habit ID' } }, 400);

  try {
    const [habit] = await db.select().from(habits)
      .where(eq(habits.id, id))
      .limit(1);

    if (!habit) return c.json({ error: 'Habit not found' }, 404);

    return c.json({ habit });
  } catch (error) {
    return c.json({ error: 'Some error while retrieving habit' }, 500);
  }
};

export const update = async (c: Context) => {
  let body = await c.req.json();
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: { id: 'Invalid or missing habit ID' } }, 400);

  let parseResult = patchHabitSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: parseResult.error.format() }, 400);

  let { name, userId, description } = parseResult.data;

  let updateFields = Object.fromEntries(
    Object.entries({ name, userId, description }).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(updateFields).length === 0) return c.json({ error: 'No fields provided to update' }, 400);

  try {
    let [updatedHabit] = await db.update(habits)
      .set(updateFields)
      .where(eq(habits.id, id))
      .returning();

    if (!updatedHabit) return c.json({ error: 'Habit not found' }, 404);

    return c.json({ message: 'Habit updated', habit: updatedHabit });
  } catch (error) {
    return c.json({ error: 'Some error while updating habit' }, 500);
  }
};

export const destroy = async (c: Context) => {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id)) return c.json({ error: { id: 'Invalid or missing habit ID' } }, 400);

  try {
    let result = await db.delete(habits)
      .where(eq(habits.id, id))
      .run();
    if (result.rowsAffected === 0) return c.json({ error: 'Habit not found' }, 404);

    return c.json({ message: 'Habit deleted', id });
  } catch (error) {
    return c.json({ error: 'Some error while deleting habit' }, 500);
  }
};
