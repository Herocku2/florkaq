#!/bin/bash

# 🚀 Script de Reset y Configuración Completa VPS Contabo - FlorkaFun
# Ejecutar como: bash vps-reset-setup.sh

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script debe ejecutarse como root. Usa: sudo bash vps-reset-setup.sh"
fi

header "🚀 INICIANDO RESET Y CONFIGURACIÓN VPS CONTABO"

# Variables de configuración
DOMAIN="florkafun.online"
USER_NAME="florka"
SSH_DIR="/home/$USER_NAME/.ssh"
PROJECT_DIR="/var/www/florkafun"
GITHUB_REPO="https://github.com/Herocku2/florkaq.git"

log "Paso 1: Actualizando sistema base..."
apt update && apt upgrade -y

log "Paso 2: Instalando dependencias esenciales..."
apt install -y curl wget git ufw nginx nodejs npm build-essential

log "Paso 3: Instalando Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

log "Paso 4: Verificando versiones instaladas..."
node --version
npm --version
nginx -v

log "Paso 5: Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw allow 1337/tcp   # Backend Strapi
ufw allow 5173/tcp   # Frontend Vite (desarrollo)
ufw --force enable

log "Paso 6: Creando usuario del proyecto..."
if ! id "$USER_NAME" &>/dev/null; then
    useradd -m -s /bin/bash $USER_NAME
    usermod -aG sudo $USER_NAME
    log "Usuario $USER_NAME creado"
else
    log "Usuario $USER_NAME ya existe"
fi

log "Paso 7: Configurando directorio SSH para el usuario..."
mkdir -p $SSH_DIR
chown $USER_NAME:$USER_NAME $SSH_DIR
chmod 700 $SSH_DIR

log "Paso 8: Configurando directorio del proyecto..."
mkdir -p $PROJECT_DIR
chown $USER_NAME:$USER_NAME $PROJECT_DIR

log "Paso 9: Configurando Nginx base..."
# Backup de configuración existente
if [ -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
fi

# Crear configuración de Nginx para FlorkaFun
cat > /etc/nginx/sites-available/florkafun << 'EOF'
server {
    listen 80;
    server_name florkafun.online www.florkafun.online;

    # Redirigir todo el tráfico HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name florkafun.online www.florkafun.online;

    # Configuración SSL (se completará después)
    ssl_certificate /etc/ssl/certs/florkafun.crt;
    ssl_certificate_key /etc/ssl/private/florkafun.key;

    # Frontend - Archivos estáticos
    location / {
        root $PROJECT_DIR/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Headers de seguridad
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Backend API - Proxy a Strapi
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

    # Admin panel de Strapi
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

    # Logs
    access_log /var/log/nginx/florkafun.access.log;
    error_log /var/log/nginx/florkafun.error.log;
}
EOF

# Habilitar el sitio
ln -sf /etc/nginx/sites-available/florkafun /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

log "Paso 10: Configurando PM2 para procesos..."
npm install -g pm2

log "Paso 11: Creando configuración PM2 para el proyecto..."
cat > $PROJECT_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'florka-backend',
      script: './backend/node_modules/@strapi/strapi/bin/strapi.js',
      args: 'start',
      cwd: '$PROJECT_DIR',
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
EOF

chown $USER_NAME:$USER_NAME $PROJECT_DIR/ecosystem.config.js

log "Paso 12: Configurando certificados SSL temporales..."
mkdir -p /etc/ssl/certs /etc/ssl/private

# Certificado autofirmado temporal (se reemplazará con Cloudflare)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/florkafun.key \
    -out /etc/ssl/certs/florkafun.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=florkafun.online"

log "Paso 13: Configurando servicio de auto-deploy..."
cat > /usr/local/bin/florka-deploy << 'EOF'
#!/bin/bash

# Script de despliegue automático
set -e

USER_NAME="florka"
PROJECT_DIR="/var/www/florkafun"
REPO_URL="https://github.com/Herocku2/florkaq.git"

log() {
    echo "[$(date)] $1"
}

log "Iniciando despliegue..."

# Cambiar al directorio del proyecto
cd $PROJECT_DIR

# Hacer backup de la base de datos
if [ -f "./backend/.tmp/data.db" ]; then
    cp ./backend/.tmp/data.db ./backend/.tmp/data.db.backup.$(date +%Y%m%d_%H%M%S)
    log "Backup de BD creado"
fi

# Obtener cambios del repositorio
git fetch origin main
git reset --hard origin/main

# Instalar dependencias del backend
cd backend
npm install --production
cd ..

# Instalar dependencias del frontend
npm install

# Construir frontend para producción
npm run build

# Copiar archivos construidos
if [ -d "dist" ]; then
    rm -rf frontend/dist
    mv dist frontend/
    log "Frontend construido y movido"
fi

# Reiniciar servicios
pm2 restart florka-backend || pm2 start ecosystem.config.js
pm2 save

# Recargar Nginx
nginx -t && systemctl reload nginx

log "Despliegue completado exitosamente"
EOF

chmod +x /usr/local/bin/florka-deploy

log "Paso 14: Configurando logrotate..."
cat > /etc/logrotate.d/florkafun << 'EOF'
/var/log/nginx/florkafun.*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

log "Paso 15: Habilitando servicios..."
systemctl enable nginx
systemctl start nginx

# Configurar PM2 para inicio automático
sudo -u $USER_NAME pm2 startup systemd -u $USER_NAME --hp /home/$USER_NAME
pm2 save

log "Paso 16: Creando script de monitoreo..."
cat > /usr/local/bin/florka-status << 'EOF'
#!/bin/bash
echo "=== Estado de FlorkaFun ==="
echo "Nginx:" $(systemctl is-active nginx)
echo "PM2 Procesos:"
pm2 list
echo "=== Uso de recursos ==="
free -h
df -h /
echo "=== Logs recientes ==="
tail -10 /var/log/nginx/florkafun.error.log 2>/dev/null || echo "No hay errores de Nginx"
EOF

chmod +x /usr/local/bin/florka-status

header "✅ CONFIGURACIÓN BASE COMPLETADA"

info "Próximos pasos:"
echo "1. Configurar SSH Key en GitHub Secrets"
echo "2. Configurar GitHub Actions"
echo "3. Configurar DNS en Cloudflare"
echo "4. Obtener certificados SSL de Cloudflare"
echo ""
echo "Comandos útiles:"
echo "  florka-status    - Ver estado del sistema"
echo "  florka-deploy    - Ejecutar despliegue manual"
echo ""
echo "Usuario creado: $USER_NAME"
echo "Directorio del proyecto: $PROJECT_DIR"
echo "Dominio configurado: $DOMAIN"
echo ""
warning "IMPORTANTE: Configura la SSH key antes de continuar"
echo "La SSH key pública debe agregarse a: $SSH_DIR/authorized_keys"

header "🎉 RESET Y CONFIGURACIÓN VPS COMPLETADO"