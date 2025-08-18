# 🚀 Guía de Deployment Nativo (Sin Docker)

## Arquitectura Final

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTABO VPS                              │
├─────────────────────────────────────────────────────────────┤
│  🌐 Nginx (Puerto 80/443)                                  │
│  ├── https://florkafun.com/        → React Build           │
│  ├── https://florkafun.com/admin   → Strapi Admin          │
│  ├── https://florkafun.com/api     → Strapi API            │
│  └── https://florkafun.com/uploads → Archivos/Imágenes     │
├─────────────────────────────────────────────────────────────┤
│  🔧 PM2 Process Manager                                     │
│  └── Strapi Backend (Puerto 1337)                          │
├─────────────────────────────────────────────────────────────┤
│  🗄️ PostgreSQL Database                                     │
│  └── Base de datos local en el VPS                         │
├─────────────────────────────────────────────────────────────┤
│  🔒 Certbot SSL                                             │
│  └── Certificados automáticos Let's Encrypt               │
└─────────────────────────────────────────────────────────────┘
```

## Lo que tendrás instalado en Contabo

### ✅ Strapi CMS Completo
- **Panel Admin**: Gestión completa de contenido
- **API REST**: Endpoints automáticos para todos los modelos
- **API GraphQL**: Consultas flexibles
- **Gestión de Usuarios**: Registro, login, roles
- **Upload de Archivos**: Imágenes y documentos
- **Internacionalización**: Múltiples idiomas
- **Plugins**: Extensiones personalizadas

### ✅ Base de Datos PostgreSQL
- **Todos los modelos**: Tokens, usuarios, votos, foros
- **Relaciones**: Entre tokens, usuarios, comentarios
- **Índices**: Optimización de consultas
- **Backups**: Automáticos y manuales
- **Acceso directo**: Para consultas SQL

### ✅ Frontend React Optimizado
- **Build de producción**: Minificado y optimizado
- **Routing**: Navegación SPA
- **API Integration**: Conectado a Strapi
- **Responsive**: Móvil y desktop
- **PWA Ready**: Instalable como app

## Comandos de Deployment

### Para Contabo VPS:
```bash
# 1. Configuración inicial del servidor
./contabo-native-setup.sh

# 2. Deploy de la aplicación
./deploy-native.sh
```

### Para desarrollo local:
```bash
# 1. Configuración inicial local
./local-native-setup.sh

# 2. Iniciar desarrollo
./start-dev.sh
```

## URLs Finales

### Producción (Contabo):
- **Frontend**: https://florkafun.com
- **Admin Panel**: https://florkafun.com/admin
- **API REST**: https://florkafun.com/api
- **GraphQL**: https://florkafun.com/graphql

### Desarrollo (Local):
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:1337/admin
- **API REST**: http://localhost:1337/api
- **GraphQL**: http://localhost:1337/graphql

## Ventajas de esta Arquitectura

### ✅ Sin Docker
- No más problemas de contenedores
- Instalación nativa más estable
- Mejor rendimiento
- Fácil debugging

### ✅ Escalable
- PM2 maneja múltiples procesos
- Nginx balanceador de carga
- PostgreSQL optimizado
- CDN para archivos estáticos

### ✅ Mantenible
- Logs centralizados
- Monitoreo con PM2
- SSL automático
- Backups automáticos

### ✅ Profesional
- Arquitectura de producción
- Alta disponibilidad
- Seguridad robusta
- Performance optimizado

## Gestión y Mantenimiento

### Comandos PM2:
```bash
pm2 status              # Ver estado de procesos
pm2 logs                # Ver logs en tiempo real
pm2 restart florkafun-backend  # Reiniciar Strapi
pm2 stop all            # Parar todos los procesos
pm2 start all           # Iniciar todos los procesos
```

### Comandos Nginx:
```bash
nginx -t                # Verificar configuración
systemctl reload nginx  # Recargar configuración
systemctl status nginx  # Ver estado
```

### Comandos PostgreSQL:
```bash
sudo -u postgres psql florkafun  # Acceder a la DB
pg_dump florkafun > backup.sql   # Backup manual
```

## Monitoreo

### Logs disponibles:
- `/var/log/florkafun/backend-*.log` - Logs de Strapi
- `/var/log/nginx/access.log` - Logs de Nginx
- `/var/log/postgresql/` - Logs de PostgreSQL

### Métricas PM2:
```bash
pm2 monit               # Monitor en tiempo real
pm2 show florkafun-backend  # Detalles del proceso
```

## Backup y Restauración

### Backup automático:
```bash
# Script de backup diario
0 2 * * * /usr/local/bin/backup-florkafun.sh
```

### Restauración:
```bash
# Restaurar desde backup
./restore-backup.sh backup-2024-01-01.tar.gz
```