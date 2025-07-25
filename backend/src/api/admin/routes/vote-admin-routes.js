'use strict';

/**
 * vote-admin-routes router
 * Rutas administrativas para el sistema VOTE
 */

module.exports = {
  routes: [
    // Rutas administrativas para candidatos de VOTE
    {
      method: 'GET',
      path: '/admin/vote/candidates',
      handler: 'vote-management.getVoteCandidatesAdmin',
    },
    {
      method: 'POST',
      path: '/admin/vote/candidates',
      handler: 'vote-management.createVoteCandidate',
    },
    {
      method: 'PUT',
      path: '/admin/vote/candidates/:candidateId',
      handler: 'vote-management.updateVoteCandidate',
    },
    {
      method: 'PUT',
      path: '/admin/vote/candidates/:candidateId/status',
      handler: 'vote-management.toggleCandidateStatus',
    },
    {
      method: 'DELETE',
      path: '/admin/vote/candidates/:candidateId',
      handler: 'vote-management.deleteVoteCandidate',
    },
    
    // Rutas administrativas para votaciones
    {
      method: 'GET',
      path: '/admin/vote/votations',
      handler: 'vote-management.getVotationsAdmin',
    },
    {
      method: 'POST',
      path: '/admin/vote/votations',
      handler: 'vote-management.createVotation',
    },
    {
      method: 'PUT',
      path: '/admin/vote/votations/:votationId',
      handler: 'vote-management.updateVotation',
    },
    {
      method: 'POST',
      path: '/admin/vote/votations/:votationId/finalize',
      handler: 'vote-management.finalizeVotation',
    },
    
    // Estadísticas de VOTE
    {
      method: 'GET',
      path: '/admin/vote/stats',
      handler: 'vote-management.getVoteStats',
    },
  ],
};