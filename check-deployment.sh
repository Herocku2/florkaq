#!/bin/bash

# 🔍 Script para monitorear el deployment en tiempo real

echo "🔍 MONITOREANDO DEPLOYMENT DE FLORKA FUN"
echo "========================================"
echo ""

# Función para verificar conectividad
check_site() {
    local url=$1
    local name=$2
    
    echo -n "Verificando $name... "
    
    if curl -s --max-time 10 "$url" >/dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ NO RESPONDE"
        return 1
    fi
}

# Función para verificar API específicamente
check_api() {
    echo -n "Verificando API... "
    
    response=$(curl -s --max-time 10 "https://florkafun.online:1337/api/candidatos" 2>/dev/null)
    
    if [[ $? -eq 0 && "$response" != *"ECONNREFUSED"* && "$response" != *"localhost"* ]]; then
        echo "✅ API FUNCIONANDO"
        return 0
    else
        echo "❌ API CON PROBLEMAS"
        echo "   Respuesta: ${response:0:100}..."
        return 1
    fi
}

# Monitoreo continuo
while true; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Verificando servicios..."
    
    # Verificar frontend
    check_site "https://florkafun.online" "Frontend"
    
    # Verificar backend admin
    check_site "https://florkafun.online/admin" "Backend Admin"
    
    # Verificar API
    check_api
    
    # Verificar votaciones específicamente
    echo -n "Verificando página de votaciones... "
    if curl -s --max-time 10 "https://florkafun.online/vote" | grep -q "vote" >/dev/null 2>&1; then
        echo "✅ PÁGINA DE VOTACIONES OK"
    else
        echo "❌ PÁGINA DE VOTACIONES CON PROBLEMAS"
    fi
    
    echo ""
    echo "Esperando 30 segundos para próxima verificación..."
    echo "Presiona Ctrl+C para detener el monitoreo"
    echo "----------------------------------------"
    
    sleep 30
done