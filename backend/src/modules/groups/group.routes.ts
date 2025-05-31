import { Hono } from 'hono';
import { create as habitsCreate, destroy as habitsDestroy, index as habitsIndex } from './group_habits.controllers';
import { create as membershipCreate, destroy as membershipDestroy, index as membershipIndex, search } from './group_member.controllers';
import { create, destroy, index, joined } from './groups.controllers';

const groupRoutes = new Hono();

groupRoutes.get('/joined', joined)
groupRoutes.post('/', create)
groupRoutes.get('/', index)
groupRoutes.delete('/:groupId', destroy)

groupRoutes.get('/:groupId/members/search', search)
groupRoutes.get('/:groupId/members', membershipIndex)
groupRoutes.post('/:groupId/members', membershipCreate)
groupRoutes.delete('/:groupId/members', membershipDestroy)

groupRoutes.get('/:groupId/habits', habitsIndex)
groupRoutes.post('/:groupId/habits', habitsCreate)
groupRoutes.delete('/:groupId/habits', habitsDestroy)

export default groupRoutes;
