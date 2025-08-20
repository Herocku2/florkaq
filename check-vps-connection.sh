#!/bin/bash

echo "🔍 VERIFICANDO CONEXIÓN CON VPS CONTABO"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar si tenemos la IP del VPS
echo -e "${YELLOW}📋 Información del VPS:${NC}"
echo "Dominio: florkafun.online"
echo "Esperado: Servidor Contabo"

# Verificar DNS
echo -e "\n${YELLOW}🌐 Verificando DNS...${NC}"
nslookup florkafun.online

# Verificar conectividad básica
echo -e "\n${YELLOW}📡 Verificando conectividad...${NC}"
if ping -c 3 florkafun.online > /dev/null 2>&1; then
    echo -e "✅ Ping: ${GREEN}RESPONDE${NC}"
    IP=$(dig +short florkafun.online | head -1)
    echo "IP del servidor: $IP"
else
    echo -e "❌ Ping: ${RED}NO RESPONDE${NC}"
fi

# Verificar puertos específicos
echo -e "\n${YELLOW}🔌 Verificando puertos...${NC}"

# Puerto 80 (HTTP)
if nc -z florkafun.online 80 2>/dev/null; then
    echo -e "✅ Puerto 80 (HTTP): ${GREEN}ABIERTO${NC}"
else
    echo -e "❌ Puerto 80 (HTTP): ${RED}CERRADO${NC}"
fi

# Puerto 443 (HTTPS)
if nc -z florkafun.online 443 2>/dev/null; then
    echo -e "✅ Puerto 443 (HTTPS): ${GREEN}ABIERTO${NC}"
else
    echo -e "❌ Puerto 443 (HTTPS): ${RED}CERRADO${NC}"
fi

# Puerto 1337 (Strapi)
if nc -z florkafun.online 1337 2>/dev/null; then
    echo -e "✅ Puerto 1337 (Strapi): ${GREEN}ABIERTO${NC}"
else
    echo -e "❌ Puerto 1337 (Strapi): ${RED}CERRADO${NC}"
fi

# Verificar respuesta HTTP
echo -e "\n${YELLOW}🌐 Verificando respuesta HTTP...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://florkafun.online)
echo "Estado HTTP: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "502" ]; then
    echo -e "${RED}❌ Error 502: Bad Gateway - El servidor backend no responde${NC}"
elif [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Servidor funcionando correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  Estado inesperado: $HTTP_STATUS${NC}"
fi

echo -e "\n${YELLOW}📊 DIAGNÓSTICO:${NC}"
if [ "$HTTP_STATUS" = "502" ]; then
    echo -e "${RED}🚨 PROBLEMA IDENTIFICADO:${NC}"
    echo "- Nginx está funcionando (responde)"
    echo "- Backend (Strapi/Node.js) está caído"
    echo "- Necesitamos conectarnos al VPS para reiniciar servicios"
fi