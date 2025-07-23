'use strict';

/**
 * create-admin-routes router
 * Rutas administrativas para el sistema CREATE
 */

module.exports = {
  routes: [
    // Rutas administrativas para paquetes de CREATE
    {
      method: 'GET',
      path: '/admin/create/packages',
      handler: 'create-admin.getPackagesAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/create/packages',
      handler: 'create-admin.createPackage',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/create/packages/:packageId',
      handler: 'create-admin.updatePackage',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/create/packages/:packageId/status',
      handler: 'create-admin.togglePackageStatus',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para solicitudes de tokens
    {
      method: 'GET',
      path: '/admin/create/requests',
      handler: 'create-admin.getTokenRequestsAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/create/requests/:requestId/review',
      handler: 'create-admin.reviewTokenRequest',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/create/requests/:requestId/approve',
      handler: 'create-admin.approveTokenRequest',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/create/requests/:requestId/reject',
      handler: 'create-admin.rejectTokenRequest',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Rutas administrativas para plantillas de tokens
    {
      method: 'GET',
      path: '/admin/create/templates',
      handler: 'create-admin.getTokenTemplatesAdmin',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/create/templates',
      handler: 'create-admin.createTokenTemplate',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
    
    // Estadísticas de CREATE
    {
      method: 'GET',
      path: '/admin/create/stats',
      handler: 'create-admin.getCreateStats',
      config: {
        policies: ['admin::isOwner'],
        middlewares: [],
      },
    },
  ],
};