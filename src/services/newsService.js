import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class NewsService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minuto para noticias
  }

  // Método para obtener datos del cache o hacer nueva petición
  async getCachedData(key, fetchFn) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      // Si hay error y tenemos cache, usar cache aunque esté expirado
      if (cached) {
        console.warn('Using expired cache due to API error');
        return cached.data;
      }
      throw error;
    }
  }

  // Obtener artículos de noticias
  async getNewsArticles(page = 1, pageSize = 10, filters = {}) {
    const cacheKey = `news-articles-${page}-${pageSize}-${JSON.stringify(filters)}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const params = {
          page,
          pageSize,
          ...filters
        };
        
        const response = await apiService.get('news/articles', params);
        return response;
      }, this.getFallbackNewsArticles(page, pageSize), 'NewsService.getNewsArticles');
    });
  }

  // Obtener categorías de noticias
  async getNewsCategories() {
    const cacheKey = 'news-categories';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('news/categories');
        return response;
      }, this.getFallbackNewsCategories(), 'NewsService.getNewsCategories');
    });
  }

  // Obtener artículo específico por slug
  async getArticleBySlug(slug) {
    const cacheKey = `news-article-${slug}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`news/article/${slug}`);
        return response;
      }, this.getFallbackArticle(slug), 'NewsService.getArticleBySlug');
    });
  }

  // Obtener artículos destacados
  async getFeaturedArticles(limit = 3) {
    return await this.getNewsArticles(1, limit, { featured: 'true' });
  }

  // Obtener artículos por categoría
  async getArticlesByCategory(category, page = 1, pageSize = 10) {
    return await this.getNewsArticles(page, pageSize, { category });
  }

  // Datos de fallback para artículos
  getFallbackNewsArticles(page = 1, pageSize = 10) {
    return {
      data: [
        {
          id: 1,
          attributes: {
            titulo: "Nuevo Token Meme Alcanza $1M en Market Cap",
            contenido: "Un nuevo token meme ha logrado alcanzar el millón de dólares en capitalización de mercado en menos de 24 horas. Este fenómeno demuestra el poder de la comunidad en el ecosistema de Solana.",
            resumen: "Token meme alcanza $1M en capitalización de mercado en tiempo récord.",
            categoria: "mercado",
            slug: "nuevo-token-meme-1m-market-cap",
            fechaPublicacion: new Date().toISOString(),
            destacado: true,
            estado: "publicado",
            vistas: 1250,
            imagen: {
              data: {
                attributes: {
                  url: "/img/news-1.jpg",
                  alternativeText: "Token meme trending"
                }
              }
            },
            autor: {
              data: {
                attributes: {
                  nombre: "Equipo FlorkaFun",
                  email: "equipo@florkafun.com"
                }
              }
            },
            tags: ["meme", "solana", "market-cap", "trending"]
          }
        },
        {
          id: 2,
          attributes: {
            titulo: "Actualización de la Plataforma: Nuevas Funcionalidades",
            contenido: "Hemos lanzado nuevas funcionalidades que mejorarán tu experiencia en FlorkaFun. Incluye mejoras en el sistema de votación, nuevos filtros y optimizaciones de rendimiento.",
            resumen: "Nuevas funcionalidades y mejoras en la plataforma FlorkaFun.",
            categoria: "plataforma",
            slug: "actualizacion-plataforma-nuevas-funcionalidades",
            fechaPublicacion: new Date(Date.now() - 86400000).toISOString(),
            destacado: false,
            estado: "publicado",
            vistas: 890,
            imagen: {
              data: {
                attributes: {
                  url: "/img/news-2.jpg",
                  alternativeText: "Actualización de plataforma"
                }
              }
            },
            autor: {
              data: {
                attributes: {
                  nombre: "Equipo Desarrollo",
                  email: "dev@florkafun.com"
                }
              }
            },
            tags: ["actualización", "funcionalidades", "mejoras"]
          }
        },
        {
          id: 3,
          attributes: {
            titulo: "Comunidad FlorkaFun Supera los 10,000 Usuarios",
            contenido: "Celebramos un hito importante: nuestra comunidad ha superado los 10,000 usuarios activos. Gracias a todos por hacer posible este crecimiento.",
            resumen: "La comunidad FlorkaFun alcanza los 10,000 usuarios activos.",
            categoria: "comunidad",
            slug: "comunidad-florkafun-10000-usuarios",
            fechaPublicacion: new Date(Date.now() - 172800000).toISOString(),
            destacado: true,
            estado: "publicado",
            vistas: 2100,
            imagen: {
              data: {
                attributes: {
                  url: "/img/news-3.jpg",
                  alternativeText: "Comunidad FlorkaFun"
                }
              }
            },
            autor: {
              data: {
                attributes: {
                  nombre: "Community Manager",
                  email: "community@florkafun.com"
                }
              }
            },
            tags: ["comunidad", "milestone", "usuarios", "crecimiento"]
          }
        }
      ],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 1,
          total: 3
        }
      }
    };
  }

  // Datos de fallback para categorías
  getFallbackNewsCategories() {
    return {
      data: [
        {
          id: 1,
          attributes: {
            nombre: "Mercado",
            slug: "mercado",
            descripcion: "Noticias sobre el mercado de criptomonedas y tokens",
            activa: true,
            orden: 1
          }
        },
        {
          id: 2,
          attributes: {
            nombre: "Plataforma",
            slug: "plataforma",
            descripcion: "Actualizaciones y noticias de la plataforma FlorkaFun",
            activa: true,
            orden: 2
          }
        },
        {
          id: 3,
          attributes: {
            nombre: "Comunidad",
            slug: "comunidad",
            descripcion: "Noticias y eventos de la comunidad FlorkaFun",
            activa: true,
            orden: 3
          }
        },
        {
          id: 4,
          attributes: {
            nombre: "Tecnología",
            slug: "tecnologia",
            descripcion: "Avances tecnológicos y desarrollos en blockchain",
            activa: true,
            orden: 4
          }
        }
      ]
    };
  }

  // Datos de fallback para artículo específico
  getFallbackArticle(slug) {
    return {
      id: 1,
      attributes: {
        titulo: "Artículo de Ejemplo",
        contenido: "Este es un artículo de ejemplo mientras se configura la base de datos. El contenido real se cargará desde el CMS una vez que esté disponible.",
        resumen: "Artículo de ejemplo para mostrar la estructura de noticias.",
        categoria: "general",
        slug: slug,
        fechaPublicacion: new Date().toISOString(),
        destacado: false,
        estado: "publicado",
        vistas: 0,
        imagen: {
          data: {
            attributes: {
              url: "/img/news-default.jpg",
              alternativeText: "Imagen por defecto"
            }
          }
        },
        autor: {
          data: {
            attributes: {
              nombre: "Equipo FlorkaFun",
              email: "equipo@florkafun.com"
            }
          }
        },
        tags: ["ejemplo", "placeholder"]
      }
    };
  }

  // Transformar datos de artículo para el frontend
  transformArticleData(strapiArticle) {
    if (!strapiArticle) return null;

    const attributes = strapiArticle.attributes || strapiArticle;
    
    return {
      id: strapiArticle.id,
      titulo: attributes.titulo,
      contenido: attributes.contenido,
      resumen: attributes.resumen,
      categoria: attributes.categoria,
      slug: attributes.slug,
      fechaPublicacion: attributes.fechaPublicacion,
      destacado: attributes.destacado,
      estado: attributes.estado,
      vistas: attributes.vistas || 0,
      imagen: attributes.imagen,
      autor: attributes.autor,
      tags: attributes.tags || [],
      comentariosHabilitados: attributes.comentariosHabilitados !== false
    };
  }

  // Formatear fecha para mostrar
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  // Obtener tiempo de lectura estimado
  getReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lectura`;
  }
}

const newsService = new NewsService();
export default newsService;