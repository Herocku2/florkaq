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

  // Obtener foros
  async getForums(page = 1, pageSize = 10, filters = {}) {
    const cacheKey = `forums-${page}-${pageSize}-${JSON.stringify(filters)}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log('🔍 Obteniendo foros desde API...');
        
        const params = {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort': 'createdAt:desc',
          ...filters
        };
        
        const response = await apiService.get('foros', params);
        console.log('✅ Foros obtenidos:', response?.data?.length || 0);
        
        return {
          success: true,
          forums: response?.data || [],
          meta: response?.meta || {}
        };
      }, this.getFallbackForums(page, pageSize), 'ForumService.getForums');
    });
  }

  // Obtener comentarios de un foro
  async getForumComments(forumId) {
    const cacheKey = `forum-comments-${forumId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      return await errorHandler.safeAsync(async () => {
        console.log(`🔍 Obteniendo comentarios del foro ${forumId}...`);
        
        const response = await apiService.get(`foros/${forumId}/comentarios`);
        console.log('✅ Comentarios obtenidos:', response?.data?.length || 0);
        
        return {
          success: true,
          comments: response?.data || []
        };
      }, { success: true, comments: [] }, 'ForumService.getForumComments');
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

  // Crear nuevo foro
  async createForum(forumData) {
    // Limpiar cache después de crear
    this.clearForumsCache();
    
    return await errorHandler.safeAsync(async () => {
      console.log('🔍 Creando nuevo foro...', forumData);
      
      const response = await apiService.post('foros', {
        data: {
          ...forumData,
          creador: 'Usuario', // TODO: Obtener del contexto de autenticación
          moderado: false,
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      });
      
      console.log('✅ Foro creado:', response?.data?.id);
      
      return {
        success: true,
        forum: response?.data
      };
    }, { success: false, error: 'Error al crear el foro' }, 'ForumService.createForum');
  }

  // Crear comentario en foro
  async createComment(forumId, commentText) {
    // Limpiar cache del foro específico
    this.cache.delete(`forum-comments-${forumId}`);
    
    return await errorHandler.safeAsync(async () => {
      console.log(`🔍 Creando comentario en foro ${forumId}...`);
      
      const response = await apiService.post(`foros/${forumId}/comentarios`, {
        data: { texto: commentText }
      });
      
      console.log('✅ Comentario creado:', response?.data?.id);
      
      return {
        success: true,
        comment: response?.data
      };
    }, { success: false, error: 'Error al crear el comentario' }, 'ForumService.createComment');
  }

  // Obtener temas por token
  async getTopicsByToken(tokenId, page = 1, pageSize = 10) {
    return await this.getForumTopics(page, pageSize, { tokenId });
  }

  // Obtener temas por categoría
  async getTopicsByCategory(category, page = 1, pageSize = 10) {
    return await this.getForumTopics(page, pageSize, { category });
  }

  // Actualizar foro
  async updateForum(forumId, forumData) {
    this.clearForumsCache();
    
    return await errorHandler.safeAsync(async () => {
      console.log(`🔍 Actualizando foro ${forumId}...`);
      
      const response = await apiService.put(`foros/${forumId}`, {
        data: forumData
      });
      
      console.log('✅ Foro actualizado:', response?.data?.id);
      
      return {
        success: true,
        forum: response?.data
      };
    }, { success: false, error: 'Error al actualizar el foro' }, 'ForumService.updateForum');
  }

  // Eliminar foro
  async deleteForum(forumId) {
    this.clearForumsCache();
    
    return await errorHandler.safeAsync(async () => {
      console.log(`🔍 Eliminando foro ${forumId}...`);
      
      await apiService.delete(`foros/${forumId}`);
      
      console.log('✅ Foro eliminado');
      
      return {
        success: true
      };
    }, { success: false, error: 'Error al eliminar el foro' }, 'ForumService.deleteForum');
  }

  // Verificar si el usuario es moderador
  async isUserModerator() {
    return await errorHandler.safeAsync(async () => {
      console.log('🔍 Verificando si el usuario es moderador...');
      
      const response = await apiService.get('foros/check-moderator');
      console.log('✅ Respuesta de verificación de moderador:', response);
      
      return response?.data?.isModerator || false;
    }, false, 'ForumService.isUserModerator');
  }

  // Limpiar cache de foros
  clearForumsCache() {
    for (const key of this.cache.keys()) {
      if (key.startsWith('forums-') || key.startsWith('forum-comments-')) {
        this.cache.delete(key);
      }
    }
  }

  // Datos de fallback para foros
  getFallbackForums(page = 1, pageSize = 10) {
    return {
      success: true,
      forums: [
        {
          id: 1,
          attributes: {
            titulo: "¿Qué opinan del nuevo token Bukele?",
            descripcion: "He visto que está ganando mucha tracción. ¿Creen que tiene potencial a largo plazo?",
            tokenRelacionado: "Bukele",
            creador: "CryptoFan123",
            moderado: true,
            activo: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        },
        {
          id: 2,
          attributes: {
            titulo: "Análisis técnico de Gustavo Petro Token",
            descripcion: "Comparto mi análisis técnico del token de Gustavo Petro. Los indicadores se ven prometedores.",
            tokenRelacionado: "Gustavo Petro",
            creador: "TechnicalAnalyst",
            moderado: true,
            activo: true,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date(Date.now() - 7200000).toISOString()
          }
        },
        {
          id: 3,
          attributes: {
            titulo: "Discusión sobre Barack Obama Coin",
            descripcion: "¿Qué piensan sobre el potencial de este token? Parece tener una comunidad sólida.",
            tokenRelacionado: "Barack Obama",
            creador: "TokenExpert",
            moderado: true,
            activo: true,
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            updatedAt: new Date(Date.now() - 10800000).toISOString()
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