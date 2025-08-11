#!/bin/bash

# 🌐 Script de configuración de Nginx con certificado CloudFlare
# Dominio: florkafun.online
# Ejecutar como: sudo bash setup-nginx-cloudflare-ssl.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
DOMAIN="florkafun.online"
WWW_DOMAIN="www.florkafun.online"
FRONTEND_PORT="5173"
BACKEND_PORT="1337"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script debe ejecutarse como root. Usa: sudo bash setup-nginx-cloudflare-ssl.sh"
fi

log "🚀 Configurando Nginx con certificado CloudFlare para $DOMAIN..."

# Verificar que existen los archivos de certificado
if [ ! -f "ssl/florkafun.crt" ]; then
    error "No se encuentra el archivo ssl/florkafun.crt"
fi

if [ ! -f "ssl/florkafun.key" ]; then
    error "No se encuentra el archivo ssl/florkafun.key - necesitas la clave privada"
fi

# Instalar certificados
log "📋 Instalando certificados SSL..."
mkdir -p /etc/ssl/certs
mkdir -p /etc/ssl/private

cp ssl/florkafun.crt /etc/ssl/certs/florkafun.crt
cp ssl/florkafun.key /etc/ssl/private/florkafun.key

chmod 644 /etc/ssl/certs/florkafun.crt
chmod 600 /etc/ssl/private/florkafun.key
chown root:root /etc/ssl/certs/florkafun.crt
chown root:root /etc/ssl/private/florkafun.key

log "🔧 Creando configuración de Nginx con SSL..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # Redirect all HTTP requests to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Main HTTPS server with CloudFlare SSL
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # CloudFlare SSL Configuration
    ssl_certificate /etc/ssl/certs/florkafun.crt;
    ssl_certificate_key /etc/ssl/private/florkafun.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Main application (React Frontend)
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Strapi API Backend
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Strapi Admin Panel - CONFIGURACIÓN ESPECIAL PARA SSL
    location /admin {
        proxy_pass http://localhost:$BACKEND_PORT/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        
        # Headers específicos para Strapi admin
        proxy_set_header X-Forwarded-Ssl on;
    }
    
    # Strapi Admin Panel con trailing slash
    location /admin/ {
        proxy_pass http://localhost:$BACKEND_PORT/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        
        # Headers específicos para Strapi admin
        proxy_set_header X-Forwarded-Ssl on;
    }
    
    # Strapi uploads y media
    location /uploads/ {
        proxy_pass http://localhost:$BACKEND_PORT/uploads/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Cache static files
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Habilitar el sitio
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Verificar configuración
log "🔍 Verificando configuración de Nginx..."
nginx -t || error "Error en la configuración de Nginx"

# Recargar nginx
log "🔄 Recargando Nginx..."
systemctl reload nginx

# Verificar certificado
log "🔐 Verificando certificado SSL..."
openssl x509 -in /etc/ssl/certs/florkafun.crt -text -noout | grep -E "(Subject|Issuer|Not After)"

echo ""
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo ""
echo "✅ Certificado CloudFlare instalado"
echo "✅ Nginx configurado con SSL"
echo "✅ Proxy reverso configurado"
echo ""
echo "🌐 Tu sitio está disponible en:"
echo "   https://florkafun.online"
echo "   https://florkafun.online/admin"
echo ""
echo "🔧 Para verificar:"
echo "   curl -I https://florkafun.online"
echo "   systemctl status nginx"
echo ""