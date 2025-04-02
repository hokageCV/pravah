import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'

const handleCors = createMiddleware(async (c, next) => {
  const middleware = cors({
    origin: c.env.FRONTEND_URL,
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  });

  return middleware(c, next);
});



export default handleCors;
