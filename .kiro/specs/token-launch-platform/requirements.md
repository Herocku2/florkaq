# Requirements Document

## Introduction

FlorkaFun es una plataforma Web3 de lanzamiento de tokens meme en la red Solana, que permite a los usuarios votar por futuros tokens meme, seguir los próximos lanzamientos y acceder a tokens ya lanzados. La plataforma incluye un sistema de votación, gestión de contenido, foros de discusión con roles y permisos, operaciones de swap, y la integración con la blockchain de Solana para el lanzamiento de tokens. Todo esto será gestionado por un CMS basado en Strapi desplegado en Docker.

## Requirements

### Requirement 1: Sistema de Gestión de Contenido (CMS)

**User Story:** Como administrador, quiero un sistema de gestión de contenido para administrar tokens, votaciones y contenido del foro, para mantener la plataforma actualizada sin necesidad de modificar el código.

#### Acceptance Criteria

1. WHEN el administrador accede al panel de administración THEN el sistema SHALL mostrar opciones para gestionar tokens, votaciones y foros.
2. WHEN el administrador crea un nuevo token THEN el sistema SHALL permitir subir metadatos, imágenes y detalles del token.
3. WHEN el administrador configura una nueva votación THEN el sistema SHALL permitir establecer fechas de inicio/fin y candidatos.
4. WHEN el administrador gestiona usuarios THEN el sistema SHALL permitir asignar roles y permisos.
5. WHEN el administrador actualiza contenido THEN el sistema SHALL reflejar los cambios en el frontend sin necesidad de redespliegue.

### Requirement 2: Sistema de Votación

**User Story:** Como usuario, quiero poder votar por mis tokens meme favoritos para que tengan la oportunidad de ser lanzados en la blockchain de Solana.

#### Acceptance Criteria

1. WHEN un usuario visita la página de votaciones THEN el sistema SHALL mostrar los candidatos actuales con sus detalles.
2. WHEN un usuario emite un voto THEN el sistema SHALL registrar el voto y actualizar los porcentajes en tiempo real.
3. WHEN finaliza el período de votación THEN el sistema SHALL determinar automáticamente el ganador basado en el porcentaje de votos.
4. WHEN se determina un ganador THEN el sistema SHALL mover automáticamente el token a la sección de próximos lanzamientos con su fecha programada.
5. WHEN un usuario intenta votar más de una vez THEN el sistema SHALL prevenir votos duplicados.

### Requirement 3: Gestión de Próximos Lanzamientos

**User Story:** Como usuario, quiero ver los próximos tokens que serán lanzados con sus fechas específicas para estar preparado para su lanzamiento.

#### Acceptance Criteria

1. WHEN un usuario visita la página de próximos lanzamientos THEN el sistema SHALL mostrar los tokens ganadores de votaciones con sus fechas de lanzamiento.
2. WHEN llega la fecha de lanzamiento de un token THEN el sistema SHALL mover automáticamente el token a la sección de tokens activos.
3. WHEN un administrador modifica la fecha de lanzamiento THEN el sistema SHALL actualizar esta información en la interfaz de usuario.
4. WHEN un usuario selecciona un próximo lanzamiento THEN el sistema SHALL mostrar detalles adicionales y foros de discusión relacionados.

### Requirement 4: Tokens Activos y Lanzados

**User Story:** Como usuario, quiero acceder a información detallada sobre tokens ya lanzados para poder evaluar su rendimiento y potencial.

#### Acceptance Criteria

1. WHEN un usuario visita la página principal THEN el sistema SHALL mostrar los tokens activos con información básica.
2. WHEN un usuario selecciona un token específico THEN el sistema SHALL mostrar detalles completos incluyendo datos de la blockchain.
3. WHEN un token es lanzado THEN el sistema SHALL integrar automáticamente los datos de la blockchain de Solana.
4. WHEN un administrador actualiza la información de un token THEN el sistema SHALL reflejar estos cambios en la interfaz de usuario.

### Requirement 5: Sistema de Foros y Comentarios

**User Story:** Como usuario, quiero participar en discusiones sobre tokens actuales y futuros para compartir opiniones y obtener información de la comunidad.

#### Acceptance Criteria

