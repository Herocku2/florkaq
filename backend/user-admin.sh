#!/bin/bash

# Script para gestionar usuarios de FlorkaFun
# Uso: ./user-admin.sh <comando> [parametros]

API_BASE="http://localhost:1337/api"

function show_help() {
    echo "🛠️  Gestor de Usuarios FlorkaFun"
    echo ""
    echo "Comandos disponibles:"
    echo "  list                    - Listar todos los usuarios"
    echo "  show <email>            - Mostrar información de un usuario"
    echo "  make-moderator <email>  - Convertir usuario en moderador"
    echo "  make-admin <email>      - Convertir usuario en administrador"
    echo "  make-user <email>       - Convertir en usuario estándar"
    echo ""
    echo "Ejemplos:"
    echo "  ./user-admin.sh list"
    echo "  ./user-admin.sh make-moderator moderator@test.com"
    echo "  ./user-admin.sh show moderator@test.com"
}

function list_users() {
    echo "👥 Listando todos los usuarios..."
    echo ""
    
    response=$(curl -s "$API_BASE/admin/users")
    
    if echo "$response" | grep -q '"success":true'; then
        echo "$response" | jq -r '
            "📊 Total de usuarios: \(.count)\n" +
            (.data[] | 
                (if .rol == "admin" then "👑" elif .rol == "moderador" then "🛡️" else "👤" end) + " " + .nombre + "\n" +
                "   📧 Email: " + .email + "\n" +
                "   🎭 Rol: " + .rol + "\n" +
                "   📅 Registro: " + (.fechaRegistro | split("T")[0]) + "\n" +
                "   " + (if .activo then "✅" else "❌" end) + " Activo: " + (.activo | tostring) + "\n"
            )
        '
    else
        echo "❌ Error obteniendo usuarios"
        echo "$response"
    fi
}

function show_user() {
    local email="$1"
    
    if [ -z "$email" ]; then
        echo "❌ Uso: ./user-admin.sh show <email>"
        return 1
    fi
    
    echo "🔍 Información del usuario: $email"
    echo ""
    
    response=$(curl -s "$API_BASE/admin/user/$email")
    
    if echo "$response" | grep -q '"success":true'; then
        echo "$response" | jq -r '
            .data | 
            (if .rol == "admin" then "👑" elif .rol == "moderador" then "🛡️" else "👤" end) + " " + .nombre + "\n" +
            "📧 Email: " + .email + "\n" +
            "🎭 Rol: " + .rol + "\n" +
            "📅 Registro: " + (.fechaRegistro | split("T")[0]) + "\n" +
            "✅ Activo: " + (.activo | tostring) +
            (if .walletSolana then "\n💰 Wallet: " + .walletSolana else "" end)
        '
    else
        echo "❌ Usuario no encontrado"
    fi
}

function change_role() {
    local email="$1"
    local new_role="$2"
    local role_emoji=""
    
    case "$new_role" in
        "usuario") role_emoji="👤" ;;
        "moderador") role_emoji="🛡️" ;;
        "admin") role_emoji="👑" ;;
    esac
    
    if [ -z "$email" ]; then
        echo "❌ Uso: ./user-admin.sh make-$new_role <email>"
        return 1
    fi
    
    echo "$role_emoji Convirtiendo $email en $new_role..."
    echo ""
    
    response=$(curl -s -X POST "$API_BASE/admin/change-role" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"newRole\":\"$new_role\"}")
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ $(echo "$response" | jq -r '.message')"
        echo ""
        echo "🔍 Estado actualizado:"
        show_user "$email"
    else
        echo "❌ Error cambiando rol"
        echo "$response" | jq -r '.error // .message // "Error desconocido"'
    fi
}

# Verificar que jq esté instalado
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq no está instalado"
    echo "💡 Instala jq con: brew install jq"
    exit 1
fi

# Procesar comandos
case "$1" in
    "list")
        list_users
        ;;
    "show")
        show_user "$2"
        ;;
    "make-moderator")
        change_role "$2" "moderador"
        ;;
    "make-admin")
        change_role "$2" "admin"
        ;;
    "make-user")
        change_role "$2" "usuario"
        ;;
    *)
        show_help
        exit 1
        ;;
esac