'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::voto.voto', ({ strapi }) => ({
  // Crear un nuevo voto
  async create(ctx) {
    const { data } = ctx.request.body;
    
    try {
      // Verificar si el usuario ya votó por este candidato
      const existingVote = await strapi.entityService.findMany('api::voto.voto', {
        filters: {
          usuario: data.usuario,
          candidatoVotado: data.candidatoVotado,
          votacion: data.votacion
        }
      });

      if (existingVote.length > 0) {
        return ctx.badRequest('El usuario ya ha votado por este candidato');
      }

      // Crear el voto
      const entity = await strapi.entityService.create('api::voto.voto', {
        data: {
          ...data,
          fechaVoto: new Date(),
          ipAddress: ctx.request.ip
        }
      });

      return this.transformResponse(entity);
    } catch (error) {
      console.error('Error creating vote:', error);
      return ctx.internalServerError('Error al crear el voto');
    }
  },

  // Eliminar un voto (unvote)
  async delete(ctx) {
    const { id } = ctx.params;
    
    try {
      const entity = await strapi.entityService.delete('api::voto.voto', id);
      return this.transformResponse(entity);
    } catch (error) {
      console.error('Error deleting vote:', error);
      return ctx.internalServerError('Error al eliminar el voto');
    }
  },

  // Obtener votos de un usuario específico
  async findUserVotes(ctx) {
    const { usuario } = ctx.params;
    
    try {
      const votes = await strapi.entityService.findMany('api::voto.voto', {
        filters: {
          usuario: usuario
        }
      });

      return this.transformResponse(votes);
    } catch (error) {
      console.error('Error fetching user votes:', error);
      return ctx.internalServerError('Error al obtener los votos del usuario');
    }
  },

  // Obtener conteo de votos por candidato
  async getVoteCount(ctx) {
    const { candidato } = ctx.params;
    
    try {
      const votes = await strapi.entityService.findMany('api::voto.voto', {
        filters: {
          candidatoVotado: candidato
        }
      });

      return {
        candidato: candidato,
        totalVotes: votes.length,
        votes: votes
      };
    } catch (error) {
      console.error('Error getting vote count:', error);
      return ctx.internalServerError('Error al obtener el conteo de votos');
    }
  },

  // Obtener estadísticas generales de votación
  async getVotingStats(ctx) {
    try {
      const allVotes = await strapi.entityService.findMany('api::voto.voto');
      
      // Agrupar votos por candidato
      const votesByCandidate = allVotes.reduce((acc, vote) => {
        const candidato = vote.candidatoVotado;
        acc[candidato] = (acc[candidato] || 0) + 1;
        return acc;
      }, {});

      // Ordenar por número de votos
      const sortedCandidates = Object.entries(votesByCandidate)
        .sort(([,a], [,b]) => b - a)
        .map(([candidato, votos]) => ({ candidato, votos }));

      return {
        totalVotes: allVotes.length,
        totalCandidates: Object.keys(votesByCandidate).length,
        votesByCandidate: sortedCandidates,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting voting stats:', error);
      return ctx.internalServerError('Error al obtener las estadísticas de votación');
    }
  }
}));