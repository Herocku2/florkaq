'use strict';

/**
 * forum-admin controller
 * Controlador para el área administrativa de FORUM
 */

module.exports = {
  // Obtener todos los temas del foro para administración
  async getForumTopicsAdmin(ctx) {
    try {
      console.log('💬👨‍💼 Admin: Accediendo a temas del foro');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, moderado, categoria, fijado } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (moderado !== undefined) {
        filters.moderado = moderado === 'true';
      }
      
      if (categoria) {
        filters.categoria = categoria;
      }
      
      if (fijado !== undefined) {
        filters.fijado = fijado === 'true';
      }
      
      // Buscar temas para administración
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
      console.error('Error en getForumTopicsAdmin:', error);
      return ctx.badRequest('Error al obtener temas para administración');
    }
  },

  // Moderar tema del foro
  async moderateForumTopic(ctx) {
    try {
      const { topicId } = ctx.params;
      const { action, reason } = ctx.request.body.data;
      
      console.log(`💬🛡️ Admin: Moderando tema ${topicId} - ${action}`);
      
      let updateData = {
        fechaModeracion: new Date().toISOString(),
        moderadoPor: ctx.state.user.id
      };
      
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
        case 'delete':
          updateData.eliminado = true;
          updateData.moderado = false;
          break;
        default:
          return ctx.badRequest('Acción no válida');
      }
      
      if (reason) {
        updateData.razonModeracion = reason;
      }
      
      // Actualizar tema
      const topic = await strapi.entityService.update('api::foro.foro', topicId, {
        data: updateData
      });
      
      return { success: true, topic };
    } catch (error) {
      console.error('Error en moderateForumTopic:', error);
      return ctx.badRequest('Error al moderar tema');
    }
  },

  // Obtener comentarios para moderación
  async getCommentsAdmin(ctx) {
    try {
      console.log('💬📝 Admin: Accediendo a comentarios');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, aprobado, foroId } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (aprobado !== undefined) {
        filters.aprobado = aprobado === 'true';
      }
      
      if (foroId) {
        filters.foroRelacionado = foroId;
      }
      
      // Buscar comentarios para administración
      const comments = await strapi.entityService.findMany('api::comentario.comentario', {
        filters,
        populate: {
          usuario: {
            fields: ['nombre', 'email']
          },
          foroRelacionado: {
            fields: ['titulo']
          },
          tokenRelacionado: {
            fields: ['nombre']
          }
        },
        sort: { fechaCreacion: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return comments;
    } catch (error) {
      console.error('Error en getCommentsAdmin:', error);
      return ctx.badRequest('Error al obtener comentarios para administración');
    }
  },

  // Moderar comentario
  async moderateComment(ctx) {
    try {
      const { commentId } = ctx.params;
      const { action, reason } = ctx.request.body.data;
      
      console.log(`💬🛡️ Admin: Moderando comentario ${commentId} - ${action}`);
      
      let updateData = {
        fechaModeracion: new Date().toISOString(),
        moderadoPor: ctx.state.user.id
      };
      
      switch (action) {
        case 'approve':
          updateData.aprobado = true;
          break;
        case 'reject':
          updateData.aprobado = false;
          break;
        case 'delete':
          updateData.eliminado = true;
          updateData.aprobado = false;
          break;
        default:
          return ctx.badRequest('Acción no válida');
      }
      
      if (reason) {
        updateData.razonModeracion = reason;
      }
      
      // Actualizar comentario
      const comment = await strapi.entityService.update('api::comentario.comentario', commentId, {
        data: updateData
      });
      
      return { success: true, comment };
    } catch (error) {
      console.error('Error en moderateComment:', error);
      return ctx.badRequest('Error al moderar comentario');
    }
  },

  // Gestionar usuarios del foro
  async getForumUsersAdmin(ctx) {
    try {
      console.log('💬👥 Admin: Accediendo a usuarios del foro');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, rol, bloqueado } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (rol) {
        filters.rol = rol;
      }
      
      if (bloqueado !== undefined) {
        filters.bloqueado = bloqueado === 'true';
      }
      
      // Buscar usuarios
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters,
        fields: ['nombre', 'email', 'rol', 'bloqueado', 'fechaRegistro'],
        sort: { fechaRegistro: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      // Obtener estadísticas de actividad para cada usuario
      const usersWithStats = await Promise.all(
        users.data.map(async (user) => {
          const topicsCount = await strapi.entityService.count('api::foro.foro', {
            filters: { creador: user.id }
          });
          const commentsCount = await strapi.entityService.count('api::comentario.comentario', {
            filters: { usuario: user.id }
          });
          
          return {
            ...user,
            stats: {
              topicsCreated: topicsCount,
              commentsPosted: commentsCount
            }
          };
        })
      );
      
      return {
        data: usersWithStats,
        meta: users.meta
      };
    } catch (error) {
      console.error('Error en getForumUsersAdmin:', error);
      return ctx.badRequest('Error al obtener usuarios del foro');
    }
  },

  // Gestionar usuario del foro (bloquear, asignar rol, etc.)
  async manageForumUser(ctx) {
    try {
      const { userId } = ctx.params;
      const { action, reason, duration } = ctx.request.body.data;
      
      console.log(`💬👤 Admin: Gestionando usuario ${userId} - ${action}`);
      
      let updateData = {};
      
      switch (action) {
        case 'block':
          updateData.bloqueado = true;
          updateData.fechaBloqueo = new Date().toISOString();
          updateData.razonBloqueo = reason;
          updateData.bloqueadoPor = ctx.state.user.id;
          if (duration) {
            updateData.fechaDesbloqueo = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
          }
          break;
        case 'unblock':
          updateData.bloqueado = false;
          updateData.fechaDesbloqueo = new Date().toISOString();
          updateData.desbloqueadoPor = ctx.state.user.id;
          break;
        case 'promote_moderator':
          updateData.rol = 'moderador';
          updateData.fechaCambioRol = new Date().toISOString();
          updateData.cambioRolPor = ctx.state.user.id;
          break;
        case 'demote_user':
          updateData.rol = 'usuario';
          updateData.fechaCambioRol = new Date().toISOString();
          updateData.cambioRolPor = ctx.state.user.id;
          break;
        default:
          return ctx.badRequest('Acción no válida');
      }
      
      // Actualizar usuario
      const user = await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: updateData
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Error en manageForumUser:', error);
      return ctx.badRequest('Error al gestionar usuario');
    }
  },

  // Obtener categorías del foro para administración
  async getForumCategoriesAdmin(ctx) {
    try {
      console.log('💬📂 Admin: Accediendo a categorías del foro');
      
      // Buscar categorías
      const categories = await strapi.entityService.findMany('api::categoria-foro.categoria-foro', {
        sort: { orden: 'asc' }
      });
      
      // Obtener estadísticas para cada categoría
      const categoriesWithStats = await Promise.all(
        categories.data.map(async (category) => {
          const topicsCount = await strapi.entityService.count('api::foro.foro', {
            filters: { categoria: category.attributes.slug }
          });
          
          return {
            ...category,
            stats: {
              topicsCount
            }
          };
        })
      );
      
      return {
        data: categoriesWithStats,
        meta: categories.meta
      };
    } catch (error) {
      console.error('Error en getForumCategoriesAdmin:', error);
      return ctx.badRequest('Error al obtener categorías');
    }
  },

  // Crear nueva categoría del foro
  async createForumCategory(ctx) {
    try {
      console.log('💬📂➕ Admin: Creando categoría del foro');
      
      const {
        nombre,
        slug,
        descripcion,
        color,
        activa,
        orden
      } = ctx.request.body.data;
      
      // Crear categoría
      const category = await strapi.entityService.create('api::categoria-foro.categoria-foro', {
        data: {
          nombre,
          slug: slug || nombre.toLowerCase().replace(/\s+/g, '-'),
          descripcion,
          color: color || '#3b82f6',
          activa: activa !== false,
          orden: orden || 0,
          fechaCreacion: new Date().toISOString()
        }
      });
      
      return { success: true, category };
    } catch (error) {
      console.error('Error en createForumCategory:', error);
      return ctx.badRequest('Error al crear categoría');
    }
  },

  // Obtener estadísticas del foro
  async getForumStats(ctx) {
    try {
      console.log('💬📊 Admin: Obteniendo estadísticas del foro');
      
      // Contar temas por estado
      const totalTopics = await strapi.entityService.count('api::foro.foro');
      const moderatedTopics = await strapi.entityService.count('api::foro.foro', {
        filters: { moderado: true }
      });
      const pinnedTopics = await strapi.entityService.count('api::foro.foro', {
        filters: { fijado: true }
      });
      const closedTopics = await strapi.entityService.count('api::foro.foro', {
        filters: { cerrado: true }
      });
      
      // Contar comentarios por estado
      const totalComments = await strapi.entityService.count('api::comentario.comentario');
      const approvedComments = await strapi.entityService.count('api::comentario.comentario', {
        filters: { aprobado: true }
      });
      
      // Contar usuarios por rol
      const totalUsers = await strapi.entityService.count('plugin::users-permissions.user');
      const moderators = await strapi.entityService.count('plugin::users-permissions.user', {
        filters: { rol: 'moderador' }
      });
      const blockedUsers = await strapi.entityService.count('plugin::users-permissions.user', {
        filters: { bloqueado: true }
      });
      
      // Obtener temas más activos
      const activeTopics = await strapi.entityService.findMany('api::foro.foro', {
        filters: { moderado: true },
        populate: {
          creador: {
            fields: ['nombre']
          },
          respuestas: true
        },
        sort: { vistas: 'desc' },
        limit: 5
      });
      
      const topicsWithActivity = activeTopics.data.map(topic => ({
        ...topic,
        replyCount: topic.attributes.respuestas?.data?.length || 0
      }));
      
      // Obtener usuarios más activos
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        fields: ['nombre', 'email'],
        limit: 100
      });
      
      const activeUsers = await Promise.all(
        users.data.slice(0, 5).map(async (user) => {
          const topicsCount = await strapi.entityService.count('api::foro.foro', {
            filters: { creador: user.id }
          });
          const commentsCount = await strapi.entityService.count('api::comentario.comentario', {
            filters: { usuario: user.id }
          });
          
          return {
            ...user,
            activity: topicsCount + commentsCount
          };
        })
      );
      
      activeUsers.sort((a, b) => b.activity - a.activity);
      
      // Contar temas por categoría
      const topicsByCategory = {};
      const categories = ['discusion', 'analisis', 'noticias', 'soporte', 'general'];
      
      for (const category of categories) {
        const count = await strapi.entityService.count('api::foro.foro', {
          filters: { categoria: category, moderado: true }
        });
        topicsByCategory[category] = count;
      }
      
      return {
        totalTopics,
        moderatedTopics,
        pendingTopics: totalTopics - moderatedTopics,
        pinnedTopics,
        closedTopics,
        totalComments,
        approvedComments,
        pendingComments: totalComments - approvedComments,
        totalUsers,
        moderators,
        regularUsers: totalUsers - moderators,
        blockedUsers,
        activeTopics: topicsWithActivity,
        activeUsers: activeUsers.slice(0, 5),
        topicsByCategory,
        moderationRate: totalTopics > 0 ? ((moderatedTopics / totalTopics) * 100).toFixed(1) : 0,
        commentApprovalRate: totalComments > 0 ? ((approvedComments / totalComments) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error en getForumStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};