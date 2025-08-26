#!/bin/bash

# 🚀 Script de Configuración Completa FlorkaFun - VPS Ubuntu 22.04
# Ejecutar como root

set -e
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }
header() { echo -e "${PURPLE}=== $1 ===${NC}"; }

header "🚀 INICIANDO CONFIGURACIÓN FLORKAFUN VPS"

# Variables de configuración
USER_NAME="florka"
PROJECT_DIR="/var/www/florkafun"
REPO_URL="https://github.com/Herocku2/florkaq.git"

log "PASO 1: Actualizando sistema Ubuntu 22.04..."
apt update && apt upgrade -y

log "PASO 2: Instalando dependencias básicas..."
apt install -y curl wget git ufw nginx build-essential

log "PASO 3: Instalando Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

log "PASO 4: Verificando versiones instaladas..."
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "Nginx: $(nginx -v 2>&1)"

log "PASO 5: Configurando firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw allow 1337/tcp   # Backend Strapi
ufw --force enable

log "PASO 6: Creando usuario florka..."
if ! id "$USER_NAME" &>/dev/null; then
    useradd -m -s /bin/bash $USER_NAME
    usermod -aG sudo $USER_NAME
    log "Usuario $USER_NAME creado"
else
    log "Usuario $USER_NAME ya existe"
fi

log "PASO 7: Configurando directorio SSH..."
mkdir -p /home/$USER_NAME/.ssh
chown $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh
chmod 700 /home/$USER_NAME/.ssh

log "PASO 8: Preparando SSH key..."
cat > /home/$USER_NAME/.ssh/authorized_keys << 'EOSSH'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCTtkwgN3gZRyiispyWIP+WHn811wJLt86IbMOGlPh77plzG0Cukbwu6VZPGabJZHZS2xQvEWTFyvVp/09H5xIlReYHay/E1ua1EBSHKqsank+vX8sIn0kI/jPEPwRmhDn6YXM4LPmp2PqHYohodBQbujz3YGcpZb2GsEbsPzgYtm0a3rMjP5yRQAB1VO/6asO8slI3wZ8iHJKEqHYFWokm/+SFBA9St/N3jC+93Tjp54xcmVPSrE8D4QoH7+6mYDkHpJ+GcLGtEGTbCPCbmg8cnBc/aUz3KvQgNZSd4XwF8Fz05RDnRBGF1hYXi5gZgQ2Z3tKLyX+PuSNPZN+VKrzJHhWYUQozJil+xk+dERir/pdjyf4wcYxh7rQUUoYbS25yTKRuNQCqKKmkpfa4bvHS49Y3EDExm2fHTPxhndXiAO+vCqmhB/FMSQQ9tXkVUsCCjgwVEYkXj2CXB08HFtXUDu0fUw3lj9tvByBVLBQ/OFEdyAaq709hBktHu635UkeR3i1LQEtG2i1c1cvIQ2yWs5i4aOwWXkeBYSAW/2UXBkiuMHpvRowL1TOWvNdE5a0ZV1eb2ru7XAaV93W+dDw3nG3OXlqV1PapceAGl8llHCJB0dCE1fpcWfaBtzTYOO84yXKbZM6RFthpt+a2u7SFyx2J2Ye+zAC+GoRUx2Je0Q== herockude@gmail.com
EOSSH

chown $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh/authorized_keys
chmod 600 /home/$USER_NAME/.ssh/authorized_keys

log "PASO 9: Configurando directorio del proyecto..."
mkdir -p $PROJECT_DIR
chown $USER_NAME:$USER_NAME $PROJECT_DIR

log "PASO 10: Instalando PM2..."
npm install -g pm2

log "PASO 11: Configurando Nginx para FlorkaFun..."
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

# Limpiar configuraciones anteriores y habilitar el sitio
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/florkafun /etc/nginx/sites-enabled/

log "PASO 12: Verificando y recargando Nginx..."
nginx -t && systemctl reload nginx

header "✅ CONFIGURACIÓN BASE COMPLETADA"
info "Próximo paso: Clonar proyecto y configurar aplicación"
