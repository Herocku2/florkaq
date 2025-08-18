#!/bin/bash

# 🚀 Script de instalación automática para Contabo VPS - Florka Fun
# Ejecutar como: bash contabo-setup.sh

set -e  # Salir si hay algún error

echo "🚀 Iniciando configuración del VPS Contabo para Florka Fun..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    error "Este script debe ejecutarse como root. Usa: sudo bash contabo-setup.sh"
fi

log "Paso 1: Actualizando el sistema..."
apt update && apt upgrade -y

log "Paso 2: Instalando dependencias básicas..."
apt install -y curl wget git ufw htop nano

log "Paso 3: Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    log "Docker instalado correctamente"
else
    info "Docker ya está instalado"
fi

log "Paso 4: Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log "Docker Compose instalado correctamente"
else
    info "Docker Compose ya está instalado"
fi

log "Paso 5: Verificando instalaciones..."
docker --version || error "Docker no se instaló correctamente"
docker-compose --version || error "Docker Compose no se instaló correctamente"

log "Paso 6: Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Frontend
ufw allow 1337/tcp  # Backend
ufw --force enable

log "Paso 7: Creando directorio del proyecto..."
mkdir -p /opt/florka-fun
cd /opt/florka-fun

log "Paso 8: Configurando Docker para iniciar automáticamente..."
systemctl enable docker
systemctl start docker

log "Paso 9: Probando Docker..."
docker run --rm hello-world || error "Docker no funciona correctamente"

log "Paso 10: Configurando logs..."
mkdir -p /var/log/florka-fun

log "Paso 11: Creando usuario para la aplicación..."
if ! id "florka" &>/dev/null; then
    useradd -r -s /bin/false florka
    usermod -aG docker florka
fi

log "Paso 12: Configurando permisos..."
chown -R root:root /opt/florka-fun
chmod 755 /opt/florka-fun

log "Paso 13: Verificando espacio en disco..."
AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
if [ $AVAILABLE_SPACE -lt 5000000 ]; then
    warning "Espacio en disco bajo. Disponible: $(($AVAILABLE_SPACE/1024/1024))GB"
else
    info "Espacio en disco suficiente: $(($AVAILABLE_SPACE/1024/1024))GB disponibles"
fi

log "Paso 14: Configurando swap (si es necesario)..."
if [ $(free | grep Swap | awk '{print $2}') -eq 0 ]; then
    info "Creando archivo swap de 2GB..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

log "Paso 15: Instalando herramientas de monitoreo..."
apt install -y htop iotop nethogs

log "Paso 16: Configurando timezone..."
timedatectl set-timezone UTC

log "Paso 17: Optimizando sistema..."
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
sysctl -p

log "Paso 18: Creando script de mantenimiento..."
cat > /opt/florka-fun/maintenance.sh << 'EOF'
#!/bin/bash
# Script de mantenimiento rápido
echo "=== Estado de Docker ==="
docker ps
echo "=== Uso de disco ==="
df -h
echo "=== Uso de memoria ==="
free -h
echo "=== Logs recientes ==="
tail -20 /var/log/florka-monitor.log 2>/dev/null || echo "No hay logs aún"
EOF
chmod +x /opt/florka-fun/maintenance.sh

echo ""
echo "🎉 ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!"
echo ""
echo "📊 Resumen de la instalación:"
echo "✅ Sistema actualizado"
echo "✅ Docker $(docker --version | cut -d' ' -f3) instalado"
echo "✅ Docker Compose $(docker-compose --version | cut -d' ' -f3) instalado"
echo "✅ Firewall configurado (puertos 22, 80, 443, 3000, 1337)"
echo "✅ Directorio del proyecto: /opt/florka-fun"
echo "✅ Usuario 'florka' creado"
echo "✅ Swap configurado"
echo "✅ Sistema optimizado"
echo ""
echo "🔧 Comandos útiles:"
echo "  Ver estado: /opt/florka-fun/maintenance.sh"
echo "  Ver logs: tail -f /var/log/florka-monitor.log"
echo "  Reiniciar Docker: systemctl restart docker"
echo ""
echo "🚀 Siguiente paso:"
echo "  Haz push a tu repositorio GitHub para activar el deployment automático"
echo ""
echo "🌐 Tu servidor está listo en: http://$(curl -s ifconfig.me)"
echo ""