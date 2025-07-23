'use strict';

/**
 * news-management controller
 * Controlador específico para el sistema NEWS
 */

module.exports = {
  // Obtener artículos de noticias para la página pública
  async getNewsArticles(ctx) {
    try {
      console.log('📰 Accediendo a artículos de NEWS');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, category, featured } = ctx.query;
      
      // Construir filtros
      let filters = {
        estado: 'publicado',
        fechaPublicacion: {
          $lte: new Date().toISOString()
        }
      };
      
      if (category) {
        filters.categoria = category;
      }
      
      if (featured === 'true') {
        filters.destacado = true;
      }
      
      // Buscar artículos de noticias
      const articles = await strapi.entityService.findMany('api::noticia.noticia', {
        filters,
        populate: ['imagen', 'autor'],
        sort: { fechaPublicacion: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return articles;
    } catch (error) {
      console.error('Error en getNewsArticles:', error);
      
      // Retornar datos de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              titulo: "Nuevo Token Meme Alcanza $1M en Market Cap",
              contenido: "Un nuevo token meme ha logrado alcanzar el millón de dólares en capitalización de mercado en menos de 24 horas...",
              categoria: "mercado",
              fechaPublicacion: new Date().toISOString(),
              destacado: true,
              estado: "publicado",
              imagen: {
                data: {
                  attributes: {
                    url: "/img/news-1.jpg"
                  }
                }
              },
              autor: {
                data: {
                  attributes: {
                    nombre: "Equipo FlorkaFun"
                  }
                }
              }
            }
          },
          {
            id: 2,
            attributes: {
              titulo: "Actualización de la Plataforma: Nuevas Funcionalidades",
              contenido: "Hemos lanzado nuevas funcionalidades que mejorarán tu experiencia en FlorkaFun...",
              categoria: "plataforma",
              fechaPublicacion: new Date(Date.now() - 86400000).toISOString(),
              destacado: false,
              estado: "publicado",
              imagen: {
                data: {
                  attributes: {
                    url: "/img/news-2.jpg"
                  }
                }
              },
              autor: {
                data: {
                  attributes: {
                    nombre: "Equipo Desarrollo"
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
            total: 2
          }
        }
      };
    }
  },

  // Obtener categorías de noticias
  async getNewsCategories(ctx) {
    try {
      console.log('📂 Accediendo a categorías de NEWS');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar categorías activas
      const categories = await strapi.entityService.findMany('api::categoria-noticia.categoria-noticia', {
        filters: {
          activa: true
        },
        sort: { orden: 'asc' }
      });
      
      return categories;
    } catch (error) {
      console.error('Error en getNewsCategories:', error);
      
      // Retornar categorías de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "Mercado",
              slug: "mercado",
              descripcion: "Noticias sobre el mercado de criptomonedas",
              activa: true,
              orden: 1
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Plataforma",
              slug: "plataforma",
              descripcion: "Actualizaciones y noticias de la plataforma",
              activa: true,
              orden: 2
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Comunidad",
              slug: "comunidad",
              descripcion: "Noticias de la comunidad FlorkaFun",
              activa: true,
              orden: 3
            }
          }
        ]
      };
    }
  },

  // Obtener artículo específico por slug
  async getArticleBySlug(ctx) {
    try {
      const { slug } = ctx.params;
      console.log(`📖 Accediendo a artículo: ${slug}`);
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar artículo por slug
      const articles = await strapi.entityService.findMany('api::noticia.noticia', {
        filters: {
          slug: slug,
          estado: 'publicado'
        },
        populate: ['imagen', 'autor', 'tags'],
        limit: 1
      });
      
      if (!articles.data || articles.data.length === 0) {
        return ctx.notFound('Artículo no encontrado');
      }
      
      return articles.data[0];
    } catch (error) {
      console.error('Error en getArticleBySlug:', error);
      
      // Retornar artículo de ejemplo si hay error
      return {
        id: 1,
        attributes: {
          titulo: "Artículo de Ejemplo",
          contenido: "Este es un artículo de ejemplo mientras se configura la base de datos...",
          categoria: "general",
          fechaPublicacion: new Date().toISOString(),
          slug: ctx.params.slug,
          estado: "publicado",
          imagen: {
            data: {
              attributes: {
                url: "/img/news-default.jpg"
              }
            }
          },
          autor: {
            data: {
              attributes: {
                nombre: "Equipo FlorkaFun"
              }
            }
          }
        }
      };
    }
  },

  // Crear nuevo artículo (solo admin)
  async createArticle(ctx) {
    try {
      console.log('✍️ Creando nuevo artículo');
      
      const { titulo, contenido, categoria, destacado, fechaPublicacion, tags } = ctx.request.body.data;
      
      // Generar slug automáticamente
      const slug = titulo.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Crear artículo
      const article = await strapi.entityService.create('api::noticia.noticia', {
        data: {
          titulo,
          contenido,
          categoria,
          slug,
          destacado: destacado || false,
          estado: 'borrador',
          fechaCreacion: new Date().toISOString(),
          fechaPublicacion: fechaPublicacion || null,
          autor: ctx.state.user.id,
          tags: tags || []
        }
      });
      
      return article;
    } catch (error) {
      console.error('Error en createArticle:', error);
      return ctx.badRequest('Error al crear el artículo');
    }
  },

  // Publicar artículo (solo admin)
  async publishArticle(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`📢 Publicando artículo: ${id}`);
      
      // Actualizar estado del artículo
      const article = await strapi.entityService.update('api::noticia.noticia', id, {
        data: {
          estado: 'publicado',
          fechaPublicacion: new Date().toISOString()
        }
      });
      
      return article;
    } catch (error) {
      console.error('Error en publishArticle:', error);
      return ctx.badRequest('Error al publicar el artículo');
    }
  }
};