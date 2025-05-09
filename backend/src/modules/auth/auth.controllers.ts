import { createDb } from '@/db';
import { insertUserSchema, users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';


export const signup = async (c: Context) => {
  const body = await c.req.json();
  const db = createDb(c.env);

  const parseResult = insertUserSchema.safeParse(body);
  if (!parseResult.success) return c.json({ error: parseResult.error.format() }, 400);

  const { username, email, password } = parseResult.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    }).returning();

    const token = await sign({ userId: newUser.id }, c.env.JWT_SECRET);

    return c.json({ message: 'User registered', token, user: sanitizeUser(newUser) });
  } catch (error) {
    return c.json({ error: 'User already exists or database error' }, 500);
  }
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();
  const db = createDb(c.env)
  const JWT_SECRET = c.env.JWT_SECRET

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ error: 'Invalid email or password' }, 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return c.json({ error: 'Invalid email or password' }, 401);

  const token = await sign({ userId: user.id }, JWT_SECRET);

  return c.json({ message: 'User logged in', token, user: sanitizeUser(user) });
};

export const profile = async (c: Context) => {
  const db = createDb(c.env)
  const JWT_SECRET = c.env.JWT_SECRET
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await verify(token, JWT_SECRET);
    if (!decoded) return c.json({ error: 'Invalid token' }, 401);

    const user = await db.select().from(users).where(eq(users.id, Number(decoded.userId))).get();
    if (!user) return c.json({ error: 'User not found' }, 404);

    return c.json(user);
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

function sanitizeUser(user: any) {
  const { id, username, email, createdAt, updatedAt } = user;
  return { id, username, email, createdAt, updatedAt };
}
