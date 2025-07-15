# Configuración de Docker para FlorkaFun

Este documento te guía para ejecutar FlorkaFun usando Docker Desktop.

## Servicios Incluidos

La configuración de Docker incluye los siguientes servicios:

1. **PostgreSQL** (Puerto 5432) - Base de datos principal
2. **Adminer** (Puerto 8080) - Interfaz web para gestionar la base de datos
3. **Strapi** (Puerto 1337) - Backend CMS
4. **Frontend React** (Puerto 5173) - Interfaz de usuario
5. **PostgREST** (Puerto 3000) - API REST directa para PostgreSQL
6. **Redis** (Puerto 6379) - Caché y gestión de sesiones

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Git para clonar el repositorio

## Pasos para Ejecutar

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Herocku2/kiroflorka.git
cd kiroflorka
```

### 2. Ejecutar con Docker Desktop

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver los logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f strapi
```

### 3. Acceder a los Servicios

Una vez que los contenedores estén ejecutándose, puedes acceder a:

- **Frontend**: http://localhost:5173
- **Strapi Admin**: http://localhost:1337/admin
- **Adminer**: http://localhost:8080
- **PostgREST API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### 4. Configurar Adminer

Para conectarte a la base de datos desde Adminer (http://localhost:8080):

- **Sistema**: PostgreSQL
- **Servidor**: postgres
- **Usuario**: florkafun_user
- **Contraseña**: florkafun_password
- **Base de datos**: florkafun

### 5. Configurar Strapi

1. Ve a http://localhost:1337/admin
2. Crea tu cuenta de administrador
3. Configura los modelos de datos según el plan de implementación

## Comandos Útiles

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto borra los datos)
docker-compose down -v

# Reconstruir los contenedores
docker-compose up --build

# Ver el estado de los contenedores
docker-compose ps

# Ejecutar comandos dentro de un contenedor
docker-compose exec strapi bash
docker-compose exec postgres psql -U florkafun_user -d florkafun

# Ver logs de todos los servicios
docker-compose logs

# Reiniciar un servicio específico
docker-compose restart strapi
```

## Estructura de Volúmenes

Los datos se almacenan en volúmenes de Docker:

- `postgres-data`: Datos de PostgreSQL
- `strapi-uploads`: Archivos subidos a Strapi
- `redis-data`: Datos de Redis

## Solución de Problemas

### Si Strapi no inicia:

1. Verifica que PostgreSQL esté ejecutándose:
   ```bash
   docker-compose logs postgres
   ```

2. Reinicia el servicio de Strapi:
   ```bash
   docker-compose restart strapi
   ```

### Si el Frontend no carga:

1. Verifica que las dependencias se instalaron:
   ```bash
   docker-compose logs frontend
   ```

2. Reconstruye el contenedor:
   ```bash
   docker-compose up --build frontend
   ```

### Para limpiar todo y empezar de nuevo:

```bash
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## Variables de Entorno

Las principales variables de entorno están configuradas en el `docker-compose.yml`:

- `DATABASE_*`: Configuración de PostgreSQL
- `APP_KEYS`: Claves de la aplicación Strapi
- `JWT_SECRET`: Secreto para tokens JWT
- `NODE_ENV`: Entorno de desarrollo

## Próximos Pasos

Una vez que todos los servicios estén ejecutándose:

1. Configura Strapi con los modelos de datos
2. Conecta el frontend con la API de Strapi
3. Implementa las funcionalidades según el plan de tareas

## Monitoreo en Docker Desktop

En Docker Desktop podrás ver:

- Estado de todos los contenedores
- Logs en tiempo real
- Uso de recursos (CPU, memoria)
- Volúmenes y redes creados
- Puertos expuestos