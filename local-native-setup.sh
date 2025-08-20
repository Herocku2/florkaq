#!/bin/bash

echo "🏠 Configuración Local Nativa (Sin Docker)"
echo "=========================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar PostgreSQL local (opcional)
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL detectado"
    USE_POSTGRES=true
else
    echo "⚠️ PostgreSQL no detectado. Usando SQLite para desarrollo local"
    USE_POSTGRES=false
fi

echo "🔧 Configurando Backend (Strapi)..."

cd backend

# Instalar dependencias
npm install

# Crear archivo de entorno local
if [ "$USE_POSTGRES" = true ]; then
    cat > .env << EOF
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

# Database PostgreSQL Local
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=florkafun_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Secrets para desarrollo
APP_KEYS=dev-key-1,dev-key-2,dev-key-3,dev-key-4
API_TOKEN_SALT=dev-api-token-salt
ADMIN_JWT_SECRET=dev-admin-jwt-secret
JWT_SECRET=dev-jwt-secret
TRANSFER_TOKEN_SALT=dev-transfer-token-salt

# CORS para desarrollo
STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
EOF

    echo "📊 Configurando base de datos PostgreSQL local..."
    # Crear base de datos si no existe
    createdb florkafun_dev 2>/dev/null || echo "Base de datos ya existe"
else
    cat > .env << EOF
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

# Database SQLite para desarrollo
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Secrets para desarrollo
APP_KEYS=dev-key-1,dev-key-2,dev-key-3,dev-key-4
API_TOKEN_SALT=dev-api-token-salt
ADMIN_JWT_SECRET=dev-admin-jwt-secret
JWT_SECRET=dev-jwt-secret
TRANSFER_TOKEN_SALT=dev-transfer-token-salt

# CORS para desarrollo
STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
EOF
fi

echo "🎨 Configurando Frontend (React)..."

cd ..

# Instalar dependencias del frontend
npm install

# Crear archivo de entorno local
cat > .env.local << EOF
VITE_API_URL=http://localhost:1337/api
VITE_STRAPI_URL=http://localhost:1337
EOF

echo "📝 Creando scripts de desarrollo..."

# Script para iniciar backend
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Strapi Backend..."
cd backend
npm run develop
EOF

# Script para iniciar frontend
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Iniciando React Frontend..."
npm run dev
EOF

# Script para iniciar todo
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando FlorkaFun en modo desarrollo..."

# Función para matar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar backend en background
echo "🔧 Iniciando Backend (Strapi)..."
cd backend && npm run develop &
BACKEND_PID=$!

# Esperar un poco para que Strapi inicie
sleep 10

# Iniciar frontend en background
echo "🎨 Iniciando Frontend (React)..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servicios iniciados:"
echo "🔧 Backend (Strapi): http://localhost:1337"
echo "🎨 Frontend (React): http://localhost:5173"
echo "👑 Admin Panel: http://localhost:1337/admin"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen los procesos
wait $BACKEND_PID $FRONTEND_PID
EOF

# Hacer scripts ejecutables
chmod +x start-backend.sh start-frontend.sh start-dev.sh

echo "✅ Configuración local completada!"
echo ""
echo "🚀 Para iniciar el desarrollo:"
echo "./start-dev.sh          - Inicia backend y frontend juntos"
echo "./start-backend.sh      - Solo backend (Strapi)"
echo "./start-frontend.sh     - Solo frontend (React)"
echo ""
echo "🌐 URLs de desarrollo:"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:1337"
echo "Admin: http://localhost:1337/admin"