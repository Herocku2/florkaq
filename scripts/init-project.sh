#!/bin/bash

# Script de inicialización del proyecto FlorkaFun
# Este script configura el entorno completo de desarrollo

echo "🚀 Inicializando proyecto FlorkaFun..."

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop."
    exit 1
fi

echo "✅ Docker está ejecutándose"

# Detener contenedores existentes si los hay
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir e iniciar contenedores
echo "🏗️ Construyendo e iniciando contenedores..."
docker-compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar que los servicios estén ejecutándose
echo "🔍 Verificando servicios..."

# Verificar PostgreSQL
if docker-compose exec -T postgres pg_isready -U florkafun_user > /dev/null 2>&1; then
    echo "✅ PostgreSQL está listo"
else
    echo "❌ PostgreSQL no está listo"
fi

# Verificar Strapi
if curl -f http://localhost:1337/admin > /dev/null 2>&1; then
    echo "✅ Strapi está listo"
else
    echo "⏳ Strapi aún se está inicializando..."
fi

# Verificar Frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend está listo"
else
    echo "⏳ Frontend aún se está inicializando..."
fi

echo ""
echo "🎉 Proyecto inicializado!"
echo ""
echo "📋 Servicios disponibles:"
echo "   Frontend:     http://localhost:5173"
echo "   Strapi Admin: http://localhost:1337/admin"
echo "   Adminer:      http://localhost:8080"
echo "   PostgREST:    http://localhost:3000"
echo ""
echo "📝 Para ver los logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener:"
echo "   docker-compose down"