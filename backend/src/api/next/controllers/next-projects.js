'use strict';

/**
 * next-projects controller
 * Controlador específico para la página NEXT (Próximos Lanzamientos)
 */

module.exports = {
  // Obtener proyectos próximos para la página NEXT
  async getNextProjects(ctx) {
    try {
      console.log('🚀 Accediendo a proyectos NEXT');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Obtener parámetros de paginación y filtrado
      const { page = 1, pageSize = 3, featured } = ctx.query;
      
      // Construir filtros
      let filters = {
        estado: 'proximo',
        fechaLanzamiento: {
          $gte: new Date().toISOString()
        }
      };
      
      if (featured === 'true') {
        filters.destacado = true;
      }
      
      // Buscar proyectos próximos
      const projects = await strapi.entityService.findMany('api::token.token', {
        filters,
        populate: ['imagen'],
        sort: { fechaLanzamiento: 'asc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return projects;
    } catch (error) {
      console.error('Error en getNextProjects:', error);
      
      // Retornar datos de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "MAGA Token",
              simbolo: "MAGA",
              descripcion: "Token inspirado en el movimiento político americano",
              precioEstimado: 0.001,
              marketCapEstimado: 1000000,
              fechaLanzamiento: new Date(Date.now() + 86400000 * 2).toISOString(), // En 2 días
              estado: "proximo",
              destacado: true,
              progreso: 85,
              orden: 1,
              enlaces: {
                web: "https://magatoken.com",
                telegram: "https://t.me/magatoken",
                twitter: "https://twitter.com/magatoken",
                discord: "https://discord.gg/magatoken"
              },
              imagen: {
                data: {
                  attributes: {
                    url: "/img/next-1.png"
                  }
                }
              }
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Pepe Classic",
              simbolo: "PEPEC",
              descripcion: "El regreso del meme más icónico de internet",
              precioEstimado: 0.0005,
              marketCapEstimado: 500000,
              fechaLanzamiento: new Date(Date.now() + 86400000 * 5).toISOString(), // En 5 días
              estado: "proximo",
              destacado: true,
              progreso: 92,
              orden: 2,
              enlaces: {
                web: "https://pepeclassic.io",
                telegram: "https://t.me/pepeclassic",
                twitter: "https://twitter.com/pepeclassic"
              },
              imagen: {
                data: {
                  attributes: {
                    url: "/img/next-2.png"
                  }
                }
              }
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Doge Revolution",
              simbolo: "DOGREV",
              descripcion: "La nueva era del token Doge en Solana",
              precioEstimado: 0.002,
              marketCapEstimado: 2000000,
              fechaLanzamiento: new Date(Date.now() + 86400000 * 7).toISOString(), // En 7 días
              estado: "proximo",
              destacado: true,
              progreso: 78,
              orden: 3,
              enlaces: {
                web: "https://dogerevolution.sol",
                telegram: "https://t.me/dogerevolution",
                twitter: "https://twitter.com/dogerevolution",
                discord: "https://discord.gg/dogerevolution"
              },
              imagen: {
                data: {
                  attributes: {
                    url: "/img/next-3.png"
                  }
                }
              }
            }
          }
        ],
        meta: {
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: 1,
            total: 3
          }
        }
      };
    }
  },

  // Obtener calendario de lanzamientos
  async getNextSchedule(ctx) {
    try {
      console.log('📅 Accediendo a calendario NEXT');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar todos los proyectos próximos ordenados por fecha
      const schedule = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'proximo',
          fechaLanzamiento: {
            $gte: new Date().toISOString()
          }
        },
        populate: ['imagen'],
        sort: { fechaLanzamiento: 'asc' }
      });
      
      return schedule;
    } catch (error) {
      console.error('Error en getNextSchedule:', error);
      
      // Retornar calendario de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "MAGA Token",
              simbolo: "MAGA",
              fechaLanzamiento: new Date(Date.now() + 86400000 * 2).toISOString(),
              estado: "proximo"
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Pepe Classic",
              simbolo: "PEPEC",
              fechaLanzamiento: new Date(Date.now() + 86400000 * 5).toISOString(),
              estado: "proximo"
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Doge Revolution",
              simbolo: "DOGREV",
              fechaLanzamiento: new Date(Date.now() + 86400000 * 7).toISOString(),
              estado: "proximo"
            }
          }
        ]
      };
    }
  },

  // Obtener proyecto específico por ID
  async getNextProjectById(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`🎯 Accediendo a proyecto NEXT: ${id}`);
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar proyecto específico
      const project = await strapi.entityService.findOne('api::token.token', id, {
        populate: ['imagen']
      });
      
      if (!project || project.estado !== 'proximo') {
        return ctx.notFound('Proyecto no encontrado');
      }
      
      return project;
    } catch (error) {
      console.error('Error en getNextProjectById:', error);
      
      // Retornar proyecto de ejemplo si hay error
      return {
        id: parseInt(ctx.params.id),
        attributes: {
          nombre: "Proyecto de Ejemplo",
          simbolo: "EXAMPLE",
          descripcion: "Este es un proyecto de ejemplo mientras se configura la base de datos",
          precioEstimado: 0.001,
          marketCapEstimado: 1000000,
          fechaLanzamiento: new Date(Date.now() + 86400000 * 3).toISOString(),
          estado: "proximo",
          destacado: false,
          progreso: 50,
          imagen: {
            data: {
              attributes: {
                url: "/img/next-default.png"
              }
            }
          }
        }
      };
    }
  },

  // Crear recordatorio para proyecto (requiere autenticación)
  async createReminder(ctx) {
    try {
      const { projectId } = ctx.params;
      const userId = ctx.state.user.id;
      
      console.log(`🔔 Creando recordatorio para proyecto: ${projectId}, usuario: ${userId}`);
      
      // Verificar que el proyecto existe
      const project = await strapi.entityService.findOne('api::token.token', projectId);
      
      if (!project || project.estado !== 'proximo') {
        return ctx.badRequest('Proyecto no válido para recordatorio');
      }
      
      // Crear o actualizar recordatorio
      const reminder = await strapi.entityService.create('api::recordatorio.recordatorio', {
        data: {
          usuario: userId,
          token: projectId,
          fechaCreacion: new Date().toISOString(),
          activo: true,
          tipoNotificacion: 'lanzamiento'
        }
      });
      
      return { success: true, reminder };
    } catch (error) {
      console.error('Error en createReminder:', error);
      return ctx.badRequest('Error al crear recordatorio');
    }
  }
};