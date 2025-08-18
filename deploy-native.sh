#!/bin/bash

echo "🚀 Deploy Nativo a Contabo VPS"
echo "=============================="

# Variables
DOMAIN="florkafun.com"
PROJECT_DIR="/var/www/florkafun"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
REPO_URL="https://github.com/Herocku2/kiroflorka.git"

echo "📥 Clonando repositorio..."

# Clonar o actualizar repositorio
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    rm -rf $PROJECT_DIR
    git clone $REPO_URL $PROJECT_DIR
fi

cd $PROJECT_DIR

echo "🔧 Configurando Backend (Strapi)..."

# Copiar backend
cp -r backend/* $BACKEND_DIR/
cd $BACKEND_DIR

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
DATABASE_PASSWORD=florkafun_secure_password_2024
DATABASE_SSL=false

# Secrets (generar nuevos en producción)
APP_KEYS=app-key-1,app-key-2,app-key-3,app-key-4
API_TOKEN_SALT=api-token-salt
ADMIN_JWT_SECRET=admin-jwt-secret
JWT_SECRET=jwt-secret
TRANSFER_TOKEN_SALT=transfer-token-salt

# CORS
STRAPI_ADMIN_BACKEND_URL=https://$DOMAIN
EOF

# Build Strapi
npm run build

echo "🎨 Configurando Frontend (React)..."

# Configurar frontend
cd $PROJECT_DIR
cp -r src public package.json vite.config.js index.html $FRONTEND_DIR/
cd $FRONTEND_DIR

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
cat > $BACKEND_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'florkafun-backend',
    script: './node_modules/@strapi/strapi/bin/strapi.js',
    args: 'start',
    cwd: '$BACKEND_DIR',
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
cd $BACKEND_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "🌐 Configurando Nginx..."

# Crear configuración Nginx
cat > /etc/nginx/sites-available/florkafun << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL certificates (will be configured by Certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Frontend (React build)
    location / {
        root $FRONTEND_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
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
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Deploy completado!"
echo ""
echo "🌐 URLs disponibles:"
echo "Frontend: https://$DOMAIN"
echo "Strapi Admin: https://$DOMAIN/admin"
echo "API: https://$DOMAIN/api"
echo ""
echo "📊 Comandos útiles:"
echo "pm2 status          - Ver estado de procesos"
echo "pm2 logs            - Ver logs"
echo "pm2 restart all     - Reiniciar servicios"
echo "nginx -t            - Verificar configuración Nginx"
echo "systemctl status nginx - Estado de Nginx"