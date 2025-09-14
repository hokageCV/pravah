import { createDb } from '@/db';
import {
  groupHabits,
  groupMembers,
  groups,
  habitLogs,
  habits,
  insertGroupSchema,
  users,
} from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();
  let userId = c.get('currentUser').id;

  let parseResult = insertGroupSchema.safeParse(body);
  if (!parseResult.success) {
    console.error(
      '❌ Group insert validation failed:',
      parseResult.error.format(),
    );
    return c.json(
      { error: 'Required fields missing' },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  let { name } = parseResult.data;

  try {
    let group = await db.transaction(async (tx) => {
      let [group] = await tx
        .insert(groups)
        .values({ name, ownerId: userId })
        .returning();
      await tx.insert(groupMembers).values({ userId, groupId: group.id });

      return group;
    });

    return c.json({ data: group }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while creating group',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  try {
    let allGroups = await db
      .select()
      .from(groups)
      .where(eq(groups.ownerId, userId))
      .all();

    return c.json({ data: allGroups }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while fetching groups',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function joined(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  try {
    let joinedGroups = await db
      .selectDistinct({
        id: groups.id,
        name: groups.name,
        ownerId: groups.ownerId,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .innerJoin(groupMembers, eq(groupMembers.groupId, groups.id))
      .where(eq(groupMembers.userId, userId))
      .all();

    return c.json({ data: joinedGroups }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while fetching joined groups',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);
  let groupId = Number(c.req.param('groupId'));

  if (!groupId || Number.isNaN(groupId))
    return c.json(
      { error: 'Invalid or missing group ID' },
      HttpStatusCodes.BAD_REQUEST,
    );

  let userId = c.get('currentUser').id;

  try {
    let result = await db
      .delete(groups)
      .where(and(eq(groups.id, groupId), eq(groups.ownerId, userId)))
      .run();

    if (result.rowsAffected === 0)
      return c.json(
        { error: 'Group not found or not owned by user' },
        HttpStatusCodes.NOT_FOUND,
      );

    return c.json({ data: groupId }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while deleting group',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function getGrades(c: Context) {
  let db = createDb(c.env);
  let groupId = Number(c.req.param('groupId'));
  let month = Number(c.req.param('month'));
  let year = Number(c.req.param('year'));

  if (
    !groupId ||
    Number.isNaN(groupId) ||
    !month ||
    Number.isNaN(month) ||
    !year ||
    Number.isNaN(year)
  ) {
    return c.json(
      { error: 'Invalid or missing group ID, month, or year' },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  let startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  let endDate = new Date(year, month, 0).toISOString().split('T')[0];

  try {
    let grades = await db
      .select({
        userId: users.id,
        username: users.username,
        // Use COALESCE to handle NULL values from LEFT JOIN
        grade: sql<number>`
          COALESCE(
            SUM(
              CASE ${habitLogs.goalLevel}
                WHEN 'A' THEN 3
                WHEN 'B' THEN 2
                WHEN 'C' THEN 1
                ELSE 0
              END
            ),
            0
          )`.as('grade'),
      })
      .from(groupMembers)
      .innerJoin(users, eq(users.id, groupMembers.userId))
      .leftJoin(groupHabits, eq(groupHabits.groupId, groupMembers.groupId))
      .leftJoin(
        habits,
        and(
          eq(habits.id, groupHabits.habitId),
          eq(habits.userId, groupMembers.userId),
        ),
      )
      // LEFT JOIN habitLogs to include members even if they have no logs in the date range
      .leftJoin(
        habitLogs,
        and(
          eq(habitLogs.habitId, habits.id),
          gte(habitLogs.date, startDate),
          lte(habitLogs.date, endDate),
        ),
      )
      .where(eq(groupMembers.groupId, groupId))
      .groupBy(users.id, users.username)
      .orderBy(sql`grade DESC`)
      .all();

    return c.json({ data: grades }, HttpStatusCodes.OK);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Some error while fetching grades',
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
