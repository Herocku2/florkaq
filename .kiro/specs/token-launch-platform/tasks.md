# Implementation Plan

- [ ] 1. Configuración del entorno Docker con Strapi
  - Crear archivo docker-compose.yml para Strapi y SQLite
  - Configurar volúmenes para persistencia de datos
  - Exponer Strapi en el puerto 1337
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 2. Configuración inicial de Strapi
  - [ ] 2.1 Instalar y configurar Strapi con SQLite
    - Crear proyecto Strapi dentro del contenedor Docker
    - Configurar base de datos SQLite
    - Habilitar API REST y GraphQL
    - _Requirements: 1.1, 1.5, 14.1_

  - [ ] 2.2 Configurar roles y permisos básicos
    - Crear roles de usuario estándar, moderador y administrador
    - Establecer permisos iniciales para cada rol
    - Configurar autenticación JWT
    - _Requirements: 7.1, 7.2, 7.4, 7.6_
    
  - [ ] 2.3 Crear scripts CLI para:
    - Inicializar el proyecto en entornos nuevos (instalación + primeros datos)
    - Crear seeds básicos (usuarios admin, ejemplos de tokens, foros de prueba)
    - Generar fixtures de desarrollo para probar lógica de votaciones, swaps, etc.
    - _Requirements: 8.4, 9.2_

- [ ] 3. Implementación de modelos de datos
  - [ ] 3.1 Crear colección de Tokens
    - Definir campos: nombre, descripcion, mintAddress, imagen, fechaLanzamiento, estado, red
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 13.1, 13.2_

  - [ ] 3.2 Crear colección de Usuarios
    - Definir campos: nombre, email, walletSolana, rol
    - Implementar validaciones para cada campo
    - Configurar autenticación y autorización
    - Crear pruebas unitarias para el modelo
    - _Requirements: 7.1, 7.2, 7.3, 13.1_

  - [ ] 3.3 Crear colección de Votaciones
    - Definir campos: fechaInicio, fechaFin
    - Establecer relación con Tokens (candidatos y ganador)
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 2.1, 2.2, 13.1, 13.2_

  - [ ] 3.4 Crear colección de Foros
    - Definir campos: título, tokenRelacionado, creador, respuestas, moderado
    - Establecer relaciones con Tokens y Usuarios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 5.1, 5.2, 13.1, 13.2_

  - [ ] 3.5 Crear colección de Comentarios
    - Definir campos: texto, usuario, tokenRelacionado, foroRelacionado, aprobado
    - Establecer relaciones con Usuarios, Tokens y Foros
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 5.2, 5.3, 13.1, 13.2_

  - [ ] 3.6 Crear colección de Paquetes
    - Definir campos: nombre, precio, características, nivel, beneficios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 9.1, 9.6, 13.1_

  - [ ] 3.7 Crear colección de SolicitudesToken
    - Definir campos: usuario, paquete, estado, datosToken, fechaPago, aprobado
    - Establecer relaciones con Usuarios y Paquetes
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 9.3, 9.4, 13.1, 13.2_

  - [ ] 3.8 Crear colección de Swaps
    - Definir campos: tokenOrigen, tokenDestino, usuario, tasaCambio, estado, txHashSolana
    - Establecer relaciones con Tokens y Usuarios
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 10.1, 10.2, 10.4, 13.1, 13.2_

  - [ ] 3.9 Crear colección de Votos
    - Definir campos: usuario, votacion, candidatoVotado, fechaVoto
    - Establecer relaciones con Usuarios, Votaciones y Tokens
    - Implementar validaciones para cada campo
    - Crear pruebas unitarias para el modelo
    - _Requirements: 2.2, 2.5, 13.1, 13.2_

  - [ ] 3.10 Crear colección de Actividad
    - Registrar acciones importantes de usuarios y admins
    - Asociar logs con entidades (token, swap, solicitud, etc.)
    - Añadir filtros por fecha, tipo de evento, usuario
    - _Requirements: 18.4, 18.5_

