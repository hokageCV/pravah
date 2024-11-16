import { notFound } from 'stoker/middlewares';
import createApp from '@/lib/create-app';

const app = createApp()

app.get('/', (c) => {
  return c.text(`test key: ${c.env.APIKEY}`);
})

app.notFound(notFound)

export default app
