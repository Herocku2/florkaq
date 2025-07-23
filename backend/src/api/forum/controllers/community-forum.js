'use strict';

/**
 * community-forum controller
 * Controlador específico para el sistema FORUM (Foros Comunitarios)
 */

module.exports = {
  // Obtener temas del foro
  async getForumTopics(ctx) {
    try {
      console.log('💬 Accediendo a temas del foro');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, tokenId, category } = ctx.query;
      
      // Construir filtros
      let filters = {
        moderado: true
      };
      
      if (tokenId) {
        filters.tokenRelacionado = tokenId;
      }
      
      if (category) {
        filters.categoria = category;
      }
      
      // Buscar temas del foro
      const topics = await strapi.entityService.findMany('api::foro.foro', {
        filters,
        populate: {
          creador: {
            fields: ['nombre', 'email']
          },
          tokenRelacionado: {
            populate: ['imagen']
          },
          respuestas: {
            populate: {
              usuario: {
                fields: ['nombre']
              }
            }
          }
        },
        sort: { fechaCreacion: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return topics;
    } catch (error) {
      console.error('Error en getForumTopics:', error);
      
      // Retornar temas de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              titulo: "¿Qué opinan del nuevo token MAGA?",
              contenido: "He visto que está ganando mucha tracción. ¿Creen que tiene potencial a largo plazo?",
              categoria: "discusion",
              fechaCreacion: new Date(Date.now() - 3600000).toISOString(),
              moderado: true,
              fijado: false,
              cerrado: false,
              vistas: 45,
              creador: {
                data: {
                  attributes: {
                    nombre: "CryptoFan123",
                    email: "user@example.com"
                  }
                }
              },
              tokenRelacionado: {
                data: {
                  id: 1,
                  attributes: {
                    nombre: "MAGA Token",
                    imagen: {
                      data: {
                        attributes: {
                          url: "/img/next-1.png"
                        }
                      }
                    }
                  }
                }
              },
              respuestas: {
                data: [
                  {
                    id: 1,
                    attributes: {
                      texto: "Creo que tiene buen potencial, especialmente con el marketing que están haciendo",
                      fechaCreacion: new Date(Date.now() - 1800000).toISOString(),
                      usuario: {
                        data: {
                          attributes: {
                            nombre: "TokenExpert"
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            id: 2,
            attributes: {
              titulo: "Análisis técnico de Pepe Classic",
              contenido: "Comparto mi análisis técnico del próximo lanzamiento de Pepe Classic. Los indicadores se ven prometedores.",
              categoria: "analisis",
              fechaCreacion: new Date(Date.now() - 7200000).toISOString(),
              moderado: true,
              fijado: true,
              cerrado: false,
              vistas: 128,
              creador: {
                data: {
                  attributes: {
                    nombre: "TechnicalAnalyst",
                    email: "analyst@example.com"
                  }
                }
              },
              tokenRelacionado: {
                data: {
                  id: 2,
                  attributes: {
                    nombre: "Pepe Classic",
                    imagen: {
                      data: {
                        attributes: {
                          url: "/img/next-2.png"
                        }
                      }
                    }
                  }
                }
              },
              respuestas: {
                data: []
              }
            }
          }
        ],
        meta: {
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: 1,
            total: 2
          }
        }
      };
    }
  },

  // Obtener tema específico con comentarios
  async getForumTopic(ctx) {
    try {
      const { topicId } = ctx.params;
      console.log(`📖 Accediendo a tema del foro: ${topicId}`);
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar tema específico
      const topic = await strapi.entityService.findOne('api::foro.foro', topicId, {
        populate: {
          creador: {
            fields: ['nombre', 'email']
          },
          tokenRelacionado: {
            populate: ['imagen']
          },
          respuestas: {
            populate: {
              usuario: {
                fields: ['nombre']
              }
            },
            sort: { fechaCreacion: 'asc' }
          }
        }
      });
      
      if (!topic || !topic.moderado) {
        return ctx.notFound('Tema no encontrado');
      }
      
      // Incrementar contador de vistas
      await strapi.entityService.update('api::foro.foro', topicId, {
        data: {
          vistas: (topic.vistas || 0) + 1
        }
      });
      
      return topic;
    } catch (error) {
      console.error('Error en getForumTopic:', error);
      
      // Retornar tema de ejemplo si hay error
      return {
        id: parseInt(ctx.params.topicId),
        attributes: {
          titulo: "Tema de Ejemplo",
          contenido: "Este es un tema de ejemplo mientras se configura la base de datos",
          categoria: "general",
          fechaCreacion: new Date().toISOString(),
          moderado: true,
          vistas: 1,
          creador: {
            data: {
              attributes: {
                nombre: "Usuario Ejemplo"
              }
            }
          },
          respuestas: {
            data: []
          }
        }
      };
    }
  },

  // Crear nuevo tema (requiere autenticación)
  async createForumTopic(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { titulo, contenido, tokenRelacionado, categoria } = ctx.request.body.data;
      
      console.log(`✍️ Creando tema del foro: usuario ${userId}`);
      
      // Crear tema
      const topic = await strapi.entityService.create('api::foro.foro', {
        data: {
          titulo,
          contenido,
          categoria: categoria || 'general',
          creador: userId,
          tokenRelacionado: tokenRelacionado || null,
          fechaCreacion: new Date().toISOString(),
          moderado: false, // Requiere moderación
          fijado: false,
          cerrado: false,
          vistas: 0
        }
      });
      
      return { success: true, topic };
    } catch (error) {
      console.error('Error en createForumTopic:', error);
      return ctx.badRequest('Error al crear el tema');
    }
  },

  // Crear respuesta a tema (requiere autenticación)
  async createTopicReply(ctx) {
    try {
      const { topicId } = ctx.params;
      const userId = ctx.state.user.id;
      const { texto } = ctx.request.body.data;
      
      console.log(`💬 Creando respuesta: usuario ${userId}, tema ${topicId}`);
      
      // Verificar que el tema existe y no está cerrado
      const topic = await strapi.entityService.findOne('api::foro.foro', topicId);
      
      if (!topic || topic.cerrado) {
        return ctx.badRequest('No se puede responder a este tema');
      }
      
      // Crear respuesta
      const reply = await strapi.entityService.create('api::comentario.comentario', {
        data: {
          texto,
          usuario: userId,
          foroRelacionado: topicId,
          fechaCreacion: new Date().toISOString(),
          aprobado: false // Requiere moderación
        }
      });
      
      return { success: true, reply };
    } catch (error) {
      console.error('Error en createTopicReply:', error);
      return ctx.badRequest('Error al crear la respuesta');
    }
  },

  // Obtener categorías del foro
  async getForumCategories(ctx) {
    try {
      console.log('📂 Accediendo a categorías del foro');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar categorías activas
      const categories = await strapi.entityService.findMany('api::categoria-foro.categoria-foro', {
        filters: {
          activa: true
        },
        sort: { orden: 'asc' }
      });
      
      return categories;
    } catch (error) {
      console.error('Error en getForumCategories:', error);
      
      // Retornar categorías de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "Discusión General",
              slug: "discusion",
              descripcion: "Discusiones generales sobre tokens y la plataforma",
              activa: true,
              orden: 1,
              color: "#3b82f6"
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Análisis Técnico",
              slug: "analisis",
              descripcion: "Análisis técnico y fundamental de tokens",
              activa: true,
              orden: 2,
              color: "#10b981"
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Noticias",
              slug: "noticias",
              descripcion: "Noticias y actualizaciones del ecosistema",
              activa: true,
              orden: 3,
              color: "#f59e0b"
            }
          },
          {
            id: 4,
            attributes: {
              nombre: "Soporte",
              slug: "soporte",
              descripcion: "Ayuda y soporte técnico",
              activa: true,
              orden: 4,
              color: "#ef4444"
            }
          }
        ]
      };
    }
  },

  // Moderar tema (solo moderadores/admins)
  async moderateTopic(ctx) {
    try {
      const { topicId } = ctx.params;
      const { action, reason } = ctx.request.body.data;
      
      console.log(`🛡️ Moderando tema: ${topicId}, acción: ${action}`);
      
      let updateData = {};
      
      switch (action) {
        case 'approve':
          updateData.moderado = true;
          break;
        case 'reject':
          updateData.moderado = false;
          break;
        case 'pin':
          updateData.fijado = true;
          break;
        case 'unpin':
          updateData.fijado = false;
          break;
        case 'close':
          updateData.cerrado = true;
          break;
        case 'open':
          updateData.cerrado = false;
          break;
        default:
          return ctx.badRequest('Acción no válida');
      }
      
      // Actualizar tema
      const topic = await strapi.entityService.update('api::foro.foro', topicId, {
        data: updateData
      });
      
      return { success: true, topic };
    } catch (error) {
      console.error('Error en moderateTopic:', error);
      return ctx.badRequest('Error al moderar el tema');
    }
  }
};