# PeopleHub Telegram Bot

Telegram бот для мини-приложения такси PeopleHub.

## Деплой на Render

1. Создайте Web Service на [render.com](https://render.com)
2. Подключите этот репозиторий
3. Настройки:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Добавьте Environment Variables:
   - `BOT_TOKEN` = ваш токен бота
   - `WEB_APP_URL` = `https://taxi-eb8b7.web.app`
   - `WEBHOOK_URL` = `https://ваш-сервис.onrender.com`

## Локальная разработка

```bash
cp .env.example .env
# Заполните BOT_TOKEN в .env
npm install
npm run dev
```

## Команды бота

- `/start` — Открыть приложение
- `/help` — Помощь
- `/about` — О платформе
- `/support` — Поддержка
