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
      handler: 'token-creation.getPackages',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/create/templates',
      handler: 'token-creation.getTemplates',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/create/simulate-payment',
      handler: 'token-creation.simulatePayment',
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
      handler: 'token-creation.submitRequest',
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
      path: '/create/request/:id/status',
      handler: 'token-creation.getRequestStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/create/request/:id/cancel',
      handler: 'token-creation.cancelRequest',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};