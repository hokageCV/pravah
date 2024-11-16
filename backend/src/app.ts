import { OpenAPIHono } from '@hono/zod-openapi';
import { PinoLogger } from 'hono-pino';
import { notFound } from 'stoker/middlewares';
import pinoLogger from './middlewares/logger';
import { validateEnv, EnvType } from './env';

type AppBindings = {
  Bindings: EnvType,
  Variables: {
    logger: PinoLogger;
  }
};

const app = new OpenAPIHono<AppBindings>()

app.use(pinoLogger)

app.get('/', (c) => {
  const env = validateEnv(c.env)
  return c.text(`test key: ${env.APIKEY}`);
})

app.notFound(notFound)

export default app
