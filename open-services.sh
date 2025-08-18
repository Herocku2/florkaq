#!/bin/bash

echo "🌐 Abriendo servicios FlorkaFun en el navegador..."

# Verificar que los servicios estén corriendo
if ! curl -s -I http://localhost:5173 | grep -q "200 OK"; then
    echo "❌ Frontend no está disponible. Ejecuta ./quick-start.sh primero"
    exit 1
fi

if ! curl -s -I http://localhost:1337/admin | grep -q "200 OK"; then
    echo "❌ Strapi Admin no está disponible. Ejecuta ./quick-start.sh primero"
    exit 1
fi

echo "✅ Servicios verificados. Abriendo en el navegador..."

# Abrir servicios en el navegador
open http://localhost:5173
sleep 2
open http://localhost:1337/admin
sleep 2
open http://localhost:8080

echo ""
echo "🔐 Credenciales para Strapi Admin:"
echo "Email: admin@florkafun.com"
echo "Password: Admin123456"
echo ""
echo "O también:"
echo "Email: giovanni@florkafun.com"
echo "Password: Giovanni123"
echo ""
echo "✅ ¡Servicios abiertos en el navegador!"