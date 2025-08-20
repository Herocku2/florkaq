#!/bin/bash

echo "🚀 EJECUTANDO FLORKA FUN LOCALMENTE"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    pkill -f "strapi\|vite" 2>/dev/null || true
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Crear directorio de logs si no existe
mkdir -p logs

echo -e "${YELLOW}🔧 Iniciando backend Strapi...${NC}"
cd backend
npm run develop > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando que Strapi esté listo...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend listo!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Backend no responde${NC}"
        echo "Logs del backend:"
        tail -20 logs/backend.log
        exit 1
    fi
    sleep 2
    echo -n "."
done

echo -e "\n${YELLOW}🎨 Iniciando frontend React...${NC}"
npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Esperar a que el frontend esté listo
echo -e "${YELLOW}⏳ Esperando que React esté listo...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend listo!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Frontend no responde${NC}"
        echo "Logs del frontend:"
        tail -20 logs/frontend.log
        exit 1
    fi
    sleep 2
    echo -n "."
done

echo -e "\n${GREEN}🎉 ¡FLORKA FUN EJECUTÁNDOSE!${NC}"
echo -e "\n${YELLOW}📱 URLs:${NC}"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Admin: http://localhost:1337/admin"
echo "🔌 API: http://localhost:1337/api"

echo -e "\n${YELLOW}🔑 Credenciales:${NC}"
echo "Email: admin@localhost"
echo "Password: Admin123456"

echo -e "\n${YELLOW}📊 Logs en tiempo real:${NC}"
echo "Backend: tail -f logs/backend.log"
echo "Frontend: tail -f logs/frontend.log"

echo -e "\n${YELLOW}⏹️  Para detener: Ctrl+C${NC}"
echo -e "\n${YELLOW}📋 Monitoreando logs...${NC}"

# Mostrar logs en tiempo real
tail -f logs/backend.log &
TAIL_PID=$!

# Esperar indefinidamente
wait $BACKEND_PID $FRONTEND_PID