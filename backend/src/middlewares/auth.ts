import { createDb } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Context, MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

type UserTokenPayload = { userId: number };

const jwtMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: 'Unauthorized' }, 401);

    try {
      await verify(token, c.env.JWT_SECRET);
      await next();
    } catch {
      return c.json({ error: 'Invalid token' }, 401);
    }
  };
};

const currentUser = (): MiddlewareHandler => {
  return async (c: Context, next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) return c.json({ error: 'Unauthorized' }, 401);

    let payload: UserTokenPayload;
    try {
      payload = (await verify(token, c.env.JWT_SECRET)) as UserTokenPayload;
    } catch {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const db = createDb(c.env);
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .get();

    if (!user) return c.json({ error: 'User not found' }, 401);

    c.set('currentUser', user);
    await next();
  };
};

export const secureRoute = (app: any, path: string, router: typeof app) => {
  app.use(`${path}/*`, jwtMiddleware());
  app.use(`${path}/*`, currentUser());

  app.route(path, router);
};
