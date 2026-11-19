
# Этап 1. Сборка приложения
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Этап 2. Продакшен-образ
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
