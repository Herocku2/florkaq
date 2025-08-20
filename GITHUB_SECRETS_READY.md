# 🔑 CONFIGURACIÓN GITHUB SECRETS - LISTO PARA COPIAR

## 📍 **IR A:**
https://github.com/Herocku2/kiroflorka/settings/secrets/actions

## 🔧 **AGREGAR ESTOS 4 SECRETS:**

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
[NECESITAS_TU_CLAVE_SSH_PRIVADA]
```

## 🔑 **OBTENER TU CLAVE SSH:**

**Ejecuta este comando en tu terminal:**
```bash
cat ~/.ssh/id_rsa
```

**Si no tienes clave SSH, genera una:**
```bash
# Generar nueva clave
ssh-keygen -t rsa -b 4096 -C "github-actions-florka"

# Copiar al VPS
ssh-copy-id root@84.247.140.138

# Mostrar clave privada
cat ~/.ssh/id_rsa
```

## 📋 **PASOS EN GITHUB:**

1. **Ve a**: https://github.com/Herocku2/kiroflorka/settings/secrets/actions
2. **Click "New repository secret"**
3. **Agregar cada secret con su valor exacto**

## ✅ **RESULTADO:**
Después de configurar, cada `git push origin main` desplegará automáticamente a https://florkafun.online

## 🎯 **FLUJO AUTOMÁTICO:**
Local → Git Push → GitHub Actions → VPS Contabo → https://florkafun.online