# 🚀 Deployment Guide - Florka Fun to Contabo VPS

## 📋 Configuración de GitHub Secrets

Para que el deployment automático funcione, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

### 🔐 Secrets Requeridos

Ve a tu repositorio → Settings → Secrets and variables → Actions → New repository secret

```
CONTABO_HOST=tu-ip-del-vps-contabo
CONTABO_USERNAME=root
CONTABO_SSH_KEY=tu-clave-privada-ssh
CONTABO_PORT=22
JWT_SECRET=tu-jwt-secret-aqui
ADMIN_JWT_SECRET=tu-admin-jwt-secret-aqui
APP_KEYS=tu-app-keys-aqui
API_TOKEN_SALT=tu-api-token-salt-aqui
TRANSFER_TOKEN_SALT=tu-transfer-token-salt-aqui
```

### 🔑 Cómo obtener la SSH Key

1. En tu máquina local, genera una clave SSH:
```bash
ssh-keygen -t rsa -b 4096 -C "florka-deployment"
```

2. Copia la clave pública al servidor:
```bash
ssh-copy-id root@tu-ip-contabo
```

3. Copia el contenido de la clave privada:
```bash
cat ~/.ssh/id_rsa
```

4. Pega todo el contenido (incluyendo `-----BEGIN` y `-----END`) en el secret `CONTABO_SSH_KEY`

## 🐳 Preparación del VPS Contabo

### 1. Instalar Docker y Docker Compose

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Configurar Firewall

```bash
# Permitir puertos necesarios
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend (temporal)
ufw allow 1337  # Backend (temporal)
ufw enable
```

### 3. Crear directorio del proyecto

```bash
mkdir -p /opt/florka-fun
chown -R root:root /opt/florka-fun
```

## 🔄 Proceso de Deployment

### Automático (Recomendado)
El deployment se ejecuta automáticamente cuando:
- Haces push a las ramas: `main`, `master`, o `feat/ui-uniformity`
- Creas un Pull Request a `main` o `master`

### Manual
Si necesitas hacer deployment manual:

```bash
# En tu VPS
cd /opt/florka-fun
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📁 Estructura del Proyecto en el VPS

```
/opt/florka-fun/
├── frontend/                 # Código React
├── backend/                  # Código Strapi
├── docker-compose.yml        # Configuración Docker
├── Dockerfile.frontend       # Dockerfile para React
├── nginx.conf               # Configuración Nginx
├── .env                     # Variables de entorno
└── ssl/                     # Certificados SSL (opcional)
```

## 🌐 Configuración de Dominio

### 1. DNS Records
Configura estos records en tu proveedor de DNS:

```
A     florka.fun        → IP-DE-TU-VPS
A     www.florka.fun    → IP-DE-TU-VPS
```

### 2. SSL Certificate (Opcional)
Para HTTPS, puedes usar Let's Encrypt:

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d florka.fun -d www.florka.fun

# Renovación automática
crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔍 Monitoreo y Logs

### Ver logs de los contenedores:
```bash
cd /opt/florka-fun

# Todos los servicios
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend
docker-compose logs -f backend

# Solo nginx
docker-compose logs -f nginx
```

### Estado de los contenedores:
```bash
docker-compose ps
```

### Reiniciar servicios:
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo un servicio
docker-compose restart frontend
```

## 🚨 Troubleshooting

### Problema: Contenedores no inician
```bash
# Verificar logs
docker-compose logs

# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up -d
```

### Problema: No se puede conectar
```bash
# Verificar puertos
netstat -tlnp | grep -E '(80|443|3000|1337)'

# Verificar firewall
ufw status
```

### Problema: Base de datos corrupta
```bash
# Backup y reset de la base de datos
cd /opt/florka-fun/backend
cp .tmp/data.db .tmp/data.db.backup
rm .tmp/data.db
docker-compose restart backend
```

## 📞 Soporte

Si tienes problemas con el deployment:
1. Revisa los logs de GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Asegúrate de que el VPS tenga Docker instalado
4. Revisa los logs de los contenedores en el VPS

---

**¡Tu proyecto Florka Fun se desplegará automáticamente cada vez que hagas push! 🎉**