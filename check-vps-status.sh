#!/bin/bash

echo "🖥️ VERIFICACIÓN INTERNA DEL VPS"
echo "==============================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📁 1. ESTRUCTURA DEL PROYECTO${NC}"
echo "--------------------------------"
echo "Directorio del proyecto:"
ls -la /var/www/florkafun/ 2>/dev/null || echo "❌ Directorio no encontrado"

echo ""
echo "Archivos principales:"
[ -f "/var/www/florkafun/package.json" ] && echo "✅ package.json" || echo "❌ package.json"
[ -d "/var/www/florkafun/backend" ] && echo "✅ backend/" || echo "❌ backend/"
[ -d "/var/www/florkafun/dist" ] && echo "✅ dist/ (build frontend)" || echo "❌ dist/"
[ -f "/var/www/florkafun/backend/.env" ] && echo "✅ backend/.env" || echo "❌ backend/.env"

echo ""
echo -e "${BLUE}🔄 2. ESTADO DE PROCESOS PM2${NC}"
echo "--------------------------------"
pm2 status 2>/dev/null || echo "❌ PM2 no está corriendo o no instalado"

echo ""
echo -e "${BLUE}🌐 3. ESTADO DE NGINX${NC}"
echo "------------------------"
systemctl status nginx --no-pager -l 2>/dev/null || echo "❌ Nginx no está corriendo"

echo ""
echo "Configuración de Nginx:"
nginx -t 2>/dev/null && echo "✅ Configuración válida" || echo "❌ Error en configuración"

echo ""
echo -e "${BLUE}🗄️ 4. BASE DE DATOS${NC}"
echo "---------------------"

# Verificar PostgreSQL
systemctl status postgresql --no-pager -l 2>/dev/null || echo "ℹ️ PostgreSQL no está corriendo (puede usar SQLite)"

# Verificar archivos de base de datos
echo "Archivos de base de datos:"
find /var/www/florkafun -name "*.db" -o -name "*.sqlite" 2>/dev/null | head -5

echo ""
echo -e "${BLUE}📊 5. RECURSOS DEL SISTEMA${NC}"
echo "-----------------------------"
echo "Uso de CPU y memoria:"
top -bn1 | grep "Cpu(s)" | head -1
free -h | grep "Mem:"

echo ""
echo "Espacio en disco:"
df -h / | tail -1

echo ""
echo -e "${BLUE}🔍 6. LOGS RECIENTES${NC}"
echo "----------------------"
echo "Últimos logs de Nginx (errores):"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No hay logs de error de Nginx"

echo ""
echo "Últimos logs de PM2:"
pm2 logs --lines 5 2>/dev/null || echo "No hay logs de PM2"

echo ""
echo -e "${BLUE}🌍 7. CONECTIVIDAD EXTERNA${NC}"
echo "-----------------------------"
echo "Verificando conectividad desde el VPS:"

# Test de conectividad saliente
curl -s -o /dev/null -w "GitHub: %{http_code} (%{time_total}s)\n" https://github.com
curl -s -o /dev/null -w "Google: %{http_code} (%{time_total}s)\n" https://google.com

echo ""
echo -e "${BLUE}🔧 8. VERSIONES DE SOFTWARE${NC}"
echo "------------------------------"
echo "Node.js: $(node --version 2>/dev/null || echo 'No instalado')"
echo "NPM: $(npm --version 2>/dev/null || echo 'No instalado')"
echo "PM2: $(pm2 --version 2>/dev/null || echo 'No instalado')"
echo "Nginx: $(nginx -v 2>&1 | cut -d' ' -f3 2>/dev/null || echo 'No instalado')"
echo "Git: $(git --version 2>/dev/null | cut -d' ' -f3 || echo 'No instalado')"

echo ""
echo -e "${BLUE}📈 9. ESTADO FINAL${NC}"
echo "-------------------"

# Verificar puertos locales
echo "Puertos en uso:"
netstat -tlnp 2>/dev/null | grep -E ":80|:443|:1337|:3000" | head -10

echo ""
echo "Verificación interna completada $(date)"