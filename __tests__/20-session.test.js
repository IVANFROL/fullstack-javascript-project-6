import { setupTestApp, setupTestContext } from './helpers/index.js';
import { prepareData } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;

  beforeAll(async () => {
    app = await setupTestApp();
    const context = await setupTestContext(app);
    knex = context.knex;
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

