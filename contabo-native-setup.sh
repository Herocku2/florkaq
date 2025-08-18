#!/bin/bash

echo "🚀 Configuración Nativa para Contabo VPS (Sin Docker)"
echo "=================================================="

# Variables
DOMAIN="florkafun.com"
USER="root"
PROJECT_DIR="/var/www/florkafun"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "📦 Instalando dependencias del sistema..."

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar Nginx
apt install -y nginx

# Instalar PM2 globalmente
npm install -g pm2

# Instalar Certbot para SSL
apt install -y certbot python3-certbot-nginx

echo "🗄️ Configurando PostgreSQL..."

# Configurar PostgreSQL
sudo -u postgres psql << EOF
CREATE DATABASE florkafun;
CREATE USER florkafun_user WITH ENCRYPTED PASSWORD 'florkafun_secure_password_2024';
GRANT ALL PRIVILEGES ON DATABASE florkafun TO florkafun_user;
ALTER USER florkafun_user CREATEDB;
\q
EOF

echo "📁 Creando estructura de directorios..."

# Crear directorios
mkdir -p $PROJECT_DIR
mkdir -p $BACKEND_DIR
mkdir -p $FRONTEND_DIR
mkdir -p /var/log/florkafun

# Cambiar permisos
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

echo "✅ Sistema base configurado!"
echo ""
echo "Siguiente paso: Clonar repositorio y configurar aplicaciones"