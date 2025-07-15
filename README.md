# FlorkaFun - Plataforma de Lanzamiento de Tokens Meme en Solana

FlorkaFun es una plataforma Web3 para el lanzamiento de tokens meme en la red Solana, que combina funcionalidades de votación, gestión de contenido, foros de discusión, y operaciones de swap.

## Características Principales

- **Sistema de Votación**: Los usuarios pueden votar por futuros tokens meme que serán lanzados en la blockchain de Solana.
- **Próximos Lanzamientos**: Visualización de tokens ganadores de votaciones con sus fechas programadas de lanzamiento.
- **Tokens Activos**: Acceso a información detallada sobre tokens ya lanzados en la blockchain.
- **Foros de Discusión**: Sistema de foros moderados para discutir sobre tokens actuales y futuros.
- **Creación de Tokens**: Diferentes paquetes para la creación de tokens meme en Solana.
- **Operaciones de Swap**: Interfaz para intercambiar tokens directamente en la plataforma.
- **Roles de Usuario**: Sistema con tres niveles de permisos (usuario estándar, moderador, administrador).

## Arquitectura

El sistema se compone de dos partes principales:
1. **Frontend**: Una aplicación React que proporciona la interfaz de usuario para todas las funcionalidades.
2. **Backend**: Un sistema CMS basado en Strapi desplegado en Docker que gestiona todos los datos, lógica de negocio, y expone APIs para el frontend.

## Estructura del Proyecto

- `/.kiro/specs/`: Documentación de especificaciones del proyecto
  - `requirements.md`: Requisitos detallados del sistema
  - `design.md`: Diseño de la arquitectura y componentes
  - `tasks.md`: Plan de implementación con tareas específicas

## Tecnologías Utilizadas

- **Frontend**: React, React Router
- **Backend**: Strapi CMS, SQLite
- **Contenedores**: Docker
- **Blockchain**: Solana
- **APIs**: REST, GraphQL

## Instalación y Configuración

### Requisitos Previos

- Docker y Docker Compose
- Node.js (versión 16 o superior)
- Git

### Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/Herocku2/kiroflorka.git
cd kiroflorka

# Iniciar contenedores Docker
docker-compose up -d
```

## Desarrollo

El proyecto sigue un enfoque modular donde cada sección (Home, Next, Votaciones, Foros, etc.) funciona de manera independiente pero integrada dentro del ecosistema completo.

### Principios de Desarrollo

1. No modificar ningún diseño de frontend sin consentimiento explícito del dueño del proyecto.
2. Tratar cada página como sistemas independientes.
3. Mantener las colecciones de contenido en el CMS como fuentes únicas de verdad.
4. No agregar, eliminar o renombrar campos, endpoints o lógicas de negocio sin validación humana.
5. Solicitar aprobación antes de ejecutar operaciones sensibles.

## Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.