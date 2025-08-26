#!/bin/bash

# ☁️ Script de Configuración Cloudflare + SSL - FlorkaFun
# Ejecutar en el VPS después del setup inicial

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

header "☁️ CONFIGURACIÓN CLOUDFLARE + SSL"

# Variables
DOMAIN="florkafun.online"
VPS_IP=$(curl -s ifconfig.me)

log "Paso 1: Instalando Certbot para SSL..."
apt update
apt install -y certbot python3-certbot-nginx

log "Paso 2: Configurando Nginx para Cloudflare..."

# Crear configuración optimizada de Nginx con Cloudflare
cat > /etc/nginx/sites-available/florkafun << EOF
# Configuración optimizada para Cloudflare
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Para verificación de Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirigir todo lo demás a HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Configuración SSL
    ssl_certificate /etc/ssl/certs/florkafun.crt;
    ssl_certificate_key /etc/ssl/private/florkafun.key;
    
    # Configuración SSL optimizada
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # IPs de Cloudflare para obtener IP real del cliente
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # Root del frontend
    root /var/www/florkafun/frontend/dist;
    index index.html;

    # Configuración de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # API del backend - Proxy a Strapi
    location /api {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin panel de Strapi
    location /admin {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend SPA - todas las rutas van a index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Health check endpoint
    location /_health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Logs
    access_log /var/log/nginx/florkafun.access.log;
    error_log /var/log/nginx/florkafun.error.log;
}
EOF

log "Paso 3: Validando configuración de Nginx..."
nginx -t

log "Paso 4: Recargando Nginx..."
systemctl reload nginx

log "Paso 5: Configurando certificados SSL automáticos..."

# Script para renovar certificados automáticamente
cat > /usr/local/bin/florka-ssl-renew << 'EOF'
#!/bin/bash

log() {
    echo "[$(date)] $1"
}

log "Iniciando renovación de certificados SSL..."

# Intentar renovar con Certbot
if certbot renew --nginx --quiet; then
    log "Certificados renovados exitosamente"
    systemctl reload nginx
else
    log "No fue necesario renovar certificados o falló la renovación"
fi

# Verificar que Nginx esté funcionando
if ! systemctl is-active --quiet nginx; then
    log "ERROR: Nginx no está activo, reiniciando..."
    systemctl restart nginx
fi

log "Proceso de renovación completado"
EOF

chmod +x /usr/local/bin/florka-ssl-renew

# Agregar cron job para renovación automática
cat > /etc/cron.d/florka-ssl-renew << 'EOF'
# Renovar certificados SSL cada día a las 2:30 AM
30 2 * * * root /usr/local/bin/florka-ssl-renew >> /var/log/florka-ssl.log 2>&1
EOF

log "Paso 6: Creando script de diagnóstico..."
cat > /usr/local/bin/florka-diagnose << 'EOF'
#!/bin/bash

echo "=== DIAGNÓSTICO FLORKAFUN ==="
echo "Fecha: $(date)"
echo ""

echo "🌐 NGINX:"
systemctl status nginx --no-pager -l | head -10
echo ""

echo "🔒 CERTIFICADOS SSL:"
if [ -f /etc/letsencrypt/live/florkafun.online/cert.pem ]; then
    openssl x509 -in /etc/letsencrypt/live/florkafun.online/cert.pem -text -noout | grep "Not After"
else
    echo "Certificados Let's Encrypt no encontrados"
fi
echo ""

echo "🚀 PM2 PROCESOS:"
pm2 list
echo ""

echo "💾 BASE DE DATOS:"
if [ -f /var/www/florkafun/backend/.tmp/data.db ]; then
    ls -lh /var/www/florkafun/backend/.tmp/data.db
else
    echo "Base de datos no encontrada"
fi
echo ""

echo "🌍 CONECTIVIDAD:"
curl -s -o /dev/null -w "Backend Local: %{http_code}\n" http://localhost:1337/api/_health || echo "Backend: ERROR"
curl -s -o /dev/null -w "Frontend Local: %{http_code}\n" http://localhost/ || echo "Frontend: ERROR"
echo ""

echo "📊 RECURSOS:"
free -h
df -h /
echo ""

echo "📝 LOGS RECIENTES:"
echo "Nginx errors (últimas 5 líneas):"
tail -5 /var/log/nginx/florkafun.error.log 2>/dev/null || echo "No hay errores"
echo ""
EOF

chmod +x /usr/local/bin/florka-diagnose

info "📋 CONFIGURACIÓN CLOUDFLARE COMPLETADA"
echo ""
echo "🌐 IP del servidor: $VPS_IP"
echo "📍 Dominio: $DOMAIN"
echo ""
warning "PASOS SIGUIENTES EN CLOUDFLARE:"
echo "1. Ve a tu panel de Cloudflare"
echo "2. Agrega un registro A para $DOMAIN → $VPS_IP"
echo "3. Agrega un registro A para www.$DOMAIN → $VPS_IP"
echo "4. Configura SSL/TLS mode en 'Full'"
echo "5. Habilita 'Always Use HTTPS'"
echo ""
info "COMANDOS ÚTILES:"
echo "  florka-diagnose     - Diagnóstico completo"
echo "  florka-ssl-renew    - Renovar certificados SSL"
echo "  florka-status       - Estado de servicios"
echo ""
warning "DESPUÉS DE CONFIGURAR CLOUDFLARE, ejecuta:"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"

header "✅ CONFIGURACIÓN LISTA"