- [ ] 4. Implementación de APIs
  - [ ] 4.1 Configurar endpoints REST para Tokens
    - Implementar CRUD para tokens
    - Añadir filtros por estado y fecha
    - Implementar paginación y ordenación
    - Crear pruebas de integración para los endpoints
    - _Requirements: 14.1, 14.3, 14.5_

  - [ ] 4.2 Configurar endpoints REST para Votaciones
    - Implementar CRUD para votaciones
    - Añadir endpoint para emitir votos
    - Implementar validación de votos duplicados
    - Crear pruebas de integración para los endpoints
    - _Requirements: 2.2, 2.5, 14.1, 14.3_

  - [ ] 4.3 Configurar endpoints REST para Foros y Comentarios
    - Implementar CRUD para foros
    - Implementar CRUD para comentarios
    - Añadir validación de permisos según rol
    - Crear pruebas de integración para los endpoints
    - _Requirements: 5.1, 5.2, 5.3, 14.1, 14.3_

  - [ ] 4.4 Configurar endpoints REST para Usuarios
    - Implementar endpoints para registro e inicio de sesión
    - Implementar endpoint para actualizar perfil
    - Añadir endpoint para conectar wallet Solana
    - Crear pruebas de integración para los endpoints
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 14.1_

  - [ ] 4.5 Configurar endpoints REST para Paquetes y Solicitudes
    - Implementar endpoints para listar paquetes
    - Implementar endpoints para crear y consultar solicitudes
    - Añadir validación de permisos
    - Crear pruebas de integración para los endpoints
    - _Requirements: 9.1, 9.2, 9.3, 14.1, 14.3_

  - [ ] 4.6 Configurar endpoints REST para Swaps
    - Implementar endpoints para operaciones de swap
    - Añadir validación de datos y permisos
    - Crear pruebas de integración para los endpoints
    - _Requirements: 10.1, 10.2, 10.3, 14.1, 14.3_

  - [ ] 4.7 Configurar GraphQL API
    - Definir tipos y resolvers para todas las entidades
    - Implementar queries y mutations principales
    - Añadir validación de permisos
    - Crear pruebas de integración para la API GraphQL
    - _Requirements: 14.1, 14.3, 14.6_

  - [ ] 4.8 Verificar integridad entre módulos independientes
    - Cada página debe consumir APIs aisladas que no modifiquen el comportamiento de otras secciones sin autorización
    - Validar que actualizaciones en "Next" no afecten "Home" sin flujo de aprobación
    - _Requirements: 16.9_

- [ ] 5. Implementación de automatizaciones (CRON jobs)
  - [ ] 5.1 Implementar CRON job para finalización de votaciones
    - Crear servicio para verificar votaciones finalizadas
    - Implementar lógica para determinar ganador
    - Crear token en estado "próximo" con fecha de lanzamiento
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 2.3, 2.4, 12.1, 12.5_

  - [ ] 5.2 Implementar CRON job para lanzamiento de tokens
    - Crear servicio para verificar tokens programados para lanzamiento
    - Implementar lógica para cambiar estado a "lanzado"
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 3.2, 12.2, 12.5_

  - [ ] 5.3 Implementar sistema de notificaciones
    - Crear servicio para enviar notificaciones
    - Implementar notificaciones para aprobación de solicitudes
    - Implementar notificaciones para lanzamiento de tokens
    - Implementar notificaciones para operaciones de swap
    - Crear pruebas unitarias para el servicio
    - Validar comportamiento del CRON job en entorno dev y producción (modo dry-run vs real)
    - _Requirements: 12.4, 12.5_

- [ ] 6. Implementación de funcionalidades específicas por sección
  - [ ] 6.1 Implementar lógica para página Home (Tokens Lanzados)
    - Crear controlador para listar tokens lanzados
    - Implementar filtros y ordenación
    - Añadir enlaces a foros correspondientes
    - Crear pruebas de integración
    - _Requirements: 16.1, 15.1, 15.2_

  - [ ] 6.2 Implementar lógica para página Next (Próximos Lanzamientos)
    - Crear controlador para listar tokens próximos
    - Implementar ordenación por fecha de lanzamiento
    - Añadir funcionalidad "Recordarme"
    - Crear pruebas de integración
    - _Requirements: 16.2, 15.1, 15.2_

  - [ ] 6.3 Implementar lógica para página Votaciones
    - Crear controlador para listar votaciones activas
    - Implementar lógica para emitir votos
    - Añadir cálculo de porcentajes en tiempo real
    - Crear pruebas de integración
    - _Requirements: 16.3, 15.1, 15.2_

  - [ ] 6.4 Implementar lógica para página Foros
    - Crear controlador para listar y crear foros
    - Implementar lógica para comentarios
    - Añadir funcionalidades de moderación
    - Crear pruebas de integración
    - _Requirements: 16.5, 15.1, 15.2_

  - [ ] 6.5 Implementar lógica para página Creación de Token
    - Crear controlador para listar paquetes
    - Implementar lógica para enviar solicitudes
    - Añadir simulación de pago
    - Crear pruebas de integración
    - _Requirements: 16.6, 15.1, 15.2_

  - [ ] 6.6 Implementar lógica para página Swap
    - Crear controlador para operaciones de swap
    - Implementar cálculo de tasas y comisiones
    - Añadir registro de transacciones
    - Crear pruebas de integración
    - _Requirements: 16.7, 15.1, 15.2_

  - [ ] 6.7 Implementar lógica para página Perfil de Usuario
    - Crear controlador para mostrar datos de perfil
    - Implementar historial de actividades
    - Añadir funcionalidad para conectar wallet
    - Crear pruebas de integración
    - _Requirements: 16.8, 15.1, 15.2_

- [ ] 7. Integración con Blockchain de Solana
  - [ ] 7.1 Implementar conexión básica con Solana
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