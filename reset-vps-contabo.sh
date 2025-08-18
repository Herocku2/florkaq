#!/bin/bash

echo "🔥 RESET COMPLETO DEL VPS CONTABO"
echo "================================="
echo "⚠️  ADVERTENCIA: Esto eliminará TODA la configuración actual"
echo "⚠️  Presiona Ctrl+C para cancelar, o Enter para continuar..."
read

# Variables
DOMAIN="florkafun.com"
PROJECT_DIR="/var/www/florkafun"
POSTGRES_PASSWORD="florkafun_secure_password_2024"

echo "🧹 Limpiando instalación anterior..."

# Parar todos los servicios
systemctl stop nginx 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Eliminar configuraciones anteriores
rm -rf /etc/nginx/sites-available/florkafun* 2>/dev/null || true
rm -rf /etc/nginx/sites-enabled/florkafun* 2>/dev/null || true
rm -rf $PROJECT_DIR 2>/dev/null || true
rm -rf /var/log/florkafun 2>/dev/null || true

# Limpiar Docker si existe
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker system prune -af 2>/dev/null || true

echo "📦 Actualizando sistema..."

# Actualizar sistema
apt update && apt upgrade -y

echo "🔧 Instalando dependencias..."

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

# Instalar herramientas adicionales
apt install -y git curl wget unzip htop

echo "🗄️ Configurando PostgreSQL..."

# Configurar PostgreSQL
sudo -u postgres psql << EOF
-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS florkafun;
DROP USER IF EXISTS florkafun_user;

-- Crear nueva base de datos
CREATE DATABASE florkafun;
CREATE USER florkafun_user WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE florkafun TO florkafun_user;
ALTER USER florkafun_user CREATEDB;
\q
EOF

echo "📁 Creando estructura de directorios..."

# Crear directorios
mkdir -p $PROJECT_DIR
mkdir -p /var/log/florkafun
mkdir -p /var/backups/florkafun

# Cambiar permisos
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

echo "📥 Clonando repositorio..."

# Clonar repositorio
git clone https://github.com/Herocku2/kiroflorka.git $PROJECT_DIR
cd $PROJECT_DIR

echo "🔧 Configurando Backend (Strapi)..."

cd $PROJECT_DIR/backend

# Instalar dependencias
npm install --production

# Crear archivo de entorno para producción
cat > .env << EOF
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=florkafun
DATABASE_USERNAME=florkafun_user
DATABASE_PASSWORD=$POSTGRES_PASSWORD
DATABASE_SSL=false

# Secrets (generar nuevos en producción)
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)

# CORS
STRAPI_ADMIN_BACKEND_URL=https://$DOMAIN
EOF

# Build Strapi
npm run build

echo "🎨 Configurando Frontend (React)..."

cd $PROJECT_DIR

# Instalar dependencias
npm install

# Crear archivo de entorno
cat > .env.production << EOF
VITE_API_URL=https://$DOMAIN/api
VITE_STRAPI_URL=https://$DOMAIN
EOF

# Build frontend
npm run build

echo "⚙️ Configurando PM2..."

# Crear configuración PM2 para Strapi
cat > $PROJECT_DIR/backend/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'florkafun-backend',
    script: './node_modules/@strapi/strapi/bin/strapi.js',
    args: 'start',
    cwd: '$PROJECT_DIR/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    error_file: '/var/log/florkafun/backend-error.log',
    out_file: '/var/log/florkafun/backend-out.log',
    log_file: '/var/log/florkafun/backend-combined.log',
    time: true
  }]
};
EOF

# Iniciar con PM2
cd $PROJECT_DIR/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "🌐 Configurando Nginx..."

# Crear configuración Nginx
cat > /etc/nginx/sites-available/florkafun << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect HTTP to HTTPS (will be configured by Certbot)
    location / {
        root $PROJECT_DIR/dist;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Strapi uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/florkafun /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

echo "🔒 Configurando SSL con Certbot..."

# Obtener certificado SSL
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "🔥 Configurando Firewall..."

# Configurar UFW
ufw --force reset
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

echo "🎯 Creando usuario administrador de Strapi..."

# Esperar que Strapi esté listo
sleep 30

# Crear usuario admin
cd $PROJECT_DIR/backend
npx strapi admin:create-user --email=admin@florkafun.com --password=Admin123456 --firstname=Admin --lastname=Principal

echo "✅ RESET Y CONFIGURACIÓN COMPLETADOS!"
echo ""
echo "🌐 URLs disponibles:"
echo "Frontend: https://$DOMAIN"
echo "Strapi Admin: https://$DOMAIN/admin"
echo "API: https://$DOMAIN/api"
echo ""
echo "🔐 Credenciales de Strapi Admin:"
echo "Email: admin@florkafun.com"
echo "Password: Admin123456"
echo ""
echo "📊 Comandos útiles:"
echo "pm2 status          - Ver estado de procesos"
echo "pm2 logs            - Ver logs"
echo "pm2 restart all     - Reiniciar servicios"
echo "nginx -t            - Verificar configuración Nginx"
echo "systemctl status nginx - Estado de Nginx"