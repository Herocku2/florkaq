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
    },
    {
      method: 'POST',
      path: '/admin/create/packages',
      handler: 'create-admin.createPackage',
    },
    {
      method: 'PUT',
      path: '/admin/create/packages/:packageId',
      handler: 'create-admin.updatePackage',
    },
    {
      method: 'PUT',
      path: '/admin/create/packages/:packageId/status',
      handler: 'create-admin.togglePackageStatus',
    },
    
    // Rutas administrativas para solicitudes de tokens
    {
      method: 'GET',
      path: '/admin/create/requests',
      handler: 'create-admin.getTokenRequestsAdmin',
    },
    {
      method: 'PUT',
      path: '/admin/create/requests/:requestId/review',
      handler: 'create-admin.reviewTokenRequest',
    },
    {
      method: 'POST',
      path: '/admin/create/requests/:requestId/approve',
      handler: 'create-admin.approveTokenRequest',
    },
    {
      method: 'POST',
      path: '/admin/create/requests/:requestId/reject',
      handler: 'create-admin.rejectTokenRequest',
    },
    
    // Rutas administrativas para plantillas de tokens
    {
      method: 'GET',
      path: '/admin/create/templates',
      handler: 'create-admin.getTokenTemplatesAdmin',
    },
    {
      method: 'POST',
      path: '/admin/create/templates',
      handler: 'create-admin.createTokenTemplate',
    },
    
    // Estadísticas de CREATE
    {
      method: 'GET',
      path: '/admin/create/stats',
      handler: 'create-admin.getCreateStats',
    },
  ],
};