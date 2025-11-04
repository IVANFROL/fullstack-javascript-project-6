import * as sessionsController from '../controllers/sessionsController.js';

export default async (fastify) => {
  fastify.get('/session/new', sessionsController.newSession);
  fastify.post('/session', async (request, reply) => {
    const method = request.body?._method?.toUpperCase();
    if (method === 'DELETE') {
      return sessionsController.destroy(request, reply);
    }
    return sessionsController.create(request, reply);
  });
  fastify.delete('/session', sessionsController.destroy);
};
