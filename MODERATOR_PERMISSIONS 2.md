# 🔐 Configuración de Permisos para Moderador

## 📋 Permisos Exactos para el Rol "Moderador"

### **Collection Types:**

**✅ ACTIVAR (marcar todas las casillas):**

1. **Comentario:**
   - ✅ Create
   - ✅ Read  
   - ✅ Update
   - ✅ Delete

2. **Foro:**
   - ✅ Create
   - ✅ Read
   - ✅ Update  
   - ✅ Delete

3. **Usuario:**
   - ❌ Create (NO)
   - ✅ Read
   - ✅ Update (para banear/desbanear)
   - ❌ Delete (NO)

**❌ DESACTIVAR (dejar sin marcar):**
- Actividad
- Candidato
- Noticias  
- Paquetes
- Proyecto-next
- Ranking
- Solicitud-token
- Swap
- Token
- Usuarios (diferente de Usuario)
- Votacion
- Vote

### **Single Types:**
- ❌ Todos desactivados

### **Plugins:**

**✅ ACTIVAR:**
- **Content Manager:** ✅ Todas las opciones
- **Upload (Media Library):** ✅ Todas las opciones (para subir imágenes)

**❌ DESACTIVAR:**
- Content-Type Builder
- Documentation
- Email
- GraphQL
- i18n
- Users & Permissions Plugin

### **Settings:**
- ❌ Todos desactivados (sin acceso a configuraciones)

## 🎯 Resultado Final

Con estos permisos, el moderador podrá:
- ✅ Crear foros con imágenes
- ✅ Editar/eliminar foros
- ✅ Ver/eliminar comentarios
- ✅ Banear/desbanear usuarios
- ✅ Subir imágenes a la Media Library
- ❌ NO acceder a configuraciones del sistema
- ❌ NO crear/eliminar usuarios admin

## 🚀 Pasos para Aplicar

1. Ve a **Settings > Administration Panel > Roles**
2. Edita el rol "Moderador" 
3. Configura los permisos según esta guía
4. **Guarda** los cambios
5. Asigna el rol al usuario `giovanoti3@gmail.com`