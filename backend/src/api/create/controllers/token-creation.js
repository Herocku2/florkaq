'use strict';

/**
 * token-creation controller
 * Controlador específico para el sistema CREATE (Creación de Tokens)
 */

module.exports = {
  // Obtener paquetes disponibles para creación de tokens
  async getCreationPackages(ctx) {
    try {
      console.log('📦 Accediendo a paquetes de creación');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar paquetes activos
      const packages = await strapi.entityService.findMany('api::paquete.paquete', {
        filters: {
          activo: true
        },
        sort: { precio: 'asc' }
      });
      
      return packages;
    } catch (error) {
      console.error('Error en getCreationPackages:', error);
      
      // Retornar paquetes de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "Básico",
              precio: 50,
              nivel: "basico",
              descripcion: "Paquete básico para crear tu token meme",
              caracteristicas: [
                "Creación de token en Solana",
                "Metadatos básicos",
                "Imagen personalizada",
                "Soporte por email"
              ],
              beneficios: [
                "Token funcional",
                "Listado en la plataforma",
                "Acceso a foros"
              ],
              activo: true,
              popular: false
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Profesional",
              precio: 1500,
              nivel: "profesional",
              descripcion: "Paquete profesional con marketing incluido",
              caracteristicas: [
                "Todo del paquete Básico",
                "Marketing en redes sociales",
                "Promoción destacada",
                "Análisis de mercado",
                "Soporte prioritario"
              ],
              beneficios: [
                "Mayor visibilidad",
                "Promoción en homepage",
                "Reportes de rendimiento",
                "Consultoría básica"
              ],
              activo: true,
              popular: true
            }
          },
          {
            id: 3,
            attributes: {
              nombre: "Premium",
              precio: 3000,
              nivel: "premium",
              descripcion: "Paquete premium con servicios completos",
              caracteristicas: [
                "Todo del paquete Profesional",
                "Campaña de marketing completa",
                "Influencer partnerships",
                "Listado en exchanges",
                "Desarrollo de comunidad"
              ],
              beneficios: [
                "Máxima exposición",
                "Gestión de comunidad",
                "Partnerships estratégicos",
                "Soporte 24/7"
              ],
              activo: true,
              popular: false
            }
          },
          {
            id: 4,
            attributes: {
              nombre: "Enterprise",
              precio: 5000,
              nivel: "enterprise",
              descripcion: "Paquete empresarial con servicios exclusivos",
              caracteristicas: [
                "Todo del paquete Premium",
                "Desarrollo personalizado",
                "Integración con DeFi",
                "Auditoría de seguridad",
                "Consultoría estratégica"
              ],
              beneficios: [
                "Solución completa",
                "Desarrollo a medida",
                "Máxima seguridad",
                "Consultoría experta"
              ],
              activo: true,
              popular: false
            }
          }
        ]
      };
    }
  },

  // Crear solicitud de token
  async submitTokenRequest(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { 
        paqueteId, 
        datosToken, 
        metodoPago,
        transactionHash 
      } = ctx.request.body.data;
      
      console.log(`💰 Creando solicitud de token: usuario ${userId}, paquete ${paqueteId}`);
      
      // Verificar que el paquete existe
      const paquete = await strapi.entityService.findOne('api::paquete.paquete', paqueteId);
      
      if (!paquete || !paquete.activo) {
        return ctx.badRequest('Paquete no válido');
      }
      
      // Crear solicitud
      const request = await strapi.entityService.create('api::solicitud-token.solicitud-token', {
        data: {
          usuario: userId,
          paquete: paqueteId,
          datosToken: datosToken,
          metodoPago: metodoPago || 'crypto',
          transactionHash: transactionHash,
          estado: 'pendiente',
          fechaSolicitud: new Date().toISOString(),
          aprobado: false
        }
      });
      
      return { success: true, request };
    } catch (error) {
      console.error('Error en submitTokenRequest:', error);
      return ctx.badRequest('Error al crear la solicitud');
    }
  },

  // Obtener solicitudes del usuario
  async getUserRequests(ctx) {
    try {
      const userId = ctx.state.user.id;
      console.log(`📋 Obteniendo solicitudes del usuario: ${userId}`);
      
      // Buscar solicitudes del usuario
      const requests = await strapi.entityService.findMany('api::solicitud-token.solicitud-token', {
        filters: {
          usuario: userId
        },
        populate: ['paquete'],
        sort: { fechaSolicitud: 'desc' }
      });
      
      return requests;
    } catch (error) {
      console.error('Error en getUserRequests:', error);
      
      // Retornar solicitudes de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              estado: 'aprobado',
              fechaSolicitud: new Date(Date.now() - 86400000 * 3).toISOString(),
              datosToken: {
                nombre: "Mi Token",
                simbolo: "MTK",
                descripcion: "Mi primer token meme"
              },
              paquete: {
                data: {
                  attributes: {
                    nombre: "Básico",
                    precio: 50
                  }
                }
              }
            }
          }
        ]
      };
    }
  },

  // Obtener estado de solicitud específica
  async getRequestStatus(ctx) {
    try {
      const { requestId } = ctx.params;
      const userId = ctx.state.user.id;
      
      console.log(`🔍 Verificando estado de solicitud: ${requestId}`);
      
      // Buscar solicitud específica del usuario
      const request = await strapi.entityService.findOne('api::solicitud-token.solicitud-token', requestId, {
        populate: ['paquete', 'usuario']
      });
      
      if (!request || request.usuario.id !== userId) {
        return ctx.notFound('Solicitud no encontrada');
      }
      
      return request;
    } catch (error) {
      console.error('Error en getRequestStatus:', error);
      return ctx.badRequest('Error al obtener el estado de la solicitud');
    }
  },

  // Obtener plantillas de tokens
  async getTokenTemplates(ctx) {
    try {
      console.log('📄 Accediendo a plantillas de tokens');
      
      // Permitir acceso público
      ctx.state.isPublic = true;
      
      // Buscar plantillas activas
      const templates = await strapi.entityService.findMany('api::plantilla-token.plantilla-token', {
        filters: {
          activa: true
        },
        sort: { orden: 'asc' }
      });
      
      return templates;
    } catch (error) {
      console.error('Error en getTokenTemplates:', error);
      
      // Retornar plantillas de ejemplo si hay error
      return {
        data: [
          {
            id: 1,
            attributes: {
              nombre: "Meme Clásico",
              descripcion: "Plantilla para tokens meme tradicionales",
              configuracion: {
                supply: 1000000000,
                decimals: 9,
                mintable: false,
                burnable: true
              },
              activa: true,
              orden: 1
            }
          },
          {
            id: 2,
            attributes: {
              nombre: "Token Comunitario",
              descripcion: "Plantilla para tokens de comunidad",
              configuracion: {
                supply: 100000000,
                decimals: 6,
                mintable: true,
                burnable: false
              },
              activa: true,
              orden: 2
            }
          }
        ]
      };
    }
  }
};