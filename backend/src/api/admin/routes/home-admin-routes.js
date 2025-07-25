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
    },
    {
      method: 'POST',
      path: '/admin/home/tokens',
      handler: 'home-management.createHomeToken',
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId',
      handler: 'home-management.updateHomeToken',
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId/status',
      handler: 'home-management.toggleTokenStatus',
    },
    {
      method: 'PUT',
      path: '/admin/home/tokens/:tokenId/highlight',
      handler: 'home-management.toggleTokenHighlight',
    },
    {
      method: 'DELETE',
      path: '/admin/home/tokens/:tokenId',
      handler: 'home-management.deleteHomeToken',
    },
    
    // Rutas administrativas para rankings de HOME
    {
      method: 'GET',
      path: '/admin/home/rankings',
      handler: 'home-management.getHomeRankingsAdmin',
    },
    {
      method: 'POST',
      path: '/admin/home/rankings',
      handler: 'home-management.createHomeRanking',
    },
    {
      method: 'PUT',
      path: '/admin/home/rankings/:rankingId',
      handler: 'home-management.updateHomeRanking',
    },
    
    // Estadísticas de HOME
    {
      method: 'GET',
      path: '/admin/home/stats',
      handler: 'home-management.getHomeStats',
    },
  ],
};