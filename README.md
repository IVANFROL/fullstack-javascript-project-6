### Hexlet tests and linter status:
[![Actions Status](https://github.com/IVANFROL/fullstack-javascript-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/IVANFROL/fullstack-javascript-project-6/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=IVANFROL_fullstack-javascript-project-6&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=IVANFROL_fullstack-javascript-project-6)

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

### Деплой

Проект развернут на Render: https://fullstack-javascript-project-6-xfut.onrender.com/
