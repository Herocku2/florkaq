'use strict';

/**
 * solicitud-token router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::solicitud-token.solicitud-token');

const customRoutes = [
  {
    method: 'GET',
    path: '/solicitud-tokens/stats',
    handler: 'solicitud-token.getStats',
    config: {
      policies: [],
      middlewares: [],
    },
  }
];

// Combinar rutas por defecto con rutas personalizadas
const routes = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes
  ]
};

module.exports = routes;