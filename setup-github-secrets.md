# 🔑 CONFIGURACIÓN DE GITHUB SECRETS PARA DEPLOYMENT AUTOMÁTICO

## 📍 **URL PARA CONFIGURAR:**
https://github.com/Herocku2/kiroflorka/settings/secrets/actions

## 🔧 **SECRETS REQUERIDOS:**

### 1. **VPS_HOST**
```
TU_IP_DEL_VPS_CONTABO
```
*Ejemplo: 123.456.789.012*

### 2. **VPS_USERNAME**
```
root
```

### 3. **VPS_PORT**
```
22
```

### 4. **VPS_SSH_KEY**
```
-----BEGIN OPENSSH PRIVATE KEY-----
TU_CLAVE_SSH_PRIVADA_COMPLETA
-----END OPENSSH PRIVATE KEY-----
```

## 🔑 **CÓMO OBTENER LA CLAVE SSH:**

### Opción A: Si ya tienes clave SSH
```bash
# Mostrar tu clave privada existente
cat ~/.ssh/id_rsa
```

### Opción B: Generar nueva clave SSH
```bash
# Generar nueva clave
ssh-keygen -t rsa -b 4096 -C "github-actions-florka"

# Copiar clave pública al VPS
ssh-copy-id root@TU_IP_VPS

# Mostrar clave privada para GitHub
cat ~/.ssh/id_rsa
```

## 📋 **PASOS PARA CONFIGURAR:**

1. **Ve a GitHub Secrets**: https://github.com/Herocku2/kiroflorka/settings/secrets/actions

2. **Click "New repository secret"** para cada uno:

   - **Name**: `VPS_HOST` → **Value**: `TU_IP_VPS`
   - **Name**: `VPS_USERNAME` → **Value**: `root`
   - **Name**: `VPS_PORT` → **Value**: `22`
   - **Name**: `VPS_SSH_KEY` → **Value**: `TU_CLAVE_PRIVADA_COMPLETA`

3. **Verificar**: Deberías ver 4 secrets configurados

## ✅ **DESPUÉS DE CONFIGURAR:**

Cada vez que hagas:
```bash
git add .
git commit -m "mi cambio"
git push origin main
```

GitHub Actions automáticamente:
- ✅ Descargará el código
- ✅ Instalará dependencias
- ✅ Construirá el frontend
- ✅ Se conectará al VPS
- ✅ Actualizará el código
- ✅ Reiniciará los servicios
- ✅ Tu sitio se actualizará automáticamente

## 🎯 **RESULTADO:**
**DEPLOYMENT AUTOMÁTICO COMPLETO** - Cambios locales → VPS automáticamente