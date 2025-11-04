export default async function methodOverride(fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.method === 'POST' && request.query && request.query._method) {
      request.raw.method = request.query._method.toUpperCase();
    }
  });
  
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.body && typeof request.body === 'object' && request.body._method) {
      const method = request.body._method.toUpperCase();
      if (['PATCH', 'PUT', 'DELETE'].includes(method)) {
        request.raw.method = method;
        delete request.body._method;
      }
    }
  });
}
