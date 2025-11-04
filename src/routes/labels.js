import * as labelsController from '../controllers/labelsController.js';

export default async (fastify) => {
  // Просмотр списка доступен всем
  fastify.get('/labels', labelsController.index);
  
  // Создание, редактирование и удаление только для залогиненных
  fastify.get('/labels/new', labelsController.newLabel);
  fastify.post('/labels', labelsController.create);
  fastify.get('/labels/:id/edit', labelsController.edit);
  
  // Support both PATCH/DELETE and POST with _method
  fastify.patch('/labels/:id', labelsController.update);
  fastify.delete('/labels/:id', labelsController.destroy);
  fastify.post('/labels/:id', async (request, reply) => {
    const method = request.body?._method?.toUpperCase();
    if (method === 'PATCH') {
      return labelsController.update(request, reply);
    } else if (method === 'DELETE') {
      return labelsController.destroy(request, reply);
    }
    return reply.code(405).send({ error: 'Method not allowed' });
  });
};
