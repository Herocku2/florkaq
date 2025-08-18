#!/bin/bash

# Script para verificar el estado SSL y servicios
echo "🔍 Verificando estado SSL y servicios..."

SERVER_IP="84.247.140.138"
SERVER_USER="root"

echo "🌐 Probando conexión HTTPS..."
curl -I https://florkafun.online

echo ""
echo "🔧 Probando admin panel..."
curl -I https://florkafun.online/admin

echo ""
echo "📊 Conectando al servidor para verificar servicios..."

ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
echo "🔍 Estado de nginx:"
systemctl status nginx --no-pager -l

echo ""
echo "🔍 Verificando certificados SSL:"
ls -la /etc/ssl/certs/florkafun.crt /etc/ssl/private/florkafun.key 2>/dev/null || echo "❌ Certificados no encontrados"

echo ""
echo "🔍 Verificando procesos:"
echo "Frontend (puerto 5173):"
netstat -tlnp | grep :5173 || echo "❌ Frontend no está escuchando"

echo "Backend (puerto 1337):"
netstat -tlnp | grep :1337 || echo "❌ Backend no está escuchando"

echo ""
echo "🔍 Procesos de Node.js:"
pgrep -f "npm.*dev" && echo "✅ Frontend corriendo" || echo "❌ Frontend no corriendo"
pgrep -f "strapi.*develop" && echo "✅ Backend corriendo" || echo "❌ Backend no corriendo"

echo ""
echo "🔍 Logs recientes de nginx:"
tail -5 /var/log/nginx/error.log

ENDSSH