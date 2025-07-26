'use strict';

/**
 * votacion controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::votacion.votacion', ({ strapi }) => ({
  // Método personalizado para obtener votaciones activas
  async findActivas(ctx) {
    try {
      const now = new Date();
      const votaciones = await strapi.entityService.findMany('api::votacion.votacion', {
        filters: {
          activa: true,
          fechaInicio: { $lte: now },
          fechaFin: { $gte: now }
        },
        sort: { fechaInicio: 'desc' }
      });

      return this.transformResponse(votaciones);
    } catch (error) {
      ctx.throw(500, 'Error al obtener votaciones activas');
    }
  },

  // Método personalizado para emitir un voto
  async emitirVoto(ctx) {
    try {
      const { votacionId, candidato } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Debes estar autenticado para votar');
      }

      if (!votacionId || !candidato) {
        return ctx.badRequest('ID de votación y candidato son requeridos');
      }

      // Verificar que la votación existe y está activa
      const votacion = await strapi.entityService.findOne('api::votacion.votacion', votacionId);
      
      if (!votacion) {
        return ctx.notFound('Votación no encontrada');
      }

      const now = new Date();
      if (!votacion.activa || now < new Date(votacion.fechaInicio) || now > new Date(votacion.fechaFin)) {
        return ctx.badRequest('La votación no está activa');
      }

      // Verificar que el candidato existe en la votación
      const candidatos = votacion.candidatos?.data || votacion.candidatos || [];
      const candidatoExiste = candidatos.find(c => c.attributes?.nombre === candidato || c.id === candidato || c.nombre === candidato);
      
      if (!candidatoExiste) {
        return ctx.badRequest('Candidato no válido para esta votación');
      }

      // Aquí deberías verificar si el usuario ya votó (implementar cuando tengamos el modelo de Votos)
      // Por ahora, asumimos que puede votar

      // Actualizar resultados de la votación
      let resultados = votacion.resultados || {};
      resultados[candidato] = (resultados[candidato] || 0) + 1;

      const votacionActualizada = await strapi.entityService.update('api::votacion.votacion', votacionId, {
        data: {
          resultados: resultados,
          totalVotos: votacion.totalVotos + 1
        }
      });

      return this.transformResponse(votacionActualizada);
    } catch (error) {
      ctx.throw(500, 'Error al emitir voto');
    }
  },

  // Método personalizado para obtener resultados de una votación
  async obtenerResultados(ctx) {
    try {
      const { id } = ctx.params;
      
      const votacion = await strapi.entityService.findOne('api::votacion.votacion', id);
      
      if (!votacion) {
        return ctx.notFound('Votación no encontrada');
      }

      const resultados = votacion.resultados || {};
      const totalVotos = votacion.totalVotos || 0;

      // Calcular porcentajes
      const resultadosConPorcentajes = Object.keys(resultados).map(candidato => ({
        candidato,
        votos: resultados[candidato],
        porcentaje: totalVotos > 0 ? ((resultados[candidato] / totalVotos) * 100).toFixed(2) : 0
      }));

      // Ordenar por número de votos (descendente)
      resultadosConPorcentajes.sort((a, b) => b.votos - a.votos);

      return {
        data: {
          votacion: {
            id: votacion.id,
            titulo: votacion.titulo,
            fechaInicio: votacion.fechaInicio,
            fechaFin: votacion.fechaFin,
            activa: votacion.activa,
            totalVotos
          },
          resultados: resultadosConPorcentajes,
          ganador: resultadosConPorcentajes.length > 0 ? resultadosConPorcentajes[0] : null
        }
      };
    } catch (error) {
      ctx.throw(500, 'Error al obtener resultados');
    }
  }
}));