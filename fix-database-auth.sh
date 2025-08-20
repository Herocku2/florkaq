#!/bin/bash

echo "🔧 Arreglando autenticación de PostgreSQL..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de base de datos
DB_NAME="florkafun"
DB_USER="florkafun_user"
DB_PASSWORD="florkafun_secure_2024"

echo -e "${YELLOW}📋 Configuración de base de datos:${NC}"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASSWORD"

# 1. Conectar como postgres y recrear usuario
echo -e "\n${YELLOW}🔑 Recreando usuario de base de datos...${NC}"
sudo -u postgres psql << EOF
-- Terminar conexiones existentes
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();

-- Eliminar usuario si existe
DROP USER IF EXISTS $DB_USER;

-- Crear usuario con contraseña
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Dar permisos completos
ALTER USER $DB_USER CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Conectar a la base de datos y dar permisos en el schema
\c $DB_NAME;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Dar permisos por defecto para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Usuario de base de datos recreado correctamente${NC}"
else
    echo -e "${RED}❌ Error al recrear usuario de base de datos${NC}"
    exit 1
fi

# 2. Crear archivo .env para el backend
echo -e "\n${YELLOW}📝 Creando archivo .env para el backend...${NC}"
cat > /var/www/florkafun/backend/.env << EOF
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=$DB_NAME
DATABASE_USERNAME=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_SSL=false

# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=mGrpi1i2DOyx+zVtF2A0l8+6oJU2enhecgEIg23gqg8=,hFAt5p7Osh0JyDVkQTPs0TKXupCqASrC1wgwqHDOuf0=,t+LqskxsuOIu1e/nLhmTkCoiqPc64LmNhMGuKSwwWIQ=,Fz8hxVslUQEL8WUARbWOcbTQ4NrBQR21s+ZI3MbsTjg=
API_TOKEN_SALT=dlvqQ76p5Cb17WoW2ZoC7Q==
ADMIN_JWT_SECRET=3Hm48VFj8QGT9q52rV5ObhN28738rw/nAQWFzCynUeM=
TRANSFER_TOKEN_SALT=GNSb8+zIeWrF3EC4VM1a9Q==
JWT_SECRET=BKGonM9dTwbRpVu0DH61tuBW/J/qHawaHexoML21x4I=

# Admin
ADMIN_EMAIL=admin@florkafun.online
ADMIN_PASSWORD=Admin123456
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=Florka

# Environment
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Archivo .env creado${NC}"

# 3. Verificar conexión
echo -e "\n${YELLOW}🔍 Verificando conexión a la base de datos...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión a la base de datos exitosa${NC}"
else
    echo -e "${RED}❌ Error de conexión a la base de datos${NC}"
    
    # Mostrar información de debug
    echo -e "\n${YELLOW}🔍 Información de debug:${NC}"
    sudo -u postgres psql -c "\du" | grep $DB_USER
    sudo -u postgres psql -c "\l" | grep $DB_NAME
fi

# 4. Reiniciar PostgreSQL
echo -e "\n${YELLOW}🔄 Reiniciando PostgreSQL...${NC}"
sudo systemctl restart postgresql

# 5. Mostrar siguiente paso
echo -e "\n${GREEN}🎯 SIGUIENTE PASO:${NC}"
echo "Ahora ejecuta estos comandos en el backend:"
echo ""
echo -e "${YELLOW}cd /var/www/florkafun/backend${NC}"
echo -e "${YELLOW}pm2 stop florkafun-backend${NC}"
echo -e "${YELLOW}rm -rf .cache .tmp${NC}"
echo -e "${YELLOW}npm install${NC}"
echo -e "${YELLOW}npm run build${NC}"
echo -e "${YELLOW}pm2 start ecosystem.config.js${NC}"
echo ""
echo -e "${GREEN}📋 Credenciales de la base de datos:${NC}"
echo "Database: $DB_NAME"
echo "User: $DB_USER"  
echo "Password: $DB_PASSWORD"