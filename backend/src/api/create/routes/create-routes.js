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
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/create/templates',
      handler: 'token-creation.getTokenTemplates',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    
    // Rutas que requieren autenticación
    {
      method: 'POST',
      path: '/create/submit',
      handler: 'token-creation.submitTokenRequest',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/create/requests',
      handler: 'token-creation.getUserRequests',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/create/request/:requestId/status',
      handler: 'token-creation.getRequestStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};