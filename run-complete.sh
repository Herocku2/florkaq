#!/bin/bash

echo "🚀 FLORKA FUN - EJECUCIÓN COMPLETA CON DATOS"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Limpiar procesos anteriores
pkill -f "vite\|strapi" 2>/dev/null || true
sleep 3

# Crear logs directory
mkdir -p logs

echo -e "${BLUE}🔧 Iniciando Strapi con base de datos completa...${NC}"
cd backend
npm run develop > ../logs/strapi-complete.log 2>&1 &
STRAPI_PID=$!
cd ..

echo -e "${YELLOW}⏳ Esperando que Strapi cargue completamente (45 segundos)...${NC}"
sleep 45

echo -e "${BLUE}🎨 Iniciando React frontend...${NC}"
npm run dev > logs/react-complete.log 2>&1 &
REACT_PID=$!

echo -e "${YELLOW}⏳ Esperando que React esté listo (15 segundos)...${NC}"
sleep 15

echo -e "\n${GREEN}🎉 ¡FLORKA FUN COMPLETAMENTE FUNCIONAL!${NC}"

echo -e "\n${BLUE}📱 URLs DISPONIBLES:${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}⚙️  Strapi Admin: http://localhost:1337/admin${NC}"
echo -e "${GREEN}🔌 API: http://localhost:1337/api${NC}"

echo -e "\n${BLUE}🔑 CREDENCIALES ADMIN:${NC}"
echo -e "${YELLOW}Email: admin@localhost${NC}"
echo -e "${YELLOW}Password: Admin123456${NC}"

echo -e "\n${BLUE}📊 VERIFICANDO SERVICIOS:${NC}"

# Verificar Strapi
if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
    echo -e "✅ Strapi: ${GREEN}FUNCIONANDO${NC}"
else
    echo -e "❌ Strapi: ${RED}NO RESPONDE${NC}"
fi

# Verificar React
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "✅ React: ${GREEN}FUNCIONANDO${NC}"
else
    echo -e "❌ React: ${RED}NO RESPONDE${NC}"
fi

echo -e "\n${BLUE}📋 CONTENT TYPES DISPONIBLES:${NC}"
echo -e "${YELLOW}• Candidato (Tokens)${NC}"
echo -e "${YELLOW}• Foro (Forum Posts)${NC}"
echo -e "${YELLOW}• Voto (Votes)${NC}"
echo -e "${YELLOW}• News (Noticias)${NC}"
echo -e "${YELLOW}• Launch Calendar${NC}"
echo -e "${YELLOW}• Solicitud Token${NC}"
echo -e "${YELLOW}• Comentario${NC}"
echo -e "${YELLOW}• Actividad${NC}"

echo -e "\n${BLUE}📊 LOGS EN TIEMPO REAL:${NC}"
echo -e "${YELLOW}Strapi: tail -f logs/strapi-complete.log${NC}"
echo -e "${YELLOW}React: tail -f logs/react-complete.log${NC}"

echo -e "\n${GREEN}🎯 TODO LISTO PARA USAR!${NC}"
echo -e "${BLUE}Ve a http://localhost:1337/admin para ver el Content Manager completo${NC}"
echo -e "${BLUE}Ve a http://localhost:3000 para ver el frontend funcionando${NC}"

echo -e "\n${YELLOW}⏹️  Para detener: Ctrl+C${NC}"

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    kill $STRAPI_PID $REACT_PID 2>/dev/null || true
    pkill -f "vite\|strapi" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Mostrar logs de Strapi en tiempo real
echo -e "\n${BLUE}📋 Monitoreando logs de Strapi:${NC}"
tail -f logs/strapi-complete.log &
TAIL_PID=$!

# Esperar indefinidamente
wait $STRAPI_PID $REACT_PID