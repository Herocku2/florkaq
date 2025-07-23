# Implementation Plan

- [x] 1. Configuración del entorno Docker con Strapi
  - Crear archivo docker-compose.yml para Strapi y SQLite
  - Configurar volúmenes para persistencia de datos
  - Exponer Strapi en el puerto 1337
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Configuración inicial de Strapi
  - [x] 2.1 Instalar y configurar Strapi con SQLite
    - Crear proyecto Strapi dentro del contenedor Docker
    - Configurar base de datos SQLite
    - Habilitar API REST y GraphQL
    - _Requirements: 1.1, 1.5, 14.1_

  - [x] 2.2 Configurar roles y permisos básicos
    - Crear roles de usuario estándar, moderador y administrador
    - Establecer permisos iniciales para cada rol
    - Configurar autenticación JWT
    - _Requirements: 7.1, 7.2, 7.4, 7.6_
    
  - [x] 2.3 Crear scripts CLI para:
    - Inicializar el proyecto en entornos nuevos (instalación + primeros datos)
    - Crear seeds básicos (usuarios admin, ejemplos de tokens, foros de prueba)
    - Generar fixtures de desarrollo para probar lógica de votaciones, swaps, etc.
    - _Requirements: 8.4, 9.2_

- [x] 3. Implementación de modelos de datos
  - [x] 3.1 Crear colección de Tokens
    - Definir campos: nombre, descripcion, mintAddress, imagen, fechaLanzamiento, estado, red
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 13.1, 13.2_

  - [x] 3.2 Crear colección de Usuarios
    - Definir campos: nombre, email, walletSolana, rol
    - Implementar validaciones para cada campo
    - Configurar autenticación y autorización
    - Crear pruebas unitarias para el modelo
    - _Requirements: 7.1, 7.2, 7.3, 13.1_

  - [x] 3.3 Crear colección de Votaciones
    - Definir campos: fechaInicio, fechaFin
    - Establecer relación con Tokens (candidatos y ganador)
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 2.1, 2.2, 13.1, 13.2_

  - [x] 3.4 Crear colección de Foros
    - Definir campos: título, tokenRelacionado, creador, respuestas, moderado
    - Establecer relaciones con Tokens y Usuarios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 5.1, 5.2, 13.1, 13.2_

  - [x] 3.5 Crear colección de Comentarios
    - Definir campos: texto, usuario, tokenRelacionado, foroRelacionado, aprobado
    - Establecer relaciones con Usuarios, Tokens y Foros
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 5.2, 5.3, 13.1, 13.2_

  - [x] 3.6 Crear colección de Paquetes
    - Definir campos: nombre, precio, características, nivel, beneficios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 9.1, 9.6, 13.1_

  - [x] 3.7 Crear colección de SolicitudesToken
    - Definir campos: usuario, paquete, estado, datosToken, fechaPago, aprobado
    - Establecer relaciones con Usuarios y Paquetes
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 9.3, 9.4, 13.1, 13.2_

  - [x] 3.8 Crear colección de Swaps
    - Definir campos: tokenOrigen, tokenDestino, usuario, tasaCambio, estado, txHashSolana
    - Establecer relaciones con Tokens y Usuarios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 10.1, 10.2, 10.4, 13.1, 13.2_

  - [x] 3.9 Crear colección de Votos
    - Definir campos: usuario, votacion, candidatoVotado, fechaVoto
    - Establecer relaciones con Usuarios, Votaciones y Tokens
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 2.2, 2.5, 13.1, 13.2_

  - [x] 3.10 Crear colección de Actividad
    - Registrar acciones importantes de usuarios y admins
    - Asociar logs con entidades (token, swap, solicitud, etc.)
    - Añadir filtros por fecha, tipo de evento, usuario
    - _Requirements: 18.4, 18.5_

