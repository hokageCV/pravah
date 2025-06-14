import { createDb } from '@/db';
import { insertUserSchema, users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import * as HttpStatusCodes from 'stoker/http-status-codes';


export async function signup(c: Context) {
  let body = await c.req.json();
  let db = createDb(c.env);

  let parseResult = insertUserSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: 'Required fields missing' }, HttpStatusCodes.UNPROCESSABLE_ENTITY);

  let { username, email, password } = parseResult.data;
  let hashedPassword = await bcrypt.hash(password, 10);

  try {
    let [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    }).returning();

    let token = await sign({ userId: newUser.id }, c.env.JWT_SECRET);

    return c.json({ token, user: sanitizeUser(newUser) }, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Error on creating user' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function login(c: Context) {
  let { email, password } = await c.req.json();
  let db = createDb(c.env);
  let JWT_SECRET = c.env.JWT_SECRET;

  let user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ error: 'Invalid email or password' }, HttpStatusCodes.UNAUTHORIZED);

  let isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return c.json({ error: 'Invalid email or password' }, HttpStatusCodes.UNAUTHORIZED);

  let token = await sign({ userId: user.id }, JWT_SECRET);

  return c.json({ token, user: sanitizeUser(user) }, HttpStatusCodes.OK);
}

export async function profile(c: Context) {
  let db = createDb(c.env);
  let JWT_SECRET = c.env.JWT_SECRET;

  let authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED);

  try {
    let token = authHeader.split(' ')[1];
    let decoded = await verify(token, JWT_SECRET);
    if (!decoded) return c.json({ error: 'Invalid token' }, HttpStatusCodes.UNAUTHORIZED);

    let user = await db.select().from(users).where(eq(users.id, Number(decoded.userId))).get();
    if (!user) return c.json({ error: 'User not found' }, HttpStatusCodes.NOT_FOUND);

    return c.json(user, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Some error while fetching user data' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

function sanitizeUser(user: any) {
  let { id, username, email, createdAt, updatedAt } = user;
  return { id, username, email, createdAt, updatedAt };
}
