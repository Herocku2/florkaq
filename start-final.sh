#!/bin/bash

echo "🚀 FLORKA FUN - INICIO FINAL"

# Limpiar procesos
pkill -f "vite\|strapi" 2>/dev/null || true
sleep 3

# Crear logs
mkdir -p logs

echo "🔧 Iniciando Strapi..."
cd backend
npm run develop > ../logs/final-strapi.log 2>&1 &
cd ..

echo "⏳ Esperando Strapi (60 segundos)..."
sleep 60

echo "🎨 Iniciando React..."
npm run dev > logs/final-react.log 2>&1 &

echo "⏳ Esperando React (15 segundos)..."
sleep 15

echo ""
echo "🎉 ¡FLORKA FUN LISTO!"
echo ""
echo "📱 URLs:"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Admin: http://localhost:1337/admin"
echo "🔌 API: http://localhost:1337/api"
echo ""
echo "🔑 Credenciales:"
echo "Email: admin@localhost"
echo "Password: Admin123456"
echo ""
echo "📊 Verificando servicios..."

# Verificar servicios
if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
    echo "✅ Strapi: FUNCIONANDO"
else
    echo "❌ Strapi: NO RESPONDE"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React: FUNCIONANDO"
else
    echo "❌ React: NO RESPONDE"
fi

echo ""
echo "📋 Content Types disponibles:"
echo "• Candidato (Tokens)"
echo "• Foro (Forum)"
echo "• Voto (Votes)"
echo "• News"
echo "• Launch Calendar"
echo "• Solicitud Token"
echo "• Comentario"
echo "• Actividad"
echo ""
echo "🎯 ¡Ve a http://localhost:1337/admin para ver el Content Manager!"
echo "🎯 ¡Ve a http://localhost:3000 para ver el frontend!"
echo ""
echo "📋 Logs:"
echo "Strapi: tail -f logs/final-strapi.log"
echo "React: tail -f logs/final-react.log"