#!/bin/bash

echo "🔗 CONECTANDO AL VPS PARA VERIFICACIÓN INTERNA..."
echo "================================================"

# Ejecutar verificación en el VPS via SSH
ssh -o StrictHostKeyChecking=no root@84.247.140.138 << 'EOF'

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
systemctl is-active nginx && echo "✅ Nginx activo" || echo "❌ Nginx inactivo"

echo ""
echo "Configuración de Nginx:"
nginx -t 2>/dev/null && echo "✅ Configuración válida" || echo "❌ Error en configuración"

echo ""
echo -e "${BLUE}🗄️ 4. BASE DE DATOS${NC}"
echo "---------------------"

# Verificar PostgreSQL
systemctl is-active postgresql && echo "✅ PostgreSQL activo" || echo "ℹ️ PostgreSQL inactivo (puede usar SQLite)"

# Verificar archivos de base de datos
echo "Archivos de base de datos:"
find /var/www/florkafun -name "*.db" -o -name "*.sqlite" 2>/dev/null | head -5

echo ""
echo -e "${BLUE}📊 5. RECURSOS DEL SISTEMA${NC}"
echo "-----------------------------"
echo "Uso de memoria:"
free -h | grep "Mem:"

echo ""
echo "Espacio en disco:"
df -h / | tail -1

echo ""
echo -e "${BLUE}🔍 6. LOGS RECIENTES${NC}"
echo "----------------------"
echo "Últimos logs de PM2:"
pm2 logs --lines 3 2>/dev/null || echo "No hay logs de PM2"

echo ""
echo -e "${BLUE}🌍 7. PUERTOS Y PROCESOS${NC}"
echo "-----------------------------"
echo "Puertos en uso:"
netstat -tlnp 2>/dev/null | grep -E ":80|:443|:1337|:3000" | head -5

echo ""
echo -e "${BLUE}🔧 8. VERSIONES DE SOFTWARE${NC}"
echo "------------------------------"
echo "Node.js: $(node --version 2>/dev/null || echo 'No instalado')"
echo "NPM: $(npm --version 2>/dev/null || echo 'No instalado')"
echo "PM2: $(pm2 --version 2>/dev/null || echo 'No instalado')"

echo ""
echo -e "${BLUE}📈 9. ÚLTIMO COMMIT DESPLEGADO${NC}"
echo "--------------------------------"
cd /var/www/florkafun 2>/dev/null && {
    echo "Último commit:"
    git log --oneline -1 2>/dev/null || echo "No es un repositorio git"
    echo ""
    echo "Estado del repositorio:"
    git status --porcelain 2>/dev/null | head -3 || echo "Repositorio limpio"
}

echo ""
echo "✅ Verificación interna completada $(date)"

EOF