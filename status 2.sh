#!/bin/bash

# 📊 Script para verificar el estado de todos los servicios
# Autor: Kiro AI Assistant

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}$1${NC}"
}

error() {
    echo -e "${RED}$1${NC}"
}

warn() {
    echo -e "${YELLOW}$1${NC}"
}

info() {
    echo -e "${BLUE}$1${NC}"
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Función para obtener PID de un puerto
get_port_pid() {
    local port=$1
    lsof -ti:$port 2>/dev/null || echo "N/A"
}

# Función para obtener uptime de un proceso
get_process_uptime() {
    local pid=$1
    if [ "$pid" != "N/A" ] && kill -0 "$pid" 2>/dev/null; then
        ps -o etime= -p "$pid" 2>/dev/null | tr -d ' ' || echo "N/A"
    else
        echo "N/A"
    fi
}

# Función para verificar conectividad HTTP
check_http() {
    local url=$1
    local timeout=5
    if curl -s --max-time $timeout "$url" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

main() {
    log "📊 ESTADO DE SERVICIOS - FLORKA FUN"
    log "=============================================="
    
    # Backend (Strapi)
    echo ""
    info "🔧 BACKEND (STRAPI)"
    echo "   Puerto: 1337"
    if check_port 1337; then
        local backend_pid=$(get_port_pid 1337)
        local backend_uptime=$(get_process_uptime $backend_pid)
        log "   Estado: ✅ CORRIENDO"
        echo "   PID: $backend_pid"
        echo "   Uptime: $backend_uptime"
        echo "   URL Admin: http://localhost:1337/admin"
        echo "   URL API: http://localhost:1337/api"
        
        # Verificar conectividad
        if check_http "http://localhost:1337/admin"; then
            log "   Conectividad: ✅ OK"
        else
            warn "   Conectividad: ⚠️ PROBLEMAS"
        fi
    else
        error "   Estado: ❌ NO ESTÁ CORRIENDO"
    fi
    
    # Frontend (Vite)
    echo ""
    info "🎨 FRONTEND (VITE)"
    echo "   Puerto: 5173"
    if check_port 5173; then
        local frontend_pid=$(get_port_pid 5173)
        local frontend_uptime=$(get_process_uptime $frontend_pid)
        log "   Estado: ✅ CORRIENDO"
        echo "   PID: $frontend_pid"
        echo "   Uptime: $frontend_uptime"
        echo "   URL: http://localhost:5173"
        
        # Verificar conectividad
        if check_http "http://localhost:5173"; then
            log "   Conectividad: ✅ OK"
        else
            warn "   Conectividad: ⚠️ PROBLEMAS"
        fi
    else
        error "   Estado: ❌ NO ESTÁ CORRIENDO"
    fi
    
    # Archivos de log
    echo ""
    info "📋 ARCHIVOS DE LOG"
    if [ -f "logs/backend.log" ]; then
        local backend_log_size=$(du -h logs/backend.log | cut -f1)
        echo "   Backend: logs/backend.log ($backend_log_size)"
    else
        echo "   Backend: No disponible"
    fi
    
    if [ -f "logs/frontend.log" ]; then
        local frontend_log_size=$(du -h logs/frontend.log | cut -f1)
        echo "   Frontend: logs/frontend.log ($frontend_log_size)"
    else
        echo "   Frontend: No disponible"
    fi
    
    # PIDs guardados
    echo ""
    info "🆔 ARCHIVOS PID"
    if [ -f "pids/backend.pid" ]; then
        local saved_backend_pid=$(cat pids/backend.pid)
        echo "   Backend PID guardado: $saved_backend_pid"
    else
        echo "   Backend PID: No guardado"
    fi
    
    if [ -f "pids/frontend.pid" ]; then
        local saved_frontend_pid=$(cat pids/frontend.pid)
        echo "   Frontend PID guardado: $saved_frontend_pid"
    else
        echo "   Frontend PID: No guardado"
    fi
    
    # Resumen
    echo ""
    log "=============================================="
    local services_running=0
    local total_services=2
    
    if check_port 1337; then
        ((services_running++))
    fi
    
    if check_port 5173; then
        ((services_running++))
    fi
    
    if [ $services_running -eq $total_services ]; then
        log "🎉 TODOS LOS SERVICIOS ESTÁN CORRIENDO ($services_running/$total_services)"
    elif [ $services_running -gt 0 ]; then
        warn "⚠️ ALGUNOS SERVICIOS ESTÁN CORRIENDO ($services_running/$total_services)"
    else
        error "❌ NINGÚN SERVICIO ESTÁ CORRIENDO ($services_running/$total_services)"
    fi
    
    log "=============================================="
    echo ""
    info "💡 COMANDOS ÚTILES:"
    echo "   Iniciar todos: ./start-all.sh"
    echo "   Detener todos: ./stop-all.sh"
    echo "   Reiniciar: ./restart-all.sh"
    echo "   Ver logs backend: tail -f logs/backend.log"
    echo "   Ver logs frontend: tail -f logs/frontend.log"
    echo "   Monitor automático: ./monitor.sh"
}

main "$@"