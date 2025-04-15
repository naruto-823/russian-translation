FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

# 使用特定版本的 pnpm 以确保兼容性
RUN npm install -g pnpm@7.30.0
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]