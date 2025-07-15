✅ TASK LIST PARA KIRO AI – PROYECTO: FlorkaFun
🚫 IMPORTANTE:
Bajo ninguna circunstancia debes modificar el diseño de ninguna página (estructura, distribución, colores, tipografía, comportamiento visual) sin el consentimiento explícito del dueño del proyecto.

✅ Cada página del sistema debe ser tratada como un módulo completamente independiente, sin afectar a otras secciones al implementar lógica o funcionalidades.
Ejemplo: Lo que suceda en next no debe alterar home, votaciones o foros a menos que el usuario lo apruebe expresamente.

🔧 1. ESTRUCTURA BASE Y CONFIGURACIÓN
 Configurar docker-compose con Strapi + SQLite en desarrollo.

 Exponer Strapi en el puerto 1337.

 Crear los modelos de datos descritos en README.md.

 Crear roles de usuario (usuario, moderador, administrador).

 Configurar Strapi para exponer tanto API REST como GraphQL.

🧱 2. MODELOS Y RELACIONES EN STRAPI
 Crear colección Tokens con campos: nombre, descripcion, mintAddress, imagen, fechaLanzamiento, estado, red.

 Crear colección Votaciones con relación múltiple a Tokens (candidatos) y una relación simple al tokenGanador.

 Crear colección Comentarios con relación a Usuarios y a Tokens.

 Crear colección Foros con relación a Tokens, Comentarios, y Usuarios.

 Crear colección Paquetes con sus precios y niveles.

 Crear colección SolicitudesToken con relación a Paquetes y Usuarios.

 Crear colección Swaps con relación a Tokens y Usuarios.

 Habilitar campos booleanos de control (aprobado, estado, etc.)

🔐 3. ROLES Y PERMISOS
 Asignar permisos a usuarios para: votar, comentar, enviar solicitudes.

 Asignar permisos a moderadores para: crear/editar foros, borrar comentarios, bloquear usuarios.

 Asignar permisos a administradores para: acceso total.

 Asegurar que cada rol solo vea lo que le corresponde.

📄 4. LÓGICA FUNCIONAL POR SECCIÓN
Nota: Cada sección debe ejecutarse y desarrollarse de forma modular.
Ninguna debe alterar otra sin autorización explícita.

🔹 Página Home (Tokens Lanzados)
 Mostrar solo tokens con estado = lanzado.

 Mostrar datos básicos (nombre, imagen, red).

 Incluir enlace al foro correspondiente.

 NO incluir lógica de votación o próximos lanzamientos.

🔹 Página Next (Próximos Lanzamientos)
 Mostrar solo tokens con estado = próximo.

 Usar la fecha de lanzamiento programada.

 Incluir opción de “Recordarme” o ver más detalles.

 No incluir botones de votación.

🔹 Página Votaciones
 Mostrar votaciones activas con fecha de inicio y fin.

 Permitir 1 voto por usuario.

 Mostrar porcentajes en tiempo real.

 Al finalizar la votación:

 Determinar token ganador

 Crear nuevo token con estado = próximo

 Programar su fecha de lanzamiento (próximo viernes)

🔹 Página Foros
 Mostrar hilos por token.

 Solo moderadores pueden crear nuevos hilos.

 Usuarios pueden comentar (según permisos).

 Moderadores pueden eliminar contenido.

 Admin puede asignar o remover permisos.

🔹 Página Creación de Token
 Mostrar paquetes disponibles con sus características.

 Permitir selección y pago (solo simulado si no hay pasarela real).

 Guardar la solicitud en SolicitudesToken.

 Notificar al admin para su aprobación manual.

🔹 Página Swap
 Mostrar interfaz de conversión entre tokens lanzados.

 Permitir selección de token origen y destino.

 Mostrar tasa y comisión (pueden ser simuladas).

 Registrar transacción en Swaps.

🔹 Página Perfil de Usuario
 Mostrar historial de votos, swaps, solicitudes.

 Permitir conectar wallet Solana.

 Permitir editar datos personales (excepto rol).

⚙️ 5. AUTOMATIZACIONES
 Crear cron job para finalizar votaciones automáticamente.

 Mover token ganador a estado = próximo y crear entrada en Next.

 Crear cron job para publicar token en Home el día de lanzamiento.

 Notificar por email o bandeja al usuario cuando:

 Su token ha sido aprobado

 Se ha lanzado el token que votó

 Su swap fue exitoso

🚫 6. PROHIBICIONES
 ❌ No modificar la estructura o diseño de las páginas (home, next, votaciones, foros, etc.) sin autorización previa.

 ❌ No replicar funcionalidades entre páginas sin aprobación.

 ❌ No hacer relaciones automáticas que afecten otras vistas (ej: comentario en Next que se vea en Home).

 ❌ No alterar metadatos ni manipular tokens sin autorización.

🧩 7. INTEGRACIONES FUTURAS (dejar preparadas)
 Soporte para wallet Phantom.

 API para crear token directamente en Solana.

 Enlace al explorer Solana por cada token.

 Integración con sistema de pagos USDC USDT en la red de solana.