- [x] 4. Implementación de APIs
  - [x] 4.1 Configurar endpoints REST para Tokens
    - Implementar CRUD para tokens
    - Añadir filtros por estado y fecha
    - Implementar paginación y ordenación
    - Crear pruebas de integración para los endpoints
    - _Requirements: 14.1, 14.3, 14.5_

  - [x] 4.2 Configurar endpoints REST para Votaciones
    - Implementar CRUD para votaciones
    - Añadir endpoint para emitir votos
    - Implementar validación de votos duplicados
    - Crear pruebas de integración para los endpoints
    - _Requirements: 2.2, 2.5, 14.1, 14.3_

  - [x] 4.3 Configurar endpoints REST para Foros y Comentarios
    - Implementar CRUD para foros
    - Implementar CRUD para comentarios
    - Añadir validación de permisos según rol
    - Crear pruebas de integración para los endpoints
    - _Requirements: 5.1, 5.2, 5.3, 14.1, 14.3_

  - [x] 4.4 Configurar endpoints REST para Usuarios
    - Implementar endpoints para registro e inicio de sesión
    - Implementar endpoint para actualizar perfil
    - Añadir endpoint para conectar wallet Solana
    - Crear pruebas de integración para los endpoints
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 14.1_

  - [x] 4.5 Configurar endpoints REST para Paquetes y Solicitudes
    - Implementar endpoints para listar paquetes
    - Implementar endpoints para crear y consultar solicitudes
    - Añadir validación de permisos
    - Crear pruebas de integración para los endpoints
    - _Requirements: 9.1, 9.2, 9.3, 14.1, 14.3_

  - [x] 4.6 Configurar endpoints REST para Swaps
    - Implementar endpoints para operaciones de swap
    - Añadir validación de datos y permisos
    - Crear pruebas de integración para los endpoints
    - _Requirements: 10.1, 10.2, 10.3, 14.1, 14.3_

  - [x] 4.7 Configurar GraphQL API
    - Definir tipos y resolvers para todas las entidades
    - Implementar queries y mutations principales
    - Añadir validación de permisos
    - Crear pruebas de integración para la API GraphQL
    - _Requirements: 14.1, 14.3, 14.6_

  - [x] 4.8 Verificar integridad entre módulos independientes
    - Cada página debe consumir APIs aisladas que no modifiquen el comportamiento de otras secciones sin autorización
    - Validar que actualizaciones en "Next" no afecten "Home" sin flujo de aprobación
    - _Requirements: 16.9_

- [x] 5. Implementación de automatizaciones (CRON jobs)
  - [x] 5.1 Implementar CRON job para finalización de votaciones
    - Crear servicio para verificar votaciones finalizadas
    - Implementar lógica para determinar ganador
    - Crear token en estado "próximo" con fecha de lanzamiento
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 2.3, 2.4, 12.1, 12.5_

  - [x] 5.2 Implementar CRON job para lanzamiento de tokens
    - Crear servicio para verificar tokens programados para lanzamiento
    - Implementar lógica para cambiar estado a "lanzado"
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 3.2, 12.2, 12.5_

  - [x] 5.3 Implementar sistema de notificaciones
    - Crear servicio para enviar notificaciones
    - Implementar notificaciones para aprobación de solicitudes
    - Implementar notificaciones para lanzamiento de tokens
    - Implementar notificaciones para operaciones de swap
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 12.4, 12.5_

