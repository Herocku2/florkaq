#!/bin/bash

# 🚨 SCRIPT DE RECUPERACIÓN DE EMERGENCIA - FLORKA FUN
# Usar cuando el VPS se cae completamente

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

log "🚨 INICIANDO RECUPERACIÓN DE EMERGENCIA"
log "======================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No estás en el directorio del proyecto. Ve a /opt/florka-fun"
    exit 1
fi

log "1️⃣ Deteniendo todos los servicios..."
docker-compose down --remove-orphans || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

log "2️⃣ Limpiando Docker completamente..."
docker system prune -af || true
docker volume prune -f || true
docker network prune -f || true

log "3️⃣ Creando configuración mínima..."

# Crear .env simple
cat > .env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://florkafun.online:1337/api
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOF

# Crear docker-compose simple
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.simple
    ports:
      - "1337:1337"
    environment:
      - NODE_ENV=production
      - DATABASE_CLIENT=sqlite
      - DATABASE_FILENAME=.tmp/data.db
    volumes:
      - ./backend/.tmp:/opt/app/.tmp
      - ./backend/public:/opt/app/public
    restart: always
    
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.simple
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=https://florkafun.online:1337/api
    depends_on:
      - backend
    restart: always
EOF

# Crear Dockerfile simple para backend
cat > backend/Dockerfile.simple << 'EOF'
FROM node:18-alpine

WORKDIR /opt/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN mkdir -p .tmp
RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
EOF

# Crear Dockerfile simple para frontend
cat > Dockerfile.simple << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=https://florkafun.online:1337/api
RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "build", "-l", "5173"]
EOF

log "4️⃣ Construyendo servicios..."
docker-compose -f docker-compose.simple.yml build --no-cache

log "5️⃣ Iniciando servicios..."
docker-compose -f docker-compose.simple.yml up -d

log "6️⃣ Esperando que los servicios estén listos..."
sleep 30

# Verificar servicios
if docker-compose -f docker-compose.simple.yml ps | grep -q "Up"; then
    log "✅ RECUPERACIÓN EXITOSA!"
    echo ""
    info "🌐 Frontend: http://$(curl -s ifconfig.me):5173"
    info "🔧 Backend: http://$(curl -s ifconfig.me):1337"
    info "👨‍💼 Admin: http://$(curl -s ifconfig.me):1337/admin"
    echo ""
    log "Para ver logs:"
    echo "  docker-compose -f docker-compose.simple.yml logs -f"
else
    error "❌ La recuperación falló. Revisa los logs:"
    docker-compose -f docker-compose.simple.yml logs
    exit 1
fi

log "======================================"
log "🎉 RECUPERACIÓN COMPLETADA"