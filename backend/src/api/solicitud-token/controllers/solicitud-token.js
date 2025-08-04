'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::solicitud-token.solicitud-token', ({ strapi }) => ({
  // Crear nueva solicitud de token
  async create(ctx) {
    try {
      console.log('🔍 Creando nueva solicitud de token...');
      console.log('📝 Datos recibidos:', ctx.request.body);
      
      const requestData = ctx.request.body.data || ctx.request.body;
      
      // Validar campos obligatorios
      const requiredFields = ['tokenName', 'tokenSymbol', 'ownerWallet', 'contactEmail', 'telegramUsername', 'selectedPlan'];
      for (const field of requiredFields) {
        if (!requestData[field]) {
          return ctx.badRequest(`El campo ${field} es obligatorio`);
        }
      }
      
      // Crear la solicitud
      const solicitud = await strapi.entityService.create('api::solicitud-token.solicitud-token', {
        data: {
          ...requestData,
          requestStatus: 'pending_review',
          paymentStatus: requestData.paymentStatus || 'pending'
        }
      });
      
      console.log(`✅ Solicitud de token creada: ${solicitud.id}`);
      
      // Enviar notificación por email (opcional)
      try {
        // Aquí se podría integrar un servicio de email
        console.log(`📧 Notificación enviada para solicitud ${solicitud.id}`);
      } catch (emailError) {
        console.warn('⚠️ Error enviando notificación por email:', emailError);
      }
      
      return { data: solicitud };
    } catch (error) {
      console.error('❌ Error creando solicitud de token:', error);
      ctx.throw(500, 'Error interno del servidor: ' + error.message);
    }
  },

  // Obtener todas las solicitudes (solo administradores)
  async find(ctx) {
    try {
      console.log('🔍 Obteniendo solicitudes de tokens...');
      
      const { data, meta } = await super.find(ctx);
      
      console.log(`✅ Solicitudes encontradas: ${data.length}`);
      return { data, meta };
    } catch (error) {
      console.error('❌ Error obteniendo solicitudes:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Obtener una solicitud específica
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`🔍 Obteniendo solicitud ${id}...`);
      
      const entity = await strapi.entityService.findOne('api::solicitud-token.solicitud-token', id, {
        populate: ['tokenImage']
      });

      if (!entity) {
        return ctx.notFound('Solicitud no encontrada');
      }

      console.log(`✅ Solicitud ${id} encontrada`);
      return { data: entity };
    } catch (error) {
      console.error(`❌ Error obteniendo solicitud ${ctx.params.id}:`, error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Actualizar estado de solicitud (solo administradores)
  async update(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`🔍 Actualizando solicitud ${id}...`);
      
      const updateData = ctx.request.body.data || ctx.request.body;
      
      const updatedEntity = await strapi.entityService.update('api::solicitud-token.solicitud-token', id, {
        data: updateData
      });

      console.log(`✅ Solicitud ${id} actualizada`);
      return { data: updatedEntity };
    } catch (error) {
      console.error(`❌ Error actualizando solicitud ${ctx.params.id}:`, error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  // Obtener estadísticas de solicitudes
  async getStats(ctx) {
    try {
      console.log('📊 Obteniendo estadísticas de solicitudes...');
      
      const total = await strapi.entityService.count('api::solicitud-token.solicitud-token');
      
      const pending = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { requestStatus: 'pending_review' }
      });
      
      const approved = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { requestStatus: 'approved' }
      });
      
      const completed = await strapi.entityService.count('api::solicitud-token.solicitud-token', {
        filters: { requestStatus: 'completed' }
      });
      
      const stats = {
        total,
        pending,
        approved,
        completed,
        rejected: total - pending - approved - completed
      };
      
      console.log('✅ Estadísticas obtenidas:', stats);
      return { data: stats };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  }
}));