#!/bin/bash

# 🚀 Script maestro para iniciar todos los servicios de Florka Fun
# Autor: Kiro AI Assistant
# Fecha: $(date)

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Función para matar procesos en un puerto específico
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        warn "Matando procesos en puerto $port: $pids"
        kill -9 $pids 2>/dev/null || true
        sleep 2
    fi
}

# Función para verificar si npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado. Por favor instala Node.js y npm primero."
        exit 1
    fi
}

# Función para instalar dependencias si es necesario
install_dependencies() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        log "Instalando dependencias para $name..."
        cd "$dir"
        npm install
        cd - > /dev/null
    else
        info "Dependencias ya instaladas para $name"
    fi
}

# Función para iniciar el backend
start_backend() {
    log "🔧 Iniciando Backend (Strapi)..."
    
    # Verificar si el puerto 1337 está ocupado
    if check_port 1337; then
        warn "Puerto 1337 ya está en uso. Liberando..."
        kill_port 1337
    fi
    
    # Instalar dependencias
    install_dependencies "./backend" "Backend"
    
    # Iniciar backend en background
    cd backend
    log "Ejecutando: npm run develop"
    nohup npm run develop > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../pids/backend.pid
    cd ..
    
    # Esperar a que el backend esté listo
    log "Esperando a que el backend esté listo..."
    for i in {1..30}; do
        if check_port 1337; then
            log "✅ Backend iniciado correctamente en puerto 1337"
            return 0
        fi
        sleep 2
        echo -n "."
    done
    
    error "❌ Backend no pudo iniciarse en 60 segundos"
    return 1
}

# Función para iniciar el frontend
start_frontend() {
    log "🎨 Iniciando Frontend (Vite)..."
    
    # Verificar si el puerto 5173 está ocupado
    if check_port 5173; then
        warn "Puerto 5173 ya está en uso. Liberando..."
        kill_port 5173
    fi
    
    # Instalar dependencias
    install_dependencies "." "Frontend"
    
    # Iniciar frontend en background
    log "Ejecutando: npm run dev"
    nohup npm run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > pids/frontend.pid
    
    # Esperar a que el frontend esté listo
    log "Esperando a que el frontend esté listo..."
    for i in {1..20}; do
        if check_port 5173; then
            log "✅ Frontend iniciado correctamente en puerto 5173"
            return 0
        fi
        sleep 2
        echo -n "."
    done
    
    error "❌ Frontend no pudo iniciarse en 40 segundos"
    return 1
}

# Función para verificar el estado de los servicios
check_services() {
    log "🔍 Verificando estado de los servicios..."
    
    if check_port 1337; then
        log "✅ Backend (Strapi) - CORRIENDO en puerto 1337"
        echo "   📊 Admin Panel: http://localhost:1337/admin"
        echo "   🔗 API: http://localhost:1337/api"
    else
        error "❌ Backend (Strapi) - NO ESTÁ CORRIENDO"
    fi
    
    if check_port 5173; then
        log "✅ Frontend (Vite) - CORRIENDO en puerto 5173"
        echo "   🌐 Aplicación: http://localhost:5173"
    else
        error "❌ Frontend (Vite) - NO ESTÁ CORRIENDO"
    fi
}

# Función para crear directorios necesarios
setup_directories() {
    log "📁 Creando directorios necesarios..."
    mkdir -p logs
    mkdir -p pids
    
    # Limpiar logs antiguos
    > logs/backend.log
    > logs/frontend.log
    > logs/monitor.log
}

# Función principal
main() {
    log "🚀 INICIANDO FLORKA FUN - TODOS LOS SERVICIOS"
    log "=============================================="
    
    # Verificar prerrequisitos
    check_npm
    
    # Configurar directorios
    setup_directories
    
    # Iniciar servicios
    start_backend
    sleep 5
    start_frontend
    
    # Verificar estado
    sleep 5
    check_services
    
    log "=============================================="
    log "🎉 TODOS LOS SERVICIOS INICIADOS CORRECTAMENTE"
    log "=============================================="
    log "📱 Frontend: http://localhost:5173"
    log "🔧 Backend API: http://localhost:1337/api"
    log "👨‍💼 Admin Panel: http://localhost:1337/admin"
    log "=============================================="
    log "📋 Para ver logs en tiempo real:"
    log "   Backend:  tail -f logs/backend.log"
    log "   Frontend: tail -f logs/frontend.log"
    log "   Monitor:  tail -f logs/monitor.log"
    log "=============================================="
    log "🛑 Para detener todos los servicios: ./stop-all.sh"
    log "🔄 Para reiniciar: ./restart-all.sh"
    log "📊 Para ver estado: ./status.sh"
}

# Ejecutar función principal
main "$@"