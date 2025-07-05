import { createDb } from '@/db';
import { habits, insertHabitSchema, patchHabitSchema } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertHabitSchema.safeParse(body);
  if (!parseResult.success) {
    console.error(
      '❌ Habit insert validation failed:',
      parseResult.error.format(),
    );
    return c.json(
      { error: 'Required fields missing' },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  let userId = c.get('currentUser').id;
  let { name, description } = parseResult.data;

  try {
    let [newHabit] = await db
      .insert(habits)
      .values({ name, userId, description })
      .returning();

    return c.json({ data: newHabit }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while creating habit',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  try {
    let whereClause = userId ? eq(habits.userId, userId) : undefined;
    let allHabits = await db.select().from(habits).where(whereClause).all();

    return c.json({ data: allHabits }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while fetching habits',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function show(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id))
    return c.json(
      { error: 'Invalid or missing habit ID' },
      HttpStatusCodes.BAD_REQUEST,
    );

  try {
    let [habit] = await db
      .select()
      .from(habits)
      .where(eq(habits.id, id))
      .limit(1);

    if (!habit)
      return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: habit }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while retrieving habit',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function update(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id))
    return c.json(
      { error: 'Invalid or missing habit ID' },
      HttpStatusCodes.BAD_REQUEST,
    );

  let parseResult = patchHabitSchema.safeParse(body);
  if (!parseResult.success) {
    console.error(
      '❌ Habit insert validation failed:',
      parseResult.error.format(),
    );
    return c.json(
      { error: 'Required fields missing' },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  let userId = c.get('currentUser').id;

  let { name, description } = parseResult.data;

  let updateFields = Object.fromEntries(
    Object.entries({ name, userId, description }).filter(
      ([_, v]) => v !== undefined,
    ),
  );

  if (Object.keys(updateFields).length === 0)
    return c.json(
      { error: 'No fields provided to update' },
      HttpStatusCodes.BAD_REQUEST,
    );

  try {
    let [updatedHabit] = await db
      .update(habits)
      .set(updateFields)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();

    if (!updatedHabit)
      return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: updatedHabit }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while updating habit',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);

  let id = Number(c.req.param('id'));
  if (!id || Number.isNaN(id))
    return c.json(
      { error: 'Invalid or missing habit ID' },
      HttpStatusCodes.BAD_REQUEST,
    );

  let userId = c.get('currentUser').id;

  try {
    let result = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .run();
    if (result.rowsAffected === 0)
      return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: id }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while deleting habit',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
