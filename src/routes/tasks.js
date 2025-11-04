import * as tasksController from '../controllers/tasksController.js';

export default async (fastify) => {
  // Просмотр списка и отдельной задачи доступен всем
  fastify.get('/tasks', tasksController.index);
  fastify.get('/tasks/:id', tasksController.show);
  
  // Создание и редактирование только для залогиненных
  fastify.get('/tasks/new', tasksController.newTask);
  fastify.post('/tasks', tasksController.create);
  fastify.get('/tasks/:id/edit', tasksController.edit);
  
  // Support both PATCH/DELETE and POST with _method
  fastify.patch('/tasks/:id', tasksController.update);
  fastify.delete('/tasks/:id', tasksController.destroy);
  fastify.post('/tasks/:id', async (request, reply) => {
    const method = request.body?._method?.toUpperCase();
    if (method === 'PATCH') {
      return tasksController.update(request, reply);
    } else if (method === 'DELETE') {
      return tasksController.destroy(request, reply);
    }
    return reply.code(405).send({ error: 'Method not allowed' });
  });
};
