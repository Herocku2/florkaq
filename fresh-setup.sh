#!/bin/bash

echo "🚀 SETUP LIMPIO DE FLORKA FUN"

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

echo -e "${YELLOW}📍 Directorio: $(pwd)${NC}"

# 1. INSTALAR DEPENDENCIAS DEL FRONTEND
echo -e "\n${YELLOW}📦 Instalando dependencias del frontend...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando frontend dependencies${NC}"
    exit 1
fi

# 2. CONFIGURAR BACKEND
echo -e "\n${YELLOW}🔧 Configurando backend...${NC}"
cd backend

# Crear .env para desarrollo local
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creando .env para desarrollo local...${NC}"
    cat > .env << 'EOF'
# Database (SQLite para desarrollo local)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=mGrpi1i2DOyx+zVtF2A0l8+6oJU2enhecgEIg23gqg8=,hFAt5p7Osh0JyDVkQTPs0TKXupCqASrC1wgwqHDOuf0=,t+LqskxsuOIu1e/nLhmTkCoiqPc64LmNhMGuKSwwWIQ=,Fz8hxVslUQEL8WUARbWOcbTQ4NrBQR21s+ZI3MbsTjg=
API_TOKEN_SALT=dlvqQ76p5Cb17WoW2ZoC7Q==
ADMIN_JWT_SECRET=3Hm48VFj8QGT9q52rV5ObhN28738rw/nAQWFzCynUeM=
TRANSFER_TOKEN_SALT=GNSb8+zIeWrF3EC4VM1a9Q==
JWT_SECRET=BKGonM9dTwbRpVu0DH61tuBW/J/qHawaHexoML21x4I=

# Admin User
ADMIN_EMAIL=admin@localhost
ADMIN_PASSWORD=Admin123456
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=Local

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# 3. INSTALAR DEPENDENCIAS DEL BACKEND
echo -e "\n${YELLOW}📦 Instalando dependencias del backend...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando backend dependencies${NC}"
    exit 1
fi

# 4. BUILD DEL BACKEND
echo -e "\n${YELLOW}🏗️  Building Strapi...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build exitoso${NC}"
else
    echo -e "${RED}❌ Error en backend build${NC}"
    exit 1
fi

# Volver al directorio raíz
cd ..

# 5. CREAR DIRECTORIOS NECESARIOS
echo -e "\n${YELLOW}📁 Creando directorios necesarios...${NC}"
mkdir -p logs

# 6. VERIFICAR CONFIGURACIÓN
echo -e "\n${YELLOW}🔍 Verificando configuración...${NC}"

# Verificar vite.config.js
if [ ! -f "vite.config.js" ]; then
    echo -e "${YELLOW}📝 Creando vite.config.js...${NC}"
    cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
EOF
    echo -e "${GREEN}✅ vite.config.js creado${NC}"
fi

echo -e "\n${GREEN}🎉 ¡Setup completado exitosamente!${NC}"

echo -e "\n${YELLOW}🚀 Para ejecutar el proyecto:${NC}"
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "cd backend && npm run develop"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "npm start"
echo ""
echo -e "${YELLOW}🌐 URLs:${NC}"
echo "Frontend: http://localhost:3000"
echo "Admin: http://localhost:1337/admin"
echo "API: http://localhost:1337/api"
echo ""
echo -e "${YELLOW}🔑 Credenciales Admin:${NC}"
echo "Email: admin@localhost"
echo "Password: Admin123456"