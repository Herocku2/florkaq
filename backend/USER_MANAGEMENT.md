# 🛠️ Gestión de Usuarios FlorkaFun

## Descripción

Este documento explica cómo gestionar usuarios y roles en la plataforma FlorkaFun.

## Roles Disponibles

- **👤 Usuario**: Rol por defecto, puede votar y comentar
- **🛡️ Moderador**: Puede crear y gestionar foros, moderar contenido
- **👑 Administrador**: Control total de la plataforma

## Herramientas Disponibles

### 1. Script de Administración (`user-admin.sh`)

Script principal para gestionar usuarios desde la línea de comandos.

#### Comandos Disponibles:

```bash
# Listar todos los usuarios
./user-admin.sh list

# Mostrar información de un usuario específico
./user-admin.sh show <email>

# Convertir usuario en moderador
./user-admin.sh make-moderator <email>

# Convertir usuario en administrador
./user-admin.sh make-admin <email>

# Convertir en usuario estándar
./user-admin.sh make-user <email>
```

#### Ejemplos:

```bash
# Ver todos los usuarios
./user-admin.sh list

# Convertir usuario en moderador
./user-admin.sh make-moderator usuario@example.com

# Ver información específica
./user-admin.sh show usuario@example.com

# Convertir en administrador
./user-admin.sh make-admin admin@example.com
```

### 2. API Endpoints

También puedes usar directamente los endpoints de la API:

#### Listar usuarios:
```bash
curl http://localhost:1337/api/admin/users
```

#### Cambiar rol:
```bash
curl -X POST http://localhost:1337/api/admin/change-role \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","newRole":"moderador"}'
```

#### Ver usuario específico:
```bash
curl http://localhost:1337/api/admin/user/usuario@example.com
```

## Proceso de Registro

Cuando un usuario se registra:

1. Se crea en la tabla de autenticación de Strapi (`users-permissions`)
2. Se crea automáticamente en la tabla personalizada `usuarios` con rol `usuario`
3. El usuario puede iniciar sesión inmediatamente

## Verificación de Moderación en Frontend

El sistema verifica automáticamente si un usuario es moderador:

```javascript
// En el frontend, puedes verificar si el usuario es moderador
const checkModerator = await fetch('/api/foros/check-moderator');
const { isModerator } = await checkModerator.json();
```

## Permisos por Rol

### Usuario Estándar
- ✅ Votar en tokens
- ✅ Comentar en foros
- ✅ Ver contenido público
- ❌ Crear foros
- ❌ Moderar contenido

### Moderador
- ✅ Todo lo del usuario estándar
- ✅ Crear foros
- ✅ Moderar comentarios
- ✅ Gestionar contenido de foros
- ❌ Gestionar usuarios

### Administrador
- ✅ Todo lo del moderador
- ✅ Gestionar usuarios
- ✅ Cambiar roles
- ✅ Acceso completo al sistema

## Requisitos

- Docker corriendo con los servicios de FlorkaFun
- `jq` instalado para el script bash (`brew install jq`)
- Servidor backend corriendo en `http://localhost:1337`

## Troubleshooting

### Error: "jq no está instalado"
```bash
brew install jq
```

### Error: "Usuario no encontrado"
Verifica que el usuario se haya registrado correctamente:
```bash
./user-admin.sh list
```

### Error de conexión
Verifica que el servidor esté corriendo:
```bash
curl http://localhost:1337/api/admin/users
```

## Seguridad

⚠️ **Importante**: Los endpoints de administración actualmente no requieren autenticación para facilitar el desarrollo. En producción, deberías:

1. Agregar autenticación a los endpoints de admin
2. Verificar que solo administradores puedan cambiar roles
3. Implementar logs de auditoría para cambios de roles

## Ejemplos de Uso Completo

```bash
# 1. Ver usuarios actuales
./user-admin.sh list

# 2. Convertir usuario en moderador
./user-admin.sh make-moderator moderador@test.com

# 3. Verificar el cambio
./user-admin.sh show moderador@test.com

# 4. Crear un administrador
./user-admin.sh make-admin admin@test.com

# 5. Ver todos los usuarios con sus nuevos roles
./user-admin.sh list
```