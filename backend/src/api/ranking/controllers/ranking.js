'use strict';

/**
 * ranking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ranking.ranking', ({ strapi }) => ({
  // Método personalizado para obtener rankings por página
  async findByPage(ctx) {
    try {
      const { pagina } = ctx.params;
      
      if (!pagina || !['home', 'next'].includes(pagina)) {
        return ctx.badRequest('Página debe ser "home" o "next"');
      }

      const rankings = await strapi.entityService.findMany('api::ranking.ranking', {
        filters: {
          activo: true,
          pagina: pagina
        },
        populate: {
          token: {
            populate: ['imagen']
          }
        },
        sort: { posicion: 'asc' }
      });

      return this.transformResponse(rankings);
    } catch (error) {
      console.error('Error fetching rankings by page:', error);
      return ctx.internalServerError('Error al obtener rankings por página');
    }
  },

  // Override del método find para permitir acceso público (mantener compatibilidad)
  async find(ctx) {
    console.log('🔍 Accediendo a rankings públicamente');
    
    try {
      const rankings = await strapi.entityService.findMany('api::ranking.ranking', {
        filters: { activo: true },
        populate: {
          token: {
            populate: ['imagen']
          }
        },
        sort: { posicion: 'asc' }
      });

      return this.transformResponse(rankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      // Fallback con datos de ejemplo
      return {
        data: [
          {
            id: 1,
            attributes: {
              posicion: 1,
              totalVotos: 28,
              fechaActualizacion: new Date().toISOString(),
              activo: true,
              pagina: "home",
              token: {
                data: {
                  id: 1,
                  attributes: {
                    nombre: "Bukele",
                    descripcion: "Token del presidente de El Salvador",
                    imagen: {
                      data: {
                        attributes: {
                          url: "/img/image-3.png"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      };
    }
  }
}));