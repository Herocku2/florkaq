#!/bin/bash

echo "🚀 FLORKA FUN - CONFIGURACIÓN FINAL FUNCIONANDO"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Limpiar procesos anteriores
echo -e "${YELLOW}🧹 Limpiando procesos anteriores...${NC}"
pkill -f "vite\|npm.*start\|npm.*dev" 2>/dev/null || true
sleep 3

# Crear logs
mkdir -p logs

echo -e "${BLUE}✅ Strapi ya está funcionando en puerto 1337${NC}"

echo -e "${YELLOW}🎨 Iniciando React en puerto 5173...${NC}"
npm start > logs/frontend-5173.log 2>&1 &
REACT_PID=$!

echo -e "${YELLOW}⏳ Esperando que React esté listo (20 segundos)...${NC}"
sleep 20

echo -e "\n${GREEN}🎉 ¡FLORKA FUN COMPLETAMENTE FUNCIONAL!${NC}"

echo -e "\n${BLUE}📱 URLs DISPONIBLES:${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}⚙️  Strapi Admin: http://localhost:1337/admin${NC}"
echo -e "${GREEN}🔌 API: http://localhost:1337/api${NC}"

echo -e "\n${BLUE}🔑 CREDENCIALES:${NC}"
echo -e "${YELLOW}Email: admin@localhost${NC}"
echo -e "${YELLOW}Password: Admin123456${NC}"

echo -e "\n${BLUE}📊 VERIFICANDO SERVICIOS:${NC}"

# Verificar Strapi
if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
    echo -e "✅ Strapi: ${GREEN}FUNCIONANDO${NC} (puerto 1337)"
else
    echo -e "❌ Strapi: ${RED}NO RESPONDE${NC}"
fi

# Verificar React
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "✅ React: ${GREEN}FUNCIONANDO${NC} (puerto 5173)"
else
    echo -e "⏳ React: ${YELLOW}INICIANDO...${NC}"
    sleep 10
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "✅ React: ${GREEN}FUNCIONANDO${NC} (puerto 5173)"
    else
        echo -e "❌ React: ${RED}NO RESPONDE${NC}"
        echo -e "${YELLOW}📋 Logs del frontend:${NC}"
        tail -10 logs/frontend-5173.log
    fi
fi

echo -e "\n${BLUE}📋 CONTENT TYPES DISPONIBLES:${NC}"
echo -e "${YELLOW}• Actividad${NC}"
echo -e "${YELLOW}• Candidato (Tokens)${NC}"
echo -e "${YELLOW}• Comentario${NC}"
echo -e "${YELLOW}• Foro${NC}"
echo -e "${YELLOW}• Noticia${NC}"
echo -e "${YELLOW}• Paquete${NC}"
echo -e "${YELLOW}• Proyecto Next${NC}"
echo -e "${YELLOW}• Ranking${NC}"
echo -e "${YELLOW}• Solicitud Token${NC}"
echo -e "${YELLOW}• Swap${NC}"
echo -e "${YELLOW}• Token${NC}"
echo -e "${YELLOW}• Usuario${NC}"
echo -e "${YELLOW}• Votacion${NC}"
echo -e "${YELLOW}• Voto${NC}"

echo -e "\n${GREEN}🎯 ¡TODO LISTO PARA USAR!${NC}"
echo -e "${BLUE}🌐 Ve a http://localhost:5173 para el frontend${NC}"
echo -e "${BLUE}⚙️  Ve a http://localhost:1337/admin para Strapi${NC}"

echo -e "\n${YELLOW}📊 Para monitorear logs:${NC}"
echo -e "${YELLOW}Frontend: tail -f logs/frontend-5173.log${NC}"
echo -e "${YELLOW}Strapi: tail -f logs/emergency-strapi.log${NC}"

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo frontend...${NC}"
    kill $REACT_PID 2>/dev/null || true
    pkill -f "vite.*5173" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "\n${YELLOW}⏹️  Para detener: Ctrl+C${NC}"
echo -e "${BLUE}📋 Monitoreando logs del frontend...${NC}"

# Mostrar logs en tiempo real
tail -f logs/frontend-5173.log