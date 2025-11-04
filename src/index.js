import Fastify from 'fastify';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import view from '@fastify/view';
import pug from 'pug';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import './lib/db.js';
import { setUser } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация i18next
i18next.use(Backend);
await i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  backend: {
    loadPath: path.join(__dirname, '..', 'locales', '{{lng}}', '{{ns}}.json'),
  },
}).catch((err) => {
  console.error('Failed to initialize i18next with file backend:', err);
  // Fallback инициализация
              return i18next.init({
        lng: 'ru',
        fallbackLng: 'ru',
        resources: {
          ru: {
            translation: {
              common: {
                title: 'Добро пожаловать',
                signIn: 'Войти',
                signUp: 'Регистрация',
                users: 'Пользователи',
                statuses: 'Статусы',
                tasks: 'Задачи',
                labels: 'Метки',
                settings: 'Настройки',
                signOut: 'Выйти',
              },
            },
          },
        },
      });
});

const t = i18next.t.bind(i18next);

const app = Fastify({
  logger: true,
});

app.register(import('@fastify/static'), {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/assets/',
});

app.register(view, {
  engine: {
    pug: pug,
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
  defaultContext: {
    t: t,
  },
});

app.register(import('@fastify/formbody'));
app.register(import('@fastify/cookie'));
app.register(import('@fastify/session'), {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});
app.register(import('@fastify/flash'));
app.register(import('./plugins/methodOverride.js'));

// Middleware для установки текущего пользователя
app.addHook('preHandler', async (request, reply) => {
  await setUser(request, reply);
  request.t = t;
});

// Главная страница
app.get('/', async (request, reply) => {
  return reply.view('index.pug', {
    title: t('common.title'),
    t: t,
    currentUser: request.currentUser,
  });
});

// Роуты
app.register(import('./routes/users.js'), { prefix: '' });
app.register(import('./routes/sessions.js'), { prefix: '' });
app.register(import('./routes/statuses.js'), { prefix: '' });
app.register(import('./routes/tasks.js'), { prefix: '' });
app.register(import('./routes/labels.js'), { prefix: '' });

const start = async () => {
  try {
    const port = process.env.PORT || 5001;
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
