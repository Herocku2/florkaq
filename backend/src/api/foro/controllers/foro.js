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
      
      // Verificar autenticación usando nuestro sistema JWT personalizado
      const token = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return ctx.unauthorized('Token de autenticación requerido');
      }

      // Verificar el token usando el mismo método que simple-auth
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';
      
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        console.log('❌ Token inválido:', jwtError.message);
        return ctx.unauthorized('Token inválido');
      }

      // Buscar usuario en la colección usuarios personalizada
      const customUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: decoded.email }
      });

      if (customUser.length === 0) {
        console.log(`❌ Usuario personalizado no encontrado: ${decoded.email}`);
        return ctx.unauthorized('Usuario no encontrado');
      }

      const userRole = customUser[0].rol;
      const isModerator = ['moderador', 'admin'].includes(userRole);
      
      if (!isModerator) {
        return ctx.forbidden('Solo los moderadores y administradores pueden crear foros');
      }

      console.log(`✅ Usuario ${decoded.email} autorizado para crear foro (rol: ${userRole})`);
      
      // Crear el foro con datos adicionales
      const requestData = ctx.request.body.data;
      const forumData = {
        titulo: requestData.titulo,
        descripcion: requestData.descripcion,
        tokenRelacionado: requestData.tokenRelacionado,
        enlaceWeb: requestData.enlaceWeb,
        redesSociales: requestData.redesSociales,
        creador: customUser[0].nombre,
        moderado: true,
        activo: true,
        fechaCreacion: new Date()
      };

      // Si hay una URL de imagen, agregarla
      if (requestData.imagen && typeof requestData.imagen === 'string') {
        forumData.imagenUrl = requestData.imagen;
      }

      console.log('📝 Datos del foro a crear:', forumData);

      const newForum = await strapi.entityService.create('api::foro.foro', {
        data: forumData
      });
      
      console.log(`✅ Foro creado: ${newForum.id} por ${customUser[0].nombre}`);
      return { data: newForum };
    } catch (error) {
      console.error('❌ Error creando foro:', error);
      ctx.throw(500, 'Error interno del servidor: ' + error.message);
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

  // Crear comentario en un foro - PÚBLICO PARA TODOS
  async createComment(ctx) {
    try {
      const { id } = ctx.params;
      const requestData = ctx.request.body.data || ctx.request.body;
      
      console.log(`🔍 Creando comentario en foro ${id}...`);
      console.log(`📝 Datos recibidos:`, requestData);
      
      const texto = requestData.texto;
      const usuario = requestData.usuario || 'Usuario Anónimo';
      
      if (!texto || texto.trim().length === 0) {
        return ctx.badRequest('El texto del comentario es requerido');
      }

      // Crear comentario - ACCESO PÚBLICO
      const comentario = await strapi.entityService.create('api::comentario.comentario', {
        data: {
          texto: texto.trim(),
          usuario: usuario,
          foroRelacionado: id.toString(),
          aprobado: true,
          fechaCreacion: new Date()
        }
      });

      console.log(`✅ Comentario creado: ${comentario.id} por ${usuario}`);
      return { data: comentario };
    } catch (error) {
      console.error(`❌ Error creando comentario en foro ${ctx.params.id}:`, error);
      console.error('Error details:', error);
      ctx.throw(500, 'Error interno del servidor: ' + error.message);
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
      // Intentar obtener el token del header Authorization
      const token = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (!token) {
        // Si no hay token, devolver false
        return {
          data: {
            isModerator: false,
            userId: null,
            email: null
          }
        };
      }

      // Verificar el token usando el mismo método que simple-auth
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'florkafun-secret-key-2024';
      
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        console.log('❌ Token inválido:', jwtError.message);
        return {
          data: {
            isModerator: false,
            userId: null,
            email: null
          }
        };
      }

      // Buscar usuario en la colección usuarios personalizada
      const customUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: decoded.email }
      });

      if (customUser.length === 0) {
        console.log(`❌ Usuario personalizado no encontrado: ${decoded.email}`);
        return {
          data: {
            isModerator: false,
            userId: decoded.id,
            email: decoded.email
          }
        };
      }

      const userRole = customUser[0].rol;
      const isModerator = ['moderador', 'admin'].includes(userRole);
      
      console.log(`🔍 Usuario ${decoded.email} tiene rol: ${userRole}, es moderador: ${isModerator}`);
      
      return {
        data: {
          isModerator,
          userId: decoded.id,
          email: decoded.email,
          role: userRole
        }
      };
    } catch (error) {
      console.error('❌ Error verificando moderador:', error);
      // En caso de error, devolver false en lugar de lanzar excepción
      return {
        data: {
          isModerator: false,
          userId: null,
          email: null
        }
      };
    }
  }
}));