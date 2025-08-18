#!/bin/bash

# 🚀 Script de deployment completo con SSL para Florka Fun
# Ejecutar como: bash deploy-with-ssl.sh

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

log "🚀 Iniciando deployment con SSL..."

# Verificar archivos SSL
if [ ! -f "ssl/florkafun.crt" ] || [ ! -f "ssl/florkafun.key" ]; then
    error "Archivos SSL no encontrados. Asegúrate de tener ssl/florkafun.crt y ssl/florkafun.key"
fi

# Hacer push de los cambios
log "📤 Haciendo push de cambios..."
git add .
git commit -m "Add SSL certificates and nginx configuration" || true
git push origin main

log "⏳ Esperando 10 segundos para que GitHub Actions procese..."
sleep 10

# Conectar al servidor y ejecutar comandos
log "🔗 Conectando al servidor para configurar SSL..."

# Aquí necesitarás reemplazar con tu IP y usuario
SERVER_IP="84.247.140.138"
SERVER_USER="root"

# Comando para ejecutar en el servidor
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

echo "🔄 Actualizando repositorio en servidor..."
cd /opt/florka-fun
git pull origin main

echo "🔐 Instalando certificados SSL..."
# Crear directorios SSL
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Copiar certificados
sudo cp ssl/florkafun.crt /etc/ssl/certs/florkafun.crt
sudo cp ssl/florkafun.key /etc/ssl/private/florkafun.key

# Establecer permisos
sudo chmod 644 /etc/ssl/certs/florkafun.crt
sudo chmod 600 /etc/ssl/private/florkafun.key
sudo chown root:root /etc/ssl/certs/florkafun.crt
sudo chown root:root /etc/ssl/private/florkafun.key

echo "🌐 Configurando Nginx con SSL..."
# Ejecutar script de configuración SSL
sudo bash setup-nginx-cloudflare-ssl.sh

echo "🔍 Verificando servicios..."
# Verificar que los servicios estén corriendo
if ! pgrep -f "npm.*dev" > /dev/null; then
    echo "⚠️ Frontend no está corriendo, iniciando..."
    cd /opt/florka-fun
    nohup npm run dev > frontend.log 2>&1 &
fi

if ! pgrep -f "strapi.*develop" > /dev/null; then
    echo "⚠️ Backend no está corriendo, iniciando..."
    cd /opt/florka-fun/backend
    nohup npm run develop > ../backend.log 2>&1 &
fi

echo "⏳ Esperando que los servicios inicien..."
sleep 15

echo "🧪 Probando conexiones..."
# Probar conexiones locales
curl -f http://localhost:5173 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend FAIL"
curl -f http://localhost:1337/admin > /dev/null && echo "✅ Backend OK" || echo "❌ Backend FAIL"

echo "🎉 Deployment completado!"
echo "🌐 Tu sitio debería estar disponible en:"
echo "   https://florkafun.online"
echo "   https://florkafun.online/admin"

ENDSSH

log "✅ Deployment completado!"
log "🌐 Verifica tu sitio en: https://florkafun.online"
log "🔧 Admin panel: https://florkafun.online/admin"

echo ""
echo "🔍 Para verificar el estado:"
echo "   curl -I https://florkafun.online"
echo "   ssh $SERVER_USER@$SERVER_IP 'systemctl status nginx'"
echo ""