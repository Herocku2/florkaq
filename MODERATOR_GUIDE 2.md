# 📋 Guía para Moderadores - Panel de Administración

## 🔐 Acceso al Panel de Moderación

Los moderadores pueden gestionar foros y comentarios desde el panel de administración de Strapi.

### **Credenciales de Acceso:**
- **URL:** http://localhost:1337/admin
- **Email:** giovanoti3@gmail.com
- **Password:** 123456

## 🛠️ Funcionalidades del Moderador

### **1. Gestión de Foros**
- ✅ **Crear nuevos foros con imágenes**
- ✅ **Editar foros existentes**
- ✅ **Eliminar foros**
- ✅ **Ver todos los foros**
- ✅ **Subir imágenes para foros**

### **2. Gestión de Comentarios**
- ✅ **Ver todos los comentarios**
- ✅ **Eliminar comentarios inapropiados**
- ❌ **NO puede crear comentarios desde admin** (solo desde el frontend público)

### **3. Gestión de Usuarios**
- ✅ **Ver usuarios registrados**
- ✅ **Banear/desbanear usuarios**
- ✅ **Cambiar estado de usuarios (activo/bloqueado)**

### **4. Restricciones de Seguridad**
- ❌ **NO tiene acceso a configuraciones del sistema**
- ❌ **NO puede crear/eliminar usuarios admin**
- ❌ **NO puede cambiar configuraciones de la aplicación**
- ❌ **NO puede acceder a otras colecciones sensibles**

## 📝 Cómo Crear un Nuevo Foro

1. **Accede al panel:** http://localhost:1337/admin
2. **Inicia sesión** con las credenciales de moderador
3. **Ve a "Content Manager"** en el menú lateral
4. **Selecciona "Foro"** en la lista de colecciones
5. **Haz clic en "Create new entry"**
6. **Completa los campos:**
   - **Título:** Nombre del foro
   - **Descripción:** Descripción del tema
   - **Token Relacionado:** Símbolo del token (ej: BTC, ETH)
   - **Creador:** Tu nombre de usuario
   - **Imagen:** Haz clic en "Add new assets" para subir imagen
   - **Moderado:** ✅ (siempre activado)
   - **Activo:** ✅ (siempre activado)
7. **Haz clic en "Save"**

## 🖼️ Cómo Subir Imágenes

1. **En el campo de imagen** haz clic en "Add new assets"
2. **Arrastra y suelta** la imagen o haz clic para seleccionar
3. **La imagen se subirá** automáticamente a la Media Library
4. **Selecciona la imagen** y haz clic en "Finish"

## 🗑️ Cómo Eliminar Comentarios

1. **Ve a "Content Manager" > "Comentario"**
2. **Busca el comentario** que quieres eliminar
3. **Haz clic en el comentario** para abrirlo
4. **Haz clic en "Delete this entry"**
5. **Confirma la eliminación**

## 🚫 Cómo Banear Usuarios

1. **Ve a "Content Manager" > "Usuario"**
2. **Busca el usuario** que quieres banear
3. **Haz clic en el usuario** para abrirlo
4. **Cambia el campo "Activo"** a ❌ (desactivado)
5. **Haz clic en "Save"**
6. **El usuario no podrá** iniciar sesión ni comentar

## ✅ Cómo Desbanear Usuarios

1. **Ve a "Content Manager" > "Usuario"**
2. **Busca el usuario baneado**
3. **Cambia el campo "Activo"** a ✅ (activado)
4. **Haz clic en "Save"**

## 📊 Vista del Frontend

Los foros creados aparecerán automáticamente en:
- **URL pública:** http://localhost:5173/forum
- Los usuarios podrán ver y comentar en los foros
- Las reacciones con emojis funcionan automáticamente

## 🔄 Flujo de Trabajo Recomendado

1. **Crear foros** desde el panel de admin
2. **Monitorear comentarios** regularmente
3. **Eliminar contenido inapropiado** cuando sea necesario
4. **Los usuarios interactúan** desde el frontend público

## 🆘 Soporte

Si necesitas ayuda o tienes problemas:
- Verifica que el backend esté corriendo en puerto 1337
- Verifica que el frontend esté corriendo en puerto 5173
- Los cambios en foros aparecen inmediatamente en el frontend

---

**¡Los moderadores tienen control total sobre el contenido de los foros desde una interfaz profesional!** 🎉