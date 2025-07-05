import { Hono } from 'hono';
import { create, destroy, index, show, update } from './goal.controllers';

const goalRoutes = new Hono();

goalRoutes.get('/', index);
goalRoutes.get('/:id', show);
goalRoutes.post('/', create);
goalRoutes.patch('/:id', update);
goalRoutes.delete('/:id', destroy);

export default goalRoutes;
