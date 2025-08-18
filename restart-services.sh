#!/bin/bash

echo "🔄 Reiniciando servicios FlorkaFun..."

# Parar todos los servicios
echo "⏹️ Parando servicios..."
docker-compose down

# Limpiar contenedores parados
echo "🧹 Limpiando contenedores..."
docker container prune -f

# Levantar servicios nuevamente
echo "🚀 Levantando servicios..."
docker-compose up -d

# Esperar que estén listos
echo "⏳ Esperando que los servicios estén listos..."
sleep 45

# Verificar estado
echo "🔍 Verificando servicios..."
./check-services.sh

echo ""
echo "✅ ¡Servicios reiniciados!"
echo ""
echo "Para abrir en el navegador ejecuta:"
echo "./open-services.sh"