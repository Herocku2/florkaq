'use strict';

/**
 * Token Creation controller
 */

module.exports = {
  // Obtener paquetes disponibles para creación
  async getPackages(ctx) {
    try {
      const packages = await strapi.entityService.findMany('api::paquete.paquete', {
        filters: { activo: true },
        sort: { precio: 'asc' },
        populate: ['caracteristicas', 'beneficios']
      });

      return ctx.send({
        data: packages,
        meta: {
          total: packages.length
        }
      });
    } catch (error) {
      console.error('Error fetching packages:', error);
      return ctx.badRequest('Error al obtener paquetes');
    }
  },

  // Obtener plantillas de tokens
  async getTemplates(ctx) {
    try {
      const templates = await strapi.entityService.findMany('api::plantilla-token.plantilla-token', {
        filters: { activa: true },
        sort: { orden: 'asc' }
      });

      return ctx.send({
        data: templates || [],
        meta: {
          total: templates?.length || 0
        }
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Devolver plantillas por defecto si no existen
      return ctx.send({
        data: [
          {
            id: 1,
            attributes: {
              nombre: "Meme Token",
              descripcion: "Plantilla estándar para tokens meme",
              configuracion: {
                supply: 1000000000,
                decimals: 9,
                mintable: false,
                burnable: true
              },
              activa: true,
              orden: 1
            }
          }
        ],
        meta: { total: 1 }
      });
    }
  },

  // Enviar solicitud de creación de token
  async submitRequest(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Debes estar autenticado para crear un token');
      }

      if (!data.paqueteId || !data.datosToken) {
        return ctx.badRequest('Datos incompletos para la solicitud');
      }

      // Verificar que el paquete existe
      const paquete = await strapi.entityService.findOne('api::paquete.paquete', data.paqueteId);
      if (!paquete) {
        return ctx.badRequest('Paquete no encontrado');
      }

      // Crear solicitud de token
      const solicitud = await strapi.entityService.create('api::solicitud-token.solicitud-token', {
        data: {
          usuario: user.id,
          paquete: data.paqueteId,
          datosToken: JSON.stringify(data.datosToken),
          metodoPago: data.metodoPago || 'crypto',
          transactionHash: data.transactionHash,
          estado: 'pendiente',
          fechaSolicitud: new Date(),
          aprobado: false,
          activo: true
        }
      });

      // Enviar notificación al equipo (placeholder)
      await this.notifyTeam(solicitud, paquete, data.datosToken);

      return ctx.send({
        data: solicitud,
        message: 'Solicitud enviada exitosamente'
      });

    } catch (error) {
      console.error('Error submitting token request:', error);
      return ctx.internalServerError('Error al procesar la solicitud');
    }
  },

  // Obtener solicitudes del usuario
  async getUserRequests(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Debes estar autenticado');
      }

      const requests = await strapi.entityService.findMany('api::solicitud-token.solicitud-token', {
        filters: { usuario: user.id },
        sort: { fechaSolicitud: 'desc' },
        populate: ['paquete', 'usuario']
      });

      return ctx.send({
        data: requests || [],
        meta: {
          total: requests?.length || 0
        }
      });

    } catch (error) {
      console.error('Error fetching user requests:', error);
      return ctx.internalServerError('Error al obtener solicitudes');
    }
  },

  // Obtener estado de solicitud específica
  async getRequestStatus(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Debes estar autenticado');
      }

      const request = await strapi.entityService.findOne('api::solicitud-token.solicitud-token', id, {
        populate: ['paquete', 'usuario']
      });

      if (!request) {
        return ctx.notFound('Solicitud no encontrada');
      }

      // Verificar que la solicitud pertenece al usuario
      if (request.usuario.id !== user.id) {
        return ctx.forbidden('No tienes acceso a esta solicitud');
      }

      return ctx.send({
        data: request
      });

    } catch (error) {
      console.error('Error fetching request status:', error);
      return ctx.internalServerError('Error al obtener estado de solicitud');
    }
  },

  // Cancelar solicitud
  async cancelRequest(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Debes estar autenticado');
      }

      const request = await strapi.entityService.findOne('api::solicitud-token.solicitud-token', id, {
        populate: ['usuario']
      });

      if (!request) {
        return ctx.notFound('Solicitud no encontrada');
      }

      // Verificar que la solicitud pertenece al usuario
      if (request.usuario.id !== user.id) {
        return ctx.forbidden('No tienes acceso a esta solicitud');
      }

      // Solo se pueden cancelar solicitudes pendientes o en revisión
      if (!['pendiente', 'revision'].includes(request.estado)) {
        return ctx.badRequest('No se puede cancelar esta solicitud');
      }

      // Actualizar estado
      const updatedRequest = await strapi.entityService.update('api::solicitud-token.solicitud-token', id, {
        data: {
          estado: 'cancelado',
          fechaCancelacion: new Date()
        }
      });

      return ctx.send({
        data: updatedRequest,
        message: 'Solicitud cancelada exitosamente'
      });

    } catch (error) {
      console.error('Error canceling request:', error);
      return ctx.internalServerError('Error al cancelar solicitud');
    }
  },

  // Método helper para notificar al equipo
  async notifyTeam(solicitud, paquete, datosToken) {
    try {
      // Aquí se podría integrar con un servicio de notificaciones
      // Por ahora solo log
      console.log('🚀 Nueva solicitud de token recibida:', {
        solicitudId: solicitud.id,
        paquete: paquete.nombre,
        token: datosToken.nombre,
        usuario: solicitud.usuario
      });

      // TODO: Integrar con servicio de email/Slack/Discord
      
    } catch (error) {
      console.error('Error sending team notification:', error);
    }
  },

  // Simular proceso de pago (para desarrollo)
  async simulatePayment(ctx) {
    try {
      const { amount, method } = ctx.request.body;

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular éxito/fallo (90% éxito)
      const success = Math.random() > 0.1;

      if (success) {
        return ctx.send({
          success: true,
          transactionId: `TX_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          amount: amount,
          method: method,
          timestamp: new Date().toISOString()
        });
      } else {
        return ctx.send({
          success: false,
          error: 'Payment failed - insufficient funds or network error',
          code: 'PAYMENT_FAILED'
        });
      }

    } catch (error) {
      console.error('Error simulating payment:', error);
      return ctx.internalServerError('Error en simulación de pago');
    }
  }
};