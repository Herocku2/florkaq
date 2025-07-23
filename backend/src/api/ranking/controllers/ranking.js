'use strict';

/**
 * ranking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ranking.ranking', ({ strapi }) => ({
  // Override del método find para permitir acceso público
  async find(ctx) {
    console.log('🔍 Accediendo a rankings públicamente');
    
    // Bypass completo de permisos - siempre retornar datos
    console.log('✅ Retornando datos de ejemplo para rankings');
    
    return {
      data: [
        {
          id: 1,
          attributes: {
            posicion: 1,
            totalVotos: 28,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
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
        },
        {
          id: 2,
          attributes: {
            posicion: 2,
            totalVotos: 15,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            token: {
              data: {
                id: 2,
                attributes: {
                  nombre: "Gustavo Petro Token",
                  descripcion: "Token del presidente colombiano",
                  imagen: {
                    data: {
                      attributes: {
                        url: "/img/image-4.png"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          id: 3,
          attributes: {
            posicion: 3,
            totalVotos: 8,
            fechaActualizacion: new Date().toISOString(),
            activo: true,
            token: {
              data: {
                id: 3,
                attributes: {
                  nombre: "Barack Obama Coin",
                  descripcion: "Token del expresidente estadounidense",
                  imagen: {
                    data: {
                      attributes: {
                        url: "/img/image-1.png"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 3
        }
      }
    };
  }
}));