# FlorkaFun CMS - Plataforma Web3 de Lanzamiento de Tokens Meme

## Introducción

FlorkaFun es una plataforma de lanzamiento de tokens meme en la red Solana, que permite votaciones, creación y seguimiento de tokens, foros moderados, y operaciones de swap, gestionados por un CMS basado en Strapi.

## Colecciones del CMS

### Tokens
- nombre
- descripcion
- mintAddress
- imagen
- fechaLanzamiento
- estado (lanzado / próximo / inactivo)
- red

### Votaciones
- fechaInicio
- fechaFin
- candidatos (relación con Tokens)
- tokenGanador (relación con Tokens)

### Comentarios
- texto
- usuario (relación)
- tokenRelacionado (relación)
- aprobado

### Foros
- título
- tokenRelacionado
- creador
- respuestas (relación)
- moderado

### Usuarios
- nombre
- email
- walletSolana
- rol (usuario, moderador, admin)

### Paquetes
- nombre
- precio
- características
- nivel
- beneficios

### SolicitudesToken
- usuario
- paquete
- estado
- datos del token
- fechaPago
- aprobado

### Swaps
- tokenOrigen
- tokenDestino
- usuario
- tasaCambio
- estado
- txHashSolana

## Roles de Usuario

- **Usuario Estándar**: votar, comentar, pagar paquetes, reaccionar
- **Moderador**: crear foros, moderar contenido, bloquear usuarios
- **Administrador**: control total

## Automatizaciones

- Mover ganador de votaciones a “Next”
- Mover token de “Next” a “Lanzado” en fecha programada
- Validar y crear token en Solana
- Notificar usuarios sobre eventos importantes

## Despliegue

```bash
docker compose up
```

Acceder en: http://localhost:1337/admin
