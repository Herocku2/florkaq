#!/bin/bash

echo "🚀 INICIANDO FLORKA FUN - MODO DESARROLLO"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Limpiar procesos anteriores
pkill -f "vite\|strapi" 2>/dev/null || true
sleep 2

# Crear logs directory
mkdir -p logs

echo -e "${YELLOW}🔧 Iniciando Strapi backend...${NC}"
cd backend
npm run develop > ../logs/strapi.log 2>&1 &
STRAPI_PID=$!
cd ..

echo -e "${YELLOW}⏳ Esperando Strapi (30 segundos)...${NC}"
sleep 30

echo -e "${YELLOW}🎨 Iniciando React frontend...${NC}"
npm run dev > logs/react.log 2>&1 &
REACT_PID=$!

echo -e "${YELLOW}⏳ Esperando React (10 segundos)...${NC}"
sleep 10

echo -e "\n${GREEN}🎉 ¡Servicios iniciados!${NC}"
echo -e "\n${YELLOW}📱 URLs:${NC}"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Strapi Admin: http://localhost:1337/admin"
echo "🔌 API: http://localhost:1337/api"

echo -e "\n${YELLOW}📊 Estado de servicios:${NC}"
if curl -s http://localhost:1337/admin > /dev/null; then
    echo -e "✅ Strapi: ${GREEN}FUNCIONANDO${NC}"
else
    echo -e "❌ Strapi: ${RED}NO RESPONDE${NC}"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "✅ React: ${GREEN}FUNCIONANDO${NC}"
else
    echo -e "❌ React: ${RED}NO RESPONDE${NC}"
fi

echo -e "\n${YELLOW}📋 Logs:${NC}"
echo "Strapi: tail -f logs/strapi.log"
echo "React: tail -f logs/react.log"

echo -e "\n${YELLOW}⏹️  Para detener: Ctrl+C${NC}"

# Función para limpiar al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    kill $STRAPI_PID $REACT_PID 2>/dev/null || true
    pkill -f "vite\|strapi" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Esperar indefinidamente
wait