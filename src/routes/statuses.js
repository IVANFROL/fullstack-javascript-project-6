import * as statusesController from '../controllers/statusesController.js';
import { requireAuth } from '../middleware/auth.js';

export default async (fastify) => {
  // Просмотр списка доступен всем
  fastify.get('/statuses', statusesController.index);
  
  // Создание, редактирование и удаление только для залогиненных
  fastify.get('/statuses/new', statusesController.newStatus);
  fastify.post('/statuses', statusesController.create);
  fastify.get('/statuses/:id/edit', statusesController.edit);
  
  // Support both PATCH/DELETE and POST with _method
  fastify.patch('/statuses/:id', statusesController.update);
  fastify.delete('/statuses/:id', statusesController.destroy);
  fastify.post('/statuses/:id', async (request, reply) => {
    const method = request.body?._method?.toUpperCase();
    if (method === 'PATCH') {
      return statusesController.update(request, reply);
    } else if (method === 'DELETE') {
      return statusesController.destroy(request, reply);
    }
    return reply.code(405).send({ error: 'Method not allowed' });
  });
};
