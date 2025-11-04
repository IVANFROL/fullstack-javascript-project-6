import Fastify from 'fastify';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import view from '@fastify/view';
import ejs from 'ejs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({
  logger: true,
});

app.register(import('@fastify/static'), {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

app.register(view, {
  engine: {
    ejs: ejs,
  },
  root: path.join(__dirname, 'views'),
});

app.register(import('@fastify/formbody'));
app.register(import('@fastify/cookie'));
app.register(import('@fastify/flash'));

app.get('/', async (request, reply) => {
  return reply.view('index.ejs', { title: 'Welcome' });
});

const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen({ port, host });
    console.log(`Server is running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  start();
}

export default app;
