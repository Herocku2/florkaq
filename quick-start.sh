#!/bin/bash

echo "🚀 Iniciando servicios FlorkaFun..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Iniciando Docker..."
    open -a Docker
    echo "⏳ Esperando que Docker se inicie..."
    sleep 15
fi

# Levantar servicios
echo "📦 Levantando contenedores..."
docker-compose up -d

# Esperar que los servicios estén listos
echo "⏳ Esperando que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
echo "🔍 Verificando servicios..."

echo "Frontend (React):"
if curl -s -I http://localhost:5173 | grep -q "200 OK"; then
    echo "✅ Frontend: http://localhost:5173"
else
    echo "❌ Frontend no está disponible"
fi

echo "Backend (Strapi Admin):"
if curl -s -I http://localhost:1337/admin | grep -q "200 OK"; then
    echo "✅ Strapi Admin: http://localhost:1337/admin"
else
    echo "❌ Strapi Admin no está disponible"
fi

echo "API REST:"
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "✅ PostgREST API: http://localhost:3000"
else
    echo "❌ PostgREST API no está disponible"
fi

echo "Adminer (DB Manager):"
if curl -s -I http://localhost:8080 | grep -q "200 OK"; then
    echo "✅ Adminer: http://localhost:8080"
else
    echo "❌ Adminer no está disponible"
fi

echo ""
echo "🔐 Credenciales de Strapi Admin:"
echo "Email: admin@florkafun.com"
echo "Password: Admin123456"
echo ""
echo "O también:"
echo "Email: giovanni@florkafun.com"
echo "Password: Giovanni123"
echo ""
echo "🌐 URLs principales:"
echo "Frontend: http://localhost:5173"
echo "Strapi Admin: http://localhost:1337/admin"
echo "API: http://localhost:1337/api"
echo "PostgREST: http://localhost:3000"
echo "Adminer: http://localhost:8080"
echo ""
echo "✅ ¡Servicios iniciados!"