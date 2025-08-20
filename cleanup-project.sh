#!/bin/bash

echo "🧹 LIMPIEZA COMPLETA DEL PROYECTO FLORKA FUN"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📋 Eliminando archivos duplicados y de Docker...${NC}"

# 1. ELIMINAR ARCHIVOS DUPLICADOS (con " 2" en el nombre)
echo -e "\n${YELLOW}🗑️  Eliminando archivos duplicados...${NC}"
find . -name "* 2.*" -type f -delete
find . -name "*2.sh" -type f -delete
find . -name "*2.md" -type f -delete
find . -name "*2.html" -type f -delete
find . -name "*2.js" -type f -delete
find . -name "*2.jsx" -type f -delete
find . -name "*2.css" -type f -delete

# 2. ELIMINAR ARCHIVOS DE DOCKER
echo -e "\n${YELLOW}🐳 Eliminando archivos de Docker...${NC}"
rm -f docker-compose*.yml
rm -f Dockerfile*
rm -f .dockerignore
rm -f DOCKER_SETUP.md

# 3. ELIMINAR SCRIPTS OBSOLETOS
echo -e "\n${YELLOW}📜 Eliminando scripts obsoletos...${NC}"
rm -f install-contabo.sh
rm -f install-ssl-certificate.sh
rm -f monitor.sh
rm -f advanced-monitor.sh
rm -f open-services.sh
rm -f quick-start.sh
rm -f restart-all.sh
rm -f restart-services.sh
rm -f stop-all.sh
rm -f check-services.sh

# 4. ELIMINAR DIRECTORIOS TEMPORALES Y BUILDS
echo -e "\n${YELLOW}🗂️  Limpiando directorios temporales...${NC}"
rm -rf dist/
rm -rf logs/
rm -rf pids/
rm -rf ssl/
rm -rf static/
rm -rf florkafun_full_package/

# 5. LIMPIAR BACKEND
echo -e "\n${YELLOW}🔧 Limpiando backend...${NC}"
cd backend
rm -rf build/
rm -rf .cache/
rm -rf .tmp/
rm -rf .strapi/
rm -rf node_modules/
cd ..

# 6. LIMPIAR FRONTEND
echo -e "\n${YELLOW}🎨 Limpiando frontend...${NC}"
rm -rf node_modules/
rm -rf build/

# 7. ELIMINAR ARCHIVOS DE CONFIGURACIÓN OBSOLETOS
echo -e "\n${YELLOW}⚙️  Eliminando configuraciones obsoletas...${NC}"
rm -f .env.development
rm -f .env.production
rm -f render.yaml
rm -f index.html
rm -f styleguide.css
rm -f florkaproject.code-workspace

# 8. MANTENER SOLO LOS ARCHIVOS ESENCIALES
echo -e "\n${GREEN}✅ Archivos mantenidos:${NC}"
echo "📁 Directorios esenciales:"
echo "  - src/ (código React)"
echo "  - backend/ (código Strapi)"
echo "  - public/ (assets públicos)"
echo "  - .github/ (GitHub Actions)"

echo -e "\n📄 Archivos esenciales:"
echo "  - package.json"
echo "  - package-lock.json"
echo "  - README.md"
echo "  - .gitignore"
echo "  - vite.config.js"

echo -e "\n🛠️  Scripts de deployment:"
echo "  - contabo-native-setup.sh"
echo "  - deploy-native.sh"
echo "  - fix-database-auth.sh"
echo "  - quick-backend-restart.sh"
echo "  - start-local-dev.sh"
echo "  - test-local.sh"

echo -e "\n📚 Documentación:"
echo "  - NATIVE_DEPLOYMENT_GUIDE.md"
echo "  - GITHUB_SECRETS_FINAL.md"
echo "  - MODERATOR_PERMISSIONS.md"
echo "  - API_DOCUMENTATION.md"

echo -e "\n${GREEN}🎉 ¡Limpieza completada!${NC}"
echo -e "${YELLOW}📋 Siguiente paso: Reinstalar dependencias limpias${NC}"