import { Hono } from 'hono';
import {
  create,
  destroy,
  groupLogs,
  index,
  show,
  update,
} from './habit_logs.controllers';

const habitLogRoutes = new Hono();

habitLogRoutes.get('/grouped-logs', groupLogs);
habitLogRoutes.get('/', index);
habitLogRoutes.get('/:id', show);
habitLogRoutes.post('/', create);
habitLogRoutes.patch('/:id', update);
habitLogRoutes.delete('/:id', destroy);

export default habitLogRoutes;