1. WHEN un usuario accede al foro de un token THEN el sistema SHALL mostrar los hilos de discusión existentes.
2. WHEN un usuario con permisos crea un nuevo hilo THEN el sistema SHALL publicarlo y hacerlo visible para todos los usuarios.
3. WHEN un usuario responde a un hilo existente THEN el sistema SHALL añadir el comentario y notificar a los participantes relevantes.
4. WHEN un moderador edita o elimina contenido THEN el sistema SHALL aplicar estos cambios y mantener un registro de moderación.
5. WHEN un administrador asigna roles de moderación THEN el sistema SHALL actualizar los permisos del usuario inmediatamente.

### Requirement 6: Integración con Blockchain de Solana

**User Story:** Como administrador, quiero poder crear y lanzar tokens en la blockchain de Solana directamente desde la plataforma para simplificar el proceso de lanzamiento.

#### Acceptance Criteria

1. WHEN un administrador inicia el proceso de creación de token THEN el sistema SHALL proporcionar una interfaz para configurar los parámetros del token.
2. WHEN se completa la configuración del token THEN el sistema SHALL interactuar con la blockchain de Solana para crear el token.
3. WHEN el token es creado exitosamente THEN el sistema SHALL actualizar automáticamente la plataforma con los datos del nuevo token.
4. WHEN ocurre un error en la creación del token THEN el sistema SHALL proporcionar información detallada sobre el error y opciones para resolverlo.
5. WHEN un token es lanzado THEN el sistema SHALL proporcionar enlaces a exploradores de blockchain para verificar la transacción.

### Requirement 7: Autenticación y Gestión de Usuarios con Roles Específicos

**User Story:** Como usuario, quiero poder registrarme, iniciar sesión y gestionar mi perfil para participar en la plataforma con una identidad verificable y permisos basados en mi rol.

#### Acceptance Criteria

1. WHEN un usuario se registra THEN el sistema SHALL crear una cuenta con información básica y rol de usuario estándar por defecto.
2. WHEN un usuario inicia sesión THEN el sistema SHALL verificar sus credenciales y proporcionar acceso según su rol específico.
3. WHEN un usuario actualiza su perfil THEN el sistema SHALL guardar los cambios y actualizar la información visible.
4. WHEN un administrador modifica roles de usuario THEN el sistema SHALL aplicar los nuevos permisos inmediatamente.
5. WHEN un usuario conecta su wallet de Solana THEN el sistema SHALL verificar la propiedad y asociarla a su cuenta.
6. WHEN el sistema asigna roles THEN el sistema SHALL implementar tres niveles de permisos:
   - Usuario Estándar: puede realizar reacciones con emojis, comentarios, votaciones, llenar formularios de solicitud de tokens y pagar paquetes de creación
   - Moderador: puede crear foros, moderar contenido, banear/bloquear usuarios, anular reacciones y administrar usuarios dentro del foro
   - Administrador: tiene control total de la plataforma, puede crear posts, noticias, votaciones, administrar solicitudes de publicación y configurar todas las secciones del proyecto

### Requirement 8: Despliegue y Arquitectura

**User Story:** Como desarrollador, quiero una arquitectura robusta y fácil de desplegar para garantizar el funcionamiento estable de la plataforma.

#### Acceptance Criteria

1. WHEN se despliega la aplicación THEN el sistema SHALL funcionar correctamente en contenedores Docker.
2. WHEN aumenta el tráfico THEN el sistema SHALL escalar horizontalmente para mantener el rendimiento.
3. WHEN se actualiza el backend o CMS THEN el sistema SHALL mantener la compatibilidad con el frontend existente.
4. WHEN se despliega una nueva versión THEN el sistema SHALL permitir migraciones de datos sin pérdida de información.
5. WHEN ocurre un error en producción THEN el sistema SHALL proporcionar logs detallados para diagnóstico.###
 Requirement 9: Paquetes de Creación de Tokens

**User Story:** Como usuario, quiero poder seleccionar y pagar diferentes paquetes para la creación de tokens meme en Solana, para elegir el nivel de servicio que mejor se adapte a mis necesidades y presupuesto.

#### Acceptance Criteria

