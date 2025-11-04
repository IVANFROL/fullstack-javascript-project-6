### Hexlet tests and linter status:
[![Actions Status](https://github.com/IVANFROL/fullstack-javascript-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/IVANFROL/fullstack-javascript-project-6/actions)

## Fullstack JavaScript Project 6

Проект на Fastify для Hexlet.

### Установка

```bash
npm install
```

### Запуск

```bash
npm start
```

Для разработки:
```bash
npm run dev
```

### Переменные окружения

Скопируйте `.env.example` в `.env` и настройте необходимые переменные:

```bash
cp .env.example .env
```

Доступные переменные:
- `PORT` - порт для запуска сервера (по умолчанию: 5000)
- `HOST` - хост для запуска сервера (по умолчанию: 0.0.0.0)
- `NODE_ENV` - окружение (development/production)
- `SESSION_SECRET` - секретный ключ для сессий
- `ROLLBAR_ACCESS_TOKEN` - токен для Rollbar (опционально)

### Настройка Rollbar

1. Создайте бесплатный аккаунт на [Rollbar](https://rollbar.com)
2. Создайте новый проект в Rollbar
3. Скопируйте Server-side access token
4. Добавьте токен в файл `.env`:
   ```
   ROLLBAR_ACCESS_TOKEN=your-rollbar-access-token-here
   ```

Rollbar автоматически отслеживает:
- Ошибки в запросах (500, 404 и т.д.)
- Необработанные исключения (uncaught exceptions)
- Необработанные промисы (unhandled rejections)
- Ошибки при запуске сервера

### Технологии

- **Fastify** - веб-фреймворк для Node.js
- **Pug** - шаблонизатор для серверного рендеринга
- **Bootstrap 5** - CSS фреймворк для создания адаптивного интерфейса
- **i18next** - библиотека для интернационализации
- **dotenv** - управление переменными окружения
- **Rollbar** - сервис для отслеживания ошибок в продакшене

### Структура проекта

```
.
├── src/
│   ├── index.js          # Точка входа приложения
│   └── views/
│       └── index.pug     # Главная страница
├── locales/
│   └── en/
│       └── translation.json  # Тексты для локализации
├── public/               # Статические файлы
└── package.json
```

### Роуты

- `/` - главная страница с меню (вход, регистрация, пользователи)

### Деплой

Проект развернут на Render: [ссылка будет добавлена после деплоя]
