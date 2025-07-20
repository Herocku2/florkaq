'use strict';

/**
 * Auth controller personalizado para FlorkaFun
 */

module.exports = {
  async register(ctx) {
    try {
      const { email, username, password, requestModerator } = ctx.request.body;

      // Validar datos requeridos
      if (!email || !password) {
        return ctx.badRequest('Email and password are required');
      }

      // Verificar si el usuario ya existe
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email }
      });

      if (existingUser) {
        return ctx.badRequest('User already exists');
      }

      // Crear usuario en el sistema de usuarios de Strapi
      const user = await strapi.plugins['users-permissions'].services.user.add({
        email,
        username: username || email.split('@')[0],
        password,
        confirmed: true,
        role: 1 // Rol de usuario autenticado por defecto
      });

      // Crear entrada en la colección personalizada de usuarios
      const customUser = await strapi.entityService.create('api::usuario.usuario', {
        data: {
          nombre: username || email.split('@')[0],
          email,
          rol: 'usuario',
          fechaRegistro: new Date(),
          activo: true,
          solicitudModerador: requestModerator || false,
          fechaSolicitudModerador: requestModerator ? new Date() : null,
          estadoSolicitudModerador: requestModerator ? 'pendiente' : null
        }
      });

      // Generar JWT token
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      // Si solicitó ser moderador, crear notificación para administradores
      if (requestModerator) {
        await strapi.entityService.create('api::actividad.actividad', {
          data: {
            tipo: 'solicitud_moderador',
            descripcion: `${user.username} has requested to be a forum moderator`,
            usuario: user.id.toString(),
            entidadRelacionada: customUser.id.toString(),
            tipoEntidad: 'usuario'
          }
        });

        strapi.log.info(`New moderator request from user: ${user.username}`);
      }

      ctx.send({
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          customUser: customUser
        }
      });

    } catch (error) {
      strapi.log.error('Registration error:', error);
      ctx.badRequest('Registration failed');
    }
  },

  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      // Validar datos requeridos
      if (!identifier || !password) {
        return ctx.badRequest('Email and password are required');
      }

      // Usar el servicio de autenticación de Strapi
      const { user, jwt } = await strapi.plugins['users-permissions'].services.auth.login({
        identifier,
        password
      });

      // Obtener datos del usuario personalizado
      const customUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: user.email }
      });

      ctx.send({
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          customUser: customUser[0] || null
        }
      });

    } catch (error) {
      strapi.log.error('Login error:', error);
      ctx.badRequest('Invalid credentials');
    }
  },

  async me(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('No user found');
      }

      // Obtener datos del usuario personalizado
      const customUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: { email: user.email }
      });

      ctx.send({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          customUser: customUser[0] || null
        }
      });

    } catch (error) {
      strapi.log.error('Me endpoint error:', error);
      ctx.internalServerError('Failed to get user data');
    }
  }
};