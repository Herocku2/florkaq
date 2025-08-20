#!/bin/bash

echo "🚀 Iniciando Florka Fun en modo desarrollo..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ejecuta desde el directorio kiroflorka${NC}"
    exit 1
fi

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
    pkill -f "strapi\|react-scripts" 2>/dev/null || true
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# 1. Verificar que el backend esté preparado
echo -e "${YELLOW}🔍 Verificando backend...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Falta archivo .env en backend${NC}"
    echo "Ejecuta primero: ./test-local.sh"
    exit 1
fi

if [ ! -d "backend/build" ]; then
    echo -e "${YELLOW}🏗️  Building backend...${NC}"
    cd backend
    npm run build
    cd ..
fi

# 2. Iniciar backend en background
echo -e "\n${YELLOW}🚀 Iniciando Strapi backend...${NC}"
cd backend
npm run develop > ../logs/backend-local.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando que Strapi esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend listo en http://localhost:1337${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend no responde después de 30 segundos${NC}"
        echo "Logs del backend:"
        tail -20 logs/backend-local.log
        exit 1
    fi
    sleep 2
    echo -n "."
done

# 3. Iniciar frontend
echo -e "\n${YELLOW}🎨 Iniciando React frontend...${NC}"
npm start > logs/frontend-local.log 2>&1 &
FRONTEND_PID=$!

# Esperar a que el frontend esté listo
echo -e "${YELLOW}⏳ Esperando que React esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend listo en http://localhost:3000${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend no responde después de 30 segundos${NC}"
        echo "Logs del frontend:"
        tail -20 logs/frontend-local.log
        exit 1
    fi
    sleep 2
    echo -n "."
done

# 4. Mostrar información
echo -e "\n${GREEN}🎉 ¡Florka Fun ejecutándose localmente!${NC}"
echo -e "\n${YELLOW}📱 URLs disponibles:${NC}"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Admin: http://localhost:1337/admin"
echo "🔌 API: http://localhost:1337/api"

echo -e "\n${YELLOW}🔑 Credenciales Admin:${NC}"
echo "Email: admin@localhost"
echo "Password: Admin123456"

echo -e "\n${YELLOW}📋 Logs en tiempo real:${NC}"
echo "Backend: tail -f logs/backend-local.log"
echo "Frontend: tail -f logs/frontend-local.log"

echo -e "\n${YELLOW}⏹️  Para detener: Ctrl+C${NC}"

# 5. Mostrar logs en tiempo real
echo -e "\n${YELLOW}📊 Logs del backend:${NC}"
tail -f logs/backend-local.log &
TAIL_PID=$!

# Esperar indefinidamente
wait $BACKEND_PID $FRONTEND_PID