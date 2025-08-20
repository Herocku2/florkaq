#!/bin/bash

echo "🚨 ARREGLO INMEDIATO VPS CONTABO - IP: 84.247.140.138"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 COMANDOS PARA EJECUTAR EN EL VPS:${NC}"
echo ""
echo -e "${GREEN}1. CONECTARSE AL VPS:${NC}"
echo "   ssh root@84.247.140.138"
echo ""
echo -e "${GREEN}2. VERIFICAR ESTADO ACTUAL:${NC}"
echo "   pm2 status"
echo "   systemctl status nginx"
echo ""
echo -e "${GREEN}3. IR AL DIRECTORIO DEL PROYECTO:${NC}"
echo "   cd /var/www/florkafun"
echo ""
echo -e "${GREEN}4. VERIFICAR SI EXISTE EL BACKEND:${NC}"
echo "   ls -la backend/"
echo ""
echo -e "${GREEN}5. REINICIAR STRAPI:${NC}"
echo "   cd backend"
echo "   pm2 restart florkafun-backend"
echo ""
echo -e "${GREEN}6. SI NO EXISTE, INICIAR STRAPI:${NC}"
echo "   pm2 start ecosystem.config.js"
echo ""
echo -e "${GREEN}7. VERIFICAR LOGS DE STRAPI:${NC}"
echo "   pm2 logs florkafun-backend --lines 20"
echo ""
echo -e "${GREEN}8. REINICIAR NGINX:${NC}"
echo "   systemctl restart nginx"
echo ""
echo -e "${GREEN}9. VERIFICAR ESTADO FINAL:${NC}"
echo "   pm2 status"
echo "   systemctl status nginx --no-pager"
echo ""
echo -e "${GREEN}10. PROBAR EL SITIO:${NC}"
echo "    curl -I https://florkafun.online"
echo ""
echo -e "${YELLOW}📋 EJECUTA ESTOS COMANDOS UNO POR UNO EN EL VPS${NC}"
echo -e "${YELLOW}📱 Después verifica: https://florkafun.online${NC}"