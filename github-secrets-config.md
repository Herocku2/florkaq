# 🔑 CONFIGURACIÓN GITHUB SECRETS - CONTABO VPS

## 📍 **CONFIGURAR EN:**
https://github.com/Herocku2/kiroflorka/settings/secrets/actions

## 🔧 **SECRETS EXACTOS PARA COPIAR:**

### 1. **VPS_HOST**
```
84.247.140.138
```

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
[TU_CLAVE_SSH_PRIVADA_COMPLETA]
```

## 🔑 **OBTENER TU CLAVE SSH:**

### Si ya tienes clave SSH configurada:
```bash
# Mostrar tu clave privada
cat ~/.ssh/id_rsa
```

### Si necesitas generar nueva clave:
```bash
# Generar nueva clave SSH
ssh-keygen -t rsa -b 4096 -C "github-actions-florka"

# Copiar clave pública al VPS
ssh-copy-id root@84.247.140.138

# Mostrar clave privada para GitHub
cat ~/.ssh/id_rsa
```

## 📋 **PASOS EN GITHUB:**

1. **Ve a**: https://github.com/Herocku2/kiroflorka/settings/secrets/actions

2. **Click "New repository secret"** y agrega:

   **Secret 1:**
   - Name: `VPS_HOST`
   - Value: `84.247.140.138`

   **Secret 2:**
   - Name: `VPS_USERNAME` 
   - Value: `root`

   **Secret 3:**
   - Name: `VPS_PORT`
   - Value: `22`

   **Secret 4:**
   - Name: `VPS_SSH_KEY`
   - Value: `[PEGAR_TU_CLAVE_PRIVADA_COMPLETA]`

## ✅ **VERIFICACIÓN:**
Después de configurar, deberías ver 4 secrets en la lista.

## 🚀 **RESULTADO:**
Cada `git push origin main` desplegará automáticamente a https://florkafun.online