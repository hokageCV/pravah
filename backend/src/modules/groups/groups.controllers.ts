import { createDb } from '@/db';
import { groupMembers, groups, insertGroupSchema } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export async function create(c: Context) {
  let db = createDb(c.env);
  let body = await c.req.json();
  let userId = c.get('currentUser').id;

  let parseResult = insertGroupSchema.safeParse(body);
  if (!parseResult.success) {
    console.error('❌ Group insert validation failed:', parseResult.error.format())
    return c.json({ error: parseResult.error.format() }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  let { name } = parseResult.data;

  try {
    let group = await db.transaction(async (tx) => {
      let [group] = await tx.insert(groups).values({ name, ownerId: userId }).returning();
      await tx.insert(groupMembers).values({ userId, groupId: group.id });

      return group;
    });

    return c.json({ data: group }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while creating group' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function index(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  try {
    let allGroups = await db.select().from(groups)
      .where(eq(groups.ownerId, userId))
      .all();

    return c.json({ data: allGroups }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching groups' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function joined(c: Context) {
  let db = createDb(c.env);
  let userId = c.get('currentUser').id;

  try {
    let joinedGroups = await db
      .select({ id: groups.id, name: groups.name, ownerId: groups.ownerId, createdAt: groups.createdAt })
      .from(groups)
      .innerJoin(groupMembers, eq(groupMembers.groupId, groups.id))
      .where(eq(groupMembers.userId, userId))
      .all();

    return c.json({ data: joinedGroups }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching joined groups' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function destroy(c: Context) {
  let db = createDb(c.env);
  let groupId = Number(c.req.param('groupId'));

  if (!groupId || Number.isNaN(groupId)) return c.json({ error: 'Invalid or missing group ID' }, HttpStatusCodes.BAD_REQUEST);

  let userId = c.get('currentUser').id;

  try {
    let result = await db.delete(groups)
      .where(
        and(
          eq(groups.id, groupId),
          eq(groups.ownerId, userId)
        ))
      .run();

    if (result.rowsAffected === 0) return c.json({ error: 'Group not found or not owned by user' }, HttpStatusCodes.NOT_FOUND);

    return c.json({ data: groupId }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while deleting group' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
