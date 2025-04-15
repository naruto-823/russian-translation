FROM node:18-alpine

WORKDIR /app

# 首先只复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制环境变量文件
COPY .env ./

# 然后复制其他文件
COPY . .

# 创建必要的目录
RUN mkdir -p /app/public

EXPOSE 3000

CMD ["node", "server.js"] 