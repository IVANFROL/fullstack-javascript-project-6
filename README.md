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

### Технологии

- **Fastify** - веб-фреймворк для Node.js
- **Pug** - шаблонизатор для серверного рендеринга
- **Bootstrap 5** - CSS фреймворк для создания адаптивного интерфейса
- **i18next** - библиотека для интернационализации
- **dotenv** - управление переменными окружения

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
