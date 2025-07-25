'use strict';

/**
 * candidato controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::candidato.candidato', ({ strapi }) => ({
  // Obtener todos los candidatos con sus imágenes
  async find(ctx) {
    try {
      const { query } = ctx;
      
      const candidatos = await strapi.entityService.findMany('api::candidato.candidato', {
        ...query,
        populate: {
          imagen: {
            fields: ['url', 'alternativeText', 'name']
          }
        }
      });

      return this.transformResponse(candidatos);
    } catch (error) {
      console.error('Error fetching candidatos:', error);
      return ctx.internalServerError('Error al obtener candidatos');
    }
  },

  // Obtener un candidato específico con su imagen
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const candidato = await strapi.entityService.findOne('api::candidato.candidato', id, {
        populate: {
          imagen: {
            fields: ['url', 'alternativeText', 'name']
          }
        }
      });

      if (!candidato) {
        return ctx.notFound('Candidato no encontrado');
      }

      return this.transformResponse(candidato);
    } catch (error) {
      console.error('Error fetching candidato:', error);
      return ctx.internalServerError('Error al obtener candidato');
    }
  },

  // Obtener candidatos activos para votación
  async findActivos(ctx) {
    try {
      const candidatos = await strapi.entityService.findMany('api::candidato.candidato', {
        filters: {
          activo: true
        },
        populate: {
          imagen: {
            fields: ['url', 'alternativeText', 'name']
          }
        },
        sort: { votos: 'desc' }
      });

      return this.transformResponse(candidatos);
    } catch (error) {
      console.error('Error fetching candidatos activos:', error);
      return ctx.internalServerError('Error al obtener candidatos activos');
    }
  }
}));