#!/bin/bash

echo "🚨 RESTAURACIÓN DE EMERGENCIA - USANDO CONFIGURACIÓN QUE FUNCIONABA"

# Limpiar todo
pkill -f "vite\|strapi\|npm" 2>/dev/null || true
sleep 5

# Restaurar configuraciones exactas del backup
echo "📋 Restaurando configuraciones del backup..."

# Copiar package.json del backup que funcionaba
cp ../backup_comparison/kiroflorka_backup/package.json . 2>/dev/null || true

# Copiar vite.config.js del backup
cp ../backup_comparison/kiroflorka_backup/vite.config.js . 2>/dev/null || true

# Copiar toda la estructura del backend que funcionaba
echo "🔧 Restaurando backend completo..."
rm -rf backend/src/api/*
cp -r ../backup_comparison/kiroflorka_backup/backend/src/api/* backend/src/api/

# Copiar configuraciones del backend
cp ../backup_comparison/kiroflorka_backup/backend/config/* backend/config/ 2>/dev/null || true

# Copiar la base de datos que funcionaba
cp ../backup_comparison/kiroflorka_backup/backend/.tmp/data.db backend/.tmp/ 2>/dev/null || true

# Reinstalar dependencias del frontend
echo "📦 Reinstalando dependencias del frontend..."
npm install

# Reinstalar dependencias del backend
echo "📦 Reinstalando dependencias del backend..."
cd backend
npm install
cd ..

# Crear logs
mkdir -p logs

echo "🚀 Iniciando con configuración que funcionaba..."

# Iniciar Strapi
echo "🔧 Iniciando Strapi..."
cd backend
npm run develop > ../logs/emergency-strapi.log 2>&1 &
STRAPI_PID=$!
cd ..

echo "⏳ Esperando Strapi (60 segundos)..."
sleep 60

# Iniciar React
echo "🎨 Iniciando React..."
npm start > logs/emergency-react.log 2>&1 &
REACT_PID=$!

echo "⏳ Esperando React (15 segundos)..."
sleep 15

echo ""
echo "🎉 RESTAURACIÓN COMPLETA"
echo ""
echo "📱 URLs:"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Admin: http://localhost:1337/admin"
echo ""
echo "🔑 Credenciales:"
echo "Email: admin@localhost"
echo "Password: Admin123456"
echo ""

# Verificar servicios
echo "📊 Verificando servicios..."
if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
    echo "✅ Strapi: FUNCIONANDO"
else
    echo "❌ Strapi: Revisando logs..."
    tail -10 logs/emergency-strapi.log
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React: FUNCIONANDO"
else
    echo "❌ React: Revisando logs..."
    tail -10 logs/emergency-react.log
fi

echo ""
echo "📋 Para ver logs:"
echo "Strapi: tail -f logs/emergency-strapi.log"
echo "React: tail -f logs/emergency-react.log"