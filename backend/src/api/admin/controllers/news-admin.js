'use strict';

/**
 * news-admin controller
 * Controlador para el área administrativa de NEWS
 */

module.exports = {
  // Obtener todos los artículos para administración
  async getNewsArticlesAdmin(ctx) {
    try {
      console.log('📰👨‍💼 Admin: Accediendo a artículos de NEWS');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, estado, categoria, destacado } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (estado) {
        filters.estado = estado;
      }
      
      if (categoria) {
        filters.categoria = categoria;
      }
      
      if (destacado !== undefined) {
        filters.destacado = destacado === 'true';
      }
      
      // Buscar artículos para administración
      const articles = await strapi.entityService.findMany('api::noticia.noticia', {
        filters,
        populate: ['imagen', 'autor'],
        sort: { fechaCreacion: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return articles;
    } catch (error) {
      console.error('Error en getNewsArticlesAdmin:', error);
      return ctx.badRequest('Error al obtener artículos para administración');
    }
  },

  // Crear nuevo artículo
  async createNewsArticle(ctx) {
    try {
      console.log('📰➕ Admin: Creando artículo de NEWS');
      
      const {
        titulo,
        contenido,
        resumen,
        categoria,
        tags,
        destacado,
        fechaPublicacion,
        comentariosHabilitados
      } = ctx.request.body.data;
      
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
          slug,
          contenido,
          resumen,
          categoria: categoria || 'general',
          tags: tags || [],
          destacado: destacado || false,
          estado: 'borrador',
          fechaCreacion: new Date().toISOString(),
          fechaPublicacion: fechaPublicacion || null,
          comentariosHabilitados: comentariosHabilitados !== false,
          vistas: 0,
          autor: ctx.state.user.id
        }
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en createNewsArticle:', error);
      return ctx.badRequest('Error al crear artículo');
    }
  },

  // Actualizar artículo
  async updateNewsArticle(ctx) {
    try {
      const { articleId } = ctx.params;
      console.log(`📰✏️ Admin: Actualizando artículo ${articleId}`);
      
      const updateData = ctx.request.body.data;
      
      // Si se actualiza el título, regenerar slug
      if (updateData.titulo) {
        updateData.slug = updateData.titulo.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
      
      // Actualizar artículo
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en updateNewsArticle:', error);
      return ctx.badRequest('Error al actualizar artículo');
    }
  },

  // Cambiar estado de artículo
  async changeArticleStatus(ctx) {
    try {
      const { articleId } = ctx.params;
      const { estado } = ctx.request.body.data;
      
      console.log(`📰🔄 Admin: Cambiando estado de artículo ${articleId} a ${estado}`);
      
      let updateData = {
        estado,
        fechaActualizacion: new Date().toISOString()
      };
      
      // Si se publica, establecer fecha de publicación
      if (estado === 'publicado' && !updateData.fechaPublicacion) {
        updateData.fechaPublicacion = new Date().toISOString();
      }
      
      // Actualizar estado
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: updateData
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en changeArticleStatus:', error);
      return ctx.badRequest('Error al cambiar estado del artículo');
    }
  },

  // Publicar artículo
  async publishArticle(ctx) {
    try {
      const { articleId } = ctx.params;
      const { fechaPublicacion } = ctx.request.body.data;
      
      console.log(`📰📢 Admin: Publicando artículo ${articleId}`);
      
      // Actualizar para publicar
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: {
          estado: 'publicado',
          fechaPublicacion: fechaPublicacion || new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en publishArticle:', error);
      return ctx.badRequest('Error al publicar artículo');
    }
  },

  // Programar publicación de artículo
  async scheduleArticle(ctx) {
    try {
      const { articleId } = ctx.params;
      const { fechaPublicacion } = ctx.request.body.data;
      
      console.log(`📰📅 Admin: Programando artículo ${articleId}`);
      
      // Actualizar para programar
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: {
          estado: 'programado',
          fechaPublicacion,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en scheduleArticle:', error);
      return ctx.badRequest('Error al programar artículo');
    }
  },

  // Destacar/quitar destaque de artículo
  async toggleArticleHighlight(ctx) {
    try {
      const { articleId } = ctx.params;
      const { destacado } = ctx.request.body.data;
      
      console.log(`📰⭐ Admin: ${destacado ? 'Destacando' : 'Quitando destaque de'} artículo ${articleId}`);
      
      // Actualizar destaque
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: {
          destacado,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, article };
    } catch (error) {
      console.error('Error en toggleArticleHighlight:', error);
      return ctx.badRequest('Error al cambiar destaque del artículo');
    }
  },

  // Gestionar categorías de noticias
  async getNewsCategoriesAdmin(ctx) {
    try {
      console.log('📰📂 Admin: Accediendo a categorías de NEWS');
      
      // Buscar categorías
      const categories = await strapi.entityService.findMany('api::categoria-noticia.categoria-noticia', {
        sort: { orden: 'asc' }
      });
      
      return categories;
    } catch (error) {
      console.error('Error en getNewsCategoriesAdmin:', error);
      return ctx.badRequest('Error al obtener categorías');
    }
  },

  // Crear nueva categoría
  async createNewsCategory(ctx) {
    try {
      console.log('📰📂➕ Admin: Creando categoría de NEWS');
      
      const {
        nombre,
        descripcion,
        slug,
        activa,
        orden
      } = ctx.request.body.data;
      
      // Crear categoría
      const category = await strapi.entityService.create('api::categoria-noticia.categoria-noticia', {
        data: {
          nombre,
          slug: slug || nombre.toLowerCase().replace(/\s+/g, '-'),
          descripcion,
          activa: activa !== false,
          orden: orden || 0
        }
      });
      
      return { success: true, category };
    } catch (error) {
      console.error('Error en createNewsCategory:', error);
      return ctx.badRequest('Error al crear categoría');
    }
  },

  // Archivar artículo (soft delete)
  async archiveArticle(ctx) {
    try {
      const { articleId } = ctx.params;
      console.log(`📰🗑️ Admin: Archivando artículo ${articleId}`);
      
      // Cambiar estado a archivado en lugar de eliminar
      const article = await strapi.entityService.update('api::noticia.noticia', articleId, {
        data: {
          estado: 'archivado',
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, message: 'Artículo archivado correctamente' };
    } catch (error) {
      console.error('Error en archiveArticle:', error);
      return ctx.badRequest('Error al archivar artículo');
    }
  },

  // Obtener estadísticas de NEWS
  async getNewsStats(ctx) {
    try {
      console.log('📰📊 Admin: Obteniendo estadísticas de NEWS');
      
      // Contar artículos por estado
      const totalArticles = await strapi.entityService.count('api::noticia.noticia');
      const publishedArticles = await strapi.entityService.count('api::noticia.noticia', {
        filters: { estado: 'publicado' }
      });
      const draftArticles = await strapi.entityService.count('api::noticia.noticia', {
        filters: { estado: 'borrador' }
      });
      const scheduledArticles = await strapi.entityService.count('api::noticia.noticia', {
        filters: { estado: 'programado' }
      });
      const featuredArticles = await strapi.entityService.count('api::noticia.noticia', {
        filters: { destacado: true }
      });
      
      // Obtener artículos más vistos
      const topViewedArticles = await strapi.entityService.findMany('api::noticia.noticia', {
        filters: { estado: 'publicado' },
        populate: ['imagen'],
        sort: { vistas: 'desc' },
        limit: 5
      });
      
      // Obtener artículos recientes
      const recentArticles = await strapi.entityService.findMany('api::noticia.noticia', {
        populate: ['imagen', 'autor'],
        sort: { fechaCreacion: 'desc' },
        limit: 5
      });
      
      // Contar artículos por categoría
      const articlesByCategory = {};
      const categories = ['mercado', 'plataforma', 'comunidad', 'tecnologia', 'general'];
      
      for (const category of categories) {
        const count = await strapi.entityService.count('api::noticia.noticia', {
          filters: { categoria: category, estado: 'publicado' }
        });
        articlesByCategory[category] = count;
      }
      
      return {
        totalArticles,
        publishedArticles,
        draftArticles,
        scheduledArticles,
        archivedArticles: totalArticles - publishedArticles - draftArticles - scheduledArticles,
        featuredArticles,
        topViewedArticles: topViewedArticles.data || [],
        recentArticles: recentArticles.data || [],
        articlesByCategory
      };
    } catch (error) {
      console.error('Error en getNewsStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};