# 🔐 Configuración de GitHub Secrets para Florka Fun

## 📍 Repositorio
**https://github.com/Herocku2/kiroflorka**

## 🛠️ Cómo configurar los Secrets

1. Ve a tu repositorio: https://github.com/Herocku2/kiroflorka
2. Click en **Settings** (en la barra superior del repo)
3. En el menú lateral izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret** para cada variable

---

## 🔑 Variables Requeridas para el Deployment

### 🌐 **Configuración del Servidor Contabo**

| Secret Name | Descripción | Ejemplo |
|-------------|-------------|---------|
| `CONTABO_HOST` | IP pública de tu VPS Contabo | `123.456.789.012` |
| `CONTABO_USERNAME` | Usuario SSH (normalmente root) | `root` |
| `CONTABO_PASSWORD` | Contraseña del usuario SSH | `tu-contraseña-segura` |
| `CONTABO_PORT` | Puerto SSH | `22` |

### 🔐 **Secrets de Strapi Backend**

| Secret Name | Descripción | Cómo generar |
|-------------|-------------|--------------|
| `JWT_SECRET` | Clave para tokens JWT | `openssl rand -base64 32` |
| `ADMIN_JWT_SECRET` | Clave para admin JWT | `openssl rand -base64 32` |
| `APP_KEYS` | Claves de la aplicación | `openssl rand -base64 32,openssl rand -base64 32` |
| `API_TOKEN_SALT` | Salt para tokens API | `openssl rand -base64 16` |
| `TRANSFER_TOKEN_SALT` | Salt para tokens de transferencia | `openssl rand -base64 16` |

---

## 📋 **Valores Específicos para Copiar y Pegar**

### 1. CONTABO_HOST
```
TU_IP_DEL_VPS_CONTABO
```
*Reemplaza con la IP real de tu servidor*

### 2. CONTABO_USERNAME
```
root
```

### 3. CONTABO_PASSWORD
```
tu-contraseña-del-vps
```
*La contraseña que usas para conectarte por SSH a tu VPS*

### 4. CONTABO_PORT
```
22
```

### 5. JWT_SECRET
```bash
# Ejecuta este comando para generar:
openssl rand -base64 32
```
*Copia el resultado*

### 6. ADMIN_JWT_SECRET
```bash
# Ejecuta este comando para generar:
openssl rand -base64 32
```
*Copia el resultado (debe ser diferente al JWT_SECRET)*

### 7. APP_KEYS
```bash
# Ejecuta estos comandos para generar 4 claves:
echo "$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
```
*Copia el resultado completo con las comas*

### 8. API_TOKEN_SALT
```bash
# Ejecuta este comando para generar:
openssl rand -base64 16
```
*Copia el resultado*

### 9. TRANSFER_TOKEN_SALT
```bash
# Ejecuta este comando para generar:
openssl rand -base64 16
```
*Copia el resultado*

---

## 🚀 **Pasos de Configuración Completos**

### Paso 1: Preparar tu VPS Contabo
```bash
# Conectarte a tu VPS
ssh root@TU_IP_CONTABO

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Crear directorio del proyecto
mkdir -p /opt/florka-fun
```

### Paso 2: Probar Conexión SSH
```bash
# Probar conexión con contraseña:
ssh root@TU_IP_CONTABO

# Debería pedirte la contraseña y conectarte
```

### Paso 3: Generar todos los secrets
```bash
# Ejecuta estos comandos y guarda los resultados:
echo "JWT_SECRET: $(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET: $(openssl rand -base64 32)"
echo "APP_KEYS: $(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT: $(openssl rand -base64 16)"
echo "TRANSFER_TOKEN_SALT: $(openssl rand -base64 16)"
```

### Paso 4: Configurar en GitHub
1. Ve a: https://github.com/Herocku2/kiroflorka/settings/secrets/actions
2. Click "New repository secret" para cada variable
3. Pega los valores generados

---

## ✅ **Verificación**

Una vez configurados todos los secrets, el deployment automático se activará cuando:
- Hagas `git push` a las ramas: `main`, `master`, o `feat/ui-uniformity`
- Crees un Pull Request

### Verificar que funciona:
1. Haz un pequeño cambio en el código
2. `git add .`
3. `git commit -m "Test deployment"`
4. `git push`
5. Ve a la pestaña "Actions" en GitHub para ver el progreso

---

## 🆘 **Troubleshooting**

### Error: "Host key verification failed"
```bash
# En tu VPS, ejecuta:
ssh-keyscan -H TU_IP_CONTABO >> ~/.ssh/known_hosts
```

### Error: "Permission denied (publickey)"
- Verifica que copiaste la clave privada completa
- Asegúrate de que la clave pública esté en el servidor

### Error: "Docker command not found"
- Instala Docker en el VPS siguiendo el Paso 1

---

**🎉 ¡Una vez configurado, tu proyecto se desplegará automáticamente en cada push!**