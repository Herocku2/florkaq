#!/bin/bash

echo "🔍 Verificando estado de los servicios FlorkaFun..."
echo ""

# Función para verificar servicio
check_service() {
    local name=$1
    local url=$2
    local port=$3
    
    if curl -s -I "$url" | grep -q "200 OK"; then
        echo "✅ $name: $url"
        return 0
    else
        echo "❌ $name: NO DISPONIBLE"
        return 1
    fi
}

# Verificar contenedores
echo "📦 Estado de contenedores:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Verificar servicios web
echo "🌐 Estado de servicios web:"
check_service "Frontend" "http://localhost:5173"
check_service "Strapi Admin" "http://localhost:1337/admin"
check_service "Strapi API" "http://localhost:1337/api"
check_service "PostgREST" "http://localhost:3000"
check_service "Adminer" "http://localhost:8080"

echo ""

# Verificar login de Strapi
echo "🔐 Verificando autenticación de Strapi..."
login_response=$(curl -s -X POST http://localhost:1337/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@florkafun.com", "password": "Admin123456"}')

if echo "$login_response" | grep -q "token"; then
    echo "✅ Login de admin@florkafun.com: FUNCIONA"
else
    echo "❌ Login de admin@florkafun.com: FALLA"
fi

# Verificar segundo usuario
login_response2=$(curl -s -X POST http://localhost:1337/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "giovanni@florkafun.com", "password": "Giovanni123"}')

if echo "$login_response2" | grep -q "token"; then
    echo "✅ Login de giovanni@florkafun.com: FUNCIONA"
else
    echo "❌ Login de giovanni@florkafun.com: FALLA"
fi

echo ""
echo "📊 Logs recientes de Strapi:"
docker logs florkafun-strapi --tail 5

echo ""
echo "💡 Si algún servicio no funciona, ejecuta:"
echo "   docker-compose restart <nombre-servicio>"
echo "   o"
echo "   ./quick-start.sh"