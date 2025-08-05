#!/bin/bash

# 🔄 Script para reiniciar todos los servicios de Florka Fun
# Autor: Kiro AI Assistant

set -e

# Colores para output
GREEN='\033[0;32m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

main() {
    log "🔄 REINICIANDO TODOS LOS SERVICIOS DE FLORKA FUN"
    log "=============================================="
    
    # Detener todos los servicios
    log "1️⃣ Deteniendo servicios..."
    ./stop-all.sh
    
    # Esperar un momento
    sleep 3
    
    # Iniciar todos los servicios
    log "2️⃣ Iniciando servicios..."
    ./start-all.sh
    
    log "=============================================="
    log "✅ REINICIO COMPLETADO"
    log "=============================================="
}

main "$@"