1. WHEN un usuario accede a la sección de creación de tokens THEN el sistema SHALL mostrar los diferentes paquetes disponibles con sus precios y características.
2. WHEN un usuario selecciona un paquete THEN el sistema SHALL mostrar un formulario detallado para la solicitud de creación del token.
3. WHEN un usuario completa el formulario y realiza el pago THEN el sistema SHALL almacenar la solicitud en la base de datos y notificar al administrador.
4. WHEN un administrador recibe una solicitud de creación THEN el sistema SHALL permitir revisar los detalles y programar una fecha de lanzamiento en el calendario.
5. WHEN el administrador aprueba una solicitud THEN el sistema SHALL notificar al usuario y actualizar el estado de la solicitud.
6. WHEN el sistema muestra los paquetes THEN el sistema SHALL incluir opciones de $50, $1500, $3000 y $5000 USD con diferentes niveles de servicio.

### Requirement 10: Sistema de Swap de Tokens

**User Story:** Como usuario, quiero poder intercambiar tokens directamente en la plataforma para facilitar las operaciones con los tokens lanzados en la plataforma.

#### Acceptance Criteria

1. WHEN un usuario accede a la página de Swap THEN el sistema SHALL mostrar una interfaz para seleccionar tokens de origen y destino.
2. WHEN un usuario configura un intercambio THEN el sistema SHALL mostrar tasas de cambio actualizadas y comisiones aplicables.
3. WHEN un usuario confirma un intercambio THEN el sistema SHALL conectar con la blockchain de Solana para ejecutar la transacción.
4. WHEN se completa un intercambio THEN el sistema SHALL actualizar los balances del usuario y proporcionar un recibo de la transacción.
5. WHEN ocurre un error durante el intercambio THEN el sistema SHALL revertir la operación y mostrar información detallada sobre el error.

### Requirement 11: Creador de Tokens de Solana

**User Story:** Como usuario avanzado o administrador, quiero acceder a una herramienta de creación de tokens en Solana directamente desde la plataforma para simplificar el proceso técnico de lanzamiento.

#### Acceptance Criteria

1. WHEN un usuario autorizado accede al creador de tokens THEN el sistema SHALL proporcionar una interfaz para configurar todos los parámetros del token.
2. WHEN un usuario configura los parámetros del token THEN el sistema SHALL validar la configuración para asegurar su viabilidad técnica.
3. WHEN un usuario confirma la creación del token THEN el sistema SHALL interactuar con la blockchain de Solana para crear el token según las especificaciones.
4. WHEN el token es creado exitosamente THEN el sistema SHALL proporcionar toda la información relevante incluyendo dirección del contrato y enlaces a exploradores.
5. WHEN un administrador lo solicita THEN el sistema SHALL permitir la integración automática del nuevo token en la plataforma principal.### 
Requirement 12: Automatizaciones y CRON Jobs

**User Story:** Como administrador, quiero que el sistema ejecute automáticamente ciertas tareas programadas para mantener la plataforma actualizada sin intervención manual constante.

#### Acceptance Criteria

1. WHEN finaliza el período de votación THEN el sistema SHALL ejecutar automáticamente un CRON job para determinar el ganador y moverlo a la sección "Next".
2. WHEN llega la fecha de lanzamiento programada para un token THEN el sistema SHALL ejecutar automáticamente un CRON job para moverlo a la sección "Lanzado".
3. WHEN se crea un nuevo token en la blockchain THEN el sistema SHALL ejecutar automáticamente la actualización de los metadatos en la plataforma.
4. WHEN ocurren eventos importantes (aprobación de solicitud, lanzamiento de token, etc.) THEN el sistema SHALL enviar notificaciones automáticas a los usuarios relevantes.
5. WHEN se ejecuta un CRON job THEN el sistema SHALL registrar la actividad en logs para auditoría y seguimiento.

### Requirement 13: Estructura de Datos del CMS

**User Story:** Como desarrollador, quiero una estructura de datos bien definida en el CMS para asegurar la consistencia y relaciones adecuadas entre las diferentes entidades del sistema.

#### Acceptance Criteria

