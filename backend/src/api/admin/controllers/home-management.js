'use strict';

/**
 * home-management controller
 * Controlador para el área administrativa de HOME
 */

module.exports = {
  // Obtener todos los tokens para administración de HOME
  async getHomeTokensAdmin(ctx) {
    try {
      console.log('🏠👨‍💼 Admin: Accediendo a tokens de HOME');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, estado, destacado } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (estado) {
        filters.estado = estado;
      }
      
      if (destacado !== undefined) {
        filters.destacado = destacado === 'true';
      }
      
      // Buscar tokens para administración
      const tokens = await strapi.entityService.findMany('api::token.token', {
        filters,
        populate: ['imagen', 'creador'],
        sort: { fechaCreacion: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return tokens;
    } catch (error) {
      console.error('Error en getHomeTokensAdmin:', error);
      return ctx.badRequest('Error al obtener tokens para administración');
    }
  },

  // Crear nuevo token para HOME
  async createHomeToken(ctx) {
    try {
      console.log('🏠➕ Admin: Creando token para HOME');
      
      const {
        nombre,
        simbolo,
        descripcion,
        mintAddress,
        red,
        estado,
        destacado,
        fechaLanzamiento,
        precioInicial,
        marketCapInicial
      } = ctx.request.body.data;
      
      // Crear token
      const token = await strapi.entityService.create('api::token.token', {
        data: {
          nombre,
          simbolo,
          descripcion,
          mintAddress,
          red: red || 'solana',
          estado: estado || 'lanzado',
          destacado: destacado || false,
          fechaLanzamiento: fechaLanzamiento || new Date().toISOString(),
          fechaCreacion: new Date().toISOString(),
          precioInicial: precioInicial || 0,
          marketCapInicial: marketCapInicial || 0,
          creador: ctx.state.user.id,
          aprobado: true
        }
      });
      
      return { success: true, token };
    } catch (error) {
      console.error('Error en createHomeToken:', error);
      return ctx.badRequest('Error al crear token');
    }
  },

  // Actualizar token de HOME
  async updateHomeToken(ctx) {
    try {
      const { tokenId } = ctx.params;
      console.log(`🏠✏️ Admin: Actualizando token ${tokenId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar token
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, token };
    } catch (error) {
      console.error('Error en updateHomeToken:', error);
      return ctx.badRequest('Error al actualizar token');
    }
  },

  // Cambiar estado de token (activar/desactivar)
  async toggleTokenStatus(ctx) {
    try {
      const { tokenId } = ctx.params;
      const { estado } = ctx.request.body.data;
      
      console.log(`🏠🔄 Admin: Cambiando estado de token ${tokenId} a ${estado}`);
      
      // Actualizar estado
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          estado,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, token };
    } catch (error) {
      console.error('Error en toggleTokenStatus:', error);
      return ctx.badRequest('Error al cambiar estado del token');
    }
  },

  // Destacar/quitar destaque de token
  async toggleTokenHighlight(ctx) {
    try {
      const { tokenId } = ctx.params;
      const { destacado } = ctx.request.body.data;
      
      console.log(`🏠⭐ Admin: ${destacado ? 'Destacando' : 'Quitando destaque de'} token ${tokenId}`);
      
      // Actualizar destaque
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          destacado,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, token };
    } catch (error) {
      console.error('Error en toggleTokenHighlight:', error);
      return ctx.badRequest('Error al cambiar destaque del token');
    }
  },

  // Gestionar rankings de HOME
  async getHomeRankingsAdmin(ctx) {
    try {
      console.log('🏠🏆 Admin: Accediendo a rankings de HOME');
      
      // Buscar rankings
      const rankings = await strapi.entityService.findMany('api::ranking.ranking', {
        populate: {
          token: {
            populate: ['imagen']
          }
        },
        sort: { posicion: 'asc' }
      });
      
      return rankings;
    } catch (error) {
      console.error('Error en getHomeRankingsAdmin:', error);
      return ctx.badRequest('Error al obtener rankings');
    }
  },

  // Actualizar ranking
  async updateHomeRanking(ctx) {
    try {
      const { rankingId } = ctx.params;
      console.log(`🏠🏆✏️ Admin: Actualizando ranking ${rankingId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar ranking
      const ranking = await strapi.entityService.update('api::ranking.ranking', rankingId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, ranking };
    } catch (error) {
      console.error('Error en updateHomeRanking:', error);
      return ctx.badRequest('Error al actualizar ranking');
    }
  },

  // Crear nuevo ranking
  async createHomeRanking(ctx) {
    try {
      console.log('🏠🏆➕ Admin: Creando ranking para HOME');
      
      const {
        tokenId,
        posicion,
        totalVotos,
        activo
      } = ctx.request.body.data;
      
      // Crear ranking
      const ranking = await strapi.entityService.create('api::ranking.ranking', {
        data: {
          token: tokenId,
          posicion,
          totalVotos: totalVotos || 0,
          activo: activo !== false,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, ranking };
    } catch (error) {
      console.error('Error en createHomeRanking:', error);
      return ctx.badRequest('Error al crear ranking');
    }
  },

  // Eliminar token (soft delete)
  async deleteHomeToken(ctx) {
    try {
      const { tokenId } = ctx.params;
      console.log(`🏠🗑️ Admin: Eliminando token ${tokenId}`);
      
      // Cambiar estado a inactivo en lugar de eliminar
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          estado: 'inactivo',
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, message: 'Token desactivado correctamente' };
    } catch (error) {
      console.error('Error en deleteHomeToken:', error);
      return ctx.badRequest('Error al eliminar token');
    }
  },

  // Obtener estadísticas de HOME
  async getHomeStats(ctx) {
    try {
      console.log('🏠📊 Admin: Obteniendo estadísticas de HOME');
      
      // Contar tokens por estado
      const totalTokens = await strapi.entityService.count('api::token.token');
      const launchedTokens = await strapi.entityService.count('api::token.token', {
        filters: { estado: 'lanzado' }
      });
      const featuredTokens = await strapi.entityService.count('api::token.token', {
        filters: { destacado: true }
      });
      
      // Obtener tokens más vistos (placeholder)
      const topViewedTokens = await strapi.entityService.findMany('api::token.token', {
        filters: { estado: 'lanzado' },
        populate: ['imagen'],
        sort: { fechaCreacion: 'desc' },
        limit: 5
      });
      
      return {
        totalTokens,
        launchedTokens,
        featuredTokens,
        inactiveTokens: totalTokens - launchedTokens,
        topViewedTokens: topViewedTokens.data || []
      };
    } catch (error) {
      console.error('Error en getHomeStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};