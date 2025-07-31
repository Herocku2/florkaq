'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::foro.foro', ({ strapi }) => ({
  // Obtener todos los foros con comentarios
  async find(ctx) {
    try {
      console.log('🔍 Obteniendo foros...');
      
      const { data, meta } = await super.find(ctx);
      
      console.log(`✅ Foros encontrados: ${data.length}`);
      return { data, meta };
    } catch (error) {
      console.error('❌ Error obteniendo foros:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Obtener un foro específico con sus comentarios
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`🔍 Obteniendo foro ${id}...`);
      
      const entity = await strapi.entityService.findOne('api::foro.foro', id, {
        populate: {
          comentarios: {
            populate: ['usuario']
          }
        }
      });

      if (!entity) {
        return ctx.notFound('Foro no encontrado');
      }

      console.log(`✅ Foro ${id} encontrado`);
      return { data: entity };
    } catch (error) {
      console.error(`❌ Error obteniendo foro ${ctx.params.id}:`, error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Crear nuevo foro (solo moderadores y administradores)
  async create(ctx) {
    try {
      console.log('🔍 Creando nuevo foro...');
      
      // Verificar autenticación
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Debes estar autenticado para crear foros');
      }

      // Verificar si el usuario es moderador o admin
      const isModerator = await this.checkUserRole(user.id, ['moderador', 'admin']);
      if (!isModerator) {
        return ctx.forbidden('Solo los moderadores y administradores pueden crear foros');
      }

      // Obtener datos del usuario desde la colección usuarios
      const userData = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: user.email }
      });

      const creatorName = userData.length > 0 ? userData[0].nombre : user.username || user.email;
      
      // Crear el foro con datos adicionales
      const forumData = {
        ...ctx.request.body.data,
        creador: creatorName,
        moderado: true,
        activo: true,
        fechaCreacion: new Date()
      };

      const { data } = await super.create({ ...ctx, request: { ...ctx.request, body: { data: forumData } } });
      
      console.log(`✅ Foro creado: ${data.id} por ${creatorName}`);
      return { data };
    } catch (error) {
      console.error('❌ Error creando foro:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Obtener comentarios de un foro específico
  async getComments(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`🔍 Obteniendo comentarios del foro ${id}...`);
      
      const comentarios = await strapi.entityService.findMany('api::comentario.comentario', {
        filters: {
          foroRelacionado: id
        },
        sort: { createdAt: 'asc' },
        populate: ['usuario']
      });

      console.log(`✅ Comentarios encontrados: ${comentarios.length}`);
      return { data: comentarios };
    } catch (error) {
      console.error(`❌ Error obteniendo comentarios del foro ${ctx.params.id}:`, error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Crear comentario en un foro
  async createComment(ctx) {
    try {
      const { id } = ctx.params;
      const { texto } = ctx.request.body.data || ctx.request.body;
      
      console.log(`🔍 Creando comentario en foro ${id}...`);
      
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Debes estar autenticado para comentar');
      }

      if (!texto || texto.trim().length === 0) {
        return ctx.badRequest('El texto del comentario es requerido');
      }

      const comentario = await strapi.entityService.create('api::comentario.comentario', {
        data: {
          texto: texto.trim(),
          usuario: user.email || user.username || 'Usuario',
          foroRelacionado: id,
          aprobado: true,
          fechaCreacion: new Date()
        }
      });

      console.log(`✅ Comentario creado: ${comentario.id}`);
      return { data: comentario };
    } catch (error) {
      console.error(`❌ Error creando comentario en foro ${ctx.params.id}:`, error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Verificar rol de usuario
  async checkUserRole(userId, allowedRoles) {
    try {
      // Buscar usuario en la colección usuarios por el ID del user de Strapi
      const strapiUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId }
      });

      if (!strapiUser) {
        console.log(`❌ Usuario Strapi no encontrado: ${userId}`);
        return false;
      }

      // Buscar en la colección usuarios personalizada
      const customUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: strapiUser.email }
      });

      if (customUser.length === 0) {
        console.log(`❌ Usuario personalizado no encontrado: ${strapiUser.email}`);
        return false;
      }

      const userRole = customUser[0].rol;
      const hasPermission = allowedRoles.includes(userRole);
      
      console.log(`🔍 Usuario ${strapiUser.email} tiene rol: ${userRole}, permitido: ${hasPermission}`);
      return hasPermission;
    } catch (error) {
      console.error('❌ Error verificando rol de usuario:', error);
      return false;
    }
  },

  // Verificar si el usuario es moderador (endpoint para frontend)
  async checkModerator(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No autenticado');
      }

      const isModerator = await this.checkUserRole(user.id, ['moderador', 'admin']);
      
      return {
        data: {
          isModerator,
          userId: user.id,
          email: user.email
        }
      };
    } catch (error) {
      console.error('❌ Error verificando moderador:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  }
}));