1. WHEN se implementa el CMS THEN el sistema SHALL crear las siguientes colecciones con sus campos correspondientes:
   - Tokens: nombre, descripcion, mintAddress, imagen, fechaLanzamiento, estado (lanzado/próximo/inactivo), red
   - Votaciones: fechaInicio, fechaFin, candidatos (relación con Tokens), tokenGanador (relación con Tokens)
   - Comentarios: texto, usuario (relación), tokenRelacionado (relación), aprobado
   - Foros: título, tokenRelacionado, creador, respuestas (relación), moderado
   - Usuarios: nombre, email, walletSolana, rol (usuario, moderador, admin)
   - Paquetes: nombre, precio, características, nivel, beneficios
   - SolicitudesToken: usuario, paquete, estado, datos del token, fechaPago, aprobado
   - Swaps: tokenOrigen, tokenDestino, usuario, tasaCambio, estado, txHashSolana

2. WHEN se definen las relaciones entre entidades THEN el sistema SHALL implementar correctamente las relaciones uno-a-uno, uno-a-muchos y muchos-a-muchos según corresponda.
3. WHEN se accede a los datos a través de la API THEN el sistema SHALL permitir consultas con relaciones anidadas para obtener datos completos en una sola petición.
4. WHEN se modifican los datos THEN el sistema SHALL mantener la integridad referencial entre las diferentes colecciones.
5. WHEN se implementan permisos THEN el sistema SHALL restringir el acceso a las colecciones según el rol del usuario.

### Requirement 14: APIs y Conectividad

**User Story:** Como desarrollador frontend, quiero acceder a APIs bien documentadas y flexibles para integrar el frontend con el backend de manera eficiente.

#### Acceptance Criteria

1. WHEN se implementa el CMS THEN el sistema SHALL exponer tanto API REST como GraphQL para acceder a los datos.
2. WHEN se accede a las APIs THEN el sistema SHALL implementar autenticación y autorización adecuadas para proteger los datos.
3. WHEN se realizan consultas a la API THEN el sistema SHALL permitir filtrado, ordenación y paginación de resultados.
4. WHEN se despliega el frontend en Vercel THEN el sistema SHALL permitir la conexión con el backend a través de las APIs expuestas.
5. WHEN se actualizan los datos en el CMS THEN el sistema SHALL reflejar estos cambios en tiempo real o casi real en el frontend.
6. WHEN se documentan las APIs THEN el sistema SHALL proporcionar documentación clara y ejemplos de uso para facilitar la integración.###
 Requirement 15: Modularidad y Separación de Funcionalidades

**User Story:** Como usuario y administrador, quiero que cada sección de la plataforma funcione de manera independiente para garantizar una experiencia de usuario coherente y evitar interferencias entre módulos.

#### Acceptance Criteria

1. WHEN se implementa una funcionalidad en una sección específica THEN el sistema SHALL asegurar que no afecte a otras secciones sin autorización explícita.
2. WHEN un usuario navega entre diferentes secciones THEN el sistema SHALL mantener la independencia de cada módulo (Home, Next, Votaciones, Foros, etc.).
3. WHEN se desarrollan nuevas características THEN el sistema SHALL seguir un enfoque modular que respete la separación de responsabilidades.
4. WHEN se implementan relaciones entre entidades THEN el sistema SHALL evitar relaciones automáticas que afecten otras vistas sin aprobación.
5. WHEN se modifican metadatos o tokens THEN el sistema SHALL requerir autorización explícita para evitar alteraciones no deseadas.

### Requirement 16: Funcionalidades Específicas por Sección

**User Story:** Como usuario, quiero que cada sección de la plataforma tenga funcionalidades específicas y bien definidas para facilitar la navegación y el uso de la plataforma.

#### Acceptance Criteria

