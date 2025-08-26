#!/bin/bash

# 🚀 Script de Configuración Limpia FlorkaFun - VPS Contabo

set -e
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }

log "🚀 INICIANDO CONFIGURACIÓN LIMPIA DE FLORKAFUN"

# Variables
USER_NAME="florka"
PROJECT_DIR="/var/www/florkafun"
REPO_URL="https://github.com/Herocku2/florkaq.git"

log "1. Creando usuario florka..."
if ! id "$USER_NAME" &>/dev/null; then
    useradd -m -s /bin/bash $USER_NAME
    usermod -aG sudo $USER_NAME
    log "Usuario $USER_NAME creado"
else
    log "Usuario $USER_NAME ya existe"
fi

log "2. Configurando directorio SSH..."
mkdir -p /home/$USER_NAME/.ssh
chown $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh
chmod 700 /home/$USER_NAME/.ssh

log "3. Preparando authorized_keys..."
echo "# SSH Key será agregada aquí" > /home/$USER_NAME/.ssh/authorized_keys
chown $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh/authorized_keys
chmod 600 /home/$USER_NAME/.ssh/authorized_keys

log "4. Configurando directorio del proyecto..."
rm -rf $PROJECT_DIR
mkdir -p $PROJECT_DIR
chown $USER_NAME:$USER_NAME $PROJECT_DIR

log "5. Configurando Nginx..."
cat > /etc/nginx/sites-available/florkafun << 'EON'
server {
    listen 80;
    server_name florkafun.online www.florkafun.online;
    
    location / {
        root /var/www/florkafun/dist;
        try_files $uri $uri/ /index.html;
        
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
    
    location /api {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EON

# Limpiar configuraciones conflictivas
rm -f /etc/nginx/sites-enabled/default*
rm -f /etc/nginx/sites-enabled/florkafun*
ln -sf /etc/nginx/sites-available/florkafun /etc/nginx/sites-enabled/

log "6. Instalando PM2..."
npm install -g pm2

log "7. Creando configuración PM2..."
cat > $PROJECT_DIR/ecosystem.config.js << 'EOP'
module.exports = {
  apps: [
    {
      name: 'florka-backend',
      script: './backend/node_modules/@strapi/strapi/bin/strapi.js',
      args: 'start',
      cwd: '/var/www/florkafun',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 1337,
        DATABASE_CLIENT: 'sqlite',
        DATABASE_FILENAME: './backend/.tmp/data.db'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    }
  ]
};
EOP

chown $USER_NAME:$USER_NAME $PROJECT_DIR/ecosystem.config.js

log "8. Verificando Nginx..."
nginx -t && systemctl reload nginx

log "✅ CONFIGURACIÓN LIMPIA COMPLETADA"
echo ""
echo "🔑 PRÓXIMO PASO: Agregar SSH Key"
echo "Ejecuta en tu MacBook: cat ~/.ssh/id_rsa.pub"
echo "Y agrega la clave SSH al VPS"
