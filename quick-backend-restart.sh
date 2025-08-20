#!/bin/bash

echo "🚀 Reinicio rápido del backend Strapi..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variables
BACKEND_DIR="/var/www/florkafun/backend"
PM2_APP="florkafun-backend"

# Ir al directorio del backend
cd $BACKEND_DIR

echo -e "${YELLOW}📍 Directorio actual: $(pwd)${NC}"

# 1. Parar PM2
echo -e "\n${YELLOW}⏹️  Parando backend...${NC}"
pm2 stop $PM2_APP

# 2. Limpiar caché
echo -e "\n${YELLOW}🧹 Limpiando caché...${NC}"
rm -rf .cache .tmp
echo "✅ Caché limpiado"

# 3. Verificar .env
echo -e "\n${YELLOW}🔍 Verificando archivo .env...${NC}"
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe"
    echo "Database config:"
    grep "DATABASE_" .env | head -5
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    echo "Ejecuta primero: ./fix-database-auth.sh"
    exit 1
fi

# 4. Verificar conexión a base de datos
echo -e "\n${YELLOW}🔍 Verificando conexión a base de datos...${NC}"
DB_USER=$(grep "DATABASE_USERNAME=" .env | cut -d'=' -f2)
DB_PASSWORD=$(grep "DATABASE_PASSWORD=" .env | cut -d'=' -f2)
DB_NAME=$(grep "DATABASE_NAME=" .env | cut -d'=' -f2)

PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión a base de datos OK${NC}"
else
    echo -e "${RED}❌ Error de conexión a base de datos${NC}"
    echo "Ejecuta: ./fix-database-auth.sh"
    exit 1
fi

# 5. Instalar dependencias
echo -e "\n${YELLOW}📦 Instalando dependencias...${NC}"
npm install --production

# 6. Build de Strapi
echo -e "\n${YELLOW}🏗️  Building Strapi...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi

# 7. Iniciar PM2
echo -e "\n${YELLOW}🚀 Iniciando backend...${NC}"
pm2 start ecosystem.config.js

# 8. Verificar estado
echo -e "\n${YELLOW}📊 Estado de servicios:${NC}"
pm2 status

# 9. Verificar logs
echo -e "\n${YELLOW}📋 Últimos logs:${NC}"
pm2 logs $PM2_APP --lines 10

echo -e "\n${GREEN}🎉 ¡Backend reiniciado correctamente!${NC}"
echo -e "\n${YELLOW}🌐 URLs disponibles:${NC}"
echo "Frontend: https://florkafun.online"
echo "Admin: https://florkafun.online/admin"
echo "API: https://florkafun.online/api"