'use strict';

/**
 * token controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::token.token', ({ strapi }) => ({
  // Método personalizado para obtener tokens lanzados
  async findLanzados(ctx) {
    try {
      const tokens = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'lanzado'
        },
        populate: {
          imagen: true,
          foros: true
        },
        sort: { fechaLanzamiento: 'desc' }
      });

      return this.transformResponse(tokens);
    } catch (error) {
      ctx.throw(500, 'Error al obtener tokens lanzados');
    }
  },

  // Método personalizado para obtener próximos lanzamientos
  async findProximos(ctx) {
    try {
      const tokens = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'próximo'
        },
        populate: {
          imagen: true
        },
        sort: { fechaLanzamiento: 'asc' }
      });

      return this.transformResponse(tokens);
    } catch (error) {
      ctx.throw(500, 'Error al obtener próximos lanzamientos');
    }
  },

  // Método personalizado para obtener candidatos de votación
  async findCandidatos(ctx) {
    try {
      const tokens = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'inactivo'
        },
        populate: {
          imagen: true,
          votaciones: true
        }
      });

      return this.transformResponse(tokens);
    } catch (error) {
      ctx.throw(500, 'Error al obtener candidatos');
    }
  },

  // Sobrescribir el método create para validaciones adicionales
  async create(ctx) {
    const { data } = ctx.request.body;

    // Validar que el mintAddress sea único si se proporciona
    if (data.mintAddress) {
      const existingToken = await strapi.entityService.findMany('api::token.token', {
        filters: {
          mintAddress: data.mintAddress
        }
      });

      if (existingToken.length > 0) {
        ctx.throw(400, 'Ya existe un token con esta dirección mint');
      }
    }

    // Validar fecha de lanzamiento
    if (data.fechaLanzamiento && new Date(data.fechaLanzamiento) < new Date()) {
      if (data.estado !== 'lanzado') {
        ctx.throw(400, 'La fecha de lanzamiento no puede ser en el pasado para tokens no lanzados');
      }
    }

    return super.create(ctx);
  },

  // Sobrescribir el método update para validaciones adicionales
  async update(ctx) {
    const { data } = ctx.request.body;
    const { id } = ctx.params;

    // Validar cambios de estado
    if (data.estado) {
      const currentToken = await strapi.entityService.findOne('api::token.token', id);
      
      // No permitir cambiar de 'lanzado' a otro estado
      if (currentToken.estado === 'lanzado' && data.estado !== 'lanzado') {
        ctx.throw(400, 'No se puede cambiar el estado de un token ya lanzado');
      }
    }

    return super.update(ctx);
  }
}));