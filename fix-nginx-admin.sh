#!/bin/bash

# 🔧 Script para arreglar configuración de Nginx - Admin de Strapi
# Se ejecuta automáticamente en el deployment

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

log "🔧 Arreglando configuración de Nginx para Admin de Strapi..."

# Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then
    warning "Este script debe ejecutarse como root"
    exit 1
fi

# Crear configuración corregida de Nginx
log "Creando configuración corregida de Nginx..."

cat > /etc/nginx/sites-available/florkafun.online << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name florkafun.online www.florkafun.online;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other HTTP requests to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name florkafun.online www.florkafun.online;
    
    # SSL Configuration
    ssl_certificate /home/cert.pem;
    ssl_certificate_key /home/key.pem;
    
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
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Strapi Admin Panel (sin slash final)
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Strapi Admin Panel (con slash final)
    location /admin/ {
        proxy_pass http://localhost:1337/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Strapi API Backend
    location /api/ {
        proxy_pass http://localhost:1337/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Strapi uploads and media
    location /uploads/ {
        proxy_pass http://localhost:1337/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache static files
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Favicon
    location /favicon.ico {
        proxy_pass http://localhost:5173/favicon.ico;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

log "Verificando configuración de Nginx..."
if nginx -t; then
    log "✅ Configuración de Nginx válida"
    
    log "Reiniciando Nginx..."
    systemctl reload nginx
    
    log "✅ Nginx reiniciado correctamente"
else
    warning "❌ Error en la configuración de Nginx"
    exit 1
fi

log "Verificando que Nginx esté corriendo..."
if systemctl is-active --quiet nginx; then
    log "✅ Nginx está corriendo"
else
    warning "⚠️ Nginx no está corriendo, intentando iniciar..."
    systemctl start nginx
fi

echo ""
echo "🎉 ¡CONFIGURACIÓN DE NGINX COMPLETADA!"
echo ""
echo "📋 Cambios realizados:"
echo "✅ Configuración de admin corregida"
echo "✅ Rutas /admin y /admin/ funcionando"
echo "✅ CORS configurado correctamente"
echo "✅ SSL y seguridad optimizados"
echo ""
echo "🌐 Tu admin panel ahora está disponible en:"
echo "   https://florkafun.online/admin/"
echo ""
echo "🔧 Para verificar:"
echo "   curl -I https://florkafun.online/admin/"
echo "   systemctl status nginx"
echo ""
EOF