#!/bin/bash

echo "🔧 ARREGLANDO CONFIGURACIÓN DE BASE DE DATOS EN PRODUCCIÓN"
echo "========================================================="

# Verificar si estamos en el VPS
if [ ! -d "/var/www/florkafun" ]; then
    echo "❌ Este script debe ejecutarse en el VPS"
    exit 1
fi

cd /var/www/florkafun/backend

echo "📋 Verificando configuración actual..."

# Backup del .env actual
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Crear .env correcto para producción
cat > .env << 'EOF'
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# URL públicas (ajustan el admin build)
URL=https://florkafun.online
ADMIN_URL=/admin

# DB - PostgreSQL en puerto 5433
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5433
DATABASE_NAME=florkafun
DATABASE_USERNAME=florkafun_user
DATABASE_PASSWORD=florkafun_secure_password_2024
DATABASE_SSL=false

# Claves (mantener las existentes)
APP_KEYS=aK7a+zU3mnin7oUocJmJbWlpOIxFbCvyGJlBxgxhsKg=,mnBzCuEhp3+W6LIz3OPDtZagxT3VAGj1b9Xt1hlSTv4=,UAIoCYToxFFPeRYbD4bJ5vTd8JX19Vz/tzDtumktTHU=,bUzfwypE5q+8Wcz4jvfCJicv+3Mk9V+S7lKrPcj28m0=
API_TOKEN_SALT=aW2aO1JGpZN7G44HmWE4lNIEMfXfNn63j9hoD83yUa4=
ADMIN_JWT_SECRET=62BdVByM7FOqkmKG2FJsVPL7wl/r27RMgILvOmtEgd0=
JWT_SECRET=iTrfiTyIqqkfecie2cAeoGgR2wg6dvUbWdAFgH9baVs=
TRANSFER_TOKEN_SALT=6IVLWnBkIeMU0lACRtLDav5ZoHYgxvAQwjqJfQ5gnV8=

STRAPI_TELEMETRY_DISABLED=true
EOF

echo "✅ Archivo .env actualizado"

# Verificar conexión a la base de datos
echo "🔍 Verificando conexión a PostgreSQL..."
if pg_isready -h 127.0.0.1 -p 5433 -U florkafun_user; then
    echo "✅ PostgreSQL está accesible"
else
    echo "❌ No se puede conectar a PostgreSQL"
    echo "Verificando si PostgreSQL está corriendo..."
    systemctl status postgresql --no-pager
fi

# Reconstruir Strapi
echo "🏗️ Reconstruyendo Strapi..."
npm run build

# Reiniciar PM2
echo "🔄 Reiniciando backend..."
pm2 restart florkafun-backend

echo "✅ Configuración de base de datos restaurada"
echo "🌐 Verifica: https://florkafun.online/admin"