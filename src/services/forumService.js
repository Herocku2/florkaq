import apiService from './api.js';
import { errorHandler } from '../utils/errorHandler.js';

class ForumService {
  constructor() {
    // Cache para evitar llamadas duplicadas
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minuto para foros (contenido dinámico)
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

  // Obtener temas del foro
  async getForumTopics(page = 1, pageSize = 10, filters = {}) {
    const cacheKey = `forum-topics-${page}-${pageSize}-${JSON.stringify(filters)}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const params = {
          page,
          pageSize,
          ...filters
        };
        
        const response = await apiService.get('forum/topics', params);
        return response;
      }, this.getFallbackForumTopics(page, pageSize), 'ForumService.getForumTopics');
    });
  }

  // Obtener tema específico con comentarios
  async getForumTopic(topicId) {
    const cacheKey = `forum-topic-${topicId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get(`forum/topic/${topicId}`);
        return response;
      }, this.getFallbackForumTopic(topicId), 'ForumService.getForumTopic');
    });
  }

  // Obtener categorías del foro
  async getForumCategories() {
    const cacheKey = 'forum-categories';
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        const response = await apiService.get('forum/categories');
        return response;
      }, this.getFallbackForumCategories(), 'ForumService.getForumCategories');
    });
  }

  // Crear nuevo tema
  async createForumTopic(topicData) {
    // Limpiar cache después de crear
    this.clearTopicsCache();
    
    return await errorHandler.safeAsync(async () => {
      const response = await apiService.post('forum/topics', {
        data: topicData
      });
      return response;
    }, { success: false, error: 'Error al crear el tema' }, 'ForumService.createForumTopic');
  }

  // Crear respuesta a tema
  async createTopicReply(topicId, replyText) {
    // Limpiar cache del tema específico
    this.cache.delete(`forum-topic-${topicId}`);
    
    return await errorHandler.safeAsync(async () => {
      const response = await apiService.post(`forum/topic/${topicId}/reply`, {
        data: { texto: replyText }
      });
      return response;
    }, { success: false, error: 'Error al crear la respuesta' }, 'ForumService.createTopicReply');
  }

  // Obtener temas por token
  async getTopicsByToken(tokenId, page = 1, pageSize = 10) {
    return await this.getForumTopics(page, pageSize, { tokenId });
  }

  // Obtener temas por categoría
  async getTopicsByCategory(category, page = 1, pageSize = 10) {
    return await this.getForumTopics(page, pageSize, { category });
  }

  // Limpiar cache de temas
  clearTopicsCache() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('forum-topics-')) {
        this.cache.delete(key);
      }
    }
  }

  // Datos de fallback para temas del foro
  getFallbackForumTopics(page = 1, pageSize = 10) {
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
                        url: "/img/next-1.png",
                        alternativeText: "MAGA Token"
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
                        url: "/img/next-2.png",
                        alternativeText: "Pepe Classic"
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
          page: page,
          pageSize: pageSize,
          pageCount: 1,
          total: 2
        }
      }
    };
  }

  // Datos de fallback para tema específico
  getFallbackForumTopic(topicId) {
    return {
      id: parseInt(topicId),
      attributes: {
        titulo: "Tema de Ejemplo",
        contenido: "Este es un tema de ejemplo mientras se configura la base de datos",
        categoria: "general",
        fechaCreacion: new Date().toISOString(),
        moderado: true,
        fijado: false,
        cerrado: false,
        vistas: 1,
        creador: {
          data: {
            attributes: {
              nombre: "Usuario Ejemplo",
              email: "user@example.com"
            }
          }
        },
        respuestas: {
          data: []
        }
      }
    };
  }

  // Datos de fallback para categorías
  getFallbackForumCategories() {
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
            color: "#3b82f6",
            icon: "💬"
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
            color: "#10b981",
            icon: "📊"
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
            color: "#f59e0b",
            icon: "📰"
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
            color: "#ef4444",
            icon: "🆘"
          }
        }
      ]
    };
  }

  // Transformar datos de tema para el frontend
  transformTopicData(strapiTopic) {
    if (!strapiTopic) return null;

    const attributes = strapiTopic.attributes || strapiTopic;
    
    return {
      id: strapiTopic.id,
      titulo: attributes.titulo,
      contenido: attributes.contenido,
      categoria: attributes.categoria,
      fechaCreacion: attributes.fechaCreacion,
      moderado: attributes.moderado,
      fijado: attributes.fijado,
      cerrado: attributes.cerrado,
      vistas: attributes.vistas || 0,
      creador: attributes.creador,
      tokenRelacionado: attributes.tokenRelacionado,
      respuestas: attributes.respuestas?.data?.map(reply => this.transformReplyData(reply)) || [],
      // Campos calculados
      timeAgo: this.getTimeAgo(attributes.fechaCreacion),
      replyCount: attributes.respuestas?.data?.length || 0,
      isPinned: attributes.fijado === true,
      isClosed: attributes.cerrado === true,
      categoryColor: this.getCategoryColor(attributes.categoria),
      lastActivity: this.getLastActivity(attributes.respuestas?.data)
    };
  }

  // Transformar datos de respuesta para el frontend
  transformReplyData(strapiReply) {
    if (!strapiReply) return null;

    const attributes = strapiReply.attributes || strapiReply;
    
    return {
      id: strapiReply.id,
      texto: attributes.texto,
      fechaCreacion: attributes.fechaCreacion,
      usuario: attributes.usuario,
      aprobado: attributes.aprobado,
      // Campos calculados
      timeAgo: this.getTimeAgo(attributes.fechaCreacion),
      isApproved: attributes.aprobado === true
    };
  }

  // Transformar datos de categoría para el frontend
  transformCategoryData(strapiCategory) {
    if (!strapiCategory) return null;

    const attributes = strapiCategory.attributes || strapiCategory;
    
    return {
      id: strapiCategory.id,
      nombre: attributes.nombre,
      slug: attributes.slug,
      descripcion: attributes.descripcion,
      activa: attributes.activa,
      orden: attributes.orden || 0,
      color: attributes.color || '#3b82f6',
      icon: attributes.icon || '📁'
    };
  }

  // Obtener tiempo transcurrido
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  // Obtener color de categoría
  getCategoryColor(category) {
    const colors = {
      discusion: '#3b82f6',
      analisis: '#10b981',
      noticias: '#f59e0b',
      soporte: '#ef4444',
      general: '#6b7280'
    };
    return colors[category] || '#6b7280';
  }

  // Obtener última actividad
  getLastActivity(replies) {
    if (!replies || replies.length === 0) {
      return null;
    }
    
    const lastReply = replies[replies.length - 1];
    return {
      date: lastReply.attributes.fechaCreacion,
      user: lastReply.attributes.usuario?.data?.attributes?.nombre || 'Usuario'
    };
  }

  // Formatear número de vistas
  formatViewCount(count) {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  // Obtener icono de categoría
  getCategoryIcon(category) {
    const icons = {
      discusion: '💬',
      analisis: '📊',
      noticias: '📰',
      soporte: '🆘',
      general: '📁'
    };
    return icons[category] || '📁';
  }

  // Verificar si el usuario puede moderar
  canModerate(userRole) {
    return ['moderador', 'admin'].includes(userRole);
  }

  // Verificar si el usuario puede crear temas
  canCreateTopic(userRole) {
    return ['moderador', 'admin'].includes(userRole);
  }
}

const forumService = new ForumService();
export default forumService;