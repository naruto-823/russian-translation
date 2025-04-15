#!/bin/bash

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "Docker 未运行，正在启动 Docker..."
    open -a Docker
    
    # 等待Docker启动
    echo "等待Docker启动..."
    while ! docker info > /dev/null 2>&1; do
        sleep 1
    done
    echo "Docker 已启动"
fi

# 停止并删除旧容器
docker-compose down

# 构建新镜像并启动容器
docker-compose up -d --build

# 显示容器状态
docker-compose ps