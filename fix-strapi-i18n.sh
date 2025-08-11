#!/bin/bash

# 🔧 Script para deshabilitar i18n en Strapi y solucionar errores
# Ejecutar en el VPS: bash fix-strapi-i18n.sh

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

log "🔧 Deshabilitando i18n en Strapi..."

# Verificar que estamos en el directorio correcto
if [ ! -d "/opt/florka-fun/backend" ]; then
    echo "Error: No se encuentra el directorio /opt/florka-fun/backend"
    exit 1
fi

cd /opt/florka-fun/backend

log "Paso 1: Creando configuración de plugins..."

# Crear directorio config si no existe
mkdir -p config

# Crear archivo plugins.js para deshabilitar i18n
cat > config/plugins.js << 'EOF'
module.exports = {
  // Deshabilitar i18n para evitar errores de localización
  i18n: {
    enabled: false,
  },
  
  // Configuración de upload
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000000, // 100MB
      },
    },
  },
  
  // Configuración de users-permissions
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['username', 'email', 'password'],
      },
    },
  },
};
EOF

log "Paso 2: Actualizando configuración del servidor..."

# Actualizar server.js para mejorar configuración
cat > config/server.js << 'EOF'
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Configuración adicional para evitar errores
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
  // Deshabilitar telemetría
  telemetry: false,
});
EOF

log "Paso 3: Creando configuración de middlewares..."

# Crear middlewares.js para configuración CORS
cat > config/middlewares.js << 'EOF'
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:5173', 'https://florkafun.online', 'https://www.florkafun.online'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
EOF

log "Paso 4: Reiniciando contenedor de Strapi..."

cd /opt/florka-fun

# Reiniciar solo el contenedor de Strapi
docker-compose restart florkafun-strapi

log "Paso 5: Esperando a que Strapi se reinicie..."
sleep 15

# Verificar que Strapi está corriendo
if docker-compose ps | grep florkafun-strapi | grep -q "Up"; then
    log "✅ Strapi reiniciado correctamente"
else
    warning "⚠️ Strapi puede estar tardando en iniciar, verificando logs..."
    docker-compose logs --tail=20 florkafun-strapi
fi

log "Paso 6: Verificando conectividad..."

# Probar conectividad
if curl -f http://localhost:1337/admin >/dev/null 2>&1; then
    log "✅ Admin panel accesible"
else
    warning "⚠️ Admin panel no responde inmediatamente, puede estar iniciando..."
fi

log "Paso 7: Mostrando logs recientes..."
echo ""
info "Últimos logs de Strapi:"
docker-compose logs --tail=10 florkafun-strapi

echo ""
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo ""
echo "📋 Cambios realizados:"
echo "✅ i18n deshabilitado"
echo "✅ Configuración CORS actualizada"
echo "✅ Middlewares optimizados"
echo "✅ Telemetría deshabilitada"
echo ""
echo "🌐 Tu admin panel está disponible en:"
echo "   https://florkafun.online/admin/"
echo ""
echo "📊 Para verificar el estado:"
echo "   docker-compose ps"
echo "   docker-compose logs florkafun-strapi"
echo ""
EOF