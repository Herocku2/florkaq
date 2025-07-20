'use strict';

/**
 * Servicio para gestión del ranking de tokens
 */

module.exports = {
  /**
   * Actualizar el ranking basado en los votos actuales
   */
  async updateRanking() {
    try {
      // Obtener todos los tokens con sus votos
      const tokens = await strapi.entityService.findMany('api::token.token', {
        populate: {
          votos: true,
          imagen: true
        }
      });

      // Calcular puntuación para cada token
      const tokensWithScore = tokens.map(token => {
        const votos = token.votos || [];
        const votosPositivos = votos.filter(voto => voto.tipo === 'positivo').length;
        const votosNegativos = votos.filter(voto => voto.tipo === 'negativo').length;
        const totalVotos = votosPositivos - votosNegativos;

        return {
          token,
          totalVotos,
          votosPositivos,
          votosNegativos
        };
      });

      // Ordenar por total de votos (descendente)
      tokensWithScore.sort((a, b) => b.totalVotos - a.totalVotos);

      // Actualizar top 3 en la base de datos
      const top3 = tokensWithScore.slice(0, 3);

      for (let i = 0; i < top3.length; i++) {
        const posicion = i + 1;
        const tokenData = top3[i];

        // Buscar ranking existente para esta posición
        const existingRanking = await strapi.entityService.findMany('api::ranking.ranking', {
          filters: { posicion }
        });

        const rankingData = {
          token: tokenData.token.id,
          totalVotos: tokenData.totalVotos,
          fechaActualizacion: new Date(),
          activo: true
        };

        if (existingRanking.length > 0) {
          // Actualizar ranking existente
          await strapi.entityService.update('api::ranking.ranking', existingRanking[0].id, {
            data: rankingData
          });
        } else {
          // Crear nuevo ranking
          await strapi.entityService.create('api::ranking.ranking', {
            data: {
              posicion,
              ...rankingData
            }
          });
        }
      }

      strapi.log.info('Ranking actualizado correctamente');
      return { success: true, top3 };
    } catch (error) {
      strapi.log.error('Error actualizando ranking:', error);
      throw error;
    }
  },

  /**
   * Obtener el top 3 actual
   */
  async getTop3() {
    try {
      const rankings = await strapi.entityService.findMany('api::ranking.ranking', {
        populate: {
          token: {
            populate: {
              imagen: true
            }
          }
        },
        sort: { posicion: 'asc' },
        filters: {
          activo: true
        }
      });

      return rankings;
    } catch (error) {
      strapi.log.error('Error obteniendo top 3:', error);
      throw error;
    }
  },

  /**
   * Actualizar ranking manualmente (para administradores)
   */
  async updateManual(rankings) {
    try {
      if (!rankings || !Array.isArray(rankings) || rankings.length !== 3) {
        throw new Error('Se requieren exactamente 3 posiciones de ranking');
      }

      // Validar posiciones
      const posiciones = rankings.map(r => r.posicion).sort();
      if (JSON.stringify(posiciones) !== JSON.stringify([1, 2, 3])) {
        throw new Error('Las posiciones deben ser 1, 2 y 3');
      }

      // Actualizar cada posición
      for (const rankingData of rankings) {
        const existingRanking = await strapi.entityService.findMany('api::ranking.ranking', {
          filters: { posicion: rankingData.posicion }
        });

        const data = {
          token: rankingData.tokenId,
          totalVotos: rankingData.totalVotos || 0,
          fechaActualizacion: new Date(),
          activo: true
        };

        if (existingRanking.length > 0) {
          await strapi.entityService.update('api::ranking.ranking', existingRanking[0].id, {
            data
          });
        } else {
          await strapi.entityService.create('api::ranking.ranking', {
            data: {
              posicion: rankingData.posicion,
              ...data
            }
          });
        }
      }

      strapi.log.info('Ranking actualizado manualmente');
      return { success: true };
    } catch (error) {
      strapi.log.error('Error actualizando ranking manualmente:', error);
      throw error;
    }
  }
};