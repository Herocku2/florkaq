# 🔐 CONFIGURACIÓN FINAL DE GITHUB SECRETS

## 📍 Repositorio: https://github.com/Herocku2/kiroflorka

## 🚨 ACCIÓN REQUERIDA: Configurar estos Secrets en GitHub

### 📋 **PASO 1: Ir a GitHub Secrets**
1. Ve a: https://github.com/Herocku2/kiroflorka/settings/secrets/actions
2. Click en "New repository secret" para cada uno

---

## 🔑 **SECRETS REQUERIDOS (Copiar y Pegar)**

### 🌐 **Configuración del VPS Contabo**

**VPS_HOST**
```
TU_IP_DEL_VPS_CONTABO
```
*⚠️ REEMPLAZA con la IP real de tu servidor Contabo*

**VPS_USERNAME**
```
root
```

**VPS_SSH_KEY**
```
-----BEGIN OPENSSH PRIVATE KEY-----
TU_CLAVE_PRIVADA_SSH_COMPLETA
-----END OPENSSH PRIVATE KEY-----
```
*⚠️ REEMPLAZA con tu clave SSH privada completa*

**VPS_PORT**
```
22
```

---

### 🔐 **Secrets de Strapi (GENERADOS AUTOMÁTICAMENTE)**

**JWT_SECRET**
```
BKGonM9dTwbRpVu0DH61tuBW/J/qHawaHexoML21x4I=
```

**ADMIN_JWT_SECRET**
```
3Hm48VFj8QGT9q52rV5ObhN28738rw/nAQWFzCynUeM=
```

**APP_KEYS**
```
mGrpi1i2DOyx+zVtF2A0l8+6oJU2enhecgEIg23gqg8=,hFAt5p7Osh0JyDVkQTPs0TKXupCqASrC1wgwqHDOuf0=,t+LqskxsuOIu1e/nLhmTkCoiqPc64LmNhMGuKSwwWIQ=,Fz8hxVslUQEL8WUARbWOcbTQ4NrBQR21s+ZI3MbsTjg=
```

**API_TOKEN_SALT**
```
dlvqQ76p5Cb17WoW2ZoC7Q==
```

**TRANSFER_TOKEN_SALT**
```
GNSb8+zIeWrF3EC4VM1a9Q==
```

---

## 🛠️ **INFORMACIÓN FALTANTE QUE NECESITAS PROPORCIONAR**

### 1. **IP del VPS Contabo**
- Conéctate a tu panel de Contabo
- Copia la IP pública de tu VPS
- Reemplaza `TU_IP_DEL_VPS_CONTABO` con esa IP

### 2. **Clave SSH Privada**
- Si ya tienes una clave SSH configurada, úsala
- Si no, genera una nueva:

```bash
# Generar nueva clave SSH
ssh-keygen -t rsa -b 4096 -C "florka-deployment"

# Copiar clave pública al servidor
ssh-copy-id root@TU_IP_CONTABO

# Mostrar clave privada para copiar a GitHub
cat ~/.ssh/id_rsa
```

---

## ✅ **CHECKLIST DE CONFIGURACIÓN**

- [ ] **VPS_HOST** - IP del servidor Contabo
- [ ] **VPS_USERNAME** - `root`
- [ ] **VPS_SSH_KEY** - Clave SSH privada completa
- [ ] **VPS_PORT** - `22`
- [ ] **JWT_SECRET** - ✅ Generado
- [ ] **ADMIN_JWT_SECRET** - ✅ Generado  
- [ ] **APP_KEYS** - ✅ Generado
- [ ] **API_TOKEN_SALT** - ✅ Generado
- [ ] **TRANSFER_TOKEN_SALT** - ✅ Generado

---

## 🚀 **DESPUÉS DE CONFIGURAR LOS SECRETS**

1. **Hacer un commit y push:**
```bash
git add .
git commit -m "🚀 Ready for automatic deployment"
git push origin main
```

2. **Verificar el deployment:**
- Ve a: https://github.com/Herocku2/kiroflorka/actions
- Verifica que el workflow se ejecute correctamente

3. **Acceder a la aplicación:**
- Frontend: https://florkafun.online
- Admin: https://florkafun.online/admin
- API: https://florkafun.online/api

---

## 🆘 **SI ALGO FALLA**

### Ver logs del deployment:
```bash
# Conectarse al VPS
ssh root@TU_IP_CONTABO

# Ver logs de PM2
pm2 logs florkafun-backend

# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Verificar estado de servicios
pm2 status
systemctl status nginx
```

### Reiniciar servicios manualmente:
```bash
# Reiniciar Strapi
pm2 restart florkafun-backend

# Reiniciar Nginx
systemctl restart nginx
```

---

**🎯 PRÓXIMO PASO: Configurar los secrets en GitHub y hacer push!**