import * as usersController from '../controllers/usersController.js';
import { requireAuth } from '../middleware/auth.js';

export default async (fastify) => {
  fastify.get('/users', usersController.index);
  fastify.get('/users/new', usersController.newUser);
  fastify.post('/users', usersController.create);
  fastify.get('/users/:id/edit', usersController.edit);
  
  // Support both PATCH/DELETE and POST with _method
  fastify.patch('/users/:id', usersController.update);
  fastify.delete('/users/:id', usersController.destroy);
  fastify.post('/users/:id', async (request, reply) => {
    const method = request.body?._method?.toUpperCase();
    if (method === 'PATCH') {
      return usersController.update(request, reply);
    } else if (method === 'DELETE') {
      return usersController.destroy(request, reply);
    }
    return reply.code(405).send({ error: 'Method not allowed' });
  });
};
