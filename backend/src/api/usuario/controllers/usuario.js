'use strict';

/**
 * usuario controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::usuario.usuario', ({ strapi }) => ({
  // Método personalizado para obtener perfil del usuario actual
  async me(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No estás autenticado');
      }

      const usuario = await strapi.entityService.findOne('api::usuario.usuario', user.id, {
        populate: '*'
      });

      return this.transformResponse(usuario);
    } catch (error) {
      ctx.throw(500, 'Error al obtener perfil de usuario');
    }
  },

  // Método personalizado para conectar wallet de Solana
  async conectarWallet(ctx) {
    try {
      const user = ctx.state.user;
      const { walletAddress } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized('No estás autenticado');
      }

      if (!walletAddress) {
        return ctx.badRequest('Dirección de wallet requerida');
      }

      // Validar formato de dirección de Solana
      const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!solanaAddressRegex.test(walletAddress)) {
        return ctx.badRequest('Formato de dirección de wallet inválido');
      }

      // Verificar que no exista otro usuario con la misma wallet
      const existingUser = await strapi.entityService.findMany('api::usuario.usuario', {
        filters: {
          walletSolana: walletAddress,
          id: { $ne: user.id }
        }
      });

      if (existingUser.length > 0) {
        return ctx.badRequest('Esta wallet ya está conectada a otra cuenta');
      }

      // Actualizar usuario con la wallet
      const updatedUser = await strapi.entityService.update('api::usuario.usuario', user.id, {
        data: {
          walletSolana: walletAddress
        }
      });

      return this.transformResponse(updatedUser);
    } catch (error) {
      ctx.throw(500, 'Error al conectar wallet');
    }
  },

  // Método personalizado para obtener estadísticas del usuario
  async estadisticas(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No estás autenticado');
      }

      // Aquí podrías obtener estadísticas como:
      // - Número de votos emitidos
      // - Número de comentarios
      // - Número de solicitudes de token
      // - Número de swaps realizados

      const estadisticas = {
        votos: 0, // Implementar cuando tengamos el modelo de Votos
        comentarios: 0, // Implementar cuando tengamos el modelo de Comentarios
        solicitudes: 0, // Implementar cuando tengamos el modelo de SolicitudesToken
        swaps: 0 // Implementar cuando tengamos el modelo de Swaps
      };

      return { data: estadisticas };
    } catch (error) {
      ctx.throw(500, 'Error al obtener estadísticas');
    }
  }
}));