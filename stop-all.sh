#!/bin/bash

# 🛑 Script para detener todos los servicios de Florka Fun
# Autor: Kiro AI Assistant

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Función para matar procesos por PID
kill_by_pid() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            log "Deteniendo $service_name (PID: $pid)..."
            kill -TERM "$pid" 2>/dev/null || true
            sleep 3
            if kill -0 "$pid" 2>/dev/null; then
                warn "Forzando cierre de $service_name..."
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$pid_file"
    fi
}

# Función para matar procesos por puerto
kill_by_port() {
    local port=$1
    local service_name=$2
    
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pids" ]; then
        log "Deteniendo $service_name en puerto $port..."
        echo "$pids" | xargs kill -TERM 2>/dev/null || true
        sleep 3
        
        # Verificar si aún están corriendo
        pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ ! -z "$pids" ]; then
            warn "Forzando cierre de $service_name..."
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi
    fi
}

main() {
    log "🛑 DETENIENDO TODOS LOS SERVICIOS DE FLORKA FUN"
    log "=============================================="
    
    # Detener por PIDs si existen
    kill_by_pid "pids/backend.pid" "Backend (Strapi)"
    kill_by_pid "pids/frontend.pid" "Frontend (Vite)"
    kill_by_pid "pids/monitor.pid" "Monitor"
    
    # Detener por puertos como respaldo
    kill_by_port 1337 "Backend (Strapi)"
    kill_by_port 5173 "Frontend (Vite)"
    
    # Limpiar archivos PID
    rm -rf pids/
    
    log "=============================================="
    log "✅ TODOS LOS SERVICIOS DETENIDOS"
    log "=============================================="
}

main "$@"