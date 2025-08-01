'use strict';

module.exports = {
  // Listar todos los usuarios
  async listUsers(ctx) {
    try {
      console.log('👥 Listando usuarios...');
      
      const usuarios = await strapi.entityService.findMany('api::usuario.usuario', {
        sort: { fechaRegistro: 'desc' }
      });

      return {
        success: true,
        data: usuarios,
        count: usuarios.length
      };
    } catch (error) {
      console.error('❌ Error listando usuarios:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Cambiar rol de usuario
  async changeUserRole(ctx) {
    try {
      const { email, newRole } = ctx.request.body;
      
      console.log(`🔄 Cambiando rol de ${email} a ${newRole}...`);

      // Validar rol
      const validRoles = ['usuario', 'moderador', 'admin'];
      if (!validRoles.includes(newRole)) {
        return ctx.badRequest('Rol inválido. Debe ser: usuario, moderador o admin');
      }

      // Buscar usuario
      const usuarios = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: email }
      });

      if (usuarios.length === 0) {
        return ctx.notFound('Usuario no encontrado');
      }

      const usuario = usuarios[0];

      // Actualizar rol
      const updatedUser = await strapi.entityService.update('api::usuario.usuario', usuario.id, {
        data: { rol: newRole }
      });

      console.log(`✅ Rol actualizado: ${email} -> ${newRole}`);

      return {
        success: true,
        message: `Usuario ${email} ahora es ${newRole}`,
        data: updatedUser
      };
    } catch (error) {
      console.error('❌ Error cambiando rol:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Obtener información de un usuario específico
  async getUserInfo(ctx) {
    try {
      const { email } = ctx.params;
      
      console.log(`🔍 Buscando usuario: ${email}`);

      const usuarios = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: email }
      });

      if (usuarios.length === 0) {
        return ctx.notFound('Usuario no encontrado');
      }

      return {
        success: true,
        data: usuarios[0]
      };
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  }
};