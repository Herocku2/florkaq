'use strict';

/**
 * next-management controller
 * Controlador para el área administrativa de NEXT
 */

module.exports = {
  // Obtener todos los proyectos NEXT para administración
  async getNextProjectsAdmin(ctx) {
    try {
      console.log('🚀👨‍💼 Admin: Accediendo a proyectos NEXT');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, estado, destacado } = ctx.query;
      
      // Construir filtros
      let filters = {
        estado: 'proximo'
      };
      
      if (destacado !== undefined) {
        filters.destacado = destacado === 'true';
      }
      
      // Buscar proyectos para administración
      const projects = await strapi.entityService.findMany('api::token.token', {
        filters,
        populate: ['imagen', 'creador'],
        sort: { fechaLanzamiento: 'asc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return projects;
    } catch (error) {
      console.error('Error en getNextProjectsAdmin:', error);
      return ctx.badRequest('Error al obtener proyectos para administración');
    }
  },

  // Crear nuevo proyecto NEXT
  async createNextProject(ctx) {
    try {
      console.log('🚀➕ Admin: Creando proyecto NEXT');
      
      const {
        nombre,
        simbolo,
        descripcion,
        precioEstimado,
        marketCapEstimado,
        fechaLanzamiento,
        destacado,
        progreso,
        orden,
        enlaces
      } = ctx.request.body.data;
      
      // Crear proyecto
      const project = await strapi.entityService.create('api::token.token', {
        data: {
          nombre,
          simbolo,
          descripcion,
          precioEstimado: precioEstimado || 0,
          marketCapEstimado: marketCapEstimado || 0,
          fechaLanzamiento: fechaLanzamiento || new Date(Date.now() + 86400000 * 7).toISOString(),
          estado: 'proximo',
          destacado: destacado || false,
          progreso: progreso || 0,
          orden: orden || 0,
          enlaces: enlaces || {},
          fechaCreacion: new Date().toISOString(),
          creador: ctx.state.user.id,
          aprobado: true
        }
      });
      
      return { success: true, project };
    } catch (error) {
      console.error('Error en createNextProject:', error);
      return ctx.badRequest('Error al crear proyecto');
    }
  },

  // Actualizar proyecto NEXT
  async updateNextProject(ctx) {
    try {
      const { projectId } = ctx.params;
      console.log(`🚀✏️ Admin: Actualizando proyecto ${projectId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar proyecto
      const project = await strapi.entityService.update('api::token.token', projectId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, project };
    } catch (error) {
      console.error('Error en updateNextProject:', error);
      return ctx.badRequest('Error al actualizar proyecto');
    }
  },

  // Cambiar estado de proyecto (Pendiente, Publicado, Top 3)
  async changeProjectStatus(ctx) {
    try {
      const { projectId } = ctx.params;
      const { estado, destacado, orden } = ctx.request.body.data;
      
      console.log(`🚀🔄 Admin: Cambiando estado de proyecto ${projectId}`);
      
      let updateData = {
        fechaActualizacion: new Date().toISOString()
      };
      
      if (estado) {
        updateData.estado = estado;
      }
      
      if (destacado !== undefined) {
        updateData.destacado = destacado;
      }
      
      if (orden !== undefined) {
        updateData.orden = orden;
      }
      
      // Actualizar proyecto
      const project = await strapi.entityService.update('api::token.token', projectId, {
        data: updateData
      });
      
      return { success: true, project };
    } catch (error) {
      console.error('Error en changeProjectStatus:', error);
      return ctx.badRequest('Error al cambiar estado del proyecto');
    }
  },

  // Programar lanzamiento de proyecto
  async scheduleProjectLaunch(ctx) {
    try {
      const { projectId } = ctx.params;
      const { fechaLanzamiento } = ctx.request.body.data;
      
      console.log(`🚀📅 Admin: Programando lanzamiento de proyecto ${projectId}`);
      
      // Actualizar fecha de lanzamiento
      const project = await strapi.entityService.update('api::token.token', projectId, {
        data: {
          fechaLanzamiento,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, project };
    } catch (error) {
      console.error('Error en scheduleProjectLaunch:', error);
      return ctx.badRequest('Error al programar lanzamiento');
    }
  },

  // Obtener Top 3 proyectos NEXT
  async getTop3NextProjects(ctx) {
    try {
      console.log('🚀🏆 Admin: Obteniendo Top 3 proyectos NEXT');
      
      // Buscar proyectos destacados
      const top3Projects = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'proximo',
          destacado: true
        },
        populate: ['imagen'],
        sort: { orden: 'asc' },
        limit: 3
      });
      
      return top3Projects;
    } catch (error) {
      console.error('Error en getTop3NextProjects:', error);
      return ctx.badRequest('Error al obtener Top 3 proyectos');
    }
  },

  // Actualizar Top 3 proyectos
  async updateTop3NextProjects(ctx) {
    try {
      console.log('🚀🏆✏️ Admin: Actualizando Top 3 proyectos NEXT');
      
      const { projects } = ctx.request.body.data;
      
      // Primero, quitar destaque de todos los proyectos
      await strapi.entityService.updateMany('api::token.token', {
        filters: {
          estado: 'proximo'
        },
        data: {
          destacado: false,
          orden: 0
        }
      });
      
      // Luego, destacar los proyectos seleccionados
      const updatedProjects = [];
      for (let i = 0; i < projects.length && i < 3; i++) {
        const project = await strapi.entityService.update('api::token.token', projects[i].id, {
          data: {
            destacado: true,
            orden: i + 1,
            fechaActualizacion: new Date().toISOString()
          }
        });
        updatedProjects.push(project);
      }
      
      return { success: true, projects: updatedProjects };
    } catch (error) {
      console.error('Error en updateTop3NextProjects:', error);
      return ctx.badRequest('Error al actualizar Top 3 proyectos');
    }
  },

  // Eliminar proyecto NEXT (soft delete)
  async deleteNextProject(ctx) {
    try {
      const { projectId } = ctx.params;
      console.log(`🚀🗑️ Admin: Eliminando proyecto ${projectId}`);
      
      // Cambiar estado a cancelado en lugar de eliminar
      const project = await strapi.entityService.update('api::token.token', projectId, {
        data: {
          estado: 'cancelado',
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, message: 'Proyecto cancelado correctamente' };
    } catch (error) {
      console.error('Error en deleteNextProject:', error);
      return ctx.badRequest('Error al eliminar proyecto');
    }
  },

  // Obtener estadísticas de NEXT
  async getNextStats(ctx) {
    try {
      console.log('🚀📊 Admin: Obteniendo estadísticas de NEXT');
      
      // Contar proyectos por estado
      const totalProjects = await strapi.entityService.count('api::token.token', {
        filters: { estado: 'proximo' }
      });
      const featuredProjects = await strapi.entityService.count('api::token.token', {
        filters: { estado: 'proximo', destacado: true }
      });
      
      // Obtener próximos lanzamientos (próximos 7 días)
      const nextWeekLaunches = await strapi.entityService.findMany('api::token.token', {
        filters: {
          estado: 'proximo',
          fechaLanzamiento: {
            $gte: new Date().toISOString(),
            $lte: new Date(Date.now() + 86400000 * 7).toISOString()
          }
        },
        populate: ['imagen'],
        sort: { fechaLanzamiento: 'asc' }
      });
      
      // Calcular progreso promedio
      const projectsWithProgress = await strapi.entityService.findMany('api::token.token', {
        filters: { estado: 'proximo' }
      });
      
      const averageProgress = projectsWithProgress.data.reduce((sum, project) => {
        return sum + (project.attributes.progreso || 0);
      }, 0) / (projectsWithProgress.data.length || 1);
      
      return {
        totalProjects,
        featuredProjects,
        pendingProjects: totalProjects - featuredProjects,
        nextWeekLaunches: nextWeekLaunches.data || [],
        averageProgress: Math.round(averageProgress)
      };
    } catch (error) {
      console.error('Error en getNextStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};