- [ ] 6. **SEPARACIÓN COMPLETA DE PÁGINAS PÚBLICAS Y ÁREAS ADMINISTRATIVAS**
  **FLUJO DEL NEGOCIO: VOTACIONES → NEXT → HOME → DETALLES**
  
  - [x] 6.1 Implementar servicios de API base en el frontend
    - Crear servicios para consumir APIs REST/GraphQL
    - Implementar manejo de errores y reintentos
    - Crear interceptores para autenticación
    - _Requirements: 14.1, 14.3, 14.5_

  - [ ] 6.2 **SISTEMA VOTE (Candidatos de Votación) - INICIO DEL FLUJO**
    - [ ] 6.2.1 Backend - API específica para CANDIDATOS DE VOTACIÓN
      - Crear controlador específico `vote-candidates.js` para candidatos potenciales
      - Implementar endpoints exclusivos: `/api/vote/candidates`, `/api/vote/submit`, `/api/vote/results`
      - Crear servicio `voteCandidateService.js` con lógica específica de competencia
      - Implementar sistema de votación con validaciones anti-duplicados por usuario
      - Sistema automático para determinar ganadores al finalizar votación
      - _Requirements: 16.3, 14.1, 14.3_
    
    - [ ] 6.2.2 Frontend - Página VOTE independiente
      - Conectar componente TarjetaVotos con API específica de CANDIDATOS
      - Implementar lógica para emitir votos con autenticación obligatoria
      - Crear servicio frontend `voteService.js` completamente independiente
      - Crear páginas de destino `/token/{nombre}/candidate` para cada candidato
      - Mostrar información detallada del candidato aunque no esté en mainnet
      - Añadir cálculo de porcentajes en tiempo real durante votación
      - _Requirements: 16.3, 15.1, 15.2_
    
    - [ ] 6.2.3 Área Administrativa VOTE - "Voting System"
      - Crear panel admin `/admin/vote-management` completamente separado
      - Formulario de creación de candidatos para competir:
        - Nombre del Token y Símbolo del Token
        - Descripción del candidato para la votación
        - Orden de visualización en la página pública
        - Imagen del proyecto (upload JPG, PNG, WebP, GIF - máx 5MB)
      - Tabla de gestión de candidatos existentes:
        - Columnas: Token, Símbolo, Votos Totales, Estado (Activo/Inactivo), Acciones
        - Botones: Eliminar, Editar, Visualizar por cada candidato
      - Sistema de control de votaciones activas con fechas
      - Botón "Crear Nuevo Candidato" prominente
      - _Requirements: 16.3, 18.1_

  - [ ] 6.3 **SISTEMA NEXT (Próximos Lanzamientos) - GANADORES DE VOTACIÓN**
    - [ ] 6.3.1 Backend - API específica para PRÓXIMOS LANZAMIENTOS
      - Crear controlador específico `next-projects.js` para tokens ganadores
      - Implementar endpoints exclusivos: `/api/next/projects`, `/api/next/countdown`
      - Crear servicio `nextProjectService.js` con lógica de programación de lanzamientos
      - Sistema automático que mueve ganadores de VOTE a NEXT con fecha programada
      - Implementar countdown timer para cada token próximo a lanzar
      - _Requirements: 16.2, 14.1, 14.3_
    
    - [ ] 6.3.2 Frontend - Página NEXT independiente
      - Conectar componentes con API específica de PRÓXIMOS LANZAMIENTOS
      - Mostrar 3 cards por línea estilo NFT con countdown timer
      - Implementar ordenación por fecha de lanzamiento más cercana
      - Crear servicio frontend `nextService.js` completamente independiente
      - Crear páginas de destino `/token/{nombre}/next` para tokens próximos
      - Mostrar información detallada con countdown y botón "Recordarme"
      - Añadir funcionalidad "Recordarme" con notificaciones
      - _Requirements: 16.2, 15.1, 15.2_
    
    - [ ] 6.3.3 Área Administrativa NEXT - "Next Projects"
      - Crear panel admin `/admin/next-projects` completamente separado
      - Formulario completo de gestión de proyectos NEXT:
        - Información básica (nombre, símbolo, precio estimado, market cap)
        - Descripción corta y enlaces sociales (Web, Telegram, Twitter, Discord)
        - Imagen del proyecto (upload/URL manual)
        - Configuración (estado, orden Top 3, progreso %, market cap estimado)
        - Fecha y hora programada de lanzamiento
      - Tabla de gestión con vista previa de cards como aparecerán públicamente
      - Control de estado: Pendiente, Publicado, Top 3, Lanzado
      - Botones: Eliminar, Editar, Visualizar, Programar Lanzamiento
      - _Requirements: 16.2, 18.1_

  - [ ] 6.4 **SISTEMA HOME (Tokens Lanzados en Mainnet) - FINAL DEL FLUJO**
    - [ ] 6.4.1 Backend - API específica para TOKENS LANZADOS
      - Crear controlador específico `home-tokens.js` para tokens YA EN MAINNET
      - Implementar endpoints exclusivos: `/api/home/tokens`, `/api/home/rankings`
      - Crear servicio `homeTokenService.js` con integración a Birdeye API
      - Sistema automático que mueve tokens de NEXT a HOME cuando se lanzan
      - Integración con API de Birdeye para datos reales (precio, holders, supply, marketcap)
      - Implementar cache independiente para datos de blockchain
      - _Requirements: 16.1, 14.1, 14.3_
    
    - [ ] 6.4.2 Frontend - Página HOME independiente
      - Conectar componente TarjetaProyectos con API específica de TOKENS LANZADOS
      - Mostrar 3 cards por línea con datos reales de blockchain
      - Implementar filtros y paginación exclusivos para tokens lanzados
      - Crear servicio frontend `homeService.js` completamente independiente
      - Crear páginas de destino `/token/{nombre}` para tokens lanzados
      - Mostrar datos reales: precio actual, holders, supply, marketcap, progreso de venta
      - Enlaces directos a foros correspondientes de cada token
      - _Requirements: 16.1, 15.1, 15.2_
    
    - [ ] 6.4.3 Área Administrativa HOME - "Home Projects"
      - Crear panel admin `/admin/home-projects` completamente separado
      - Formulario de creación manual de tokens para HOME (casos especiales):
        - Información completa del token lanzado
        - Mint address de Solana
        - Enlaces a datos de blockchain
      - Tabla de gestión de tokens lanzados:
        - Columnas: Token, Símbolo, Precio Actual, Market Cap, Holders, Estado, Acciones
        - Botones: Eliminar, Editar, Visualizar, Destacar
      - Sistema de aprobación para publicar tokens lanzados manualmente
      - Control de Top 3 rankings independiente con datos reales
      - Botón "Crear Nuevo Proyecto" para casos especiales
      - _Requirements: 16.1, 18.1_

  - [ ] 6.5 **SISTEMA DE PÁGINAS DE DESTINO DE TOKENS**
    - [ ] 6.5.1 Backend - API para detalles de tokens
      - Crear controlador `token-details.js` para páginas individuales
      - Implementar endpoints: `/api/token/{nombre}/details`, `/api/token/{nombre}/stats`
      - Diferentes endpoints según estado: candidate, next, launched
      - Integración con Birdeye API para tokens lanzados
      - _Requirements: 16.8, 14.1_
    
    - [ ] 6.5.2 Frontend - Páginas de destino dinámicas
      - Crear componente `TokenDetail` para `/token/{nombre}`
      - Crear componente `CandidateDetail` para `/token/{nombre}/candidate`
      - Crear componente `NextTokenDetail` para `/token/{nombre}/next`
      - Mostrar información específica según el estado del token
      - Para tokens lanzados: datos reales de blockchain, gráficos, enlaces a DEX
      - Para candidatos: información de votación, descripción, enlaces sociales
      - Para próximos: countdown, información de lanzamiento, botón recordarme
      - _Requirements: 16.8, 15.1_

  - [ ] 6.6 **SISTEMA NEWS (Gestión de Noticias) - Proyecto Independiente**
    - [ ] 6.5.1 Backend - API específica para NEWS
      - Crear controlador específico `news-management.js` para noticias
      - Implementar endpoints exclusivos: `/api/news/articles`, `/api/news/publish`
      - Crear servicio `newsService.js` con lógica específica
      - Implementar sistema de publicación y programación de noticias
      - _Requirements: 16.4, 14.1, 14.3_
    
    - [ ] 6.5.2 Frontend - Página NEWS independiente
      - Crear componentes para mostrar noticias
      - Implementar filtros por categoría y fecha
      - Crear servicio frontend `newsService.js` independiente
      - Crear páginas de destino `/news/{slug}` para artículos
      - _Requirements: 16.4, 15.1, 15.2_
    
    - [ ] 6.5.3 Área Administrativa NEWS
      - Crear panel admin `/admin/news-management` (News Management)
      - Formulario de creación y edición de noticias
      - Sistema de gestión de artículos (crear, editar, publicar, archivar)
      - Control de estado: Borrador, Publicado, Programado, Archivado
      - _Requirements: 16.4, 18.1_

  - [ ] 6.6 **SISTEMA PUBLISH (Solicitudes de Publicación) - Proyecto Independiente**
    - [ ] 6.6.1 Backend - API específica para PUBLISH
      - Crear controlador específico `publication-requests.js` para solicitudes
      - Implementar endpoints exclusivos: `/api/publish/requests`, `/api/publish/review`
      - Crear servicio `publishService.js` con lógica específica
      - Implementar sistema de revisión y aprobación de solicitudes
      - _Requirements: 16.5, 14.1, 14.3_
    
    - [ ] 6.6.2 Frontend - Página PUBLISH independiente
      - Crear formularios para solicitudes de publicación
      - Implementar sistema de seguimiento de solicitudes
      - Crear servicio frontend `publishService.js` independiente
      - Sistema de notificaciones de estado de solicitudes
      - _Requirements: 16.5, 15.1, 15.2_
    
    - [ ] 6.6.3 Área Administrativa PUBLISH
      - Crear panel admin `/admin/publication-requests` (Publication Requests)
      - Sistema de revisión de solicitudes de publicación
      - Formularios de aprobación/rechazo con comentarios
      - Control de flujo: Pendiente, En Revisión, Aprobado, Rechazado
      - _Requirements: 16.5, 18.1_

  - [ ] 6.7 **SISTEMA CREATE (Creación de Tokens) - Proyecto Independiente**
    - [ ] 6.7.1 Backend - API específica para CREATE
      - Crear controlador específico `token-creation.js` para creación
      - Implementar endpoints exclusivos: `/api/create/packages`, `/api/create/submit`
      - Crear servicio `tokenCreationService.js` con lógica específica
      - Implementar sistema de paquetes y procesamiento de pagos
      - _Requirements: 16.6, 14.1, 14.3_
    
    - [ ] 6.7.2 Frontend - Página CREATE independiente
      - Conectar formularios con API de paquetes y solicitudes
      - Implementar lógica para enviar solicitudes
      - Crear servicio frontend `createService.js` independiente
      - Añadir simulación de pago y seguimiento de solicitudes
      - _Requirements: 16.6, 15.1, 15.2_
    
    - [ ] 6.7.3 Área Administrativa CREATE
      - Crear panel admin `/admin/token-creation` (Token Creation)
      - Gestión de paquetes de creación de tokens
      - Sistema de revisión de solicitudes de creación
      - Control de pagos y procesamiento de tokens
      - _Requirements: 16.6, 18.1_

  - [ ] 6.8 **SISTEMA FORUM (Foros Comunitarios) - Proyecto Independiente**
    - [ ] 6.8.1 Backend - API específica para FORUM
      - Crear controlador específico `community-forum.js` para foros
      - Implementar endpoints exclusivos: `/api/forum/topics`, `/api/forum/moderate`
      - Crear servicio `forumService.js` con lógica específica
      - Implementar sistema de moderación y gestión de usuarios
      - _Requirements: 16.7, 14.1, 14.3_
    
    - [ ] 6.8.2 Frontend - Página FORUM independiente
      - Implementar componentes para listar y crear foros
      - Conectar con API de foros y comentarios
      - Crear servicio frontend `forumService.js` independiente
      - Añadir funcionalidades de moderación para moderadores
      - _Requirements: 16.7, 15.1, 15.2_
    
    - [ ] 6.8.3 Área Administrativa FORUM
      - Crear panel admin `/admin/community-forum` (Community Forum)
      - Sistema de moderación de posts y usuarios
      - Gestión de temas y categorías de foros
      - Control de usuarios: aprobar, bloquear, asignar roles
      - _Requirements: 16.7, 18.1_

  - [x] 6.9 Implementar autenticación en el frontend
    - Crear componentes de registro e inicio de sesión
    - Implementar gestión de tokens JWT
    - Añadir protección de rutas según rol
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 7. Integración con Blockchain de Solana
  - [x] 7.1 Implementar conexión básica con Solana
    - Configurar cliente de Solana
    - Implementar funciones para consultar datos de la blockchain
    - Crear pruebas unitarias para la conexión
    - _Requirements: 6.1, 6.5, 17.2, 17.3_

  - [ ] 7.2 Implementar creación de tokens en Solana
    - Crear servicio para generar metadatos de token
    - Implementar lógica para crear token en la blockchain
    - Añadir manejo de errores y reintentos
    - Crear pruebas unitarias para el servicio
    - _Requirements: 6.2, 6.3, 6.4, 11.1, 11.2, 11.3_

  - [ ] 7.3 Implementar operaciones de swap en Solana
    - Crear servicio para operaciones de swap
    - Implementar lógica para ejecutar transacciones
    - Añadir verificación y seguimiento de transacciones
    - Crear pruebas unitarias para el servicio
    - _Requirements: 10.3, 10.4, 10.5_

  - [ ] 7.4 Implementar verificación de wallets
    - Crear servicio para verificar propiedad de wallet
    - Implementar firma de mensajes para autenticación
    - Añadir asociación de wallet a cuenta de usuario
    - Crear pruebas unitarias para el servicio
    - _Requirements: 7.5, 17.1_

  - [ ] 7.5 Integrar wallet Phantom en el frontend
    - Añadir botón de conexión de wallet
    - Implementar lógica para firmar mensajes
    - Crear componente para mostrar balance y transacciones
    - _Requirements: 17.1, 17.4_

