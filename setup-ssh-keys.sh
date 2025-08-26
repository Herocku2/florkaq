#!/bin/bash

# 🔐 Script para configurar SSH Keys - FlorkaFun
# Ejecutar en LOCAL primero, luego en VPS

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Detectar si estamos en local o VPS
if [ -f "/etc/hostname" ] && grep -q "vmi" /etc/hostname; then
    LOCATION="VPS"
else
    LOCATION="LOCAL"
fi

if [ "$LOCATION" = "LOCAL" ]; then
    echo "🔐 CONFIGURANDO SSH KEYS EN LOCAL"
    echo "================================"
    
    # Generar SSH key si no existe
    if [ ! -f ~/.ssh/id_rsa ]; then
        log "Generando nueva SSH key..."
        ssh-keygen -t rsa -b 4096 -C "github-actions@florkafun.online" -f ~/.ssh/id_rsa -N ""
    else
        log "SSH key ya existe"
    fi
    
    # Mostrar clave pública
    echo ""
    info "🔑 CLAVE PÚBLICA SSH (copiar al VPS):"
    echo "======================================"
    cat ~/.ssh/id_rsa.pub
    echo "======================================"
    echo ""
    
    # Mostrar clave privada para GitHub Secrets
    echo ""
    warning "🔐 CLAVE PRIVADA SSH (copiar a GitHub Secrets como CONTABO_SSH_KEY):"
    echo "======================================================================="
    cat ~/.ssh/id_rsa
    echo "======================================================================="
    echo ""
    
    info "📋 PASOS SIGUIENTES:"
    echo "1. Copia la CLAVE PÚBLICA y ejecútala en el VPS con este script"
    echo "2. Copia la CLAVE PRIVADA a GitHub Secrets como 'CONTABO_SSH_KEY'"
    echo "3. Agrega también estos secrets a GitHub:"
    echo "   - CONTABO_HOST: [IP_DEL_VPS]"
    echo "   - CONTABO_USER: florka"
    echo ""
    
    # Crear archivo con la IP del VPS para referencia
    read -p "Ingresa la IP de tu VPS Contabo: " VPS_IP
    echo "$VPS_IP" > ~/.ssh/contabo_ip.txt
    
    echo ""
    info "IP del VPS guardada en ~/.ssh/contabo_ip.txt"
    
    # Comando para probar conexión
    echo ""
    info "🧪 COMANDO PARA PROBAR CONEXIÓN SSH:"
    echo "ssh -i ~/.ssh/id_rsa florka@$VPS_IP"
    
elif [ "$LOCATION" = "VPS" ]; then
    echo "🔐 CONFIGURANDO SSH KEYS EN VPS"
    echo "==============================="
    
    # Verificar que estamos como usuario correcto
    if [ "$USER" != "florka" ] && [ "$USER" != "root" ]; then
        echo "Ejecuta como usuario 'florka' o 'root'"
        exit 1
    fi
    
    # Si somos root, cambiar a usuario florka
    if [ "$USER" = "root" ]; then
        USER_NAME="florka"
        SSH_DIR="/home/$USER_NAME/.ssh"
    else
        USER_NAME="$USER"
        SSH_DIR="$HOME/.ssh"
    fi
    
    # Crear directorio SSH
    mkdir -p $SSH_DIR
    chmod 700 $SSH_DIR
    
    echo ""
    warning "Pega la CLAVE PÚBLICA SSH aquí (desde el LOCAL):"
    warning "Presiona Enter después de pegar y luego Ctrl+D"
    echo "=================================================="
    
    # Leer la clave pública
    cat >> $SSH_DIR/authorized_keys
    
    # Configurar permisos
    chmod 600 $SSH_DIR/authorized_keys
    if [ "$USER" = "root" ]; then
        chown -R $USER_NAME:$USER_NAME $SSH_DIR
    fi
    
    log "✅ Clave SSH pública agregada a authorized_keys"
    
    # Configurar SSH daemon para mayor seguridad
    log "Configurando SSH daemon..."
    
    # Backup de configuración SSH
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Configurar SSH más seguro
    cat >> /etc/ssh/sshd_config << 'EOF'

# Configuración de seguridad FlorkaFun
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitRootLogin prohibit-password
ClientAliveInterval 60
ClientAliveCountMax 3
EOF
    
    # Reiniciar SSH
    systemctl restart sshd
    
    log "✅ SSH configurado y reiniciado"
    
    # Mostrar información de conexión
    echo ""
    info "📋 CONFIGURACIÓN COMPLETADA"
    echo "Usuario SSH: $USER_NAME"
    echo "Directorio SSH: $SSH_DIR"
    echo "IP del servidor: $(curl -s ifconfig.me || echo 'No detectada')"
    echo ""
    info "🧪 PRUEBA LA CONEXIÓN desde LOCAL con:"
    echo "ssh $USER_NAME@$(curl -s ifconfig.me)"
    
fi