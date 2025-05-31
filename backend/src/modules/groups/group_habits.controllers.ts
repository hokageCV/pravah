import { createDb } from '@/db';
import { groupHabits, habits, insertGroupHabitSchema } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let parseResult = insertGroupHabitSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Group Habit insert validation failed:', parseResult.error.format())
    return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  let { habitId } = parseResult.data

  try {
    let [entry] = await db.insert(groupHabits)
      .values({ groupId, habitId })
      .returning();

    return c.json({ data: entry }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating association.' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) {
    return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);
  }

  try {
    let memberHabits = await db
      .select({ habitId: habits.id, habitName: habits.name })
      .from(groupHabits)
      .innerJoin(habits, eq(groupHabits.habitId, habits.id))
      .where(eq(groupHabits.groupId, groupId))
      .orderBy(habits.name)

    return c.json({ data: memberHabits }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching association.' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();
  let currentUserId = c.get('currentUser').id;

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let habitId = Number(body.habitId);
  if (!habitId || Number.isNaN(habitId)) return c.json({ error: 'Invalid habit ID in request body' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [habit] = await db.select().from(habits)
      .where(eq(habits.id, habitId))
      .limit(1);

    if (!habit) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);
    if (habit.userId !== currentUserId) return c.json({ error: 'Unauthorized: only habit owner can remove habit' }, HttpStatusCodes.FORBIDDEN);

    let result = await db.delete(groupHabits)
      .where(
        and(
          eq(groupHabits.groupId, groupId),
          eq(groupHabits.habitId, habitId)
        )
      )
      .run();

    if (result.rowsAffected === 0) return c.json({ error: 'Habit not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: habitId }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting habit.' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