1. WHEN un usuario accede a la página Home THEN el sistema SHALL mostrar solo tokens con estado "lanzado" con sus datos básicos e incluir enlaces a foros correspondientes.
2. WHEN un usuario accede a la página Next THEN el sistema SHALL mostrar solo tokens con estado "próximo" con sus fechas de lanzamiento programadas e incluir opciones de "Recordarme".
3. WHEN un usuario accede a la página Votaciones THEN el sistema SHALL mostrar votaciones activas, permitir un voto por usuario y mostrar porcentajes en tiempo real.
4. WHEN finaliza una votación THEN el sistema SHALL determinar el token ganador, crear un nuevo token con estado "próximo" y programar su fecha de lanzamiento para el próximo viernes.
5. WHEN un usuario accede a la página Foros THEN el sistema SHALL mostrar hilos por token, permitir a moderadores crear nuevos hilos y a usuarios comentar según sus permisos.
6. WHEN un usuario accede a la página Creación de Token THEN el sistema SHALL mostrar paquetes disponibles, permitir selección y pago, guardar la solicitud y notificar al administrador.
7. WHEN un usuario accede a la página Swap THEN el sistema SHALL mostrar interfaz de conversión entre tokens lanzados, permitir selección de tokens, mostrar tasas y comisiones, y registrar transacciones.
8. WHEN un usuario accede a la página Perfil THEN el sistema SHALL mostrar historial de votos, swaps y solicitudes, permitir conectar wallet Solana y editar datos personales.

### Requirement 17: Integraciones Futuras

**User Story:** Como propietario del proyecto, quiero que el sistema esté preparado para futuras integraciones para facilitar la expansión y mejora de la plataforma.

#### Acceptance Criteria

1. WHEN se diseña la arquitectura THEN el sistema SHALL incluir soporte para futura integración con wallet Phantom.
2. WHEN se implementa la API THEN el sistema SHALL preparar endpoints para futura creación directa de tokens en Solana.
3. WHEN se muestra información de tokens THEN el sistema SHALL preparar la estructura para incluir enlaces al explorer de Solana por cada token.
4. WHEN se diseña el sistema de pagos THEN el sistema SHALL considerar futura integración con sistema de pagos USDC/USDT en la red de Solana.
5. WHEN se implementan nuevas integraciones THEN el sistema SHALL mantener la compatibilidad con las funcionalidades existentes.

### Requirement 18: Restricciones y Prohibiciones

**User Story:** Como propietario del proyecto, quiero establecer restricciones claras sobre lo que no debe modificarse para mantener la integridad y coherencia de la plataforma.

#### Acceptance Criteria

1. WHEN se implementan cambios THEN el sistema SHALL prohibir modificar la estructura o diseño de las páginas sin autorización previa.
2. WHEN se desarrollan nuevas funcionalidades THEN el sistema SHALL prohibir replicar funcionalidades entre páginas sin aprobación.
3. WHEN se implementan relaciones entre entidades THEN el sistema SHALL prohibir relaciones automáticas que afecten otras vistas sin autorización.
4. WHEN se trabaja con tokens THEN el sistema SHALL prohibir alterar metadatos o manipular tokens sin autorización explícita.
5. WHEN se implementan cambios visuales THEN el sistema SHALL mantener la coherencia con el diseño existente y respetar la identidad visual de la plataforma.

### Requirement 19: Módulos Separados e Independientes

**User Story:** Como desarrollador y administrador, quiero que cada página pública tenga su propio sistema backend y área administrativa completamente separada para garantizar independencia funcional y facilitar el mantenimiento.

#### Acceptance Criteria

1. WHEN se implementa cada módulo THEN el sistema SHALL crear controladores, servicios y rutas específicas para cada página pública (Home, Next, Vote, News, Forum, Create, Publish).
2. WHEN se accede a APIs específicas THEN el sistema SHALL usar endpoints exclusivos como `/api/home/tokens`, `/api/next/projects`, `/api/vote/candidates`, `/api/news/articles`.
3. WHEN se administra contenido THEN el sistema SHALL proporcionar paneles administrativos separados como `/admin/home-projects`, `/admin/next-projects`, `/admin/vote-management`, `/admin/news-management`.
4. WHEN se desarrollan servicios frontend THEN el sistema SHALL crear servicios independientes como `homeService.js`, `nextService.js`, `voteService.js`, `newsService.js`.
5. WHEN se implementa cache THEN el sistema SHALL mantener cache independiente para cada módulo para evitar interferencias entre sistemas.
6. WHEN se realizan cambios en un módulo THEN el sistema SHALL garantizar que no afecte el funcionamiento de otros módulos sin autorización explícita.
7. WHEN se crean formularios administrativos THEN el sistema SHALL incluir todos los campos necesarios según las especificaciones de cada módulo (imagen upload, configuraciones específicas, estados independientes).