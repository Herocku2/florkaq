'use strict';

/**
 * token service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::token.token', ({ strapi }) => ({
  // Servicio para mover token ganador de votación a "próximo"
  async moverGanadorAProximo(tokenId, fechaLanzamiento) {
    try {
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          estado: 'próximo',
          fechaLanzamiento: fechaLanzamiento
        }
      });

      strapi.log.info(`Token ${token.nombre} movido a próximos lanzamientos`);
      return token;
    } catch (error) {
      strapi.log.error('Error moviendo token a próximo:', error);
      throw error;
    }
  },

  // Servicio para lanzar token en la fecha programada
  async lanzarToken(tokenId, mintAddress) {
    try {
      const token = await strapi.entityService.update('api::token.token', tokenId, {
        data: {
          estado: 'lanzado',
          mintAddress: mintAddress,
          fechaLanzamiento: new Date()
        }
      });

      strapi.log.info(`Token ${token.nombre} lanzado exitosamente`);
      return token;
    } catch (error) {
      strapi.log.error('Error lanzando token:', error);
      throw error;
    }
  },

  // Servicio para obtener estadísticas de tokens
  async obtenerEstadisticas() {
    try {
      const [lanzados, proximos, candidatos] = await Promise.all([
        strapi.entityService.count('api::token.token', {
          filters: { estado: 'lanzado' }
        }),
        strapi.entityService.count('api::token.token', {
          filters: { estado: 'próximo' }
        }),
        strapi.entityService.count('api::token.token', {
          filters: { estado: 'inactivo' }
        })
      ]);

      return {
        lanzados,
        proximos,
        candidatos,
        total: lanzados + proximos + candidatos
      };
    } catch (error) {
      strapi.log.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Servicio para validar dirección mint de Solana
  async validarMintAddress(mintAddress) {
    // Validación básica de formato de dirección de Solana
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    
    if (!solanaAddressRegex.test(mintAddress)) {
      throw new Error('Formato de dirección mint inválido');
    }

    // Verificar que no exista otro token con la misma dirección
    const existingToken = await strapi.entityService.findMany('api::token.token', {
      filters: {
        mintAddress: mintAddress
      }
    });

    if (existingToken.length > 0) {
      throw new Error('Ya existe un token con esta dirección mint');
    }

    return true;
  }
}));