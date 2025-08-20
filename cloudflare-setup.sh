#!/bin/bash

echo "🌐 CONFIGURACIÓN CLOUDFLARE + BACKEND COMPLETO"
echo "=============================================="

# Variables
DOMAIN="florkafun.online"
VPS_IP="84.247.140.138"
PROJECT_DIR="/var/www/florkafun"

echo "📋 PASOS PARA CONFIGURAR CLOUDFLARE:"
echo ""
echo "1. 🌐 CONFIGURAR DNS EN CLOUDFLARE:"
echo "   Ve a tu panel de Cloudflare → DNS → Records"
echo "   Agrega estos registros:"
echo ""
echo "   Tipo: A"
echo "   Nombre: @"
echo "   Contenido: $VPS_IP"
echo "   Proxy: ✅ Activado (naranja)"
echo ""
echo "   Tipo: A" 
echo "   Nombre: www"
echo "   Contenido: $VPS_IP"
echo "   Proxy: ✅ Activado (naranja)"
echo ""
echo "   Tipo: A"
echo "   Nombre: api"
echo "   Contenido: $VPS_IP"
echo "   Proxy: ✅ Activado (naranja)"
echo ""
echo "2. 🔒 CONFIGURAR SSL EN CLOUDFLARE:"
echo "   Ve a SSL/TLS → Overview"
echo "   Selecciona: 'Full (strict)'"
echo ""
echo "3. ⚡ CONFIGURAR OPTIMIZACIONES:"
echo "   Ve a Speed → Optimization"
echo "   Activa: Auto Minify (HTML, CSS, JS)"
echo "   Activa: Brotli"
echo ""
echo "Presiona Enter cuando hayas configurado Cloudflare..."
read

echo "🔧 Configurando Nginx para Cloudflare..."

# Crear configuración Nginx optimizada para Cloudflare
cat > /etc/nginx/sites-available/florkafun << 'EONGINX'
# Configuración para florkafun.com con Cloudflare
server {
    listen 80;
    listen 443 ssl http2;
    server_name florkafun.online www.florkafun.online;
    
    # SSL Configuration (Cloudflare Origin Certificate)
    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Cloudflare Real IP
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2c0f:f248::/32;
    set_real_ip_from 2a06:98c0::/29;
    real_ip_header CF-Connecting-IP;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Frontend (React build) - Ruta principal
    location / {
        root /var/www/florkafun/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache para archivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }
        
        # Cache para HTML
        location ~* \.(html)$ {
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }
    }
    
    # Strapi Admin Panel - Acceso completo
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts para admin
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API REST completa - Todos los endpoints
    location /api {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers para API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # GraphQL endpoint
    location /graphql {
        proxy_pass http://localhost:1337/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS para GraphQL
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Uploads y archivos multimedia
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache para uploads
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:1337/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Robots.txt
    location /robots.txt {
        root /var/www/florkafun/dist;
        expires 1d;
    }
    
    # Sitemap
    location /sitemap.xml {
        root /var/www/florkafun/dist;
        expires 1d;
    }
}

# Subdominio API dedicado (opcional)
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.florkafun.online;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Cloudflare Real IP
    set_real_ip_from 103.21.244.0/22;
    real_ip_header CF-Connecting-IP;
    
    # API completa en subdominio
    location / {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS completo
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # Admin en subdominio API
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
    }
}
EONGINX

echo "🔒 Generando certificados SSL para Cloudflare..."

# Crear directorio para certificados
mkdir -p /etc/ssl/certs /etc/ssl/private

# Generar certificado autofirmado temporal (hasta que configures Cloudflare Origin Certificate)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/cloudflare-origin.key \
    -out /etc/ssl/certs/cloudflare-origin.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=florkafun.online"

# Configurar permisos
chmod 600 /etc/ssl/private/cloudflare-origin.key
chmod 644 /etc/ssl/certs/cloudflare-origin.pem

echo "⚙️ Configurando Strapi para Cloudflare..."

# Actualizar configuración de Strapi para Cloudflare
cat >> $PROJECT_DIR/backend/.env << 'EOSTRAPI'

# Cloudflare Configuration
STRAPI_ADMIN_BACKEND_URL=https://florkafun.online
STRAPI_ADMIN_CLIENT_URL=https://florkafun.online
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=preview-secret-key

# CORS Configuration
CORS_ENABLED=true
CORS_CREDENTIALS=true
CORS_ORIGIN=https://florkafun.online,https://www.florkafun.online,https://api.florkafun.online

# Trust Proxy (Cloudflare)
TRUST_PROXY=true
EOSTRAPI

echo "🔄 Reiniciando servicios..."

# Verificar configuración de Nginx
nginx -t

if [ $? -eq 0 ]; then
    # Habilitar sitio
    ln -sf /etc/nginx/sites-available/florkafun /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Reiniciar Nginx
    systemctl reload nginx
    
    # Reiniciar Strapi con nueva configuración
    pm2 restart florkafun-backend
    
    echo "✅ CONFIGURACIÓN COMPLETADA!"
    echo ""
    echo "🌐 URLs DISPONIBLES:"
    echo "Frontend: https://florkafun.online"
    echo "Admin Panel: https://florkafun.online/admin"
    echo "API REST: https://florkafun.online/api"
    echo "GraphQL: https://florkafun.online/graphql"
    echo "API Dedicada: https://api.florkafun.online"
    echo ""
    echo "🔐 CREDENCIALES ADMIN:"
    echo "Email: admin@florkafun.com"
    echo "Password: Admin123456"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo "1. Configura DNS en Cloudflare (A records apuntando a $VPS_IP)"
    echo "2. Activa SSL 'Full (strict)' en Cloudflare"
    echo "3. Genera Origin Certificate en Cloudflare y reemplaza los certificados temporales"
    echo "4. ¡Tu aplicación estará lista!"
    
else
    echo "❌ Error en configuración de Nginx. Revisa los logs."
    nginx -t
fi