#!/bin/bash

echo "🧪 Probando Florka Fun localmente..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No estás en el directorio del proyecto${NC}"
    echo "Ejecuta: cd kiroflorka"
    exit 1
fi

echo -e "${YELLOW}📍 Directorio: $(pwd)${NC}"

# 2. Instalar dependencias del frontend
echo -e "\n${YELLOW}📦 Instalando dependencias del frontend...${NC}"
npm install

# 3. Ir al backend e instalar dependencias
echo -e "\n${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd backend
npm install

# 4. Verificar si existe .env local
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}📝 Creando .env local para desarrollo...${NC}"
    cat > .env << 'EOF'
# Database (SQLite para desarrollo local)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=mGrpi1i2DOyx+zVtF2A0l8+6oJU2enhecgEIg23gqg8=,hFAt5p7Osh0JyDVkQTPs0TKXupCqASrC1wgwqHDOuf0=,t+LqskxsuOIu1e/nLhmTkCoiqPc64LmNhMGuKSwwWIQ=,Fz8hxVslUQEL8WUARbWOcbTQ4NrBQR21s+ZI3MbsTjg=
API_TOKEN_SALT=dlvqQ76p5Cb17WoW2ZoC7Q==
ADMIN_JWT_SECRET=3Hm48VFj8QGT9q52rV5ObhN28738rw/nAQWFzCynUeM=
TRANSFER_TOKEN_SALT=GNSb8+zIeWrF3EC4VM1a9Q==
JWT_SECRET=BKGonM9dTwbRpVu0DH61tuBW/J/qHawaHexoML21x4I=

# Admin
ADMIN_EMAIL=admin@localhost
ADMIN_PASSWORD=Admin123456
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=Local

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Archivo .env creado para desarrollo local${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# 5. Limpiar build anterior
echo -e "\n${YELLOW}🧹 Limpiando builds anteriores...${NC}"
rm -rf build/ .strapi/ .cache/ .tmp/

# 6. Build del backend
echo -e "\n${YELLOW}🏗️  Building backend...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build exitoso${NC}"
else
    echo -e "${RED}❌ Error en backend build${NC}"
    exit 1
fi

# 7. Volver al directorio raíz
cd ..

echo -e "\n${GREEN}🎉 ¡Preparación completa!${NC}"
echo -e "\n${YELLOW}🚀 Para iniciar el proyecto localmente:${NC}"
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "cd backend && npm run develop"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "npm start"
echo ""
echo -e "${YELLOW}🌐 URLs locales:${NC}"
echo "Frontend: http://localhost:3000"
echo "Admin: http://localhost:1337/admin"
echo "API: http://localhost:1337/api"