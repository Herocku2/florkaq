'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::voto.voto', ({ strapi }) => ({
  // Servicio para obtener estadísticas de votación
  async getVotingStatistics() {
    try {
      const votes = await strapi.entityService.findMany('api::voto.voto', {
        populate: '*'
      });

      // Agrupar votos por candidato
      const votesByCandidate = {};
      const votesByUser = {};
      const votesByDate = {};

      votes.forEach(vote => {
        const candidato = vote.candidatoVotado;
        const usuario = vote.usuario;
        const fecha = new Date(vote.fechaVoto).toDateString();

        // Contar votos por candidato
        votesByCandidate[candidato] = (votesByCandidate[candidato] || 0) + 1;

        // Contar votos por usuario
        votesByUser[usuario] = (votesByUser[usuario] || 0) + 1;

        // Contar votos por fecha
        votesByDate[fecha] = (votesByDate[fecha] || 0) + 1;
      });

      // Ordenar candidatos por número de votos
      const topCandidates = Object.entries(votesByCandidate)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([candidato, votos]) => ({ candidato, votos }));

      // Calcular estadísticas adicionales
      const totalVotes = votes.length;
      const totalUsers = Object.keys(votesByUser).length;
      const totalCandidates = Object.keys(votesByCandidate).length;
      const averageVotesPerUser = totalUsers > 0 ? (totalVotes / totalUsers).toFixed(2) : 0;

      return {
        totalVotes,
        totalUsers,
        totalCandidates,
        averageVotesPerUser,
        topCandidates,
        votesByDate: Object.entries(votesByDate)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([fecha, votos]) => ({ fecha, votos })),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting voting statistics:', error);
      throw error;
    }
  },

  // Servicio para validar votos duplicados
  async validateVote(usuario, candidatoVotado, votacion = 'general') {
    try {
      const existingVote = await strapi.entityService.findMany('api::voto.voto', {
        filters: {
          usuario,
          candidatoVotado,
          votacion
        }
      });

      return existingVote.length === 0;
    } catch (error) {
      console.error('Error validating vote:', error);
      throw error;
    }
  },

  // Servicio para limpiar votos duplicados
  async cleanDuplicateVotes() {
    try {
      const votes = await strapi.entityService.findMany('api::voto.voto');
      const seenVotes = new Set();
      const duplicates = [];

      votes.forEach(vote => {
        const key = `${vote.usuario}-${vote.candidatoVotado}-${vote.votacion}`;
        if (seenVotes.has(key)) {
          duplicates.push(vote.id);
        } else {
          seenVotes.add(key);
        }
      });

      // Eliminar duplicados
      for (const duplicateId of duplicates) {
        await strapi.entityService.delete('api::voto.voto', duplicateId);
      }

      return {
        totalVotesProcessed: votes.length,
        duplicatesRemoved: duplicates.length,
        cleanVotesRemaining: votes.length - duplicates.length
      };
    } catch (error) {
      console.error('Error cleaning duplicate votes:', error);
      throw error;
    }
  },

  // Servicio para exportar datos de votación
  async exportVotingData(format = 'json') {
    try {
      const votes = await strapi.entityService.findMany('api::voto.voto', {
        populate: '*'
      });

      const statistics = await this.getVotingStatistics();

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalRecords: votes.length,
          format: format
        },
        statistics,
        votes: votes.map(vote => ({
          id: vote.id,
          usuario: vote.usuario,
          candidatoVotado: vote.candidatoVotado,
          votacion: vote.votacion,
          fechaVoto: vote.fechaVoto,
          ipAddress: vote.ipAddress
        }))
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting voting data:', error);
      throw error;
    }
  }
}));