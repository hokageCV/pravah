import { createDb } from '@/db';
import { groupHabits, groupMembers, groups, habits, insertGroupMemberSchema, users } from '@/db/schema';
import { sanitizeInput } from '@/utils/text';
import { and, eq, isNull, like } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let parseResult = insertGroupMemberSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Group Member insert validation failed:', parseResult.error.format())
    return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  let { userId } = parseResult.data;

  try {
    let [member] = await db.insert(groupMembers)
      .values({ groupId, userId })
      .returning();

    return c.json({ data: member }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating membership' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let members = await db
      .selectDistinct({ userId: users.id, username: users.username })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(users.username);

    return c.json({ data: members }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching membership' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function membersWithHabits(c: Context) {
  let db = createDb(c.env);

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let members = await db
      .selectDistinct({ userId: users.id, userName: users.username, habitId: habits.id, habitName: habits.name, habitCreatedAt: habits.createdAt })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .innerJoin(habits, eq(habits.userId, users.id))
      .innerJoin(groupHabits, eq(groupHabits.habitId, habits.id))
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupHabits.groupId, groupId) // select habits only from given group
        )
      )
      .orderBy(users.username);

    return c.json({ data: members }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : 'Some error while fetching members with habits' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();
  let currentUserId = c.get('currentUser').id;

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let userId = Number(body.userId);
  if (!userId || Number.isNaN(userId)) return c.json({ error: 'Invalid user ID in request body' }, HttpStatusCodes.BAD_REQUEST);

  try {
    let [group] = await db.select().from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) return c.json({ error: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
    if (group.ownerId !== currentUserId) return c.json({ error: 'Unauthorized: only group owner can remove members' }, HttpStatusCodes.FORBIDDEN);
    if (userId === currentUserId) return c.json({ error: 'Owner cannot remove themselves from group membership' }, HttpStatusCodes.BAD_REQUEST);

    let result = await db.delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      )
      .run();

    if (result.rowsAffected === 0) return c.json({ error: 'Membership not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: userId }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting membership' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function search(c: Context) {
  let db = createDb(c.env);

  let url = new URL(c.req.url);
  let raw_query = (url.searchParams.get('query') || '').trim().toLowerCase();
  if (!raw_query) return c.json({ error: 'Search query not found.' }, HttpStatusCodes.UNPROCESSABLE_ENTITY)

  let groupId = Number(c.req.param('groupId'));
  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid group ID' }, HttpStatusCodes.BAD_REQUEST);

  let search_query = sanitizeInput(raw_query);

  try {
    let matchedUsers = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .leftJoin(
        groupMembers,
        and(
          eq(groupMembers.userId, users.id),
          eq(groupMembers.groupId, groupId)
        )
      )
      .where(
        and(
          like(users.username, `%${search_query}%`),
          isNull(groupMembers.userId)
        )
      )
      .limit(10)

    return c.json({ data: matchedUsers }, HttpStatusCodes.OK);
  }
  catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching users' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
