#!/bin/bash

# 🔧 Script de Mantenimiento para Florka Fun en Contabo VPS
# Uso: ./server-maintenance.sh [comando]

PROJECT_DIR="/opt/florka-fun"
BACKUP_DIR="/opt/backups/florka-fun"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🔧 Florka Fun - Server Maintenance Script${NC}"
    echo ""
    echo "Comandos disponibles:"
    echo -e "  ${GREEN}status${NC}     - Ver estado de los contenedores"
    echo -e "  ${GREEN}logs${NC}       - Ver logs de todos los servicios"
    echo -e "  ${GREEN}restart${NC}    - Reiniciar todos los servicios"
    echo -e "  ${GREEN}update${NC}     - Actualizar desde GitHub y redesplegar"
    echo -e "  ${GREEN}backup${NC}     - Crear backup de la base de datos"
    echo -e "  ${GREEN}restore${NC}    - Restaurar backup de la base de datos"
    echo -e "  ${GREEN}cleanup${NC}    - Limpiar imágenes y contenedores no utilizados"
    echo -e "  ${GREEN}ssl${NC}        - Renovar certificados SSL"
    echo -e "  ${GREEN}monitor${NC}    - Monitorear recursos del sistema"
    echo ""
    echo "Ejemplo: ./server-maintenance.sh status"
}

# Función para verificar si estamos en el directorio correcto
check_directory() {
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${RED}❌ Error: Directorio del proyecto no encontrado: $PROJECT_DIR${NC}"
        exit 1
    fi
    cd "$PROJECT_DIR"
}

# Ver estado de contenedores
status() {
    echo -e "${BLUE}📊 Estado de los contenedores:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}💾 Uso de disco:${NC}"
    df -h /opt
    echo ""
    echo -e "${BLUE}🧠 Uso de memoria:${NC}"
    free -h
}

# Ver logs
logs() {
    echo -e "${BLUE}📋 Logs de los servicios (últimas 50 líneas):${NC}"
    docker-compose logs --tail=50 -f
}

# Reiniciar servicios
restart() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
    status
}

# Actualizar desde GitHub
update() {
    echo -e "${YELLOW}🔄 Actualizando desde GitHub...${NC}"
    
    # Backup antes de actualizar
    backup
    
    # Pull del código más reciente
    git pull origin main
    
    # Reconstruir y redesplegar
    echo -e "${YELLOW}🏗️ Reconstruyendo contenedores...${NC}"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    echo -e "${GREEN}✅ Actualización completada${NC}"
    status
}

# Crear backup
backup() {
    echo -e "${YELLOW}💾 Creando backup...${NC}"
    
    # Crear directorio de backup si no existe
    mkdir -p "$BACKUP_DIR"
    
    # Timestamp para el backup
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    
    # Backup de la base de datos
    if [ -f "$PROJECT_DIR/backend/.tmp/data.db" ]; then
        cp "$PROJECT_DIR/backend/.tmp/data.db" "$BACKUP_DIR/data_$TIMESTAMP.db"
        echo -e "${GREEN}✅ Backup de base de datos creado: data_$TIMESTAMP.db${NC}"
    fi
    
    # Backup de archivos subidos
    if [ -d "$PROJECT_DIR/backend/public/uploads" ]; then
        tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR/backend/public" uploads
        echo -e "${GREEN}✅ Backup de uploads creado: uploads_$TIMESTAMP.tar.gz${NC}"
    fi
    
    # Listar backups disponibles
    echo -e "${BLUE}📁 Backups disponibles:${NC}"
    ls -la "$BACKUP_DIR"
}

# Restaurar backup
restore() {
    echo -e "${BLUE}📁 Backups disponibles:${NC}"
    ls -la "$BACKUP_DIR"/*.db 2>/dev/null || echo "No hay backups de base de datos disponibles"
    
    echo ""
    read -p "Ingresa el nombre del archivo de backup (ej: data_20240308_143022.db): " backup_file
    
    if [ -f "$BACKUP_DIR/$backup_file" ]; then
        echo -e "${YELLOW}🔄 Restaurando backup...${NC}"
        docker-compose stop backend
        cp "$BACKUP_DIR/$backup_file" "$PROJECT_DIR/backend/.tmp/data.db"
        docker-compose start backend
        echo -e "${GREEN}✅ Backup restaurado exitosamente${NC}"
    else
        echo -e "${RED}❌ Archivo de backup no encontrado${NC}"
    fi
}

# Limpiar sistema
cleanup() {
    echo -e "${YELLOW}🧹 Limpiando sistema...${NC}"
    
    # Limpiar contenedores parados
    docker container prune -f
    
    # Limpiar imágenes no utilizadas
    docker image prune -f
    
    # Limpiar volúmenes no utilizados
    docker volume prune -f
    
    # Limpiar redes no utilizadas
    docker network prune -f
    
    # Limpiar logs antiguos (más de 7 días)
    find /var/lib/docker/containers/ -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    echo -e "${GREEN}✅ Limpieza completada${NC}"
    
    # Mostrar espacio liberado
    echo -e "${BLUE}💾 Uso de disco después de la limpieza:${NC}"
    df -h /opt
}

# Renovar SSL
ssl() {
    echo -e "${YELLOW}🔒 Renovando certificados SSL...${NC}"
    
    if command -v certbot &> /dev/null; then
        certbot renew --quiet
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Certificados SSL renovados${NC}"
            # Reiniciar nginx para aplicar nuevos certificados
            docker-compose restart nginx
        else
            echo -e "${RED}❌ Error al renovar certificados SSL${NC}"
        fi
    else
        echo -e "${RED}❌ Certbot no está instalado${NC}"
        echo "Para instalar: apt install certbot python3-certbot-nginx"
    fi
}

# Monitorear sistema
monitor() {
    echo -e "${BLUE}📊 Monitor del Sistema - Florka Fun${NC}"
    echo "Presiona Ctrl+C para salir"
    echo ""
    
    while true; do
        clear
        echo -e "${BLUE}🕐 $(date)${NC}"
        echo ""
        
        # Estado de contenedores
        echo -e "${BLUE}🐳 Contenedores:${NC}"
        docker-compose ps
        echo ""
        
        # Uso de CPU y memoria
        echo -e "${BLUE}💻 Recursos del sistema:${NC}"
        top -bn1 | head -5
        echo ""
        
        # Uso de disco
        echo -e "${BLUE}💾 Uso de disco:${NC}"
        df -h /opt | head -2
        echo ""
        
        # Conexiones de red
        echo -e "${BLUE}🌐 Conexiones activas:${NC}"
        netstat -an | grep -E ':(80|443|3000|1337)' | grep ESTABLISHED | wc -l | xargs echo "Conexiones activas:"
        echo ""
        
        sleep 5
    done
}

# Función principal
main() {
    case "$1" in
        "status")
            check_directory
            status
            ;;
        "logs")
            check_directory
            logs
            ;;
        "restart")
            check_directory
            restart
            ;;
        "update")
            check_directory
            update
            ;;
        "backup")
            check_directory
            backup
            ;;
        "restore")
            check_directory
            restore
            ;;
        "cleanup")
            check_directory
            cleanup
            ;;
        "ssl")
            ssl
            ;;
        "monitor")
            check_directory
            monitor
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"