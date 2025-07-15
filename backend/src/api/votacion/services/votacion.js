'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::votacion.votacion', ({ strapi }) => ({
  async finalizarVotacion(votacionId) {
    try {
      const votacion = await strapi.entityService.findOne('api::votacion.votacion', votacionId);
      const resultados = votacion.resultados || {};
      
      let ganador = null;
      let maxVotos = 0;
      
      Object.keys(resultados).forEach(candidato => {
        if (resultados[candidato] > maxVotos) {
          maxVotos = resultados[candidato];
          ganador = candidato;
        }
      });

      await strapi.entityService.update('api::votacion.votacion', votacionId, {
        data: {
          activa: false,
          tokenGanador: ganador
        }
      });

      return { ganador, votos: maxVotos };
    } catch (error) {
      throw error;
    }
  }
}));