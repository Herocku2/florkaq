# Backend de FlorkaFun con Strapi

Este directorio contiene el backend de FlorkaFun basado en Strapi CMS.

## Estructura

El backend se organiza siguiendo la estructura estándar de Strapi:

- `/api`: Contiene las definiciones de los modelos de datos y controladores
- `/config`: Configuración de la aplicación, base de datos, middleware, etc.
- `/extensions`: Extensiones personalizadas para Strapi
- `/public`: Archivos públicos accesibles desde el exterior

## Modelos de Datos

El sistema implementa los siguientes modelos de datos:

1. **Tokens**: Información sobre tokens meme en Solana
2. **Votaciones**: Sistema de votación para futuros tokens
3. **Comentarios**: Comentarios de usuarios en foros y tokens
4. **Foros**: Hilos de discusión sobre tokens
5. **Usuarios**: Información de usuarios y sus roles
6. **Paquetes**: Opciones de paquetes para creación de tokens
7. **SolicitudesToken**: Solicitudes de creación de tokens
8. **Swaps**: Operaciones de intercambio de tokens

## Roles y Permisos

El sistema implementa tres niveles de roles:

1. **Usuario Estándar**: Puede votar, comentar, reaccionar y solicitar tokens
2. **Moderador**: Puede crear y moderar foros, gestionar usuarios en foros
3. **Administrador**: Control total del sistema

## Automatizaciones

El sistema incluye varios trabajos programados (CRON jobs):

1. Finalización de votaciones y determinación de ganadores
2. Lanzamiento automático de tokens en fechas programadas
3. Notificaciones a usuarios sobre eventos importantes

## Desarrollo

Para iniciar el desarrollo del backend:

```bash
# Iniciar el contenedor de Strapi
docker-compose up strapi

# Acceder al panel de administración
# URL: http://localhost:1337/admin
```