'use strict';

/**
 * create-routes router
 * Rutas específicas para el sistema CREATE (Creación de Tokens)
 */

module.exports = {
  routes: [
    // Rutas públicas para creación de tokens
    {
      method: 'GET',
      path: '/create/packages',
      handler: 'token-creation.getCreationPackages',
    },
    {
      method: 'GET',
      path: '/create/templates',
      handler: 'token-creation.getTokenTemplates',
    },
    
    // Rutas que requieren autenticación
    {
      method: 'POST',
      path: '/create/submit',
      handler: 'token-creation.submitTokenRequest',
    },
    {
      method: 'GET',
      path: '/create/requests',
      handler: 'token-creation.getUserRequests',
    },
    {
      method: 'GET',
      path: '/create/request/:requestId/status',
      handler: 'token-creation.getRequestStatus',
    },
  ],
};