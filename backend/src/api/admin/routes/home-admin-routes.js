'use strict';

/**
 * home-admin-routes router
 * Rutas administrativas para el sistema HOME
 */

module.exports = {
  routes: [
    // Rutas administrativas para tokens de HOME
    {
      method: 'GET',
      path: '/admin/home/tokens',
      handler: 'home-management.getHomeTokensAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/home/tokens',
      handler: 'home-management.createHomeToken',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId',
      handler: 'home-management.updateHomeToken',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId/status',
      handler: 'home-management.toggleTokenStatus',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId/highlight',
      handler: 'home-management.toggleTokenHighlight',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/home/tokens/:tokenId',
      handler: 'home-management.deleteHomeToken',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para rankings de HOME
    {
      method: 'GET',
      path: '/admin/home/rankings',
      handler: 'home-management.getHomeRankingsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/home/rankings',
      handler: 'home-management.createHomeRanking',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/home/rankings/:rankingId',
      handler: 'home-management.updateHomeRanking',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas de HOME
    {
      method: 'GET',
      path: '/admin/home/stats',
      handler: 'home-management.getHomeStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};