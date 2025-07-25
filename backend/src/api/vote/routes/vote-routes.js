'use strict';

/**
 * vote-routes router
 * Rutas específicas para el sistema VOTE (Candidatos de Votación)
 */

module.exports = {
  routes: [
    // Rutas públicas para votaciones
    {
      method: 'GET',
      path: '/vote/candidates',
      handler: 'vote-candidates.getVoteCandidates',
    },
    {
      method: 'GET',
      path: '/vote/stats/:votingId',
      handler: 'vote-candidates.getVotingStats',
    },
    
    // Rutas que requieren autenticación
    {
      method: 'POST',
      path: '/vote/submit',
      handler: 'vote-candidates.submitVote',
    },
    {
      method: 'GET',
      path: '/vote/check/:votingId',
      handler: 'vote-candidates.checkUserVote',
    },
  ],
};