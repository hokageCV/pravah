import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

const handleCors = createMiddleware(async (c, next) => {
  const allowedOrigins: string[] =
    c.env.FRONTEND_URLS?.split(',').map((o: string) => o.trim()) || []

  const middleware = cors({
    origin: allowedOrigins,
    allowHeaders: [
      'X-Custom-Header',
      'Upgrade-Insecure-Requests',
      'Content-Type',
      'Authorization',
    ],
    allowMethods: ['POST', 'PATCH', 'GET', 'OPTIONS', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });

  return middleware(c, next);
});

export default handleCors;
