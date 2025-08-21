#!/bin/bash

echo "🔍 VERIFICACIÓN COMPLETA DEL DESPLIEGUE VPS"
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar estado
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}📡 1. VERIFICANDO CONECTIVIDAD BÁSICA${NC}"
echo "----------------------------------------"

# Ping al servidor
ping -c 3 84.247.140.138 > /dev/null 2>&1
show_status $? "Conectividad de red al VPS"

# Verificar puertos principales
nc -z 84.247.140.138 80 > /dev/null 2>&1
show_status $? "Puerto 80 (HTTP) accesible"

nc -z 84.247.140.138 443 > /dev/null 2>&1
show_status $? "Puerto 443 (HTTPS) accesible"

nc -z 84.247.140.138 1337 > /dev/null 2>&1
show_status $? "Puerto 1337 (Strapi) accesible"

echo ""
echo -e "${BLUE}🌐 2. VERIFICANDO FRONTEND${NC}"
echo "------------------------------"

# Verificar que el frontend responde
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend responde correctamente (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Frontend no responde (HTTP $FRONTEND_STATUS)${NC}"
fi

# Verificar contenido del frontend
FRONTEND_CONTENT=$(curl -s https://florkafun.online | grep -i "florka\|react\|vite" | wc -l)
if [ "$FRONTEND_CONTENT" -gt 0 ]; then
    echo -e "${GREEN}✅ Contenido del frontend cargado correctamente${NC}"
else
    echo -e "${RED}❌ Contenido del frontend no se detecta${NC}"
fi

echo ""
echo -e "${BLUE}🔧 3. VERIFICANDO BACKEND/API${NC}"
echo "--------------------------------"

# Verificar API de Strapi
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online/api)
if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "404" ]; then
    echo -e "${GREEN}✅ API Strapi accesible (HTTP $API_STATUS)${NC}"
else
    echo -e "${RED}❌ API Strapi no accesible (HTTP $API_STATUS)${NC}"
fi

# Verificar admin de Strapi
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online/admin)
if [ "$ADMIN_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Admin Strapi accesible (HTTP $ADMIN_STATUS)${NC}"
else
    echo -e "${RED}❌ Admin Strapi no accesible (HTTP $ADMIN_STATUS)${NC}"
fi

# Verificar endpoints específicos de la API
echo ""
echo -e "${YELLOW}📋 Verificando endpoints específicos:${NC}"

# Verificar tokens
TOKENS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online/api/tokens)
echo "   - /api/tokens: HTTP $TOKENS_STATUS"

# Verificar foro
FORO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online/api/foros)
echo "   - /api/foros: HTTP $FORO_STATUS"

# Verificar solicitudes
SOLICITUDES_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online/api/solicitud-tokens)
echo "   - /api/solicitud-tokens: HTTP $SOLICITUDES_STATUS"

echo ""
echo -e "${BLUE}🔐 4. VERIFICANDO SSL/CERTIFICADOS${NC}"
echo "------------------------------------"

# Verificar certificado SSL
SSL_INFO=$(echo | openssl s_client -servername florkafun.online -connect florkafun.online:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificado SSL válido${NC}"
    echo "$SSL_INFO" | sed 's/^/   /'
else
    echo -e "${RED}❌ Problema con certificado SSL${NC}"
fi

echo ""
echo -e "${BLUE}⚡ 5. VERIFICANDO RENDIMIENTO${NC}"
echo "--------------------------------"

# Tiempo de respuesta del frontend
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://florkafun.online)
echo "   - Tiempo de respuesta frontend: ${RESPONSE_TIME}s"

# Tiempo de respuesta de la API
API_RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://florkafun.online/api)
echo "   - Tiempo de respuesta API: ${API_RESPONSE_TIME}s"

echo ""
echo -e "${BLUE}📊 6. RESUMEN FINAL${NC}"
echo "--------------------"

# Contador de servicios funcionando
SERVICES_OK=0
TOTAL_SERVICES=6

# Verificaciones finales
curl -s https://florkafun.online > /dev/null && ((SERVICES_OK++))
curl -s https://florkafun.online/api > /dev/null && ((SERVICES_OK++))
curl -s https://florkafun.online/admin > /dev/null && ((SERVICES_OK++))
nc -z 84.247.140.138 80 > /dev/null 2>&1 && ((SERVICES_OK++))
nc -z 84.247.140.138 443 > /dev/null 2>&1 && ((SERVICES_OK++))
ping -c 1 84.247.140.138 > /dev/null 2>&1 && ((SERVICES_OK++))

echo "   - Servicios funcionando: $SERVICES_OK/$TOTAL_SERVICES"

if [ $SERVICES_OK -eq $TOTAL_SERVICES ]; then
    echo -e "${GREEN}🎉 ¡DESPLIEGUE COMPLETAMENTE FUNCIONAL!${NC}"
    echo -e "${GREEN}   Frontend: https://florkafun.online${NC}"
    echo -e "${GREEN}   Admin: https://florkafun.online/admin${NC}"
    echo -e "${GREEN}   API: https://florkafun.online/api${NC}"
elif [ $SERVICES_OK -gt 3 ]; then
    echo -e "${YELLOW}⚠️  Despliegue mayormente funcional con algunos problemas menores${NC}"
else
    echo -e "${RED}🚨 Problemas significativos detectados en el despliegue${NC}"
fi

echo ""
echo -e "${BLUE}🔗 ENLACES ÚTILES:${NC}"
echo "   - Sitio web: https://florkafun.online"
echo "   - Admin Strapi: https://florkafun.online/admin"
echo "   - API: https://florkafun.online/api"
echo "   - GitHub Actions: https://github.com/Herocku2/kiroflorka/actions"

echo ""
echo "Verificación completada $(date)"