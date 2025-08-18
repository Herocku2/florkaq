#!/bin/bash

# Script para instalar certificado SSL manualmente
echo "🔐 Instalando certificado SSL de CloudFlare..."

# Crear directorio SSL si no existe
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Copiar certificado
echo "📋 Copiando certificado..."
sudo cp ssl/florkafun.crt /etc/ssl/certs/florkafun.crt
sudo cp ssl/florkafun.key /etc/ssl/private/florkafun.key

# Establecer permisos correctos
sudo chmod 644 /etc/ssl/certs/florkafun.crt
sudo chmod 600 /etc/ssl/private/florkafun.key
sudo chown root:root /etc/ssl/certs/florkafun.crt
sudo chown root:root /etc/ssl/private/florkafun.key

echo "✅ Certificado instalado correctamente"

# Verificar certificado
echo "🔍 Verificando certificado..."
openssl x509 -in /etc/ssl/certs/florkafun.crt -text -noout | grep -E "(Subject|Issuer|Not After)"

# Reiniciar nginx
echo "🔄 Reiniciando nginx..."
sudo systemctl reload nginx

echo "🎉 Instalación completada!"