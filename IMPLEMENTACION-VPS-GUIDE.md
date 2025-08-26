# 🚀 Guía Completa de Implementación VPS + GitHub Actions + Cloudflare

## 📋 ORDEN DE EJECUCIÓN

### **FASE 1: PREPARACIÓN LOCAL**

1. **Hacer ejecutables los scripts:**
```bash
chmod +x vps-reset-setup.sh
chmod +x setup-ssh-keys.sh
chmod +x setup-cloudflare.sh
```

2. **Configurar SSH Keys en LOCAL:**
```bash
./setup-ssh-keys.sh
```
- ✅ Guarda la IP del VPS cuando te la pida
- ✅ Copia la CLAVE PÚBLICA (para el VPS)
- ✅ Copia la CLAVE PRIVADA (para GitHub Secrets)

---

### **FASE 2: CONFIGURACIÓN DEL VPS**

1. **Conectarse al VPS via SSH:**
```bash
ssh root@[IP_DEL_VPS]
```

2. **Subir y ejecutar script de reset:**
```bash
# Opción A: Subir archivo
scp vps-reset-setup.sh root@[IP_DEL_VPS]:/root/
ssh root@[IP_DEL_VPS]
bash /root/vps-reset-setup.sh

# Opción B: Ejecutar directamente
curl -sSL https://raw.githubusercontent.com/Herocku2/florkaq/main/vps-reset-setup.sh | bash
```

3. **Configurar SSH Keys en el VPS:**
```bash
# En el VPS, como usuario florka
su - florka
curl -sSL https://raw.githubusercontent.com/Herocku2/florkaq/main/setup-ssh-keys.sh | bash
```
- ✅ Pega la CLAVE PÚBLICA que copiaste del LOCAL

4. **Probar conexión SSH sin password:**
```bash
# Desde LOCAL
ssh florka@[IP_DEL_VPS]
```

---

### **FASE 3: CONFIGURACIÓN DE GITHUB**

1. **Ir a GitHub → Repositorio → Settings → Secrets and Variables → Actions**

2. **Agregar estos Secrets:**
```
CONTABO_SSH_KEY     = [CLAVE_PRIVADA_COMPLETA_DESDE_LOCAL]
CONTABO_HOST        = [IP_DEL_VPS]
CONTABO_USER        = florka
```

3. **Verificar que GitHub Actions esté habilitado:**
   - Ve a Actions tab en tu repositorio
   - Habilita workflows si están deshabilitados

---

### **FASE 4: CONFIGURACIÓN DE CLOUDFLARE**

1. **En el VPS, ejecutar configuración Cloudflare:**
```bash
# Como root en el VPS
curl -sSL https://raw.githubusercontent.com/Herocku2/florkaq/main/setup-cloudflare.sh | bash
```

2. **En el Panel de Cloudflare:**
   - Ve a tu dominio `florkafun.online`
   - DNS Settings:
     ```
     Tipo: A | Nombre: @ | IPv4: [IP_DEL_VPS] | Proxy: ON
     Tipo: A | Nombre: www | IPv4: [IP_DEL_VPS] | Proxy: ON
     ```
   - SSL/TLS Settings:
     - Encryption mode: **Full**
     - Always Use HTTPS: **ON**
     - Edge Certificates: **ON**

3. **Configurar certificados SSL en el VPS:**
```bash
# En el VPS como root
certbot --nginx -d florkafun.online -d www.florkafun.online
```

---

### **FASE 5: PRIMER DESPLIEGUE**

1. **Hacer primer push para activar GitHub Actions:**
```bash
# En LOCAL
git add .
git commit -m "🚀 Configuración completa para auto-deploy VPS"
git push origin main
```

2. **Monitorear el deploy:**
   - Ve a GitHub → Actions tab
   - Observa el workflow en ejecución
   - Revisa logs si hay errores

3. **Verificar en el VPS:**
```bash
# En el VPS
florka-status
florka-diagnose
```

---

### **FASE 6: VERIFICACIÓN FINAL**

1. **Probar el sitio:**
   - https://florkafun.online
   - https://florkafun.online/admin
   - https://florkafun.online/api/tokens

2. **Verificar servicios:**
```bash
# En el VPS
systemctl status nginx
pm2 list
florka-diagnose
```

---

## 🔧 COMANDOS ÚTILES

### **En el VPS:**
```bash
florka-status          # Estado general
florka-diagnose        # Diagnóstico completo
florka-deploy          # Deploy manual
florka-ssl-renew       # Renovar SSL
pm2 logs florka-backend # Ver logs backend
tail -f /var/log/nginx/florkafun.error.log # Logs Nginx
```

### **En LOCAL:**
```bash
ssh florka@[IP_VPS]    # Conectar al VPS
git add . && git commit -m "update" && git push  # Trigger deploy
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Si falla la conexión SSH:**
```bash
# Verificar SSH key
ssh -i ~/.ssh/id_rsa florka@[IP_VPS]

# Regenerar keys si es necesario
rm ~/.ssh/id_rsa*
./setup-ssh-keys.sh
```

### **Si falla GitHub Actions:**
1. Verificar Secrets en GitHub
2. Revisar logs del workflow
3. Probar conexión SSH manualmente

### **Si falla Nginx:**
```bash
# En el VPS
nginx -t                    # Verificar configuración
systemctl restart nginx    # Reiniciar
florka-diagnose            # Diagnóstico
```

### **Si falla el Backend:**
```bash
# En el VPS
pm2 restart florka-backend
pm2 logs florka-backend
cd /var/www/florkafun && npm run build
```

---

## 🎯 FLUJO DE TRABAJO DIARIO

1. **Hacer cambios en LOCAL**
2. **Commit y push:**
   ```bash
   git add .
   git commit -m "descripción del cambio"
   git push
   ```
3. **GitHub Actions se activa automáticamente**
4. **En 2-3 minutos el sitio está actualizado**
5. **Verificar en https://florkafun.online**

---

## 📊 MONITOREO

- **GitHub Actions:** Ve progreso en tiempo real
- **VPS Status:** `florka-status` en el VPS
- **Logs:** `pm2 logs` y `/var/log/nginx/`
- **Health Check:** https://florkafun.online/_health

---

## 🔐 SEGURIDAD

- ✅ SSH con keys (sin passwords)
- ✅ Firewall configurado
- ✅ SSL/TLS automático
- ✅ Headers de seguridad
- ✅ Cloudflare protection
- ✅ Auto-updates habilitadas

---

**¡Todo listo para producción! 🎉**