#!/bin/bash

echo "🚨 ARREGLO RÁPIDO DEL VPS - LEVANTAR STRAPI"

# Información del VPS (necesitarás proporcionarla)
VPS_IP="TU_IP_DEL_VPS"  # Reemplazar con la IP real
VPS_USER="root"

echo "🔧 Comandos para ejecutar en el VPS:"
echo ""
echo "1. Conectarse al VPS:"
echo "   ssh root@$VPS_IP"
echo ""
echo "2. Ir al directorio del proyecto:"
echo "   cd /var/www/florkafun"
echo ""
echo "3. Verificar estado de PM2:"
echo "   pm2 status"
echo ""
echo "4. Reiniciar Strapi:"
echo "   pm2 restart florkafun-backend"
echo ""
echo "5. Si no existe, iniciar Strapi:"
echo "   cd backend"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "6. Verificar logs:"
echo "   pm2 logs florkafun-backend"
echo ""
echo "7. Reiniciar Nginx:"
echo "   systemctl restart nginx"
echo ""
echo "8. Verificar estado:"
echo "   systemctl status nginx"
echo "   pm2 status"

echo ""
echo "🎯 DESPUÉS DE ARREGLAR EL VPS, CONFIGURAREMOS GITHUB ACTIONS"