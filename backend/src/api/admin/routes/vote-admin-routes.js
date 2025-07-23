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
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/vote/candidates',
      handler: 'vote-management.createVoteCandidate',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/vote/candidates/:candidateId',
      handler: 'vote-management.updateVoteCandidate',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/vote/candidates/:candidateId/status',
      handler: 'vote-management.toggleCandidateStatus',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/vote/candidates/:candidateId',
      handler: 'vote-management.deleteVoteCandidate',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para votaciones
    {
      method: 'GET',
      path: '/admin/vote/votations',
      handler: 'vote-management.getVotationsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/vote/votations',
      handler: 'vote-management.createVotation',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/vote/votations/:votationId',
      handler: 'vote-management.updateVotation',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/vote/votations/:votationId/finalize',
      handler: 'vote-management.finalizeVotation',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas de VOTE
    {
      method: 'GET',
      path: '/admin/vote/stats',
      handler: 'vote-management.getVoteStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};