
# Этап 1. Сборка фронтенда
FROM node:20-alpine AS build

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci
RUN npm install --no-save --package-lock=false @rollup/rollup-linux-x64-musl
# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 2. Сохраняем готовую сборку
FROM alpine:3.20

COPY --from=build /app/dist /dist
