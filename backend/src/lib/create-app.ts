import { AppBindings } from '@/lib/types';
import handleCors from '@/middlewares/cors';
import pinoLogger from '@/middlewares/logger';
import ValidateEnv from '@/middlewares/validate-env';
import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export default function createApp() {
  const app = createRouter()


  app.use('*', ValidateEnv)
  app.use('*', handleCors)

  app.use(serveEmojiFavicon('🍀'))
  app.use(pinoLogger)

  app.notFound(notFound)

  return app
}

