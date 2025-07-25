'use strict';

/**
 * create-admin controller
 * Controlador para el área administrativa de CREATE (Token Creation)
 */

module.exports = {
  // Obtener todos los paquetes para administración
  async getPackagesAdmin(ctx) {
    try {
      console.log('📦👨‍💼 Admin: Accediendo a paquetes de CREATE');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, activo } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (activo !== undefined) {
        filters.activo = activo === 'true';
      }
      
      // Buscar paquetes para administración
      const packages = await strapi.entityService.findMany('api::paquete.paquete', {
        filters,
        sort: { precio: 'asc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return packages;
    } catch (error) {
      console.error('Error en getPackagesAdmin:', error);
      return ctx.badRequest('Error al obtener paquetes para administración');
    }
  },

  // Crear nuevo paquete
  async createPackage(ctx) {
    try {
      console.log('📦➕ Admin: Creando paquete de CREATE');
      
      const {
        nombre,
        precio,
        nivel,
        descripcion,
        caracteristicas,
        beneficios,
        activo,
        popular
      } = ctx.request.body.data;
      
      // Crear paquete
      const paquete = await strapi.entityService.create('api::paquete.paquete', {
        data: {
          nombre,
          precio,
          nivel,
          descripcion,
          caracteristicas: caracteristicas || [],
          beneficios: beneficios || [],
          activo: activo !== false,
          popular: popular || false,
          fechaCreacion: new Date().toISOString()
        }
      });
      
      return { success: true, package: paquete };
    } catch (error) {
      console.error('Error en createPackage:', error);
      return ctx.badRequest('Error al crear paquete');
    }
  },

  // Actualizar paquete
  async updatePackage(ctx) {
    try {
      const { packageId } = ctx.params;
      console.log(`📦✏️ Admin: Actualizando paquete ${packageId}`);
      
      const updateData = ctx.request.body.data;
      
      // Actualizar paquete
      const paqueteActualizado = await strapi.entityService.update('api::paquete.paquete', packageId, {
        data: {
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, package: paqueteActualizado };
    } catch (error) {
      console.error('Error en updatePackage:', error);
      return ctx.badRequest('Error al actualizar paquete');
    }
  },

  // Activar/desactivar paquete
  async togglePackageStatus(ctx) {
    try {
      const { packageId } = ctx.params;
      const { activo } = ctx.request.body.data;
      
      console.log(`📦🔄 Admin: ${activo ? 'Activando' : 'Desactivando'} paquete ${packageId}`);
      
      // Actualizar estado
      const paqueteActualizado = await strapi.entityService.update('api::paquete.paquete', packageId, {
        data: {
          activo,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, package: paqueteActualizado };
    } catch (error) {
      console.error('Error en togglePackageStatus:', error);
      return ctx.badRequest('Error al cambiar estado del paquete');
    }
  },

  // Obtener todas las solicitudes de tokens para administración
  async getTokenRequestsAdmin(ctx) {
    try {
      console.log('💰👨‍💼 Admin: Accediendo a solicitudes de tokens');
      
      // Obtener parámetros de filtrado y paginación
      const { page = 1, pageSize = 10, estado, paqueteId } = ctx.query;
      
      // Construir filtros
      let filters = {};
      
      if (estado) {
        filters.estado = estado;
      }
      
      if (paqueteId) {
        filters.paquete = paqueteId;
      }
      
      // Buscar solicitudes para administración
      const requests = await strapi.entityService.findMany('api::solicitud-token.solicitud-token', {
        filters,
        populate: {
          usuario: {
            fields: ['nombre', 'email']
          },
          paquete: true
        },
        sort: { fechaSolicitud: 'desc' },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      });
      
      return requests;
    } catch (error) {
      console.error('Error en getTokenRequestsAdmin:', error);
      return ctx.badRequest('Error al obtener solicitudes para administración');
    }
  },

  // Revisar solicitud de token
  async reviewTokenRequest(ctx) {
    try {
      const { requestId } = ctx.params;
      const { estado, comentarios, fechaProcesamiento } = ctx.request.body.data;
      
      console.log(`💰🔍 Admin: Revisando solicitud ${requestId}`);
      
      // Actualizar solicitud
      const request = await strapi.entityService.update('api::solicitud-token.solicitud-token', requestId, {
        data: {
          estado,
          comentarios,
          fechaProcesamiento: fechaProcesamiento || new Date().toISOString(),
          revisadoPor: ctx.state.user.id,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, request };
    } catch (error) {
      console.error('Error en reviewTokenRequest:', error);
      return ctx.badRequest('Error al revisar solicitud');
    }
  },

  // Aprobar solicitud de token
  async approveTokenRequest(ctx) {
    try {
      const { requestId } = ctx.params;
      const { comentarios, fechaLanzamiento } = ctx.request.body.data;
      
      console.log(`💰✅ Admin: Aprobando solicitud ${requestId}`);
      
      // Actualizar solicitud
      const request = await strapi.entityService.update('api::solicitud-token.solicitud-token', requestId, {
        data: {
          estado: 'aprobado',
          aprobado: true,
          comentarios,
          fechaAprobacion: new Date().toISOString(),
          fechaLanzamientoProgramada: fechaLanzamiento,
          aprobadoPor: ctx.state.user.id,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      // Si se especifica fecha de lanzamiento, crear token programado
      if (fechaLanzamiento && request.datosToken) {
        await strapi.entityService.create('api::token.token', {
          data: {
            nombre: request.datosToken.nombre,
            simbolo: request.datosToken.simbolo,
            descripcion: request.datosToken.descripcion,
            estado: 'programado',
            fechaLanzamiento: fechaLanzamiento,
            fechaCreacion: new Date().toISOString(),
            origenSolicitud: requestId,
            creador: request.usuario.id
          }
        });
      }
      
      return { success: true, request };
    } catch (error) {
      console.error('Error en approveTokenRequest:', error);
      return ctx.badRequest('Error al aprobar solicitud');
    }
  },

  // Rechazar solicitud de token
  async rejectTokenRequest(ctx) {
    try {
      const { requestId } = ctx.params;
      const { comentarios, razonRechazo } = ctx.request.body.data;
      
      console.log(`💰❌ Admin: Rechazando solicitud ${requestId}`);
      
      // Actualizar solicitud
      const request = await strapi.entityService.update('api::solicitud-token.solicitud-token', requestId, {
        data: {
          estado: 'rechazado',
          aprobado: false,
          comentarios,
          razonRechazo,
          fechaRechazo: new Date().toISOString(),
          rechazadoPor: ctx.state.user.id,
          fechaActualizacion: new Date().toISOString()
        }
      });
      
      return { success: true, request };
    } catch (error) {
      console.error('Error en rejectTokenRequest:', error);
      return ctx.badRequest('Error al rechazar solicitud');
    }
  },

  // Obtener plantillas de tokens para administración
  async getTokenTemplatesAdmin(ctx) {
    try {
      console.log('📄👨‍💼 Admin: Accediendo a plantillas de tokens');
      
      // Buscar plantillas
      const templates = await strapi.entityService.findMany('api::plantilla-token.plantilla-token', {
        sort: { orden: 'asc' }
      });
      
      return templates;
    } catch (error) {
      console.error('Error en getTokenTemplatesAdmin:', error);
      return ctx.badRequest('Error al obtener plantillas');
    }
  },

  // Crear nueva plantilla de token
  async createTokenTemplate(ctx) {
    try {
      console.log('📄➕ Admin: Creando plantilla de token');
      
      const {
        nombre,
        descripcion,
        configuracion,
        activa,
        orden
      } = ctx.request.body.data;
      
      // Crear plantilla
      const template = await strapi.entityService.create('api::plantilla-token.plantilla-token', {
        data: {
          nombre,
          descripcion,
          configuracion: configuracion || {},
          activa: activa !== false,
          orden: orden || 0,
          fechaCreacion: new Date().toISOString()
        }
      });
      
      return { success: true, template };
    } catch (error) {
      console.error('Error en createTokenTemplate:', error);
      return ctx.badRequest('Error al crear plantilla');
    }
  },

  // Obtener estadísticas de CREATE
  async getCreateStats(ctx) {
    try {
      console.log('📦📊 Admin: Obteniendo estadísticas de CREATE');
      
      // Contar paquetes
      const totalPackages = await strapi.entityService.count('api::paquete.paquete');
      const activePackages = await strapi.entityService.count('api::paquete.paquete', {
        filters: { activo: true }
      });
      
      // Contar solicitudes por estado
      const totalRequests = await strapi.entityService.count('api::solicitud-token.solicitud-token');
      const pendingRequests = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { estado: 'pendiente' }
      });
      const approvedRequests = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { estado: 'aprobado' }
      });
      const rejectedRequests = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { estado: 'rechazado' }
      });
      
      // Calcular ingresos por paquete
      const requestsByPackage = {};
      const packages = await strapi.entityService.findMany('api::paquete.paquete');
      
      for (const pkg of packages.data) {
        const requests = await strapi.entityService.findMany('api::solicitud-token.solicitud-token', {
          filters: { 
            paquete: pkg.id,
            estado: 'aprobado'
          }
        });
        requestsByPackage[pkg.attributes.nombre] = {
          count: requests.data.length,
          revenue: requests.data.length * pkg.attributes.precio
        };
      }
      
      // Obtener solicitudes recientes
      const recentRequests = await strapi.entityService.findMany('api::solicitud-token.solicitud-token', {
        populate: {
          usuario: {
            fields: ['nombre']
          },
          paquete: {
            fields: ['nombre', 'precio']
          }
        },
        sort: { fechaSolicitud: 'desc' },
        limit: 5
      });
      
      // Calcular ingresos totales
      const totalRevenue = Object.values(requestsByPackage).reduce((sum, pkg) => sum + pkg.revenue, 0);
      
      return {
        totalPackages,
        activePackages,
        inactivePackages: totalPackages - activePackages,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        inReviewRequests: totalRequests - pendingRequests - approvedRequests - rejectedRequests,
        requestsByPackage,
        recentRequests: recentRequests.data || [],
        totalRevenue,
        approvalRate: totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error en getCreateStats:', error);
      return ctx.badRequest('Error al obtener estadísticas');
    }
  }
};