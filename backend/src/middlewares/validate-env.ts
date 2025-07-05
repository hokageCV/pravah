import { validateEnv } from '@/env';
import { createMiddleware } from 'hono/factory';

const ValidateEnv = createMiddleware(async (c, next) => {
  c.env = validateEnv(c.env);
  await next();
});

export default ValidateEnv;
