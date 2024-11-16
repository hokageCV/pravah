import { OpenAPIHono } from '@hono/zod-openapi';
import { PinoLogger } from 'hono-pino';
import { notFound } from 'stoker/middlewares';
import { EnvType } from './env';
import pinoLogger from './middlewares/logger';
import ValidateEnv from './middlewares/validate-env';

type AppBindings = {
  Bindings: EnvType,
  Variables: {
    logger: PinoLogger;
  }
};

const app = new OpenAPIHono<AppBindings>()

app.use('*', ValidateEnv)
app.use(pinoLogger)

app.get('/', (c) => {
  return c.text(`test key: ${c.env.APIKEY}`);
})

app.notFound(notFound)

export default app
