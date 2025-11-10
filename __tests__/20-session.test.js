import fastify from 'fastify';
import init from '../server/plugin.js';
import { prepareData } from './helpers/index.js';

let app;
let knex;

const runServer = async (appInstance) => {
  await appInstance.ready();
};

describe('test session', () => {
  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false,
    });
    await init(app);
    await app.ready();
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('sign in / sign out', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: {
          email: 'lawrence.kulas87@outlook.com',
          password: 'O6AvLIQL1cbzrre', // NOSONAR - test password
        },
      },
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});

