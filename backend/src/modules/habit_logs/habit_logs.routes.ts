import { Hono } from 'hono';
import {
  create,
  destroy,
  getStreaks,
  getWeeklyLogs,
  groupLogs,
  index,
  show,
  update,
} from './habit_logs.controllers';

const habitLogRoutes = new Hono();

habitLogRoutes.get('/grouped-logs', groupLogs);
habitLogRoutes.get('/streaks', getStreaks);
habitLogRoutes.get('/weekly', getWeeklyLogs);
habitLogRoutes.get('/', index);
habitLogRoutes.get('/:id', show);
habitLogRoutes.post('/', create);
habitLogRoutes.patch('/:id', update);
habitLogRoutes.delete('/:id', destroy);

export default habitLogRoutes;