- [ ] 8. Seguridad y optimización
  - [ ] 8.1 Implementar autenticación y autorización avanzada
    - Configurar JWT con refresh tokens
    - Implementar verificación de roles para cada endpoint
    - Añadir protección contra ataques comunes
    - Crear pruebas de seguridad
    - _Requirements: 7.2, 7.4, 7.6_

  - [ ] 8.2 Implementar validación y sanitización de datos
    - Añadir validación de inputs en todos los endpoints
    - Implementar sanitización para prevenir inyecciones
    - Crear pruebas de seguridad
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ] 8.3 Implementar logging y monitoreo
    - Configurar sistema de logs
    - Implementar registro de errores y actividades críticas
    - Añadir alertas para problemas importantes
    - Integrar herramienta de analítica (como Plausible, PostHog o Segment)
    - Rastrear métricas clave: visitas, votos, swaps, solicitudes de tokens
    - Incluir dashboards para admin con KPIs diarios/semanales
    - _Requirements: 12.5, 8.3, 9.2_

  - [ ] 8.4 Optimizar rendimiento
    - Implementar caché para consultas frecuentes
    - Optimizar consultas a la base de datos
    - Añadir índices para mejorar rendimiento
    - Realizar pruebas de carga
    - _Requirements: 8.2_

- [ ] 9. Documentación y despliegue final
  - [ ] 9.1 Crear documentación de API
    - Documentar todos los endpoints REST
    - Documentar schema GraphQL
    - Añadir ejemplos de uso
    - _Requirements: 14.6_

  - [ ] 9.2 Crear documentación para desarrolladores
    - Documentar estructura del proyecto
    - Añadir guías de desarrollo
    - Documentar flujos principales
    - _Requirements: 8.3, 8.4_

  - [ ] 9.3 Configurar entorno de producción
    - Optimizar docker-compose para producción
    - Configurar backups automáticos
    - Implementar CI/CD para despliegue
    - _Requirements: 8.1, 8.4_

  - [ ] 9.4 Realizar pruebas finales
    - Ejecutar pruebas end-to-end
    - Realizar pruebas de seguridad
    - Verificar todos los flujos críticos
    - _Requirements: 8.3_

- [ ] 10. Normas para IAs (como Kiro AI)
  - [ ] 10.1 Proteger la integridad del diseño
    - No modificar ningún componente de interfaz de usuario sin autorización explícita
    - Mantener independencia funcional entre secciones: Home, Next, Votaciones, Foros, etc.
    - Cualquier cambio visual o de flujo debe ser aprobado por el Product Owner
    - Conservar la fidelidad con el diseño exportado desde Anima App o Figma
    - _Requirements: 19.1_

- [ ] 11. Integración de Asistentes de IA
  - [ ] 11.1 Integrar módulo de ayuda contextual en CMS
    - IA que explique flujos como "Cómo aprobar un token" o "Cómo crear votación"
    - Entrenar IA con documentación generada (sección 9.2)
    - _Requirements: 19.3_