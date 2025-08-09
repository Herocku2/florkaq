#!/bin/bash

# 🌐 Script de configuración completa de Nginx para Florka Fun
# Dominio: florkafun.online
# Ejecutar como: bash setup-nginx-proxy.sh

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
DOMAIN="florkafun.online"
WWW_DOMAIN="www.florkafun.online"
FRONTEND_PORT="5173"
BACKEND_PORT="1337"

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

# Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script debe ejecutarse como root. Usa: sudo bash setup-nginx-proxy.sh"
fi

log "🚀 Iniciando configuración de Nginx para $DOMAIN..."

# Paso 1: Actualizar sistema e instalar Nginx
log "Paso 1: Instalando Nginx..."
apt update
apt install nginx -y

# Verificar instalación
systemctl enable nginx
systemctl start nginx

log "Paso 2: Creando backup de configuración original..."
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

log "Paso 3: Configurando Nginx principal..."
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 100M;
    
    # MIME Types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging Settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Include site configurations
    include /etc/nginx/sites-enabled/*;
}
EOF

log "Paso 4: Creando configuración del sitio para $DOMAIN..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other HTTP requests to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN $WWW_DOMAIN;
    
    # SSL Configuration (will be configured by certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
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
        
        # CORS headers for development
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
        
        # Rate limiting for API
        limit_req zone=api burst=20 nodelay;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Strapi Admin Panel
    location /admin/ {
        proxy_pass http://localhost:$BACKEND_PORT/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Rate limiting for admin
        limit_req zone=login burst=5 nodelay;
    }
    
    # Strapi uploads and media
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
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # Favicon
    location /favicon.ico {
        proxy_pass http://localhost:$FRONTEND_PORT/favicon.ico;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

log "Paso 5: Habilitando el sitio..."
# Eliminar sitio por defecto
rm -f /etc/nginx/sites-enabled/default

# Habilitar nuestro sitio
ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Verificar configuración
log "Paso 6: Verificando configuración de Nginx..."
nginx -t || error "Error en la configuración de Nginx"

# Recargar nginx
systemctl reload nginx

log "Paso 7: Configurando firewall..."
# Configurar firewall
ufw allow 'Nginx Full'
ufw allow 'Nginx HTTP'
ufw allow 'Nginx HTTPS'

log "Paso 8: Instalando Let's Encrypt..."
# Instalar certbot
apt install certbot python3-certbot-nginx -y

log "Paso 9: Creando script de monitoreo..."
# Crear script de monitoreo
cat > /opt/florka-fun/nginx-monitor.sh << 'MONITOR_EOF'
#!/bin/bash

LOG_FILE="/var/log/florka-nginx-monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Verificar que nginx esté corriendo
if ! systemctl is-active --quiet nginx; then
    log_message "⚠️ Nginx no está corriendo, reiniciando..."
    systemctl restart nginx
    log_message "✅ Nginx reiniciado"
fi

# Verificar que los servicios backend estén respondiendo
if ! curl -f http://localhost:5173 >/dev/null 2>&1; then
    log_message "⚠️ Frontend no responde en puerto 5173"
fi

if ! curl -f http://localhost:1337/admin >/dev/null 2>&1; then
    log_message "⚠️ Backend no responde en puerto 1337"
fi

# Verificar certificados SSL
if command -v certbot &> /dev/null; then
    if [ -f "/etc/letsencrypt/live/florkafun.online/fullchain.pem" ]; then
        DAYS_LEFT=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/florkafun.online/fullchain.pem | cut -d= -f2 | xargs -I {} date -d {} +%s)
        CURRENT_DATE=$(date +%s)
        DAYS_REMAINING=$(( (DAYS_LEFT - CURRENT_DATE) / 86400 ))
        
        if [ $DAYS_REMAINING -lt 30 ]; then
            log_message "⚠️ Certificado SSL expira en $DAYS_REMAINING días"
        fi
    fi
fi
MONITOR_EOF

chmod +x /opt/florka-fun/nginx-monitor.sh

log "Paso 10: Configurando cron jobs..."
# Agregar al cron para ejecutar cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/florka-fun/nginx-monitor.sh") | crontab -

# Agregar renovación automática de SSL
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

log "Paso 11: Creando script de SSL..."
cat > /opt/florka-fun/setup-ssl.sh << 'SSL_EOF'
#!/bin/bash

echo "🔒 Configurando SSL para florkafun.online..."
echo "⚠️  IMPORTANTE: Asegúrate de que el DNS esté configurado antes de continuar"
echo "   A record: florkafun.online -> 84.247.140.138"
echo "   A record: www.florkafun.online -> 84.247.140.138"
echo ""
read -p "¿Los DNS records están configurados? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d florkafun.online -d www.florkafun.online
    echo "✅ SSL configurado exitosamente"
else
    echo "❌ Configura los DNS records primero, luego ejecuta:"
    echo "   bash /opt/florka-fun/setup-ssl.sh"
fi
SSL_EOF

chmod +x /opt/florka-fun/setup-ssl.sh

log "Paso 12: Verificación final..."
# Verificar estado
systemctl status nginx --no-pager
netstat -tlnp | grep -E '(80|443)' || warning "Puertos 80/443 no están escuchando"

echo ""
echo "🎉 ¡CONFIGURACIÓN DE NGINX COMPLETADA!"
echo ""
echo "📋 Resumen:"
echo "✅ Nginx instalado y configurado"
echo "✅ Proxy reverso configurado para florkafun.online"
echo "✅ Firewall configurado"
echo "✅ Monitoreo automático activado"
echo "✅ Let's Encrypt instalado"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Configura los DNS records en tu proveedor de dominio:"
echo "   A     florkafun.online        84.247.140.138"
echo "   A     www.florkafun.online    84.247.140.138"
echo ""
echo "2. Una vez configurado el DNS, ejecuta:"
echo "   bash /opt/florka-fun/setup-ssl.sh"
echo ""
echo "3. Tu aplicación estará disponible en:"
echo "   🌐 https://florkafun.online"
echo "   🔧 https://florkafun.online/admin"
echo ""
echo "📊 Comandos útiles:"
echo "   systemctl status nginx"
echo "   nginx -t"
echo "   tail -f /var/log/nginx/access.log"
echo "   tail -f /var/log/florka-nginx-monitor.log"
echo ""